import { supabase } from "../lib/supabase";

import type {Task, CreateTaskInput} from '../types/tasks.type'

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

export async function createNewTask(input : CreateTaskInput): Promise<Task> {
    const { data: position, error: positionError } = await supabase
        .from('tasks')
        .select('position')
        .eq('column_id', input.column_id)
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle()

    if(positionError){
        throw new Error(positionError.message)
    }

    const newPosition: number = Number(position) + 1;



    const {data: task, error: taskError} = await supabase
        .from('tasks')
        .insert({column_id: input.column_id,
                title: input.title,
                description: input.description ?? null,
                priority: input.priority ?? 'medium',
                due_date: input.due_date ?? null,
                assignee_id: input.assignee_id ?? null,
                position: newPosition,
                created_by: input.created_by,})
        .select()
        .single()

    if(taskError){
        throw new Error(taskError.message)
    }

    return task;
}


export async function deleteTask(taskId: string): Promise<void>{
    const {error} = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

    if(error){
        throw new Error(error.message)
    }
}