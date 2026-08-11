import s from './BoardCard.module.css';

import del from '../../../assets/delete.svg';

import { useNavigate } from 'react-router-dom';

interface BoardCardProps {
    id: string;
    title: string;
    deleteFunction: (id: string) => void;
    canDelete: boolean;
}

function BoardCard({
    id,
    title,
    deleteFunction,
    canDelete
}: BoardCardProps) {

    const navigate = useNavigate();

    return (
        <div className={s.boardCard}>
            {canDelete && <div className={s.deleteButton}>
                <img className=
                {s.deleteIcon} 
                src={del} 
                onClick={() => deleteFunction(id)}
                alt="delete" />
            </div>}
            <div onClick={() => navigate(`/board/${id}`)} className={s.boardInfo}>
                <h3 className={s.boardTitle}>{title}</h3>
            </div>
        </div>
    );
}

export default BoardCard;
