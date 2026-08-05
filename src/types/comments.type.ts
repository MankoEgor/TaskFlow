export type Comment = {
    id: string;
    task_id: string;
    user_id: string;
    content: string;
    created_at: string;
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