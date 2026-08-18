import type {BoardMember} from '../../../types/members.type';
import type {Column} from '../../../types/column.type'
import type { KanbanItems } from '../../../types/kanban.type'
import type { 
    DragEndEvent,
    DragOverEvent,
} from '@dnd-kit/dom';
import { DragDropProvider } from "@dnd-kit/react";



import ColumnBoard from '../ColumnBoard/ColumnBoard'

import addColumnIcon from '../../../assets/addColumn.svg'

import s from '../KanbanBoard/KanbanBoard.module.css'

interface KanbanBoardProps {
    members: BoardMember[];
    membersById: ReadonlyMap<string, BoardMember>;
    items: KanbanItems,
    columns: Column[];
    isOwner: boolean;
    isUpdated: boolean;
    handleDeleteColumn: (columnId: string) => void;
    handleUpdateColumnTitle: (input: {columnId: string, title: string}) => Promise<void>;
    onColumnAdd: () => void;
    handleDragOver: (event: DragOverEvent) => void;
    handleDragEnd: (event: DragEndEvent) => Promise<void>;
}

function KanbanBoard(
    {
        members,
        membersById,
        items,
        columns,
        isOwner,
        isUpdated,
        handleDeleteColumn,
        handleUpdateColumnTitle,
        onColumnAdd,
        handleDragOver,
        handleDragEnd
    } : KanbanBoardProps
) {

    return (
        <DragDropProvider
        
            onDragOver={handleDragOver}
        
            onDragEnd={handleDragEnd}>

            <div className={s.boardScroll}>
                <div className={s.columnDiv}>
                    {columns.map((column) => (
                        <ColumnBoard 
                            key={column.id}
                            members={members}
                            membersById={membersById}
                            column={column}
                            tasks={items[column.id] ?? []}
                            canManageBoard={isOwner}
                            isUpdated={isUpdated}
                            deleteColumn={handleDeleteColumn}
                            updateColumn={handleUpdateColumnTitle}
                        />
                    ))}

                    {isOwner && <button 
                                    type='button' 
                                    onClick={onColumnAdd} 
                                    className={s.addButton}>
                                        <img className={s.addButtonIcon} src={addColumnIcon} alt="" />
                                        <p className={s.addButtonText}>Add Column</p>
                                </button>}
                </div>
            </div>
        </DragDropProvider>
    )
}

export default KanbanBoard;