import { useState } from 'react';
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
  rows: any[];
  columns: ITableColumn<T>[];
  defaultSortPredicate: ISortField;
  backupSortPredicate: ISortField;
  filters?: IFilter[];
  id: string | number;
  sortOrderOverride?: ISortOrder;
  sortFieldOverride?: ISortField;
  onSort?: (arg0: { sortField: ISortField, sortOrder: ISortOrder }) => void;
  onRowSelect: (arg0: any) => void;
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
  onSort,
  onRowSelect = () => {/*default to empty function*/},
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
      <TableSortContext.Provider value={{ 
        sortPredicate: trueSortPredicate,
        setSortPredicate, 
        sortOrder: trueSortOrder, 
        setSortOrder, 
        onSort: (onSort || (() => setSortOrder)),
        overrideSortMethod: !!onSort,
        onRowClick: onRowSelect,
      }}>
        <thead>
          <Row row={headerRow} columns={headerColumns} isHeader/>
        </thead>
        <tbody>
          {sortedRows.map((row: any, index : number) => <Row key={index} row={row} columns={sortedColumns} />)}
        </tbody>
      </TableSortContext.Provider>
    </table>
  );
}

export default Table;