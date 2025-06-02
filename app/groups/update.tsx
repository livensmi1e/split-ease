import GroupForm from "@/components/GroupForm";
import { getGroup, updateGroup } from "@/core/groups";
import {
    getParticipantsByGroupID,
    syncParticipants,
} from "@/core/participants";
import { Participant } from "@/types/group";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export default function UpdateGroup() {
    const db = useSQLiteContext();
    const { id } = useLocalSearchParams();
    const [initialData, setInitialData] = useState<{
        name: string;
        currency: string;
        participants: Participant[];
    } | null>(null);
    const [oldPaticipants, setOldParticipants] = useState<Participant[]>([]);
    useEffect(() => {
        const loadData = async () => {
            try {
                const groupId = Array.isArray(id) ? id[0] : id ?? "";
                const res = await getGroup(db, groupId);
                const { name, currency } = res
                    ? res[0]
                    : {
                          name: "",
                          currency: "",
                      };
                const par = await getParticipantsByGroupID(db, groupId);
                let participants: Participant[] = [];
                if (par) {
                    participants = par.map((item) => {
                        return {
                            name: item.name as string,
                            id: item.id as number,
                        };
                    });
                }
                setInitialData({
                    name,
                    currency,
                    participants,
                });
                setOldParticipants(participants);
            } catch (error) {
                console.error("Fail to get detail infor of group: ", error);
            }
        };
        loadData();
    }, [id]);

    const handleUpdate = async (
        name: string,
        currency: string,
        participants: Participant[]
    ) => {
        const groupId = Array.isArray(id) ? id[0] : id ?? "";
        await updateGroup(db, { id: groupId, name, currency });
        await syncParticipants(db, groupId, oldPaticipants, participants);
    };

    if (!initialData) return null;

    return (
        <GroupForm
            title="Edit group"
            initialGroupName={initialData.name}
            initialCurrency={initialData.currency}
            initialParticipants={initialData.participants}
            onSubmit={handleUpdate}
            destination="/"
        />
    );
}
