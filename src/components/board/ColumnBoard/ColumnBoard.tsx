import { useDroppable } from '@dnd-kit/react';
import { useTask } from '../../../hooks/useTask';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskPriority } from '../../../types/tasks.type';
import type { Column } from '../../../types/column.type';

import TaskCard from '../TaskCard/TaskCard';
import CreateTaskModalWindow from '../../shared/CreateTaskModalWindow/CreateTaskModalWimdow';

import s from './ColumnBoard.module.css'
import addIcon from '../../../assets/addTask.svg'

interface ColumnBoardProps {
    column: Column;
    tasks: Task[];
}


function ColumnBoard({column, tasks}: ColumnBoardProps){

    const {user} = useAuth()
    const {createTask, isCreated,} = useTask(column.board_id)

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

        console.log('CREATE TASK PAYLOAD:', {
            column_id: column.id,
            boardId: column.board_id,
            title: taskTitle.trim(),
            description: taskDescription?.trim() || null,
            priority: taskPriority,
            due_date: dueDate || null,
            assignee_id: user.id,
            created_by: user.id,
        });

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
    }

    const {ref, isDropTarget} = useDroppable({
        id: column.id,
        data:{
            type: 'column',
            columnId: column.id
        },
    })


    return(
        <div className={s.column}>
            <div className={s.header}>
                <h1 className={s.title}>{column.title}</h1>
            </div>


            <SortableContext 
                items={tasks.map(task => task.id)} 
                strategy={verticalListSortingStrategy}>
                <div ref={ref} className={s.content}>
                {tasks.map((t: Task, index: number) => (
                    <TaskCard
                        key={t.id}
                        id={t.id}
                        title={t.title}
                        description={t.description}
                        priority={t.priority}
                        index={index}
                        columnId={t.column_id}/>
                ))}

                {isDropTarget && <div className={s.dropDiv}>DROP IT HERE</div>}
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