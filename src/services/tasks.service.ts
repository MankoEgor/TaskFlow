import { supabase } from "../lib/supabase";

import type {Task, CreateTaskInput} from '../types/tasks.type'


export async function getAllBoardTask(boardId?: string): Promise<Task[]> {
    const {data, error} = await supabase
        .from('tasks')
        .select(
            `*, 
            columns!inner(
                id, 
                board_id
            )`
        )
        .eq('columns.board_id', boardId)
        .order('position', {ascending: true})

    if(error){
        throw new Error(error.message)
    }

    return data ?? [];
}

async function getMaxPosition(columnId: string): Promise<number>{

    const { data, error} = await supabase
        .from('tasks')
        .select('position')
        .eq('column_id', columnId)
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle()


    if(error){
        throw new Error(error.message)
    }

    const position: number = (data?.position ?? -1) + 1;

    return position;
}

export async function createNewTask(input : CreateTaskInput): Promise<Task> {

    const newPosition: number = await getMaxPosition(input.column_id)

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

export async function updateTaskPosition(taskId: string, targetColumnId: string, targetPosition: number){


    const {error} = await supabase
        .from('tasks')
        .update(({
            column_id: targetColumnId,
            position: targetPosition
        }))
        .eq('id', taskId)

    if(error){
        throw new Error(error.message);
    }
}

export async function updateTaskPositionInSameColumn(
    tasks: {id: string, position: number}[]
): Promise<void>{
    const result = await Promise.all(
        tasks.map((task) => 
            supabase
                .from('tasks')
                .update({position: task.position})
                .eq('id', task.id)
        )
    )

    const failed = result.find((result) => result.error)

    if(failed?.error){
        throw new Error(failed.error.message)
    }
}