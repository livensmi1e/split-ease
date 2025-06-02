import GroupForm from "@/components/GroupForm";
import { createGroup } from "@/core/groups";
import { addParticipant } from "@/core/participants";
import { Participant } from "@/types/group";
import { useSQLiteContext } from "expo-sqlite";

export default function CreateGroup() {
    const db = useSQLiteContext();
    const handleSubmit = async (
        name: string,
        currency: string,
        participants: Participant[]
    ) => {
        const res = await createGroup(db, name, currency);
        if (res) {
            for (const p of participants) {
                await addParticipant(
                    db,
                    res.lastInsertRowId.toString(),
                    p.name
                );
            }
        }
    };

    return <GroupForm destination="/(tabs)/groups" onSubmit={handleSubmit} />;
}
