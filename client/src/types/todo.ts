export type Todo = {
    ID: number;
    Name: string;
    Description: string;
    Completed: boolean;
    ListID: number;
    Today: boolean;
    Deadline: string | null;
    CreatedAt: string;
    UpdatedAt: string;
};
