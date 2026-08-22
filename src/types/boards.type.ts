export type Board = {
    id: string;
    title: string;
    owner_id: string;
    created_at: string;
}

export type createBoardInput = {
    title: string;
}