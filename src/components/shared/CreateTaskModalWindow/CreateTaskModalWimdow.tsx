
import type { TaskPriority } from '../../../types/tasks.type';

import ModalInput from '../ModalInput/ModalInput';

import cross from '../../../assets/cross.svg'
import s from './CreateTaskModalWimdow.module.css'

interface CreateBoardModalWindowProps {
    title: string;
    setTitle: (title: string) => void;
    description: string | null;
    setDescription: (description: string | null) => void;
    priority: TaskPriority;
    setPriority: (priority: TaskPriority) => void;
    dueDate: any | null;
    setDueDate: (dueDate: any | null) => void;
    // assigneeId: string | null;
    // setAssigneeId : (assigneeId: string | null) => void;
    setIsClicked: (isClicked: boolean) => void;
    isCreating: boolean;
    heandleCreateTask: (e: React.FormEvent<HTMLFormElement>) => void;

}


function CreateTaskModalWindow(props : CreateBoardModalWindowProps) {

    const {
        title,
        description,
        setTitle,
        setDescription,
        setPriority,
        dueDate,
        setDueDate,
        // assigneeId,
        // setAssigneeId,
        setIsClicked,
        isCreating,
        heandleCreateTask
    } = props

    const heandleClose = () =>{
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate(null);
        // setAssigneeId(null);
        setIsClicked(false);
    } 

    const heandlePriority = (level: TaskPriority) => {
        setPriority(level);
    }

    return (
        <div className={s.overlay}>
            <div className={s.backdrop}>
                <div className={s.content}>

                    <div className={s.modal}>

                        <div className={s.header}>
                            <div className={s.headerText}>
                                <h1 className={s.headerTitle}>Create New Task</h1>
                            </div>
                            <div className={s.closeButton} onClick={heandleClose}>
                                <img src={cross} alt="Close" />
                            </div>
                        </div>

                        <form className={s.form} onSubmit={heandleCreateTask}>

                            <ModalInput
                                label='TASK TITLE'
                                state={title}
                                placeholderText='Enter task title'
                                setStateFunc={setTitle}/>

                            <ModalInput
                                label='DESCRIPTION (Optional)'
                                state={description}
                                placeholderText='Enter task description'
                                setStateFunc={setDescription}/>

                            <div className={s.specialInfoDiv}>

                                <div className={s.priorityInputDiv}> 
                                    <h1 className={s.modalLabel}>PRIORITY</h1>
                                    <div className={s.priorityDiv}>
                                        <div className={s.priority} onClick={() => heandlePriority('low')}>
                                            <div id={s.lowCircle}></div>
                                            <p className={s.priorityType}>Low</p>
                                        </div>
                                        <div className={s.priority} onClick={() => heandlePriority('medium')}>
                                            <div id={s.medCircle}></div>
                                            <p className={s.priorityType}>Medium</p>
                                        </div>
                                        <div className={s.priority} onClick={() => heandlePriority('high')}>
                                            <div id={s.highCircle}></div>
                                            <p className={s.priorityType}>High</p>
                                        </div>
                                    </div>
                                    
                                </div>

                                <input
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className={s.dateInput}
                                    type="date" 
                                    lang="en-US"
                                />
                            </div>

                            
                            <div className={s.buttonDiv}>
                                <button 
                                    className={s.createButton}
                                    type="submit"  
                                    disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Create Task'}
                                </button>
                                <button 
                                    className={s.cancelButton}
                                    type='submit' 
                                    disabled={isCreating}
                                    onClick={() => setIsClicked(false)}>
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