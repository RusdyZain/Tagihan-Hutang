import Constants from "expo-constants";
import { Linking } from "react-native";

import { listDebts, type Debt, updateDebt } from "./debtRepo";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

type NotificationsModule = typeof import("expo-notifications");

let notificationsModule: NotificationsModule | null = null;

async function getNotificationsModule(): Promise<NotificationsModule | null> {
  if (notificationsModule) {
    return notificationsModule;
  }

  if (Constants.appOwnership === "expo") {
    return null;
  }

  try {
    notificationsModule = await import("expo-notifications");
    return notificationsModule;
  } catch {
    return null;
  }
}

export async function ensureNotifPermission(
  module?: NotificationsModule | null,
): Promise<boolean> {
  const notifications = module ?? (await getNotificationsModule());
  if (!notifications) {
    return false;
  }

  try {
    const settings = await notifications.getPermissionsAsync();
    if (settings.status === notifications.AuthorizationStatus.GRANTED) {
      return true;
    }

    const request = await notifications.requestPermissionsAsync();
    return request.status === notifications.AuthorizationStatus.GRANTED;
  } catch {
    return false;
  }
}

export function buildWaMessage(debt: Debt): string {
  const date = new Date(debt.dueDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const amount = debt.amount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  return `Halo ${debt.debtorName}, ini pengingat tagihan sebesar ${amount} yang jatuh tempo pada ${date}. Mohon konfirmasi pembayaran ya. Terima kasih!`;
}

export async function openWhatsApp(phone: string, message: string): Promise<void> {
  const sanitized = phone.replace(/[^0-9]/g, "");
  const url = `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
  await Linking.openURL(url);
}

export async function runReminderSweep(): Promise<boolean> {
  const notifications = await getNotificationsModule();
  if (!notifications) {
    return false;
  }

  const granted = await ensureNotifPermission(notifications);
  if (!granted) {
    return false;
  }

  const debts = listDebts({ status: "UNPAID" });
  const now = Date.now();

  for (const debt of debts) {
    const lastReminder = debt.lastReminderAt ? new Date(debt.lastReminderAt).getTime() : null;
    const shouldNotify = !lastReminder || now - lastReminder >= THREE_DAYS_MS;
    if (!shouldNotify) {
      continue;
    }

    await notifications.scheduleNotificationAsync({
      content: {
        title: `Reminder hutang: ${debt.debtorName}`,
        body: `Tagihan sebesar Rp${debt.amount.toLocaleString("id-ID")} jatuh tempo pada ${new Date(debt.dueDate).toLocaleDateString("id-ID")}`,
        data: { debtId: debt.id },
      },
      trigger: null,
    });

    updateDebt(debt.id, { lastReminderAt: new Date().toISOString() });
  }

  return true;
}
