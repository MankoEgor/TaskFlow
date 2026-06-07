import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useColumn } from "../../hooks/useColumn";
import { useBoardTask } from "../../hooks/useColumnTask";
import { useTask } from "../../hooks/useTask";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

import type { Task } from "../../types/tasks.type";

import ColumnBoard from "../../components/board/ColumnBoard/ColumnBoard";

import s from './BoardPage.module.css'

function BoardPage(){

    const {id} = useParams()

    const [items, setItems] = useState<Record<string, Task[]>>({})
    const prevItems = useRef<Record<string, Task[]>>({})

    const {tasks, error, isLoading} = useBoardTask(id);
    const {columns} = useColumn(id);
    const {moveTask, reorderTasks} = useTask(id)

    useEffect(() => {

        const groupdeTasks = tasks.reduce<Record<string, Task[]>>((acc, task) => {
            if(!acc[task.column_id]){
                acc[task.column_id] = []
            }

            acc[task.column_id].push(task);

            return acc;
        }, {});

        for(const columnId in groupdeTasks){
            groupdeTasks[columnId].sort((a, b) => a.position - b.position);
        }

        setItems(groupdeTasks);
    }, [tasks])


    const handleDragEnd = async (event: any) => {
        const {source, target} = event.operation

        if(!source || !target) return;

        if (source.type !== 'task') return;

        const taskId = source.data?.taskId as string | undefined;
        const sourceColumnId = source.data?.columnId as string | undefined;

        const targetColumnId = target.data?.column_id as string | undefined;
    

        if (!taskId || !sourceColumnId || !targetColumnId) return;

        const finalColumnTasks = items[targetColumnId] ?? [];

        const targetPosition = finalColumnTasks.findIndex((task) => task.id === taskId)

        if(targetPosition === -1) return;


        if(sourceColumnId !== targetColumnId){

            await moveTask({
                taskId,
                targetColumnId,
                targetPosition
            });

            return;
        }


        await reorderTasks(
            finalColumnTasks.map((task, index) => ({
                id: task.id,
                position: index
            }))
        )

    }

    if(isLoading)
        return <p>Loading...</p>

    if(error)
        return <p>Fail to load board, {error.message}</p>

   return (
        <DragDropProvider
            onDragStart={() => {
                prevItems.current = items;
            }}

            onDragOver={(event) => {
                const {source} = event.operation;

                if(source?.type !== 'task') return;

                setItems((currentItems) => move(currentItems, event))
            }}

            onDragEnd={async (event) => {
                if(event.canceled){
                    setItems(prevItems.current);
                    return;
                }

                await handleDragEnd(event)
            }}>

            <div className={s.columnDiv}>
                {columns.map((column) => (
                <ColumnBoard 
                    key={column.id}
                    column={column}
                    tasks={items[column.id] ?? []}
                    />
                ))}
            </div>
        </DragDropProvider>
    );
}

export default BoardPage;