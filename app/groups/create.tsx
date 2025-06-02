import GroupForm from "@/components/GroupForm";
import { createGroup } from "@/core/groups";
import { addParticipant } from "@/core/participants";
import { Participant } from "@/types/group";
export default function CreateGroup() {
    const handleSubmit = async (name: string, currency: string, participants: Participant[]) => {
    const res = await createGroup(name, currency);
    if (res) {
      for (const p of participants) {
        await addParticipant(res.lastInsertRowId.toString(), p.name);
      }
    }
  };

  return <GroupForm destination="/(tabs)/groups" onSubmit={handleSubmit} />;
}
