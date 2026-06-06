import { useParams } from "react-router-dom";
import { useColumn } from "../../hooks/useColumn";
import { useBoardTask } from "../../hooks/useColumnTask";
import { useTask } from "../../hooks/useTask";
import { DndContext, pointerWithin } from "@dnd-kit/core";

import ColumnBoard from "../../components/board/ColumnBoard/ColumnBoard";

import s from './BoardPage.module.css'
import type { DragEndEvent } from "@dnd-kit/core";
import type { Task } from "../../types/tasks.type";

function BoardPage(){
    const {id} = useParams()

    const {tasks, error, isLoading, isError} = useBoardTask(id);
    const {columns} = useColumn(id);
    const {moveTask} = useTask(id)

    const tasksByColumn = tasks.reduce<Record<string, Task[]>>((acc, task) => {
        if(!acc[task.column_id]){
            acc[task.column_id] = [];
        }

        acc[task.column_id].push(task)

        return acc;
    }, {})
 

    // const navigate = useNavigate()

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        console.log('active data:', active.data.current);
        console.log('over data:', over?.data.current);

        if (!over) return;
        if (active.id === over.id) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType !== 'task') return;

        const taskId = active.data.current?.taskId as string | undefined;
        const sourceColumnId = active.data.current?.columnId as string | undefined;

        let targetColumnId: string | undefined;

        if (overType === 'column') {
            targetColumnId = over.data.current?.columnId as string | undefined;
        }

        if (overType === 'task') {
            targetColumnId = over.data.current?.columnId as string | undefined;
        }

        console.log({
            taskId,
            sourceColumnId,
            targetColumnId,
            overType,
        });

        if (!taskId) return;
        if (!sourceColumnId) return;
        if (!targetColumnId) return;

        if (sourceColumnId === targetColumnId) {
            console.log('Same column');
            return;
        }

        console.log('Move task to another column:', {
            taskId,
            from: sourceColumnId,
            to: targetColumnId,
        });

        await moveTask({
            taskId, 
            targetColumnId
        })
    // здесь позже будет updateTaskColumn(taskId, targetColumnId)
    };

    if(isLoading)
        return <p>Loading...</p>

    if(error)
        return <p>Fail to load board, {error.message}</p>

   return (
        <DndContext 
            collisionDetection={pointerWithin}
            onDragEnd={handleDragEnd}>

            <div className={s.columnDiv}>
                {columns.map((column) => (
                <ColumnBoard 
                    key={column.id}
                    column={column}
                    tasks={tasksByColumn[column.id] ?? []}
                    />
                ))}
            </div>
        </DndContext>
    );
}

export default BoardPage;