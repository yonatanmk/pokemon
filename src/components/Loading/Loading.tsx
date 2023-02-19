import styles from './Loading.module.scss';

function Loading( {display }:{ display: boolean } ) {
  if (!display) return null;
  return (
    <div className={styles.Loading}>
      <div className={styles['lds-ring']}><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loading;