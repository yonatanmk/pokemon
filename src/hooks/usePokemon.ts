import { useQuery } from "@apollo/client"
import { SORT_FIELDS, PAGE_SIZE } from '../util';
import type { IPokemonQueryData, ISortOrder, ISortField } from '../interfaces';
import { GET_POKEMON } from '../graphql/queries';

export const usePokemonQuery = ({
  offset,
  limit = PAGE_SIZE,
  nameSearch,
  sortOrder,
  sortField,
  selectedTypes,
}: {
  offset: number;
  limit?: number;
  nameSearch: string;
  sortOrder: ISortOrder;
  sortField: ISortField;
  selectedTypes: number[];
}) => {
  const getPokemonQuery = useQuery<IPokemonQueryData>(GET_POKEMON, {
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
    },
    // fetchPolicy: 'network-only',
  })

  const refetch = ({ offset, limit = PAGE_SIZE, nameSearch, sortOrder, sortField, selectedTypes }: {
    offset: number;
    limit?: number;
    nameSearch: string;
    sortOrder: ISortOrder;
    sortField: ISortField;
    selectedTypes: number[];
  }) => {
    getPokemonQuery.refetch({
      offset,
      limit,
      nameSearch, 
      sortOrder,
      sortById: sortField === SORT_FIELDS.ID,
      sortByName: sortField === SORT_FIELDS.NAME,
      sortByHeight: sortField === SORT_FIELDS.HEIGHT,
      sortByWeight: sortField === SORT_FIELDS.WEIGHT,
      selectedTypes,
    })
  }

  return {
    ...getPokemonQuery,
    refetch, 
  };
};
