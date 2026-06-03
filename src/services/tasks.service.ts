import { supabase } from "../lib/supabase";

import type {Task} from '../types/tasks.type'

export async function getAllColumnTasks(columnId: string): Promise<Task[]>{
    const {data, error} = await supabase
        .from('tasks')
        .select('*')
        .eq('column_id', columnId)

    if(error){
        throw new Error(error.message)
    }

    return data ?? [];
}