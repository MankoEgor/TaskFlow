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

export async function createComment(
    input: CreateCommentInput
): Promise<void> {
    const content = input.content.trim();

    if (!input.task_id) {
        throw new Error('Task ID is required');
    }

    if (!input.user_id) {
        throw new Error('You must be logged in to create a comment');
    }

    if (!content) {
        throw new Error('Comment cannot be empty');
    }

    if (content.length > 500) {
        throw new Error('Comment cannot exceed 500 characters');
    }

    const { error } = await supabase
        .from('comments')
        .insert({
            task_id: input.task_id,
            user_id: input.user_id,
            content,
        });

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