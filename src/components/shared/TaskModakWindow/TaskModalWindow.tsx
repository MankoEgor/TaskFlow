import type { Task } from "../../../types/tasks.type"
import s from './TaskModalWindow.module.css'
import cross from '../../../assets/cross.svg'
import { useProfile } from "../../../hooks/useProfile";
import ProfileIcon from "../ProfileIcon/ProfileIcon";
import { useComments } from "../../../hooks/useComments";
import { formatDateTime } from '../../../utils/date'

import type { Comment } from "../../../types/comments.type";
import ErrorModalWindow from "../ErrorModalWindow/ErrorModalWindow";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import sendIcon from '../../../assets/send.svg'
import deleteIcon from '../../../assets/delete.svg'
import Loader from "../Loader/Loader";
import { toError } from "../../../utils/errors";

interface TaskModalWindowProps {
    task: Task;
    setClose: (value: boolean) => void;
}

function TaskModalWindow({task, setClose} : TaskModalWindowProps){

    const {user} = useAuth()

    const {
        data,
        isLoading,
        error,
        createComment,
        isCreating,
        deleteComment,
        isDeleting,
    } = useComments(task.id)

    const {profileInfo} = useProfile(task.assignee_id ?? undefined)

    const [comment, setComment] = useState<string>('');
    const [localError, setLocalError] = useState<Error | null>(null);


    const priorityClass = {
        low: s.low,
        medium: s.medium,
        high: s.high,
    } as const;

    const handleCreateComment = async() => {
        if(!user?.id){
            setLocalError(new Error('You must be logged in to create a comment.'));
            return;
        }

        try {
            await createComment({
                task_id: task.id,
                user_id: user.id,
                content: comment
            });
            setComment(''); 
        } catch (error) {
            setLocalError(toError(error, 'Failed to create comment'));
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);
        } catch (error) {
            setLocalError(toError(error, 'Failed to delete comment'));
        }
    }

    return(
        <div className={s.overlay}>
            <div className={s.backdrop}>
                <div className={s.content}>
                    <div className={s.modal}>
                        <div className={s.closeButton} onClick={() => setClose(false)}>
                            <img src={cross} alt="Close" />
                        </div>

                        <div className={s.taskInfo}>
                            <div className={s.container}>
                                <h3 className={s.label}>TASK TITLE</h3>
                                <h1 className={s.title}>{task.title}</h1>
                            </div>

                            
                            <div className={s.taskDetailse}>

                                <div className={s.container}>
                                    <h3 className={s.label}>ASSIGNEE</h3>
                                    <div className={s.assignee}>
                                        {profileInfo?.avatar_url && profileInfo.name
                                            && <ProfileIcon 
                                                    name={profileInfo.name}
                                                    avatarUrl={profileInfo.avatar_url}/>}
                                        <p className={s.assigneeText}>{profileInfo?.name ?? 'Unassigned'}</p>
                                    </div>
                                </div>

                                <div className={s.container}>
                                    <h3 className={s.label}>DEADLINE</h3>
                                    <p className={s.deadlineText}>{task.due_date ?? 'No deadline'}</p>
                                </div>

                                <div className={s.container}>
                                    <h3 className={s.label}>PRIORITY</h3>
                                    <div className={priorityClass[task.priority]}>
                                        <p className={s.priorityText}>
                                            {task.priority.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={s.container}>
                                <h3 className={s.label}>DESCRIPTION</h3>
                                <div className={s.descriptionDiv}>
                                    <p className={s.descriptionText}>{task.description ?? 'No description'}</p>
                                </div>
                            </div>

                            <div className={s.container}>
                                <h3 className={s.label}>COMMENTS</h3>

                                {error && <ErrorModalWindow error={error}/>}

                                <div className={s.commentsDiv}>
                                    <div className={s.commentScroll}>
                                        {isLoading ? (
                                            <Loader/>
                                        ) : data.length > 0 ? data.map((comment: Comment) => (
                                            <div key={comment.id} className={s.comment}>
                                                <div>
                                                    <ProfileIcon
                                                        name={comment.profile?.name ?? 'Unknown user'}
                                                        avatarUrl={comment.profile?.avatar_url ?? null}/>
                                                </div>
                                                <div className={s.commentTextContainer}>
                                                    <div className={s.commentText}>
                                                        <div className={s.commentInfoContainer}>
                                                            <p className={s.commentInfo}>
                                                                {comment.profile?.name ?? 'Unknown user'}
                                                            </p>
                                                            <p className={s.dateInfo}>{formatDateTime(comment.created_at)}</p>
                                                        </div>
                                                        
                                                        <div className={s.commentContent}>
                                                            <p>{comment.content}</p>
                                                            {user?.id === comment.user_id && <button 
                                                                                                className={s.deleteButton}
                                                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                                                disabled={isDeleting}>
                                                                                                <img src={deleteIcon} alt="delete" />
                                                                                            </button>}
                                                        </div>
                                                    </div>
                                                </div> 
                                            </div>
                                        )) : (
                                            <p className={s.noComments}>No comments yet.</p>
                                        )}
                                    </div>
                                    

                                    <div className={s.commentInput}>
                                        {localError && <ErrorModalWindow 
                                                            error={localError} 
                                                            onClose={() => setLocalError(null)}/>}
                                        <textarea
                                            className={s.input}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={3}
                                            maxLength={500}
                                            placeholder="Write a comment"
                                        />

                                        <button 
                                            className={s.sendButton} 
                                            onClick={handleCreateComment}
                                            disabled={comment.trim() === '' || isCreating}>

                                            <img className={s.sendImage} src={sendIcon} alt="send" />

                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModalWindow;
