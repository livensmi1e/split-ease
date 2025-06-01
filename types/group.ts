export type GroupItemProps = {
    id: string;
    name: string;
    activityCount: number;
    memberCount: number;
    totalExpense: number;
    myExpense: number;
    isCompleted: boolean;
    avatar: any;
};

export type GroupUpdate = {
    id: string;
    name: string;
    currency: string;
}

export type RowData = Record<string, any>;