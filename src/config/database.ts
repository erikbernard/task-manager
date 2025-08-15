import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initializeDatabase() {
  try {
    const db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    await db.exec("PRAGMA foreign_keys = ON;"); // Habilita foreign keys no sqlite
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT CHECK(priority IN ('HIGH', 'MEDIUM', 'LOW')) NOT NULL,
        status TEXT CHECK(status IN ('PENDING', 'COMPLETED', 'STARTED', 'BLOCKED', 'NOSTARTED')) NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("Banco de dados conectado e tabela de usuários garantida.");
    return db;
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
    process.exit(1); 
  }
}
