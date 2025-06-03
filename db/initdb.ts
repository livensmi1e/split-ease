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
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS expense (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        amount INTEGER,
        group_id INTEGER,
        paid_by INTEGER,
        created_at TEXT DEFAULT (DATE('now')),
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
        FOREIGN KEY (paid_by) REFERENCES member(id)
      );

      CREATE TABLE IF NOT EXISTS expense_share (
        member_id INTEGER,
        expense_id INTEGER,
        amount INTEGER,
        PRIMARY KEY (member_id, expense_id),
        FOREIGN KEY (member_id) REFERENCES member(id),
        FOREIGN KEY (expense_id) REFERENCES expense(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS settlement (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER,
        from_member INTEGER,
        to_member INTEGER,
        amount INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
        FOREIGN KEY (from_member) REFERENCES member(id),
        FOREIGN KEY (to_member) REFERENCES member(id)
      );

      -- Drop views
      DROP VIEW IF EXISTS who_owes_who;
     DROP VIEW IF EXISTS member_balances;

CREATE VIEW member_balances AS
SELECT
  m.id AS member_id,
  m.name AS name,
  g.id AS group_id,

  -- Tổng tôi đã trả thay cho nhóm
  IFNULL((
    SELECT SUM(e.amount)
    FROM expense e
    WHERE e.paid_by = m.id AND e.group_id = g.id
  ), 0) AS total_paid,

  -- Tổng tôi phải trả cho các expense
  -- Tổng tôi phải trả (chia phí cho người khác + tôi đã thanh toán cho người khác)
(
  IFNULL((
    SELECT SUM(es.amount)
    FROM expense_share es
    JOIN expense e2 ON es.expense_id = e2.id
    WHERE es.member_id = m.id
      AND e2.group_id = g.id
      AND e2.paid_by != m.id  -- Bỏ phần tôi tự nợ chính mình
  ), 0)
  -
  IFNULL((
    SELECT SUM(s.amount)
    FROM settlement s
    WHERE s.from_member = m.id AND s.group_id = g.id
  ), 0)
) AS total_owed,

  -- Tổng tôi nhận từ người khác (settlement)
  IFNULL((
    SELECT SUM(s.amount)
    FROM settlement s
    WHERE s.to_member = m.id AND s.group_id = g.id
  ), 0) AS total_received,

  -- Tổng tôi trả cho người khác (settlement)
  IFNULL((
    SELECT SUM(s.amount)
    FROM settlement s
    WHERE s.from_member = m.id AND s.group_id = g.id
  ), 0) AS total_sent,

  -- Final balance
  (
    IFNULL((
      SELECT SUM(e.amount)
      FROM expense e
      WHERE e.paid_by = m.id AND e.group_id = g.id
    ), 0)
    -
    IFNULL((
      SELECT SUM(es.amount)
      FROM expense_share es
      JOIN expense e2 ON es.expense_id = e2.id
      WHERE es.member_id = m.id AND e2.group_id = g.id
    ), 0)
    -
    IFNULL((
      SELECT SUM(s.amount)
      FROM settlement s
      WHERE s.to_member = m.id AND s.group_id = g.id
    ), 0)
    +
    IFNULL((
      SELECT SUM(s.amount)
      FROM settlement s
      WHERE s.from_member = m.id AND s.group_id = g.id
    ), 0)
  ) AS balance

FROM member m
JOIN groups g ON m.group_id = g.id;


      CREATE VIEW who_owes_who AS
        SELECT
        debtor.group_id AS group_id,
        debtor.member_id AS from_member_id,
        debtor.name AS debtor_name,
        creditor.member_id AS to_member_id,
        creditor.name AS creditor_name,
        ROUND(MIN(-debtor.balance, creditor.balance), 2) AS amount
        FROM member_balances AS debtor
        JOIN member_balances AS creditor
        ON debtor.group_id = creditor.group_id
        WHERE
        debtor.balance < 0
        AND creditor.balance > 0
        AND debtor.member_id != creditor.member_id
        AND ROUND(MIN(-debtor.balance, creditor.balance), 2) > 0;

    `);

    console.log("✅ Các bảng và view đã được tạo thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi tạo bảng:", error);
    throw error;
  }
};


export const dropAllTables = async (db: SQLite.SQLiteDatabase) => {
    const tableNames = ["expense_share", "expense", "member", "groups"]; // đúng thứ tự phụ thuộc

    for (const name of tableNames) {
    try {
        await db.runAsync(`DROP TABLE IF EXISTS ${name}`);
        console.log(`✅ Đã xoá bảng ${name}`);
    } catch (err) {
        console.error(`❌ Lỗi khi xoá bảng ${name}:`, err);
    }
    }

};
