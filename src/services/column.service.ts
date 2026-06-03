import { supabase } from "../lib/supabase";
import type { Column } from "../types/column.type";

export async function getAllColumns(id: string): Promise<Column[]> {
    const {data: column, error} = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', id)
        .order('position', { ascending: true })

    if(error){
        throw new Error(error.message);
    }

    return column ?? [];
}