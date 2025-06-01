import { getDb } from '@/db/initdb'
import { RowData } from '@/types/group';
import * as SQLite from 'expo-sqlite'



export async function createGroup(name: string, currency: string){
    try{
        let db: SQLite.SQLiteDatabase = await getDb();
        await db.runAsync('INSERT INTO group_table (name, currency) VALUES (?, ?)', [name, currency])
        return true;
    }
    catch(error){
        console.error("Fail to create group: ", error);
        return false;
    }
}

export async function getAllGroup(){
    try{
        let db: SQLite.SQLiteDatabase = await getDb();
        const result: RowData[]= await db.getAllAsync('SELECT * FROM group_table', [])
        return result
    }
    catch(error){
        console.error("Fail to get all group: ", error)
    }
}

export async function getDataGroupById(id: number){
    try{
        let db: SQLite.SQLiteDatabase = await getDb();
        const result: RowData[]= await db.getAllAsync('SELECT * FROM group_table WHERE id=?', [id])
        return result
    }
    catch(error){
        console.error("Fail to get group: ", error)
    }
}
