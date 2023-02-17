import style from './AbilitiesCell.module.scss';
import startCase from 'lodash/startCase';

import type { IPokemonAbility } from '../../interfaces';

export type IAbilitiesCellProps = {
  abilities: IPokemonAbility[];
}

function AbilitiesCell({ abilities }: IAbilitiesCellProps) {
  return (
    <div className={style.AbilitiesCell}>
      {abilities.map(ability => <p>{startCase(ability.name.replace('-', ' '))}</p>)}
    </div>
  )
}

export default AbilitiesCell;