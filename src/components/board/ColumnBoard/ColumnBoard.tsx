import { useDroppable } from '@dnd-kit/react';
import { useTask } from '../../../hooks/useTask';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import { toast } from 'sonner';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskFormValues } from '../../../types/tasks.type';
import type { BoardMember } from '../../../types/members.type';
import type { Column } from '../../../types/column.type';

import TaskCard from '../TaskCard/TaskCard';
import CreateTaskModalWindow from '../../shared/CreateTaskModalWindow/CreateTaskModalWimdow';

import s from './ColumnBoard.module.css'
import addIcon from '../../../assets/addTask.svg'
import deleteIcon from '../../../assets/delete.svg'
import editIcon from '../../../assets/edit.svg'
import CreateModalWindow from '../../shared/CreateModalWindow/CreateModalWindow';
import { toError } from '../../../utils/errors';

interface ColumnBoardProps {
    members: BoardMember[];
    membersById: ReadonlyMap<string, BoardMember>;
    column: Column;
    tasks: Task[];
    canManageBoard: boolean;
    isUpdated: boolean;
    deleteColumn: (columnId: string) => void;
    updateColumn: (input: {columnId: string, title: string}) => Promise<void>;
}


function ColumnBoard({
    column,
    tasks,
    canManageBoard,
    deleteColumn,
    updateColumn,
    isUpdated,
    members,
    membersById
}: ColumnBoardProps){

    const {user} = useAuth();
    const {
        createTask,
        isCreated,
        deleteTask,
        isDeleted,
        updateTask,
        isUpdating,
    } = useTask(column.board_id);

    // states for updating column title
    const [updateColumnTitle, setUpdateColumnTitle] = useState<string>('');
    const [isColumnUpdateClicked, setColumnIsUpdateClicked] = useState<boolean>(false);

    const handleUpdateColumnTitle = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!updateColumnTitle.trim()) return;
        if(!column.id) return;

        try {
            await updateColumn({
                columnId: column.id,
                title: updateColumnTitle
            })

            setUpdateColumnTitle('');
            setColumnIsUpdateClicked(false);
        } catch (err: unknown) {
            toast.error(toError(err, 'Failed to update column').message);
        }
    }

    const [isClicked, setIsClicked] = useState<boolean>(false)


    const handleCreateTask = async (values: TaskFormValues) => {

        if(!column.id) return false;
        if(!user) return false;
        if(!values.title) return false;
        if(!values.priority) return false;

        try {
            await createTask({
                column_id: column.id,
                title: values.title.trim(),
                description: values.description.trim() || null,
                priority: values.priority,
                due_date: values.dueDate || null,
                assignee_id: values.assigneeId || null,
                created_by: user.id,
            });

            return true;
        } catch (err: unknown) {
            toast.error(toError(err, 'Failed to create task').message);
            return false;
        }

        
    }


    const {ref, isDropTarget} = useDroppable({
        id: column.id,
        type: 'column',
        accept: 'task',
        data:{
            type: 'column',
            columnId: column.id
        },
    })


    return(
        <>
        
        <div className={s.column}>
            <div className={s.header}> 
                <h1 className={s.title}>{column.title}</h1>
                {canManageBoard && <div className={s.menuActionDiv}>
                    <button className={s.actionButton} onClick={() => deleteColumn(column.id)}>
                        <img className={s.btnIcon} src={deleteIcon} alt="Delete" />
                    </button>
                    <button className={s.actionButton} onClick={() => setColumnIsUpdateClicked(true)}>
                        <img className={s.btnIcon} src={editIcon} alt="Rename" />
                    </button>
                </div>}
            </div>

            {isColumnUpdateClicked && <CreateModalWindow    
                                            headerTitle="Update Column Title"
                                            labelText="COLUMN TITLE"
                                            setIsClicked={setColumnIsUpdateClicked}
                                            setTitle={setUpdateColumnTitle}
                                            title={updateColumnTitle}
                                            isDoneState={isUpdated}
                                            heandleCreate={handleUpdateColumnTitle}
                                            prevTitle={column.title}/>}


            <SortableContext 
                items={tasks.map(task => task.id)} 
                strategy={verticalListSortingStrategy}>
                <div ref={ref} className={s.content}>
                {tasks.map((task: Task, index: number) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        deleteTask={deleteTask}
                        isDeleted={isDeleted}
                        members={members}
                        updateTask={updateTask}
                        isUpdating={isUpdating}
                        assignee={
                            task.assignee_id 
                                ? membersById.get(task.assignee_id) 
                                : undefined
                        }
                        currentColumnId={column.id}
                    />
                ))}

                {isDropTarget && tasks.length === 0 && <div className={s.dropDiv}>DROP IT HERE</div>}
            </div>
            </SortableContext>


            <button className={s.addButton} onClick={() => setIsClicked(true)}>
                <img className={s.buttonIcon} src={addIcon} alt="" />
                <p className={s.buttonText}>Add Task</p>
            </button>

            {isClicked && <CreateTaskModalWindow
                                members={members}
                                isCreating={isCreated}
                                onClose={() => setIsClicked(false)}
                                onCreateTask={handleCreateTask}
                                />}
        </div>
    </>
    )
}

export default ColumnBoard;
