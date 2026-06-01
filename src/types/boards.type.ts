export type Board = {
    id: string;
    title: string;
    owner_id: string;
    createAt: string;
}

export type createBoardInput = {
    title: string;
    userId: string;
}