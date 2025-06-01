import { getDb } from '@/db/initdb'
import { Participant, RowData } from '@/types/group';
import * as SQLite from 'expo-sqlite'

export async function addParticipant(groupID: string, name: string){
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

export async function getParticipantsByGroupID(groupID: string){
    try{
        const db: SQLite.SQLiteDatabase = await getDb()
        // console.log(groupID)
        const result: RowData[] =  await db.getAllAsync('SELECT * FROM member WHERE group_id = ?', [groupID])
        return result;
    }
    catch(error){
        console.error("Fail to get participant of group: ", error);
        return null;
    }
}

export async function updateParticipant(id: number, name: string){
    try{
        const db: SQLite.SQLiteDatabase = await getDb()
        await db.runAsync('UPDATE member SET name = ? WHERE id =?', [name, id])
    }catch(error){
        console.error("Fail to delete participant: ", error)
    }
}

export async function deleteParticipant(id: number){
    try{
        const db: SQLite.SQLiteDatabase = await getDb()
        // console.log("delete id: ", id)
        await db.runAsync('DELETE FROM member WHERE id = ?', [id])
    }catch(error){
        console.error("Fail to delete participant: ", error)
    }
}


export const syncParticipants = async (
    groupId: string,
    original: Participant[],  
    updated: Participant[]   
    ) => {
    const originalMap = new Map<number, Participant>();
    for (const p of original) {
    if (p.id !== undefined) {
        originalMap.set(p.id, p);
    }
    }

    for (const oldP of original) {
    if (oldP.id && !updated.find((p) => p.id === oldP.id)) {
        await deleteParticipant(oldP.id);
    }
    }

    for (const newP of updated) {
    if (!newP.name.trim()) continue;

    if (!original.find((p) => p.id === newP.id)) {
        await addParticipant(groupId, newP.name);
    } else {
        const originalP = originalMap.get(newP.id);
        if (originalP && originalP.name !== newP.name) {
        await updateParticipant(newP.id, newP.name);
        }
    }
    }
};