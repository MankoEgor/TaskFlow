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



export async function createNewBoard({
    title
}: createBoardInput): Promise<Board> {
    const { data: board, error } = await supabase.rpc(
        'create_board_with_defaults',
        {
            p_title: title
        }
    );

    if (error) {
        throw new Error(error.message);
    }

    if (!board) {
        throw new Error('Failed to create board');
    }

    return board as Board;
} 


export async function deleteBoard(boardId: string): Promise<void> {
    const {error} = await supabase.from('boards').delete().eq('id', boardId)

    if(error){
        throw new Error(error.message)
    }
}