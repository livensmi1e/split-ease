import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
    try {
        db = await SQLite.openDatabaseAsync("./mydb");

        db.execSync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS group_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        currency TEXT
      );

      CREATE TABLE IF NOT EXISTS member (
        id INTEGER,
        name TEXT,
        group_id INTEGER,
        PRIMARY KEY(id, group_id),
        FOREIGN KEY (group_id) REFERENCES group_table(id)
      );

      CREATE TABLE IF NOT EXISTS expense (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        amount INTEGER,
        group_id INTEGER,
        created_at TEXT DEFAULT (DATE('now')),
        FOREIGN KEY (group_id) REFERENCES group_table(id)
      );

      CREATE TABLE IF NOT EXISTS own (
        member_id INTEGER,
        group_id INTEGER,
        expense_id INTEGER,
        PRIMARY KEY(member_id, group_id, expense_id),
        FOREIGN KEY (member_id, group_id) REFERENCES member(id, group_id),
        FOREIGN KEY (group_id) REFERENCES group_table(id),
        FOREIGN KEY (expense_id) REFERENCES expense(id)
      );
    `);

        console.log("Các bảng đã được tạo thành công!");
        return db;
    } catch (error) {
        console.error("Lỗi khi tạo bảng:", error);
        throw error;
    }
};

export const getDb = () => {
    if (!db) {
        throw new Error(
            "Database chưa được khởi tạo. Hãy gọi initDatabase() trước."
        );
    }
    return db;
};
