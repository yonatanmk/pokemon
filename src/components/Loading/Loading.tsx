import style from './Loading.module.scss';

function Loading( {display }:{ display: boolean } ) {
  if (!display) return null;
  return (
    <div className={style.Loading}>
      <div className={style['lds-ring']}><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loading;