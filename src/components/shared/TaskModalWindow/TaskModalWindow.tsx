import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../../hooks/useAuth';
import { useComments } from '../../../hooks/useComments';

import type { Comment } from '../../../types/comments.type';
import type { BoardMember } from '../../../types/members.type';
import type {
    Task,
    TaskFormValues,
    UpdateTaskInput,
} from '../../../types/tasks.type';

import { formatDateTime } from '../../../utils/date';
import { toError } from '../../../utils/errors';

import ErrorModalWindow from '../ErrorModalWindow/ErrorModalWindow';
import Loader from '../Loader/Loader';
import ProfileIcon from '../ProfileIcon/ProfileIcon';
import TaskForm from '../TaskForm/TaskForm';

import cross from '../../../assets/cross.svg';
import deleteIcon from '../../../assets/delete.svg';
import editIcon from '../../../assets/edit.svg';
import sendIcon from '../../../assets/send.svg';

import s from './TaskModalWindow.module.css';

interface TaskModalWindowProps {
    task: Task;
    members: BoardMember[];
    assignee: BoardMember | undefined;
    updateTask: (input: UpdateTaskInput) => Promise<void>;
    isUpdating: boolean;
    setClose: (value: boolean) => void;
}

function getTaskFormValues(task: Task): TaskFormValues {
    return {
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        dueDate: task.due_date ?? '',
        assigneeId: task.assignee_id ?? '',
    };
}

function TaskModalWindow({
    task,
    members,
    assignee,
    updateTask,
    isUpdating,
    setClose,
}: TaskModalWindowProps) {
    const [editingMode, setEditingMode] = useState(false);
    const [comment, setComment] = useState('');
    const [localError, setLocalError] = useState<Error | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
            isDirty,
        },
    } = useForm<TaskFormValues>({
        defaultValues: getTaskFormValues(task),
    });

    const { user } = useAuth();

    const {
        data,
        isLoading,
        error,
        createComment,
        isCreating,
        deleteComment,
        isDeleting,
    } = useComments(task.id);


    const handleCreateComment = async () => {
        if (!user?.id) {
            setLocalError(new Error('You must be logged in to create a comment.'));
            return;
        }

        try {
            await createComment({
                task_id: task.id,
                user_id: user.id,
                content: comment,
            });
            setComment('');
        } catch (commentError: unknown) {
            setLocalError(toError(commentError, 'Failed to create comment'));
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);
        } catch (commentError: unknown) {
            setLocalError(toError(commentError, 'Failed to delete comment'));
        }
    };

    const handleEdit = () => {
        reset(getTaskFormValues(task));
        setEditingMode(true);
    };

    const handleCancelEdit = () => {
        reset(getTaskFormValues(task));
        setEditingMode(false);
    };

    const onSubmit = async (values: TaskFormValues) => {
        const normalizedValues = {
            ...values,
            title: values.title.trim(),
            description: values.description.trim(),
        };

        try {
            await updateTask({
                taskId: task.id,
                title: normalizedValues.title,
                description: normalizedValues.description || null,
                priority: normalizedValues.priority,
                due_date: normalizedValues.dueDate || null,
                assignee_id: normalizedValues.assigneeId || null,
            });

            reset(normalizedValues);
            setEditingMode(false);
        } catch (updateError: unknown) {
            setLocalError(toError(updateError, 'Failed to update task'));
        }
    };

    const today = new Date().toISOString().slice(0, 10);
    const submitting = isUpdating || isSubmitting;

    return (
        <div className={s.overlay}>
            <div className={s.backdrop}>
                <div className={s.content}>
                    <div className={s.modal}>
                        <div className={s.modalActions}>
                            {!editingMode && (
                                <button
                                    className={s.iconButton}
                                    type="button"
                                    title="Edit task"
                                    aria-label="Edit task"
                                    onClick={handleEdit}
                                >
                                    <img src={editIcon} alt="" />
                                </button>
                            )}
                            <button
                                className={s.iconButton}
                                type="button"
                                title="Close"
                                aria-label="Close task"
                                onClick={() => setClose(false)}
                            >
                                <img src={cross} alt="" />
                            </button>
                        </div>

                        <div className={s.taskInfo}>
                            {editingMode ? (
                                <form className={s.editForm} onSubmit={handleSubmit(onSubmit)}>
                                    <label className={s.field}>
                                        <span className={s.label}>TASK TITLE</span>
                                        <input
                                            className={s.formControl}
                                            type="text"
                                            {...register('title', {
                                                required: 'Task title is required',
                                                validate: (value) =>
                                                    value.trim().length > 0 || 'Task title is required',
                                            })}
                                        />
                                        {errors.title && (
                                            <p className={s.error}>{errors.title.message}</p>
                                        )}
                                    </label>

                                    <div className={s.editDetails}>
                                        <label className={s.field}>
                                            <span className={s.label}>ASSIGNEE</span>
                                            <select className={s.formControl} {...register('assigneeId')}>
                                                <option value="">Unassigned</option>
                                                {members.map((member) => (
                                                    <option key={member.id} value={member.id}>
                                                        {member.name ?? 'Unnamed member'}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className={s.field}>
                                            <span className={s.label}>DEADLINE</span>
                                            <input
                                                className={s.formControl}
                                                type="date"
                                                {...register('dueDate', {
                                                    validate: (value) =>
                                                        !value ||
                                                        value >= today ||
                                                        value === task.due_date ||
                                                        'Due date cannot be in the past',
                                                })}
                                            />
                                            {errors.dueDate && (
                                                <p className={s.error}>{errors.dueDate.message}</p>
                                            )}
                                        </label>

                                        <label className={s.field}>
                                            <span className={s.label}>PRIORITY</span>
                                            <select className={s.formControl} {...register('priority')}>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </label>
                                    </div>

                                    <label className={s.field}>
                                        <span className={s.label}>DESCRIPTION</span>
                                        <textarea
                                            className={s.descriptionInput}
                                            rows={4}
                                            {...register('description')}
                                        />
                                    </label>

                                    <div className={s.formActions}>
                                        <button
                                            className={s.cancelButton}
                                            type="button"
                                            disabled={submitting}
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className={s.saveButton}
                                            type="submit"
                                            disabled={submitting || !isDirty}
                                        >
                                            {submitting ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <TaskForm
                                    task={task}
                                    assignee={assignee}
                                />
                            )}

                            <div className={s.container}>
                                <h3 className={s.label}>COMMENTS</h3>

                                {error && <ErrorModalWindow error={error} />}

                                <div className={s.commentsDiv}>
                                    <div className={s.commentScroll}>
                                        {isLoading ? (
                                            <Loader />
                                        ) : data.length > 0 ? data.map((currentComment: Comment) => (
                                            <div key={currentComment.id} className={s.comment}>
                                                <div>
                                                    <ProfileIcon
                                                        name={currentComment.profile?.name ?? 'Unknown user'}
                                                        avatarUrl={currentComment.profile?.avatar_url ?? null}
                                                    />
                                                </div>
                                                <div className={s.commentTextContainer}>
                                                    <div className={s.commentText}>
                                                        <div className={s.commentInfoContainer}>
                                                            <p className={s.commentInfo}>
                                                                {currentComment.profile?.name ?? 'Unknown user'}
                                                            </p>
                                                            <p className={s.dateInfo}>
                                                                {formatDateTime(currentComment.created_at)}
                                                            </p>
                                                        </div>

                                                        <div className={s.commentContent}>
                                                            <p>{currentComment.content}</p>
                                                            {user?.id === currentComment.user_id && (
                                                                <button
                                                                    className={s.deleteButton}
                                                                    type="button"
                                                                    onClick={() => handleDeleteComment(currentComment.id)}
                                                                    disabled={isDeleting}
                                                                >
                                                                    <img src={deleteIcon} alt="Delete comment" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className={s.noComments}>No comments yet.</p>
                                        )}
                                    </div>

                                    <div className={s.commentInput}>
                                        <textarea
                                            className={s.input}
                                            value={comment}
                                            onChange={(event) => setComment(event.target.value)}
                                            rows={3}
                                            maxLength={500}
                                            placeholder="Write a comment"
                                        />

                                        <button
                                            className={s.sendButton}
                                            type="button"
                                            onClick={handleCreateComment}
                                            disabled={comment.trim() === '' || isCreating}
                                        >
                                            <img className={s.sendImage} src={sendIcon} alt="Send" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {localError && (
                            <ErrorModalWindow
                                error={localError}
                                onClose={() => setLocalError(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskModalWindow;
