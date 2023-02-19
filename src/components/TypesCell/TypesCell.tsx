import styles from './TypesCell.module.scss';

import type { IType } from '../../interfaces';

export type ITypesCellProps = {
  types: IType[];
}

function TypesCell({ types }: ITypesCellProps) {
  return (
    <div className={styles.TypesCell}>
      {types.map(type => <p key={type.id} className={styles.TypesCell__text}>{type.name}</p>)}
    </div>
  )
}

export default TypesCell;