import s from './BoardCard.module.css';

interface BoardCardProps {
    title: string;
    createAt: string;
    createAtFunction: (id: string) => string;
}

function BoardCard({ title, createAt, createAtFunction }: BoardCardProps) {

    const time = createAtFunction(createAt);
    return (
        <div className={s.boardCard}>
            <h3 className={s.boardTitle}>{title}</h3>
            <p className={s.time}>Created: {time}</p>
        </div>
    );
}

export default BoardCard;