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

export type PendingGroup = {
    id: string;
    name: string;
    activityCount: number;
    memberCount: number;
    totalExpense: number;
    myExpense: number;
};

export type PendingGroupsListProps = {
    groups: PendingGroup[];
};

export type MarkAsPaid = {
    id: string;
    owner: string;
    target: string;
    amount: number;
    isMe: boolean;
    onMarkAsPaid?: () => void;
};

export type MarkAsPaidsListProps = {
    balances: MarkAsPaid[];
};
