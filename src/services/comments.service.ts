import {supabase} from '../lib/supabase';
import type { Comment, CreateCommentInput } from '../types/comments.type';

export async function getTaskComments(taskId: string): Promise<Comment[]> {

    const {data, error} = await supabase
        .from('comments')
        .select(`
            *,
            profile:profiles!comments_user_id_profiles_fkey (
                id,
                name,
                avatar_url
            )
        `)
        .eq('task_id', taskId)
        .order('created_at', {ascending: true});

    if (error) {
        throw new Error(error.message);
    }

    return data as Comment[];
}

export async function createComment(comment: CreateCommentInput): Promise<void> {
    if(!comment.task_id || !comment.user_id || !comment.content) return;

    if(comment.content.trim().length === 0 || comment.content.trim().length > 500) 
        throw new Error('Comment content exceeds the maximum length of 500 characters.');

    comment.content = comment.content.trim();

    const {error} = await supabase
        .from('comments')
        .insert(comment);

    if (error) {
        throw new Error(error.message);
    }
}

export async function deleteComment(commentId: string) {
    const {error} = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

    if(error){
        throw new Error(error.message)
    }
}