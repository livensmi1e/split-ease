import { GroupUpdate, RowData } from "@/types/group";
import * as SQLite from "expo-sqlite";

export async function createGroup(
    db: SQLite.SQLiteDatabase,
    name: string,
    currency: string
) {
    try {
        const result = await db.runAsync(
            "INSERT INTO groups (name, currency) VALUES (?, ?)",
            [name, currency]
        );
        return result;
    } catch (error) {
        console.error("Fail to create group: ", error);
        return null;
    }
}

export async function getAllGroup(db: SQLite.SQLiteDatabase) {
    try {
        const result: RowData[] = await db.getAllAsync(
            `SELECT 
            g.id AS id,
            g.name,
            g.currency,
            COUNT(DISTINCT m.id) AS memberCount,
            COUNT(DISTINCT e.id) AS activityCount,
            SUM(e.amount) AS totalAmount 
        FROM groups g
        LEFT JOIN member m ON g.id = m.group_id
        LEFT JOIN expense e ON g.id = e.group_id
        GROUP BY g.id, g.name, g.currency`,
            []
        );
        return result;
    } catch (error) {
        console.error("Fail to get all group: ", error);
    }
}

export async function getGroup(db: SQLite.SQLiteDatabase, id: string) {
    try {
        const result: RowData[] = await db.getAllAsync(
            `SELECT g.id,
            g.name,
            g.currency,
            COUNT(DISTINCT m.id) AS memberCount,
            COUNT(DISTINCT e.id) AS activityCount,
            SUM(e.amount) AS totalAmount
            FROM groups g
            LEFT JOIN member m ON g.id = m.group_id
            LEFT JOIN expense e ON g.id = e.group_id
            WHERE g.id = ?
             `,
            [id]
        );
        return result;
    } catch (error) {
        console.error("Fail to get group: ", error);
    }
}

export async function deleteGroup(db: SQLite.SQLiteDatabase, id: number) {
    try {
        await db.runAsync("DELETE FROM groups WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Fail to delete group: ", error);
        return false;
    }
}

export async function updateGroup(db: SQLite.SQLiteDatabase, obj: GroupUpdate) {
    try {
        let query = "UPDATE groups SET ";
        const param = [];
        for (const [key, value] of Object.entries(obj)) {
            if (key != "id") {
                query += ` ${key} = ?,`;
                param.push(value);
            }
        }
        query = query.slice(0, -1);
        query += " WHERE id = ?";
        if (obj.id) param.push(obj.id);
        await db.runAsync(query, param);
    } catch (error) {
        console.error("Fail to update group: ", error);
    }
}

export async function getGroupsWithPendingDebt(db: SQLite.SQLiteDatabase) {
    try {
        const result = await db.getAllAsync<{
            id: number;
            name: string;
            currency: string;
            memberCount: number;
            activityCount: number;
            totalAmount: number | null;
        }>(
            `
        SELECT 
          g.id AS id,
          g.name,
          g.currency,
          COUNT(DISTINCT m.id) AS memberCount,
          COUNT(DISTINCT e.id) AS activityCount,
          SUM(e.amount) AS totalAmount
        FROM groups g
        JOIN who_owes_who w ON g.id = w.group_id AND w.amount > 0
        LEFT JOIN member m ON g.id = m.group_id
        LEFT JOIN expense e ON g.id = e.group_id
        GROUP BY g.id, g.name, g.currency
        `
        );
        return result;
    } catch (error) {
        console.error("Fail to get groups with pending debt details: ", error);
        throw error;
    }
}
