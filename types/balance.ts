export type BalanceSummaryProps = {
    youOwe: number;
    owesYou: number;
};

export type MarkAsPaidProps = {
    id: string;
    owner: string;
    target: string;
    amount: number;
    isMe: boolean;
    onMarkAsPaid?: () => void;
};

export type MemberBalanceProps = {
    id: string;
    pays: number;
    owes: number;
    memberName: string;
};
