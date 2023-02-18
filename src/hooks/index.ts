import { useQuery } from "@apollo/client"
import { SORT_FIELDS } from '../util';
import type { IPokemonQueryData, ISortOrder, ISortField } from '../interfaces';
import { GET_POKEMON } from '../graphql/queries';

export const usePokemonQuery = ({
  offset,
  nameSearch,
  sortOrder,
  sortField,
}: {
offset: number;
nameSearch: string;
sortOrder: ISortOrder;
sortField: ISortField;
}) => {
  const getPokemonQuery = useQuery<IPokemonQueryData>(GET_POKEMON, {
    variables: { 
      offset,
      nameSearch,
      sortOrder,
      sortById: sortField === SORT_FIELDS.ID,
      sortByName: sortField === SORT_FIELDS.NAME,
    },
  })

  const refetch = ({ offset, nameSearch, sortOrder, sortField }: {
    offset: number;
    nameSearch: string;
    sortOrder: ISortOrder;
    sortField: ISortField;

  }) => {

    getPokemonQuery.refetch({
      offset,
      nameSearch, 
      sortOrder,
      sortById: sortField === SORT_FIELDS.ID,
      sortByName: sortField === SORT_FIELDS.NAME,
    })
  }

  return {
    ...getPokemonQuery,
    refetch, 
  };
};
