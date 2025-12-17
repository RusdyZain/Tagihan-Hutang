import { getDb } from "./db";

export type QuickNote = {
  id: number;
  content: string;
  createdAt: string;
};

type QuickNoteRow = QuickNote;

export function createQuickNote(content: string): QuickNote {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Catatan kosong tidak dapat disimpan.");
  }

  const db = getDb();
  const now = new Date().toISOString();
  db.runSync("INSERT INTO quick_notes (content, createdAt) VALUES (?, ?)", [trimmed, now]);
  const row = db.getFirstSync<QuickNoteRow>(
    "SELECT * FROM quick_notes WHERE id = last_insert_rowid()",
  );
  if (!row) {
    throw new Error("Gagal membuat catatan.");
  }
  return row;
}

export function listQuickNotes(): QuickNote[] {
  const db = getDb();
  const rows = db.getAllSync<QuickNoteRow>(
    "SELECT * FROM quick_notes ORDER BY datetime(createdAt) DESC",
  );
  return rows.map((row) => ({ ...row }));
}

export function deleteQuickNote(id: number): void {
  const db = getDb();
  db.runSync("DELETE FROM quick_notes WHERE id = ?", id);
}
