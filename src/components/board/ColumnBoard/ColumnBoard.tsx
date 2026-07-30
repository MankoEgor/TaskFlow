import { useDroppable } from '@dnd-kit/react';
import { useTask } from '../../../hooks/useTask';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../../../types/tasks.type';
import type { Column } from '../../../types/column.type';

import TaskCard from '../TaskCard/TaskCard';
import CreateTaskModalWindow from '../../shared/CreateTaskModalWindow/CreateTaskModalWimdow';
import ErrorModalWindow from '../../shared/ErrorModalWindow/ErrorModalWindow';

import s from './ColumnBoard.module.css'
import addIcon from '../../../assets/addTask.svg'
import deleteIcon from '../../../assets/delete.svg'
import editIcon from '../../../assets/edit.svg'
import CreateModalWindow from '../../shared/CreateModalWindow/CreateModalWindow';
import { useBoardMembers } from '../../../hooks/useBoardMembers';
import { toError } from '../../../utils/errors';

import type { CreateTaskFormValue } from '../../shared/CreateTaskModalWindow/CreateTaskModalWimdow';

interface ColumnBoardProps {
    column: Column;
    tasks: Task[];
    isUpdated: boolean;
    deleteColumn: (columnId: string) => void;
    updateColumn: (input: {columnId: string, title: string}) => Promise<void>;
}


function ColumnBoard({column, tasks, deleteColumn, updateColumn, isUpdated}: ColumnBoardProps){

    const {user} = useAuth();
    const {createTask, isCreated, deleteTask, isDeleted} = useTask(column.board_id);

    const { members } =  useBoardMembers(column.board_id)

    const [localError, setLocalError] = useState<Error | null>(null);

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
            setLocalError(toError(err, 'Failed to update column'));
        }
    }

    const [isClicked, setIsClicked] = useState<boolean>(false)


    const handleCreateTask = async (values: CreateTaskFormValue) => {

        if(!column.id) return;
        if(!user) return;
        if(!values.title) return;
        if(!values.priority) return;

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

            setIsClicked(false);
        } catch (err: unknown) {
            setLocalError(toError(err, 'Failed to create task'));
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
                <div className={s.menuActionDiv}>
                    <button className={s.actionButton} onClick={() => deleteColumn(column.id)}>
                        <img className={s.btnIcon} src={deleteIcon} alt="Delete" />
                    </button>
                    <button className={s.actionButton} onClick={() => setColumnIsUpdateClicked(true)}>
                        <img className={s.btnIcon} src={editIcon} alt="Rename" />
                    </button>
                </div>
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
                        />
                ))}

                {isDropTarget && tasks.length === 0 && <div className={s.dropDiv}>DROP IT HERE</div>}
            </div>
            </SortableContext>


            <button className={s.addButton} onClick={() => setIsClicked(true)}>
                <img className={s.buttonIcon} src={addIcon} alt="" />
                <p className={s.buttonText}>Add Task</p>
            </button>

            {localError && <ErrorModalWindow error={localError} onClose={() => setLocalError(null)}/>}

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
