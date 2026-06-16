import {supabase} from '../lib/supabase'
import type {Board, createBoardInput} from '../types/boards.type'


export async function getMyBoards(id?: string ): Promise<Board[]>{

    const {data: members, error: membersError} = await supabase
        .from('board_members')
        .select('board_id')
        .eq('user_id', id)

    if(membersError){
        throw new Error(membersError.message)
    }

    const boardsId = members.map((member) => member.board_id)

    if(boardsId.length === 0){
        return [];
    }

    const {data: boards, error: boardsError} = await supabase
        .from('boards')
        .select('*')
        .in('id', boardsId)
        .order('created_at', {ascending: false})


    if(boardsError){
        throw new Error(boardsError.message);
    } 

    return boards ?? [];

}

export async function getBoardTitle(id: string) {
    const {data, error} = await supabase
        .from('boards')
        .select('title')
        .eq('id', id)
        .limit(1)
        .single()


    if(error){
        throw new Error(error.message)
    }

    return data.title ?? '';
}



export async function createNewBoard({title, userId}: createBoardInput): Promise<Board> {
    
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