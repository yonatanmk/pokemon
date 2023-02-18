export interface IPokemonRow {
  id: string;
  name: string;
  height: number;
  weight: number;
  image: {
    props: {
      id: string;
      name: string;
    }
  }
  abilities: {
    props: {
      abilities: IPokemonAbility[];
    }
  }
  types: {
    props: {
      types: IType[],
    }
  } 
}

export interface IPokemonAbility {
  id: number;
  name: string;
  effect: string;
  short_effect: string;
}

export interface IPokemonQueryData {
  pokemon_v2_pokemon: IPokemonQueryDatum[];
  pokemon_v2_pokemon_aggregate: ICountQueryDatum;
  pokemon_v2_pokemontype: ITypeQueryDatum[];
}

export interface IPokemonQueryDatum {
  id: string;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemonabilities: IPokemonQueryAbility[]
  pokemon_v2_pokemontypes: ITypeQueryDatum[]
}

export interface ICountQueryDatum {
  aggregate: {
    count: number;
  }
}

export interface ITypeQueryDatum {
  type_id: number;
  pokemon_v2_type: {
    name: string;
  };
}

export interface IType {
  id: number;
  name: string;
}

export interface IPokemonQueryAbility {
  id: number;
  pokemon_v2_ability: {
    id: number;
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
// export type ISortField = 'id' | 'name' | 'height' | 'weight';
export type ISortField = 'id' | 'name';

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
