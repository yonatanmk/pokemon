import { useState, SetStateAction, Dispatch } from 'react';
import classnames from 'classnames';
import orderBy from 'lodash/orderBy';
import styles from "./Table.module.scss";
import Row from './Row';
import type { ITableColumn, ISortOrder, IFilter, ISortField } from '../../interfaces';
import HeaderCell from './HeaderCell';
import { SORT_ORDERS, filterRows } from './util';
import { TableSortContext } from './contexts';

interface ITableProps<T> {
  className?: string;
  // rows: T[];
  rows: any[];
  columns: ITableColumn<T>[];
  defaultSortPredicate: ISortField;
  backupSortPredicate: ISortField;
  filters?: IFilter[];
  id: string | number;
  sortOrderOverride?: ISortOrder;
  sortFieldOverride?: ISortField;
  setSortFieldOverride?: Dispatch<SetStateAction<ISortField>>;
  setSortOrderOverride?: Dispatch<SetStateAction<ISortOrder>>;
}

function Table<T extends object>({ 
  className,
  rows,
  columns,
  defaultSortPredicate,
  backupSortPredicate,
  filters,
  sortOrderOverride,
  sortFieldOverride,
  setSortFieldOverride,
  setSortOrderOverride,
}: ITableProps<T>) {
  const [sortPredicate, setSortPredicate] = useState(defaultSortPredicate);
  const [sortOrder, setSortOrder] = useState(SORT_ORDERS.ASC as ISortOrder);
  const sortedColumns = [...columns].sort((a, b) => a.index > b.index ? 1 : -1);
  const headerColumns = sortedColumns.map(col => ({
    ...col,
    component: HeaderCell,
  }));

  const filteredRows = filters && filters.length > 0 ? filterRows(rows, filters)  : rows;

  const sortByColumn = columns.find(col => col.field === sortPredicate) as ITableColumn<T>;
  const sortByFunction = sortByColumn.sortByFunction || sortPredicate; // default to field value if there's no sort by function

  const sortedRows = sortFieldOverride ? filteredRows : orderBy(filteredRows, [sortByFunction, defaultSortPredicate || backupSortPredicate], [sortOrder, sortOrder]);

  const trueSortPredicate = sortFieldOverride || sortPredicate;
  const trueSortOrder = sortOrderOverride || sortOrder;
  const trueSetSortPredicate = setSortFieldOverride || setSortPredicate;
  const trueSetSortOrder = setSortOrderOverride || setSortOrder;

  const headerRow = columns.reduce((agg: Partial<any>, col) => {
    return {
      ...agg,
      [col.field]: {
        props: {
          name: col.name,
          field: col.field,
          sortPredicate: trueSortPredicate,
          sortOrder: trueSortOrder,
          disableSort: !!col.disableSort,
        }
      },
    }
  }, {
    sortPredicate: trueSortPredicate,
    sortOrder: trueSortOrder,
  } as Partial<any>) as any;

  return (
    <table className={classnames(styles.table, className)}>
      <thead>
        <TableSortContext.Provider value={{ 
          sortPredicate: trueSortPredicate,
          setSortPredicate: trueSetSortPredicate, 
          sortOrder: trueSortOrder, 
          setSortOrder: trueSetSortOrder 
        }}>
          <Row row={headerRow} columns={headerColumns} isHeader/>
        </TableSortContext.Provider>
      </thead>
      <tbody>
        {sortedRows.map((row: any, index : number) => <Row key={index} row={row} columns={sortedColumns} />)}
      </tbody>
    </table>
  );
}

export default Table;