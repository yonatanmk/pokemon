export interface IPokemon {
  id: string;
  name: string;
  height: number;
  weight: number;
  abilities: {
    name: string;
    effect: string;
    short_effect: string;
  }[]
}

export interface IPokemonQueryData {
  pokemon_v2_pokemon: [IPokemonQueryDatum]
}

export interface IPokemonQueryDatum {
  id: string;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemonabilities: IPokemonQueryAbility[]
}

export interface IPokemonQueryAbility {
  id: number;
  pokemon_v2_ability: {
    name: string;
    pokemon_v2_abilityeffecttexts: IPokemonQueryAbilityText[];
  }

}

export interface IPokemonQueryAbilityText {
  language_id: number;
  effect: string;
  short_effect: string;
}

export type ISortOrder = 'asc' | 'desc';

export interface ITableColumn<T> {
  name: string;
  index: number;
  // field: keyof T;
  field: string;
  component?: React.ComponentType<any>;
  disableSort?: boolean;
  sortByFunction?: (row: any) => any;
  formatFunction?: (value: T) => number | string;
}

export interface ITableCellComponent {
  props: {
    [key: string]: any;
  }
}

export interface IFilter {
  type: 'SEARCH' | 'SELECT' | 'CUSTOM';
  field?: string;
  value: string | string[];
  filterMethod?: (row: any) => boolean;
}

export interface ISelectFilter {
  key: number;
  placeholder: string;
  options: (string | number)[];
  updateFilterValues: React.Dispatch<React.SetStateAction<(string | number)[]>>;
}
