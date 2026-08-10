import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Comment } from '../types/comments.type';

export function useCommentsRealtime(taskId: string) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!taskId) return;

        const queryKey = ['comments', taskId] as const;
        const invalidateComments = () => {
            void queryClient.invalidateQueries({ queryKey });
        };

        const channel = supabase
            .channel(`comments-realtime-${taskId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `task_id=eq.${taskId}`,
                },
                invalidateComments
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'comments',
                    filter: `task_id=eq.${taskId}`,
                },
                invalidateComments
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'comments',
                },
                (payload) => {
                    const deletedId = (payload.old as { id?: string }).id;
                    const cachedComments = queryClient.getQueryData<Comment[]>(queryKey);

                    if (deletedId && cachedComments?.some(({ id }) => id === deletedId)) {
                        invalidateComments();
                    }
                }
            )
            .subscribe((status, error) => {
                if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    console.error('Comments realtime error:', status, error);
                }
            });

        return () => {
            void supabase.removeChannel(channel);
        };
    }, [queryClient, taskId]);
}
