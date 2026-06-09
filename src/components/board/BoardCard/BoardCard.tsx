import s from './BoardCard.module.css';

import del from '../../../assets/delete.svg';

import { useNavigate } from 'react-router-dom';

interface BoardCardProps {
    id: string;
    title: string;
    createAt: string;
    createAtFunction: (id: string) => string;
    deleteFunction: (id: string) => void;
}

function BoardCard({ id, title, createAt, createAtFunction, deleteFunction }: BoardCardProps) {

    const navigate = useNavigate();

    const time = createAtFunction(createAt);
    return (
        <div className={s.boardCard}>
            <div className={s.deleteButton}>
                <img className=
                {s.deleteIcon} 
                src={del} 
                onClick={() => deleteFunction(id)}
                alt="delete" />
            </div>
            <div onClick={() => navigate(`/board/${id}`)} className={s.boardInfo}>
                <h3 className={s.boardTitle}>{title}</h3>
                <p className={s.time}>Created: {time}</p>
            </div>
        </div>
    );
}

export default BoardCard;