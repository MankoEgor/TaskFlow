import { useDroppable } from '@dnd-kit/react';
import { useTask } from '../../../hooks/useTask';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskPriority } from '../../../types/tasks.type';
import type { Column } from '../../../types/column.type';

import TaskCard from '../TaskCard/TaskCard';
import CreateTaskModalWindow from '../../shared/CreateTaskModalWindow/CreateTaskModalWimdow';
import ErrorModalWindow from '../../shared/ErrorModalWindow/ErrorModalWindow';

import s from './ColumnBoard.module.css'
import addIcon from '../../../assets/addTask.svg'
import deleteIcon from '../../../assets/delete.svg'
import editIcon from '../../../assets/edit.svg'
import CreateModalWindow from '../../shared/CreateModalWindow/CreateModalWindow';

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
        } catch (err: any) {
            setLocalError(err instanceof Error ? err : new Error(String(err)));
        }
    }


    // states fot creating new task in this column
    const [taskTitle, setTaskTitle] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string | null>('');
    const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
    const [dueDate, setDueDate] = useState<any | null>(null);
    // const [assigneeId, setAssigneeId] = useState<string | null>(null);
    const [isClicked, setIsClicked] = useState<boolean>(false)


    const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!column.id) return;
        if(!user) return;
        if(!taskTitle.trim()) return;
        if(!taskPriority) return;

        try {
            await createTask({
                column_id: column.id,
                title: taskTitle.trim(),
                description: taskDescription?.trim() || null,
                priority: taskPriority,
                due_date: dueDate || null,
                assignee_id: user.id,
                created_by: user.id,
            });

            setTaskTitle('');
            setTaskDescription('');
            setTaskPriority('medium');
            setDueDate(null);
            // setAssigneeId(null);
            setIsClicked(false);
        } catch (err: any) {
            setLocalError(err instanceof Error ? err : new Error(String(err)));
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId);
        } catch (err: any) {
            setLocalError(err instanceof Error ? err : new Error(String(err)));
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

            {isClicked && <CreateTaskModalWindow
                                title={taskTitle}
                                setTitle={setTaskTitle}
                                description={taskDescription}
                                setDescription={setTaskDescription}
                                priority={taskPriority}
                                setPriority={setTaskPriority}
                                dueDate={dueDate}
                                setDueDate={setDueDate}
                                // assigneeId={assigneeId}
                                // setAssigneeId={setAssigneeId}
                                setIsClicked={setIsClicked}
                                isCreating={isCreated}
                                heandleCreateTask={handleCreateTask}
                                />}
        </div>
    )
}

export default ColumnBoard;