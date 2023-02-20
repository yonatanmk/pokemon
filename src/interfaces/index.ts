export interface IPokemonRow {
  id: number;
  name: string;
  height: number;
  weight: number;
  imageUrl: string | null;
  image: {
    props: {
      id: number;
      name: string;
      defaultUrl: string | null;
      shinyUrl: string | null;
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

export interface IPokemonMove {
  id: number;
  level: number;
  name: string;
  power: number | null;
  accuracy: number;
  generation: {
      name: string;
  };
  effect: string
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
}

export interface ITypeQueryData {
  pokemon_v2_pokemontype: ITypeQueryDatum[];
}

export interface IPokemonQueryDatum {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemonabilities: IPokemonQueryAbility[];
  pokemon_v2_pokemontypes: ITypeQueryDatum[];
  pokemon_v2_pokemonsprites: { sprites: string }[]
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

export interface ISinglePokemonData {
  pokemon_v2_pokemonspeciesflavortext: IFlavorQueryDatum[];
  pokemon_v2_pokemonstat: IBaseStatDatum[];
  pokemon_v2_pokemonmove: IBaseMoveDatum[]
}

export interface IFlavorQueryDatum {
  flavor_text: string;
  pokemon_species_id: number;
}

export interface IBaseStatDatum {
  id: number;
  pokemon_id: number;
  base_stat: number;
  pokemon_v2_stat: {
    name: string;
  }
}

export interface IBaseMoveDatum {
  id: number;
  move_id: number;
  level: number;
  pokemon_v2_move: {
    accuracy: number;
    power: number | null;
    name: string;
    pokemon_v2_type: {
      name: string;
    }
    pokemon_v2_generation: {
      name: string;
    }
    pokemon_v2_moveeffect: {
      pokemon_v2_moveeffecteffecttexts: {
        effect: string;
        short_effect: string;
      }[]
    }
  }
}

export interface IBaseMove {
  id: number;
  level: number;
  name: string;
  type: string;
  power: string | number;
  accuracy: string | number;
  generation: string;
  effect: string;
}

export type ISortOrder = 'asc' | 'desc';
export type ISortField = 'id' | 'name' | 'height' | 'weight';

export interface ITableColumn<T> {
  name: string;
  index: number;
  // field: keyof T;
  field: string;
  className?: string;
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
  value?: string | string[];
  filterMethod?: (row: any) => boolean;
}

export interface ISelectFilter {
  key: number;
  placeholder: string;
  options: (string | number)[];
  updateFilterValues: React.Dispatch<React.SetStateAction<(string | number)[]>>;
}

export interface IBarChartData {
  label: string;
  value: number;
}
