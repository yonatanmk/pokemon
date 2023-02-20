import { render, fireEvent } from '@testing-library/react';
import CellComponent, { ICellProps } from '../Cell';
import { TableSortContext } from '../../contexts';
import type { ITableColumn } from '../../../../interfaces';
import { SORT_ORDERS } from '../../util';

const mockProps = {
  fieldName: 'name',
  row: {
    id: 1,
    name: 'Test Name',
  },
  column: {} as  ITableColumn<any>,
} as ICellProps;

const mockContext = { 
  sortPredicate: 'name',
  sortOrder: SORT_ORDERS.ASC,
  setSortPredicate:(() => null),
  setSortOrder: (() => null),
  onSort: (() => null),
  overrideSortMethod: false,
}

describe('Cell', () => {
  it('renders successfully', async () => {
    const wrapper = render(<table><tbody><tr><CellComponent {...mockProps} /></tr></tbody></table>)
    const { getByText } = wrapper;
    expect(getByText(mockProps.row.name)).toBeInTheDocument();
  })

  it('renders formatted text successfully', async () => {
    const props = {
      ...mockProps, 
      column: {
        formatFunction: (row: any) => 'FORMATTED TEXT',
      } as ITableColumn<any>,
    }
    const wrapper = render(<table><tbody><tr><CellComponent {...props} /></tr></tbody></table>)
    const { getByText } = wrapper;
    expect(getByText('FORMATTED TEXT')).toBeInTheDocument();
  })

  it('handles row click event', async () => {
    const onRowSelect = jest.fn();
    const wrapper = render(
      <TableSortContext.Provider value={{...mockContext, onRowClick: onRowSelect }}>
        <table><tbody><tr><CellComponent {...mockProps} /></tr></tbody></table>
      </TableSortContext.Provider>
    )
    const { getByText } = wrapper;
    expect(onRowSelect).not.toHaveBeenCalled();
    fireEvent(
      getByText(mockProps.row.name),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).toHaveBeenCalledWith(mockProps.row);
  })

  it('does not handles row click event if header cell', async () => {
    const onRowSelect = jest.fn();
    const wrapper = render(
      <TableSortContext.Provider value={{...mockContext, onRowClick: onRowSelect }}>
        <table><thead><tr><CellComponent {...{...mockProps, isHeader: true} } /></tr></thead></table>
      </TableSortContext.Provider>
    )
    const { getByText } = wrapper;
    expect(onRowSelect).not.toHaveBeenCalled();
    fireEvent(
      getByText(mockProps.row.name),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).not.toHaveBeenCalled();
  })
})
