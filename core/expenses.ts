import { RecentExpenseProps } from "@/types/expense";
import { Participant, RowData } from "@/types/group";
import * as SQLite from "expo-sqlite";
import { getIsMeParticipant } from "./participants";

type CreateExpenseInput = {
    description: string;
    amount: number;
    currency: string;
    groupId: number;
    paidById: number;
    participants: Participant[];
    splitMethod?: "equally" | "as parts" | "as amounts";
    participantParts?: { [id: number]: number }; // Nếu chia theo phần
    participantAmounts?: { [id: number]: number }; // Nếu chia theo số tiền cụ thể
};

export async function createExpense(
    db: SQLite.SQLiteDatabase,
    input: CreateExpenseInput
): Promise<boolean> {
    const {
        description,
        amount,
        currency,
        groupId,
        paidById,
        participants, // Đây là những người tham gia đã được chọn từ UI
        splitMethod = "equally",
        participantParts = {},
        participantAmounts = {},
    } = input;

    try {
        // 1. Insert into expense table
        await db.withTransactionAsync(async () => {
            const result = await db.runAsync(
                `INSERT INTO expense (description, amount, group_id, paid_by) VALUES (?, ?, ?, ?)`,
                [description, amount, groupId, paidById]
            );

            const expenseId = result.lastInsertRowId;
            if (!expenseId)
                throw new Error("Không thể lấy ID của expense vừa tạo");

            // 2. Determine shares
            let shareMap: { [id: number]: number } = {};

            if (splitMethod === "equally") {
                // Tính toán phần chia đều dựa trên số lượng người tham gia đã chọn
                const equalShare =
                    Math.round((amount / participants.length) * 100) / 100;
                for (const p of participants) {
                    shareMap[p.id] = equalShare;
                }
            } else if (splitMethod === "as parts") {
                // Xây dựng shareMap chỉ với những người tham gia có số phần > 0
                for (const p of participants) {
                    const parts = participantParts[p.id] || 0;
                    if (parts > 0) {
                        // Chỉ bao gồm nếu số phần lớn hơn 0
                        shareMap[p.id] = parts;
                    }
                }
                // Tính toán lại số tiền thực tế dựa trên tổng số phần
                const totalParts = Object.values(shareMap).reduce(
                    (sum, part) => sum + part,
                    0
                );
                if (totalParts === 0) {
                    throw new Error("Tổng số phần chia không hợp lệ (bằng 0)");
                }
                for (const pId in shareMap) {
                    shareMap[pId] = (amount * shareMap[pId]) / totalParts;
                }
            } else if (splitMethod === "as amounts") {
                // Xây dựng shareMap chỉ với những người tham gia có số tiền > 0
                for (const p of participants) {
                    const individualAmount = participantAmounts[p.id] || 0;
                    if (individualAmount > 0) {
                        // Chỉ bao gồm nếu số tiền lớn hơn 0
                        shareMap[p.id] = individualAmount;
                    }
                }
            } else {
                throw new Error("Phương thức chia không hợp lệ");
            }

            // Tùy chọn: xác thực tổng số tiền chia
            const totalShare = Object.values(shareMap).reduce(
                (a, b) => a + b,
                0
            );
            // Sử dụng một dung sai nhỏ cho việc so sánh số thập phân
            if (parseFloat(Math.abs(totalShare - amount).toFixed(2)) > 0.01) {
                console.log(`totalShare: ${totalShare} amount: ${amount}`);
                throw new Error("Tổng tiền chia không khớp với tổng chi phí");
            }

            // 3. Insert into expense_share table
            // Lặp qua shareMap đã được lọc
            for (const [memberIdStr, share] of Object.entries(shareMap)) {
                const memberId = parseInt(memberIdStr);
                await db.runAsync(
                    `INSERT INTO expense_share (member_id, expense_id, amount) VALUES (?, ?, ?)`,
                    [memberId, expenseId, share]
                );
            }
            // Removed 'return true;' here as withTransactionAsync expects Promise<void>
        });
        return true; // This return is for the outer createExpense function
    } catch (err) {
        console.error("Lỗi trong createExpense:", err);
        return false;
    }
}

export async function getExpense(db: SQLite.SQLiteDatabase, id: number) {
    try {
        const result: RowData = await db.getAllAsync(
            "SELECT * FROM expense WHERE id = ?",
            [id]
        );
        return result;
    } catch (error) {
        console.error("Fail to get expense: ", error);
        return false;
    }
}

export async function updateExpense(
    db: SQLite.SQLiteDatabase,
    id: number,
    description: string,
    amount: number
) {
    try {
        await db.runAsync(
            "UPDATE expense SET description = ?, amount = ? WHERE id = ?",
            [description, amount, id]
        );
        return true;
    } catch (error) {
        console.error("Fail to update expense: ", error);
        return false;
    }
}

export async function getExpensesByGroupId(
    db: SQLite.SQLiteDatabase,
    groupId: number
) {
    try {
        const expenses: RowData[] = await db.getAllAsync(
            `SELECT e.id, e.description, e.amount, e.created_at, m.name as paid_by_name
       FROM expense e
       JOIN member m ON e.paid_by = m.id
       WHERE e.group_id = ?
       ORDER BY e.created_at DESC`,
            [groupId]
        );
        return expenses;
    } catch (error) {
        console.error("Failed to get expenses by group ID: ", error);
        return [];
    }
}

export async function getMemberBalancesByGroupId(
    db: SQLite.SQLiteDatabase,
    groupId: string
) {
    try {
        const balances: RowData[] = await db.getAllAsync(
            `SELECT member_id, name, total_paid, total_owed, balance
       FROM member_balances
       WHERE group_id = ?`,
            [groupId]
        );
        return balances;
    } catch (error) {
        console.error("Failed to get member balances by group ID: ", error);
        return [];
    }
}

export async function getWhoOwesWhoByGroupId(
    db: SQLite.SQLiteDatabase,
    groupId: number
) {
    try {
        const owesWho: RowData[] = await db.getAllAsync(
            `SELECT 
        group_id,
        from_member_id,
        debtor_name,
        to_member_id,
        creditor_name,
        amount
       FROM who_owes_who
       WHERE group_id = ?`,
            [groupId]
        );
        return owesWho;
    } catch (error) {
        console.error("Failed to get who owes who by group ID: ", error);
        return [];
    }
}

export async function markAsPaid(
    db: SQLite.SQLiteDatabase,
    groupId: number,
    fromMemberId: number,
    toMemberId: number,
    amount: number
): Promise<boolean> {
    try {
        await db.runAsync(
            `INSERT INTO settlement (group_id, from_member, to_member, amount) VALUES (?, ?, ?, ?)`,
            [groupId, fromMemberId, toMemberId, amount]
        );
        return true;
    } catch (error) {
        console.error("Failed to mark as paid:", error);
        return false;
    }
}

export async function getExpensesByPayer(
    db: SQLite.SQLiteDatabase,
    payer_id: number
) {
    try {
        const result: RowData[] = await db.getAllAsync(
            "SELECT * FROM expense WHERE paid_by = ?",
            [payer_id]
        );
        return result;
    } catch (error) {
        console.error("Fail to get expenses: ", error);
        return false;
    }
}

export async function getRecentExpensesFromMe(
    db: SQLite.SQLiteDatabase
): Promise<RecentExpenseProps[]> {
    const meParticipants = await getIsMeParticipant(db);
    if (!meParticipants || meParticipants.length === 0) return [];

    let allExpenses: any[] = [];

    for (const member of meParticipants) {
        const expenses = await getExpensesByPayer(db, member.id);
        if (expenses) {
            allExpenses.push(...expenses);
        }
    }

    // Sắp xếp theo thời gian tạo mới nhất
    allExpenses.sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Chỉ lấy 10 expense đầu tiên, map thành dạng RecentExpenseProps
    const limited = allExpenses.slice(0, 10);
    const withGroup = await Promise.all(
        limited.map(async (expense) => {
            const group = await db.getFirstAsync<{ name: string }>(
                "SELECT name FROM groups WHERE id = ?",
                [expense.group_id]
            );
            return {
                id: expense.id.toString(),
                groupName: group?.name ?? "Unknown Group",
                name: expense.description,
                amount: expense.amount,
                date: expense.created_at,
            } as RecentExpenseProps;
        })
    );

    return withGroup;
}

export async function getMyPaymentInfo(db: SQLite.SQLiteDatabase) {
    try {
        const myMembers = await db.getAllAsync<{ id: number }>(
            "SELECT id FROM member WHERE isMe = 1"
        );
        const myIds = myMembers.map((m) => m.id);
        if (myIds.length === 0) {
            return {
                totalIOwe: 0,
                totalTheyOweMe: 0,
            };
        }
        const iOweOthers = await db.getAllAsync<{
            from_member_id: number;
            to_member_id: number;
            creditor_name: string;
            amount: number;
        }>(
            `SELECT * FROM who_owes_who WHERE from_member_id IN (${myIds
                .map(() => "?")
                .join(",")})`,
            myIds
        );

        const othersOweMe = await db.getAllAsync<{
            from_member_id: number;
            to_member_id: number;
            debtor_name: string;
            amount: number;
        }>(
            `SELECT * FROM who_owes_who WHERE to_member_id IN (${myIds
                .map(() => "?")
                .join(",")})`,
            myIds
        );

        const totalIOwe = iOweOthers.reduce((sum, row) => sum + row.amount, 0);
        const totalTheyOweMe = othersOweMe.reduce(
            (sum, row) => sum + row.amount,
            0
        );

        return {
            totalIOwe,
            totalTheyOweMe,
        };
    } catch (error) {
        console.log("Failed to get my payment info");
        return {
            totalIOwe: 0,
            totalTheyOweMe: 0,
        };
    }
}
