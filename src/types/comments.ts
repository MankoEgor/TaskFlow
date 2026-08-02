export type Comment = {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: string;
    profile?: {
        id: string;
        name: string | null;
        avatar_url: string | null;
    };
};

export type CreateCommentInput = {
    task_id: string;
    user_id: string;
    content: string;
}