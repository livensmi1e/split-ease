import { getDb } from '@/db/initdb'
import { RowData } from '@/types/group';
import * as SQLite from 'expo-sqlite'



export async function createExpense(description: string, amount: number, group_id: number){
    try{
        let db: SQLite.SQLiteDatabase = await getDb()
        await db.runAsync('INSERT INTO expense(description, amount, group_id) VALUES (?, ?, ?)', [description, amount, group_id])
        return true;
    }
    catch(error){
        console.error("Fail to create expense: ", error)
        return false;
    }
}

export async function getExense(id: number){
    try{
        let db: SQLite.SQLiteDatabase = await getDb()
        const result: RowData = await db.getAllAsync('SELECT * FROM expense WHERE id = ?', [id])
        return result;
    }
    catch(error){
        console.error("Fail to get expense: ", error)
        return false;
    }
}