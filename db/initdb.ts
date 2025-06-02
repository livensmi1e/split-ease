import * as SQLite from "expo-sqlite";

export const initDatabase = async (db: SQLite.SQLiteDatabase) => {
    try {
        db.execSync(`
          PRAGMA foreign_keys = ON;

          CREATE TABLE IF NOT EXISTS groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            currency TEXT
          );

          CREATE TABLE IF NOT EXISTS member (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            group_id INTEGER,
            FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS expense (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            amount INTEGER,
            group_id INTEGER,
            created_at TEXT DEFAULT (DATE('now')),
            FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
          );

          CREATE TABLE IF NOT EXISTS own (
            member_id INTEGER,
            group_id INTEGER,
            expense_id INTEGER,
            PRIMARY KEY(member_id, group_id, expense_id),
            FOREIGN KEY (member_id) REFERENCES member(id),
            FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
            FOREIGN KEY (expense_id) REFERENCES expense(id)
          );
    `);
        console.log("Các bảng đã được tạo thành công!");
    } catch (error) {
        console.error("Lỗi khi tạo bảng:", error);
        throw error;
    }
};

export const dropAllTables = async (db: SQLite.SQLiteDatabase) => {
    const tableNames = ["own", "expense", "member", "groups"]; // Xóa theo thứ tự phụ thuộc
    for (const name of tableNames) {
        try {
            await db.runAsync(`DROP TABLE IF EXISTS ${name}`);
            console.log(`Dropped table ${name}`);
        } catch (err) {
            console.error(`Failed to drop table ${name}:`, err);
        }
    }
};
