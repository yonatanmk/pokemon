import style from './TypesCell.module.scss';

import type { IType } from '../../interfaces';

export type ITypesCellProps = {
  types: IType[];
}

function TypesCell({ types }: ITypesCellProps) {
  return (
    <div className={style.TypesCell}>
      {types.map(type => <p key={type.id} className={style.TypesCell__text}>{type.name}</p>)}
    </div>
  )
}

export default TypesCell;