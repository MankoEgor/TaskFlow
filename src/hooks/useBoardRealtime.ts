import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useBoardRealtime(boardId?: string) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if(!boardId) return;

        const invalidateBoard = () => {
            void queryClient.invalidateQueries({ 
                queryKey: ['board-tasks', boardId],
            });

            void queryClient.invalidateQueries({
                queryKey: ['columns', boardId],
            });
        }


        const channel = supabase
            .channel(`board-realtime-${boardId}`)
            .on(
                'postgres_changes',
                { 
                    event: '*',
                    schema: 'public', 
                    table: 'tasks' 
                },
                invalidateBoard
            )
            .on(
                'postgres_changes',
                { 
                    event: '*',
                    schema: 'public', 
                    table: 'columns' 
                },
                invalidateBoard
            )
            .subscribe((status, error) => {
                if(status === 'CHANNEL_ERROR' ||  status === 'TIMED_OUT') {
                    console.error('Supabase channel error:', status, error);
                }
            });

        return () => {
            void supabase.removeChannel(channel);
        };

    }, [boardId, queryClient]);
}