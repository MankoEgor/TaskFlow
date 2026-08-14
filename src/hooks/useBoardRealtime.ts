import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

import type { Column } from "../types/column.type";

export function useBoardRealtime(boardId?: string) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if(!boardId) return;

         const invalidateTask = () => {
            void queryClient.invalidateQueries({ 
                queryKey: ['board-tasks', boardId],
            });
        }


        const invalidateColumn = () => {

            void queryClient.invalidateQueries({
                queryKey: ['columns', boardId],
            });
        }

        const handleColumnDelete = (
            payload: { old: { id?: string } }
        ) => {
            const deletedColumnId = payload.old.id;

            const cachedColumns = queryClient.getQueryData<Column[]>(
                ['columns', boardId]
            );

            const belongsToCurrentBoard = cachedColumns?.some(
                (column) => column.id === deletedColumnId
            );

            if (belongsToCurrentBoard) {
                invalidateColumn();
                invalidateTask();
            }
        };

        const channel = supabase
            .channel(`board-realtime-${boardId}`)
            .on(
                'postgres_changes',
                { 
                    event: '*',
                    schema: 'public', 
                    table: 'tasks' 
                },
                invalidateTask
            )
            .on(
                'postgres_changes',
                { 
                    event: 'INSERT',
                    schema: 'public', 
                    table: 'columns',
                    filter: `board_id=eq.${boardId}`
                },
                invalidateColumn
            )
            .on(
                'postgres_changes',
                { 
                    event: 'UPDATE',
                    schema: 'public', 
                    table: 'columns',
                    filter: `board_id=eq.${boardId}`
                },
                invalidateColumn
            )
            .on(
                'postgres_changes',
                { 
                    event: 'DELETE',
                    schema: 'public', 
                    table: 'columns',
                },
                handleColumnDelete
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