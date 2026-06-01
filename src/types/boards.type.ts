export type Board = {
    id: string;
    title: string;
    owner_id: string;
    createAt: string;
}

export type createBoardInput = {
    title: string;
    user_id: string;
}