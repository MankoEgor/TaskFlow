import { useParams, useNavigate } from "react-router-dom";
import { useColumn } from "../../hooks/useColumn";

import s from './BoardPage.module.css'

function BoardPage(){
    const {id} = useParams()
    const navigate = useNavigate()

    const {columns} = useColumn(id!);

   return (
        <div className={s.columnDiv}>
            {columns.map((c: any) => (
            <div key={c.id}>
                <h1>{c.title}</h1>
            </div>
            ))}
        </div>
    );
}

export default BoardPage;