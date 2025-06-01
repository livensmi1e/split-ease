import { getDb } from '@/db/initdb'
import * as SQLite from 'expo-sqlite'

export async function addParticipant(groupID: number, name: string){
    try{
        const db: SQLite.SQLiteDatabase = await getDb()
        // console.log(groupID)
        await db.runAsync('INSERT INTO member (name, group_id) VALUES (?, ?)', [name, groupID])
        return true;
    }
    catch(error){
        console.error("Fail to add participant: ", error);
        return false;
    }
}