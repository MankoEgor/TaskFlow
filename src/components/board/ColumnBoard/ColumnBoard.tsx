import { useDroppable } from '@dnd-kit/react';
import { useTask } from '../../../hooks/useTask';
import { useAuth } from '../../../hooks/useAuth';
import { useState } from 'react';
import type { Task, TaskPriority } from '../../../types/tasks.type';

import TaskCard from '../TaskCard/TaskCard';
import CreateTaskModalWindow from '../../shared/CreateTaskModalWindow/CreateTaskModalWimdow';

import s from './ColumnBoard.module.css'
import addIcon from '../../../assets/addTask.svg'

interface ColumnBoardProps {
    id: string,
    title: string;
}


function ColumnBoard({id, title}: ColumnBoardProps){

    const {
        tasks,
        error,
        createTask,
        isCreated,
    } = useTask(id)

    const {user} = useAuth()

    const [taskTitle, setTaskTitle] = useState<string>('');
    const [taskDescription, setTaskDescription] = useState<string | null>('');
    const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
    const [dueDate, setDueDate] = useState<any | null>(null);
    // const [assigneeId, setAssigneeId] = useState<string | null>(null);
    const [isClicked, setIsClicked] = useState<boolean>(false)

    const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!id) return;
        if(!user) return;
        if(!taskTitle.trim()) return;
        if(!taskPriority) return;

        await createTask({
            column_id: id,
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

    const {isDropTarget, ref} = useDroppable({id: id})


    return(
        <div ref={ref} className={s.column}>
            <div className={s.header}>
                <h1 className={s.title}>{title}</h1>
            </div>
            {isDropTarget && <p>Drop item to me</p>}
            <div className={s.content}>
                {tasks.map((t: Task) => (
                    <TaskCard
                        id={t.id}
                        title={t.title}
                        description={t.description}
                        priority={t.priority}/>
                ))}
                    
            </div>
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