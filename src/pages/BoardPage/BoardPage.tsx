import { useParams, useNavigate } from "react-router-dom";
import { useColumn } from "../../hooks/useColumn";

import ColumnBoard from "../../components/ColumnBoard/ColumnBoard";

import s from './BoardPage.module.css'

function BoardPage(){
    const {id} = useParams()
    const navigate = useNavigate()

    const {columns} = useColumn(id!);

   return (
        <div className={s.columnDiv}>
            {columns.map((c: any) => (
            <ColumnBoard 
                key={c.id}
                id={c.id}
                board_id={c.board_id}
                title={c.title}/>
            ))}
        </div>
    );
}

export default BoardPage;