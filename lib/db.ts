import { openDatabaseSync } from "expo-sqlite";
import type { SQLiteDatabase } from "expo-sqlite";

let dbInstance: SQLiteDatabase | null = null;

export function initDb(): SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = openDatabaseSync("tagih-hutang.db");
    dbInstance.execSync("PRAGMA journal_mode = WAL;");
    dbInstance.execSync("PRAGMA foreign_keys = ON;");
  }

  dbInstance.execSync(`
    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      debtorName TEXT NOT NULL,
      phone TEXT NOT NULL,
      amount INTEGER NOT NULL,
      dueDate TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'UNPAID',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastReminderAt TEXT
    )
  `);

  dbInstance.execSync(`
    CREATE TABLE IF NOT EXISTS quick_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  return dbInstance;
}

export function getDb(): SQLiteDatabase {
  if (!dbInstance) {
    throw new Error("Database is not initialized. Call initDb() first.");
  }

  return dbInstance;
}
