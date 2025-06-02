import { Participant, RowData } from "@/types/group";
import * as SQLite from "expo-sqlite";

export async function addParticipant(
    db: SQLite.SQLiteDatabase,
    groupID: string,
    name: string
) {
    try {
        await db.runAsync("INSERT INTO member (name, group_id) VALUES (?, ?)", [
            name,
            parseInt(groupID),
        ]);
        return true;
    } catch (error) {
        console.error("Fail to add participant: ", error);
        return false;
    }
}

export async function getParticipantsByGroupID(
    db: SQLite.SQLiteDatabase,
    groupID: string
) {
    try {
        const result: RowData[] = await db.getAllAsync(
            "SELECT * FROM member WHERE group_id = ?",
            [parseInt(groupID)]
        );
        return result;
    } catch (error) {
        console.error("Fail to get participant of group: ", error);
        return null;
    }
}

export async function updateParticipant(
    db: SQLite.SQLiteDatabase,
    id: number,
    name: string
) {
    try {
        await db.runAsync("UPDATE member SET name = ? WHERE id =?", [name, id]);
    } catch (error) {
        console.error("Fail to delete participant: ", error);
    }
}

export async function deleteParticipant(db: SQLite.SQLiteDatabase, id: number) {
    try {
        await db.runAsync("DELETE FROM member WHERE id = ?", [id]);
    } catch (error) {
        console.error("Fail to delete participant: ", error);
    }
}

export const syncParticipants = async (
    db: SQLite.SQLiteDatabase,
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
            await deleteParticipant(db, oldP.id);
        }
    }

    for (const newP of updated) {
        if (!newP.name.trim()) continue;

        if (!original.find((p) => p.id === newP.id)) {
            await addParticipant(db, groupId, newP.name);
        } else {
            const originalP = originalMap.get(newP.id);
            if (originalP && originalP.name !== newP.name) {
                await updateParticipant(db, newP.id, newP.name);
            }
        }
    }
};
