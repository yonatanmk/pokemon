
import { createContext } from 'react';
import { SORT_ORDERS } from './util';
import type { ISortOrder, ISortField } from '../../interfaces';

export const TableSortContext = createContext({
  sortPredicate: 'name',
  sortOrder: SORT_ORDERS.ASC as ISortOrder,
  setSortPredicate:(() => null) as (arg0: ISortField) => void,
  setSortOrder: (() => null) as (arg0: ISortOrder) => void,
  onSort: (() => null) as (arg0: { sortField: ISortField, sortOrder: ISortOrder }) => void,
  overrideSortMethod: false,
  cellClickDisabled: false,
  onRowClick: (() => null) as (arg0: any) => void,
});