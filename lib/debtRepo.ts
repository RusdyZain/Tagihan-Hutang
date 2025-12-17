import { getDb } from "./db";

export type DebtStatus = "UNPAID" | "PAID";

export type Debt = {
  id: number;
  debtorName: string;
  phone: string;
  amount: number;
  dueDate: string;
  note: string | null;
  status: DebtStatus;
  createdAt: string;
  updatedAt: string;
  lastReminderAt: string | null;
};

type DebtRow = Debt;

export type CreateDebtInput = {
  debtorName: string;
  phone: string;
  amount: number;
  dueDate: string;
  note?: string | null;
};

export type UpdateDebtInput = Partial<
  Pick<Debt, "debtorName" | "phone" | "amount" | "dueDate" | "note" | "status" | "lastReminderAt">
>;

export type Totals = {
  outstanding: number;
  overdue: number;
};

export type DeadlineBucket = {
  title: string;
  data: Debt[];
};

function mapDebt(row: DebtRow | undefined): Debt | null {
  if (!row) {
    return null;
  }

  return { ...row };
}

export function createDebt(input: CreateDebtInput): Debt {
  const db = getDb();
  const now = new Date().toISOString();
  db.runSync(
    `INSERT INTO debts (debtorName, phone, amount, dueDate, note, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, 'UNPAID', ?, ?)`,
    [input.debtorName, input.phone, input.amount, input.dueDate, input.note ?? null, now, now],
  );

  const persisted = db.getFirstSync<DebtRow>("SELECT * FROM debts WHERE id = last_insert_rowid()");
  const mapped = mapDebt(persisted);
  if (!mapped) {
    throw new Error("Failed to create debt");
  }
  return mapped;
}

export function listDebts(options?: { status?: DebtStatus }): Debt[] {
  const db = getDb();
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (options?.status) {
    clauses.push("status = ?");
    params.push(options.status);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db.getAllSync<DebtRow>(`SELECT * FROM debts ${where} ORDER BY dueDate ASC`, params);
  return rows.map((row) => ({ ...row }));
}

export function getDebt(id: number): Debt | null {
  const db = getDb();
  const row = db.getFirstSync<DebtRow>("SELECT * FROM debts WHERE id = ?", id);
  return mapDebt(row);
}

export function updateDebt(id: number, patch: UpdateDebtInput): Debt | null {
  const entries = Object.entries(patch).filter(
    ([key, value]) => value !== undefined && key !== "id" && key !== "createdAt",
  ) as Array<[keyof UpdateDebtInput, string | number | null]>;

  if (!entries.length) {
    return getDebt(id);
  }

  const db = getDb();
  const columns = entries.map(([key]) => `${key} = ?`).join(", ");
  const params = entries.map(([, value]) => value);
  const now = new Date().toISOString();

  db.runSync(`UPDATE debts SET ${columns}, updatedAt = ? WHERE id = ?`, [...params, now, id]);
  return getDebt(id);
}

export function setPaid(id: number, paid: boolean): Debt | null {
  return updateDebt(id, { status: paid ? "PAID" : "UNPAID" });
}

export function deleteDebt(id: number): void {
  const db = getDb();
  db.runSync("DELETE FROM debts WHERE id = ?", id);
}

export function totals(): Totals {
  const db = getDb();
  const now = new Date().toISOString();
  const row = db.getFirstSync<{ outstanding: number | null; overdue: number | null }>(
    `
      SELECT
        SUM(CASE WHEN status = 'UNPAID' THEN amount ELSE 0 END) as outstanding,
        SUM(CASE WHEN status = 'UNPAID' AND dueDate < ? THEN amount ELSE 0 END) as overdue
      FROM debts
    `,
    now,
  );

  return {
    outstanding: row?.outstanding ?? 0,
    overdue: row?.overdue ?? 0,
  };
}

export function deadlineBuckets(): DeadlineBucket[] {
  const unpaid = listDebts({ status: "UNPAID" });
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  const buckets: Record<"Overdue" | "Next 7 Days" | "Later", Debt[]> = {
    Overdue: [],
    "Next 7 Days": [],
    Later: [],
  };

  unpaid.forEach((debt) => {
    const due = new Date(debt.dueDate);
    if (due < now) {
      buckets.Overdue.push(debt);
    } else if (due <= nextWeek) {
      buckets["Next 7 Days"].push(debt);
    } else {
      buckets.Later.push(debt);
    }
  });

  return Object.entries(buckets)
    .map(([title, data]) => ({
      title,
      data,
    }))
    .filter((section) => section.data.length > 0);
}
