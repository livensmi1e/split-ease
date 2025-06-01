export type GroupItemProps = {
    id: number;
    name: string;
    activityCount: number;
    memberCount: number;
    totalExpense: number;
    myExpense: number;
    isCompleted: boolean;
    avatar: any;
};

export type GroupUpdate = {
    id?: string;
    name?: string;
    currency?: string;
}

export interface Participant {
  id: number;
  name: string;
}


export type RowData = Record<string, any>;