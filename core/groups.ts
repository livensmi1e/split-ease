import { getDb } from '@/db/initdb'
import { GroupUpdate, RowData } from '@/types/group';
import * as SQLite from 'expo-sqlite'



export async function createGroup(name: string, currency: string){
    try{
        let db: SQLite.SQLiteDatabase = await getDb();
        const result = await db.runAsync('INSERT INTO group_table (name, currency) VALUES (?, ?)', [name, currency])
        return result;
    }
    catch(error){
        console.error("Fail to create group: ", error);
        return null;
    }
}

export async function getAllGroup(){
    try{
        let db: SQLite.SQLiteDatabase = await getDb();
        const result: RowData[] = await db.getAllAsync(
        `SELECT 
            g.id AS group_id,
            g.name,
            g.currency,
            COUNT(DISTINCT m.id) AS memberCount,
            COUNT(DISTINCT e.id) AS activityCount,
            SUM(e.amount) AS totalAmount 
        FROM group_table g
        LEFT JOIN member m ON g.id = m.group_id
        LEFT JOIN expense e ON g.id = e.group_id
        GROUP BY g.id, g.name, g.currency`,
        []
        );
        return result
    }
    catch(error){
        console.error("Fail to get all group: ", error)
    }
}

export async function getGroup(id: number){
    try{
        let db: SQLite.SQLiteDatabase = await getDb();
        const result: RowData[]= await db.getAllAsync('SELECT * FROM group_table WHERE id=?', [id])
        return result
    }
    catch(error){
        console.error("Fail to get group: ", error)
    }
}

export async function deleteGroup(id: number){
    try{
        let db: SQLite.SQLiteDatabase = await getDb();
        await db.runAsync('DELETE FROM group_table WHERE id = ?', [id])
        return true;
    }
    catch(error){
        console.error("Fail to delete group: ", error)
        return false;
    }
}

export async function updateGroup(obj: GroupUpdate){
    try{
        let db: SQLite.SQLiteDatabase = await getDb();
        let query = "UPDATE group_table SET "
        const param = []
        for(const [key, value] of Object.entries(obj)){
            query += `${key} = ?`
            param.push(value)
        }
        await db.runAsync(query, param)
    }
    catch(error){
        console.error("Fail to update group: ", error)
    }
}