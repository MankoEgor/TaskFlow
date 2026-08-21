import { useId } from 'react';
import {useForm, useWatch} from 'react-hook-form';

import cross from '../../../assets/cross.svg'
import s from './CreateTaskModalWimdow.module.css'

import type { Profile } from '../../../types/members.type';
import type { TaskFormValues } from '../../../types/tasks.type';
import { useDialogAccessibility } from '../../../hooks/useDialogAccessibility';



interface CreateBoardModalWindowProps {
    members: Profile[];
    onClose: () => void;
    isCreating: boolean;
    onCreateTask: (values: TaskFormValues) => Promise<void>;

}

function CreateTaskModalWindow({
    members,
    onClose,
    isCreating,
    onCreateTask,
} : CreateBoardModalWindowProps) {

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<TaskFormValues>({
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
            assigneeId: ''
        }
    })

    const handleClose = () =>{
        reset();
        onClose();
    }

    const titleId = useId();
    const dialogRef = useDialogAccessibility<HTMLDivElement>(handleClose);

    const onSubmit = async (value: TaskFormValues) => {
        await onCreateTask(value);

        reset();
        onClose();
    }

    const today = new Date().toISOString().slice(0, 10);

    const selectedPriority = useWatch({
        control,
        name: 'priority'
    })

    const submitting = isCreating || isSubmitting;

    return (
        <div className={s.overlay}>
            <div className={s.backdrop}>
                <div className={s.content}>

                    <div
                        ref={dialogRef}
                        className={s.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        tabIndex={-1}>

                        <div className={s.header}>
                            <div className={s.headerText}>
                                <h1 id={titleId} className={s.headerTitle}>Create New Task</h1>
                            </div>
                            <button
                                className={s.closeButton}
                                type="button"
                                title="Close"
                                aria-label="Close create task dialog"
                                onClick={handleClose}>
                                <img src={cross} alt="" />
                            </button>
                        </div>

                        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>

                            <label className={s.field}>
                                <h1 className={s.modalLabel}>TASK TITLE</h1>

                                <input
                                    className={s.modalInput}
                                    type="text" 
                                    placeholder='Enter task title'
                                    {...register('title', {
                                        required: 'Task title is required',
                                        validate: (value) => {
                                            return (value.trim().length > 0 || 'Task title is required')
                                        }
                                    })}/>

                                    {errors.title && (
                                        <p className={s.error}>
                                            {errors.title.message}
                                        </p>
                                    )}
                            </label>


                            <label className={s.field}>
                                <h1 className={s.modalLabel}>DESCRIPTION (Optional)</h1>

                                <textarea
                                    className={s.modalTextarea}
                                    placeholder='Enter task description'
                                    {...register('description')}/>

                            </label>

                            <div className={s.specialInfoDiv}>

                                <div className={s.priorityInputDiv}> 
                                    <h1 className={s.modalLabel}>PRIORITY</h1>
                                    <div className={s.priorityDiv}>

                                        <button
                                            type='button'
                                            className={`${s.priority} ${
                                                selectedPriority === 'low'
                                                ? s.selectedPriority 
                                                : ''
                                            }`}
                                            
                                            onClick={() => 
                                                setValue('priority', 'low', {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                })
                                            }
                                            >
                                            <div id={s.lowCircle}></div>
                                            <p className={s.priorityType}>Low</p>
                                        </button>

                                        <button
                                            type='button'
                                            className={`${s.priority} ${
                                                selectedPriority === 'medium'
                                                ? s.selectedPriority 
                                                : ''
                                            }`}
                                            
                                            onClick={() => 
                                                setValue('priority', 'medium', {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                })
                                            }>
                                            <div id={s.medCircle}></div>
                                            <p className={s.priorityType}>Medium</p>
                                        </button>

                                        <button
                                            type='button'
                                            className={`${s.priority} ${
                                                selectedPriority === 'high'
                                                ? s.selectedPriority 
                                                : ''
                                            }`}
                                            
                                            onClick={() => 
                                                setValue('priority', 'high', {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                })
                                            }>
                                            <div id={s.highCircle}></div>
                                            <p className={s.priorityType}>High</p>
                                        </button>
                                    </div>
                                    
                                </div>

                                <label className={s.field}>
                                    <h1 className={s.modalLabel}>ASSIGNEE</h1>

                                    <select
                                        className={s.assigneeSelect}
                                        {...register('assigneeId')}
                                    >
                                        <option value="">Unassigned</option>
                                        {members.map((member) => (

                                        <option key={member.id} value={member.id}>
                                            {member.name ?? 'Unnamed member'}
                                        </option>

                                        ))}
                                    </select>
                                </label>
                                
                                <label className={s.field}>
                                    <h1 className={s.modalLabel}>DUE DATE</h1>
                                    <input
                                        className={s.dateInput}
                                        type='date'
                                        lang='en-US'
                                        min={today}
                                        {...register('dueDate', {
                                            validate: (values) => !values || values >= today || 'Due date cannot be in the past'
                                            
                                        })}
                                    />
                                    {errors.dueDate && (
                                        <p className={s.error}>
                                            {errors.dueDate.message?.toString()}
                                        </p>
                                    )}
                                </label>
                            </div>

                            
                            <div className={s.buttonDiv}>
                                <button 
                                    className={s.createButton}
                                    type="submit"  
                                    disabled={submitting}>
                                    {submitting ? 'Creating...' : 'Create Task'}
                                </button>
                                <button 
                                    className={s.cancelButton}
                                    type="button"
                                    disabled={submitting}
                                    onClick={handleClose}>
                                    <p>Cancel</p>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>  

        </div>
        
    )
}

export default CreateTaskModalWindow;
