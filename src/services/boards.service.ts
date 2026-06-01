import {supabase} from '../lib/supabase'
import type {Board, createBoardInput} from '../types/boards.type'


export async function getMyBoards(id?: string ): Promise<Board[]>{

    const {data, error} = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', id);


    if(error){
        throw new Error(error.message);
    } 

    return data ?? [];

}


export async function createNewBoard({title, user_id}: createBoardInput): Promise<Board> {
    const { data: board, error: boardError } = await supabase
        .from('boards')
            .insert({
            title,
            owner_id: user_id,
        })
        .select()
        .single()


    if(boardError){
        throw new Error(boardError.message)
    }


    const {error: memberError} = await supabase
        .from('board_members')
        .insert({
            board_id: board.id,
            user_id: user_id,
            role: 'owner'
        });

    if(memberError){
        throw new Error(memberError.message)
    }


    const {error: columnError} = await supabase
        .from('')
        .insert([{
            board_id: board.id,
            title: 'To Do',
            position: 0
        },
        {
            board_id: board.id,
            title: 'In Progress',
            position: 1
        },
        {
            board_id: board.id,
            title: 'Done',
            position: 2
        }]
    )
                                        
    if(columnError){
        throw new Error(columnError.message)
    }

    return board;

}   


export async function deleteBoard(boardId: string): Promise<void>{
    const {error} = await supabase.from('boards').delete().eq('id', boardId)

    if(error){
        throw new Error(error.message)
    }
}