import { useParams } from "react-router-dom";
import { useColumn } from "../../hooks/useColumn";
import { useColumnTask } from "../../hooks/useColumnTask";
import { DndContext } from "@dnd-kit/core";

import ColumnBoard from "../../components/board/ColumnBoard/ColumnBoard";

import s from './BoardPage.module.css'
import type { DragEndEvent } from "@dnd-kit/core";
import type { Task } from "../../types/tasks.type";

function BoardPage(){
    const {id} = useParams()

    const {tasks, error, isLoading} = useColumnTask(id);
    const {columns} = useColumn(id);

    const tasksByColumn = tasks.reduce<Record<string, Task[]>>((acc, task) => {
        if(!acc[task.column_id]){
            acc[task.column_id] = [];
        }

        acc[task.column_id].push(task)

        return acc;
    }, {})
 

    // const navigate = useNavigate()

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        console.log(`active ${active.id}`)
        console.log(`over ${over?.id}`)

        if(!over) return;
        if(active.id === over.id) return 

    }

   return (

        
        <DndContext onDragEnd={handleDragEnd}>

            {error && <p>Fail to load board</p>}

            {isLoading && <p>Loading...</p>}

            <div className={s.columnDiv}>
                {columns.map((column) => (
                <ColumnBoard 
                    key={column.id}
                    id={column.id}
                    column={column}
                    tasks={tasksByColumn[column.id] ?? []}
                    />
                ))}
            </div>
        </DndContext>
    );
}

export default BoardPage;