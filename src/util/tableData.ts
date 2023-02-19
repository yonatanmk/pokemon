import startCase from 'lodash/startCase';
import PokeSpriteCell from '../components/PokeSpriteCell';
import AbilitiesCell from '../components/AbilitiesCell';
import TypesCell from '../components/TypesCell';
import type { ITableColumn, IPokemonRow } from '../interfaces';

export const pokemonColumns: ITableColumn<IPokemonRow>[] = [
  {
    name: 'Pokédex No.',
    index: 1,
    field: 'id',
  },
  {
    name: 'Name',
    index: 2,
    field: 'name',
    formatFunction: (row: IPokemonRow) => startCase(row.name.split('-').join(' '))
  },
  {
    name: 'Height',
    index: 4,
    field: 'height',
    formatFunction: (row: IPokemonRow) => `${row.height / 10}m`
  },
  {
    name: 'Weight',
    index: 5,
    field: 'weight',
    disableSort: true,
    formatFunction: (row: IPokemonRow) => `${row.weight / 10}kg`
  },
  {
    name: 'Sprite',
    index: 3,
    field: 'image',
    disableSort: true,
    component: PokeSpriteCell,
  },
  {
    name: 'Abilities',
    index: 8,
    field: 'abilities',
    disableSort: true,
    component: AbilitiesCell,
  },
  {
    name: 'Types',
    index: 7,
    field: 'types',
    disableSort: true,
    component: TypesCell,
  },
];