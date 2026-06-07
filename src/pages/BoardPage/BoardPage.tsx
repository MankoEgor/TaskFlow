import { useParams } from "react-router-dom";
import { useColumn } from "../../hooks/useColumn";
import { useBoardTask } from "../../hooks/useColumnTask";
import { useTask } from "../../hooks/useTask";
import { DragDropProvider } from "@dnd-kit/react";

import type { Task } from "../../types/tasks.type";

import ColumnBoard from "../../components/board/ColumnBoard/ColumnBoard";

import s from './BoardPage.module.css'

function BoardPage(){

    const {id} = useParams()

    const {tasks, error, isLoading} = useBoardTask(id);
    const {columns} = useColumn(id);
    const {moveTask} = useTask(id)

    const tasksByColumn = tasks.reduce<Record<string, Task[]>>((acc, task) => {
        if(!acc[task.column_id]){
            acc[task.column_id] = [];
        }

        acc[task.column_id].push(task)

        return acc;
    }, {})


    const handleDragEnd = async (event: any) => {
        const source = event.operation.source;
        const target = event.operation.target;

        if(!target) return;

        const sourceData = source.data;
        const targetData = target.data;

        if (sourceData?.type !== 'task') return;

        const taskId = sourceData.taskId;
        const sourceColumnId = sourceData.columnId;

        let targetColumnId: string | undefined;

        if (targetData?.type === 'column') {
            targetColumnId = targetData.columnId;
        }

        if (targetData?.type === 'task') {
            targetColumnId = targetData.columnId;
        }

        if (!taskId) return;
        if (!sourceColumnId) return;
        if (!targetColumnId) return;

        if (sourceColumnId === targetColumnId) {
            return;
        }
        
        await moveTask({
            taskId,
            targetColumnId,
        });


    }

    if(isLoading)
        return <p>Loading...</p>

    if(error)
        return <p>Fail to load board, {error.message}</p>

   return (
        <DragDropProvider
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
        </DragDropProvider>
    );
}

export default BoardPage;