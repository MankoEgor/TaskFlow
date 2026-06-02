import {supabase} from '../lib/supabase'
import type {Board, createBoardInput} from '../types/boards.type'


export async function getMyBoards(id?: string ): Promise<Board[]>{

    const {data, error} = await supabase
        .from('boards')
        .select('*')
        .eq('owner_id', id);


    if(error){
        throw new Error(error.message);
    } 

    return data ?? [];

}


export async function createNewBoard({title, userId}: createBoardInput): Promise<Board> {

    console.log(title)
    
    const { data: board, error: boardError } = await supabase
        .from('boards')
            .insert({
            title,
            owner_id: userId,
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
            user_id: userId,
            role: 'owner'
        });

    if(memberError){
        throw new Error(memberError.message)
    }


    const {error: columnError} = await supabase
        .from('columns')
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