import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initializeDatabase() {
  try {
    const db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Banco de dados conectado e tabela de usuários garantida.");
    return db;
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
    process.exit(1); 
  }
}
