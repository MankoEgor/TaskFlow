import s from './ModalInput.module.css'

interface ModalInputProps {
    label: string;
    state: string | null;
    placeholderText: string;
    setStateFunc: (state: string) => void;
}

function ModalInput({label, state, setStateFunc, placeholderText}: ModalInputProps){
    return(
        <div className={s.inputDiv}>
            <label className={s.modalLabel} htmlFor="inputName">{label}</label>
            <input
                className={s.modalInput}
                id='inputName'
                type="text"
                value={state!}
                onChange={(e) => setStateFunc(e.target.value)}
                placeholder={placeholderText}/>
    </div>
    )
}

export default ModalInput;