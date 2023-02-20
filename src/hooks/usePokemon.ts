import { useLazyQuery } from "@apollo/client"
import { SORT_FIELDS, PAGE_SIZE } from '../util';
import type { IPokemonQueryData, ISortOrder, ISortField } from '../interfaces';
import { GET_POKEMON } from '../graphql/queries';

export const usePokemonQuery = () => {
  // useLazy because we can't make the first request until allTypes are loaded
  const [loadPokemonFunc, getPokemonQuery] = useLazyQuery<IPokemonQueryData>(GET_POKEMON);

  const loadPokemon = ({ offset, limit = PAGE_SIZE, nameSearch, sortOrder, sortField, selectedTypes }: {
    offset: number;
    limit?: number;
    nameSearch: string;
    sortOrder: ISortOrder;
    sortField: ISortField;
    selectedTypes: number[];
  }) => {
    loadPokemonFunc({
      variables: {
        offset,
        limit,
        nameSearch, 
        sortOrder,
        sortById: sortField === SORT_FIELDS.ID,
        sortByName: sortField === SORT_FIELDS.NAME,
        sortByHeight: sortField === SORT_FIELDS.HEIGHT,
        sortByWeight: sortField === SORT_FIELDS.WEIGHT,
        selectedTypes,
      }
    })
  }

  return {
    ...getPokemonQuery,
    loadPokemon,
  };
};
