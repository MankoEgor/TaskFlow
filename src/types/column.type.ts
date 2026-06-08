export type Column = {
    id: string;
    board_id: string;
    title: string;
    position: number;
}

export type insertColumnProps = {
    boardId?: string;
    title: string;
}