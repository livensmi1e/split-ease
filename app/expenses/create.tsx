import ExpenseForm from "@/components/ExpenseForm";
import { createExpense } from "@/core/expenses";
import { Participant } from "@/types/group";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function CreateExpense() {
    const router = useRouter();
    const { groupId } = useLocalSearchParams();
    const db = useSQLiteContext();

    const handleCreateExpense = async (
        description: string,
        amount: string,
        currency: string,
        groupId?: string,
        participants?: Participant[],
        paidBy?: Participant | null,
        splitMethod?: "equally" | "as parts" | "as amounts",
        participantParts?: { [id: number]: number },
        participantAmounts?: { [id: number]: number }
    ) => {
        if (
            !description ||
            !amount ||
            !groupId ||
            !paidBy ||
            !participants?.length
        ) {
            alert("Please provide all required fields.");
            return;
        }

        try {
            console.log("Creating expense...");

            const numericAmount = parseFloat(amount);
            const groupIdNum = parseInt(groupId);

            const success = await createExpense(db, {
                description,
                amount: numericAmount,
                currency,
                groupId: groupIdNum,
                paidById: paidBy.id,
                participants,
                splitMethod,
                participantParts,
                participantAmounts,
            });

            if (success) {
                router.back();
            }
        } catch (error) {
            console.error("Failed to create expense:", error);
            alert("An error occurred while creating the expense");
        }
    };

    return (
        <ExpenseForm
            initialGroupId={groupId as string}
            onSubmit={handleCreateExpense}
            title="Create new expense"
        />
    );
}
