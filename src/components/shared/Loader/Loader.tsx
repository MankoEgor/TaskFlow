import s from './Loader.module.css';

function Loader() {
  return (
    <div className={s.wrapper}>
      <div className={s.blocks}>
        <span className={s.block}></span>
        <span className={s.block}></span>
        <span className={s.block}></span>
      </div>

      <p className={s.text}>Loading...</p>
    </div>
  );
}

export default Loader;