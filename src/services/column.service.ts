import { supabase } from "../lib/supabase";
import type { Column, insertColumnProps } from "../types/column.type";

export async function getAllColumns(boardId?: string): Promise<Column[]> {
    const {data: column, error} = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true })

    if(error){
        throw new Error(error.message);
    }

    return column ?? [];
}

async function getMaxPosition(boardId?: string): Promise<number>{
    const {data: position, error: errorPosition} = await supabase
        .from('columns')
        .select('position')
        .eq('board_id', boardId)
        .order('position', {ascending: false})
        .limit(1)
        .maybeSingle()

        if(errorPosition){
            throw new Error(errorPosition.message)
        }

        return position?.position
}

export async function createNewColumn({boardId, title}: insertColumnProps): Promise<Column>{

    const maxPosition: number = await getMaxPosition(boardId)
    const nextPosition: number = (maxPosition ?? -1) + 1;

    const {data, error} = await supabase
        .from('columns')
        .insert({
            board_id: boardId,
            title: title,
            position: nextPosition
        })
        .select()
        .single()

    if(error){
        throw new Error(error.message);
    }

    return data;
}

export async function deleteColumn(columnId: string): Promise<void>{
    const {error} = await supabase
        .from('columns')
        .delete()
        .eq('id', columnId)

    if(error){
        throw new Error(error.message)
    }
}