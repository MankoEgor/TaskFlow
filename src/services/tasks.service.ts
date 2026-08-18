import { supabase } from "../lib/supabase";

import type {Task, CreateTaskInput, UpdateTaskInput} from '../types/tasks.type'
import type { MoveTaskInput } from '../types/kanban.type'


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

export async function moveTask(input: MoveTaskInput): Promise<void> {
    const {error} = await supabase.rpc('move_task', {
        p_task_id: input.taskId,
        p_target_column_id: input.targetColumnId,
        p_target_index: input.targetIndex,
    });

    if(error){
        throw new Error(error.message);
    }
}

export async function updateTask(input: UpdateTaskInput): Promise<void> {

    const title = input.title.trim();

    if(!title){
        throw new Error('Task title is required')
    }

    const {error} = await supabase
        .from('tasks')
        .update({
            title,
            description: input.description?.trim() || null,
            priority: input.priority,
            due_date: input.due_date,
            assignee_id: input.assignee_id
        })
        .eq('id', input.taskId)
        .select()
        .single()
        
    if(error){
        throw new Error(error.message)
    }
}
