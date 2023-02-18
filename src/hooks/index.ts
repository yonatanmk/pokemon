import { useQuery } from "@apollo/client"
import { SORT_FIELDS } from '../util';
import type { IPokemonQueryData, ISortOrder, ISortField } from '../interfaces';
import { GET_POKEMON } from '../graphql/queries';

export const usePokemonQuery = ({
  offset,
  nameSearch,
  sortOrder,
  sortField,
  selectedTypes,
}: {
offset: number;
nameSearch: string;
sortOrder: ISortOrder;
sortField: ISortField;
selectedTypes: number[];
}) => {
  const getPokemonQuery = useQuery<IPokemonQueryData>(GET_POKEMON, {
    variables: { 
      offset,
      nameSearch,
      sortOrder,
      sortById: sortField === SORT_FIELDS.ID,
      sortByName: sortField === SORT_FIELDS.NAME,
      sortByHeight: sortField === SORT_FIELDS.HEIGHT,
      sortByWeight: sortField === SORT_FIELDS.WEIGHT,
      selectedTypes,
    },
  })

  const refetch = ({ offset, nameSearch, sortOrder, sortField, selectedTypes }: {
    offset: number;
    nameSearch: string;
    sortOrder: ISortOrder;
    sortField: ISortField;
    selectedTypes: number[];
  }) => {
    getPokemonQuery.refetch({
      offset,
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
