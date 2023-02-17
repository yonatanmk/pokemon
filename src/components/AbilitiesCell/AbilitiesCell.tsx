import style from './AbilitiesCell.module.scss';
import startCase from 'lodash/startCase';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import type { IPokemonAbility } from '../../interfaces';

export type IAbilitiesCellProps = {
  abilities: IPokemonAbility[];
}

function AbilitiesCell({ abilities }: IAbilitiesCellProps) {
  return (
    <div className={style.AbilitiesCell}>
      {abilities.map(ability => (
        <Tippy content={<span>{ability.short_effect}</span>}>
          <p className={style.AbilitiesCell__text}>{startCase(ability.name.replace('-', ' '))}</p>
        </Tippy>
      ))}
    </div>
  )
}

export default AbilitiesCell;