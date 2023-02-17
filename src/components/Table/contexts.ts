
import React, { createContext } from 'react';
import { SORT_ORDERS } from './util';
import type { ISortOrder } from '../../interfaces';

export const TableSortContext = createContext({
  sortPredicate: 'name',
  sortOrder: SORT_ORDERS.ASC as ISortOrder,
  setSortPredicate:(() => null) as React.Dispatch<React.SetStateAction<string>>,
  setSortOrder: (() => null) as React.Dispatch<React.SetStateAction<ISortOrder>>,
});