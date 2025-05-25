export type BalanceSummaryProps = {
    youOwe: number;
    owesYou: number;
};

export type RecentExpense = {
    id: string;
    groupName: string;
    name: string;
    amount: number;
    date: string;
};

export type RecentExpensesListProps = {
    expenses: RecentExpense[];
};
