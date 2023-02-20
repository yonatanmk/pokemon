import { render, fireEvent } from '@testing-library/react';
import HeaderCellComponent, { IHeaderCellProps } from '../HeaderCell';
import { TableSortContext } from '../../contexts';
import { SORT_ORDERS } from '../../util';
import { ISortField } from '../../../../interfaces';

const testFieldName = 'height'

const mockProps = {
  name: 'Test Height',
  field: testFieldName as ISortField,
  disableSort: false,
} as IHeaderCellProps;

const mockContext = { 
  sortPredicate: testFieldName,
  sortOrder: SORT_ORDERS.ASC,
  setSortPredicate:(() => null),
  setSortOrder: (() => null),
  onSort: (() => null),
  overrideSortMethod: false,
  onRowClick: (() => null), 
}

describe('HeaderCell', () => {
  it('renders successfully', async () => {
    const wrapper = render(<HeaderCellComponent {...mockProps} />)
    const { getByText } = wrapper;
    expect(getByText(mockProps.name)).toBeInTheDocument();
  })

  it('click event toggles sort order', async () => {
    const setSortOrder = jest.fn();
    const setSortPredicate = jest.fn();
    const wrapper = render(
      <TableSortContext.Provider value={{...mockContext, setSortOrder, setSortPredicate }}>
        <HeaderCellComponent {...mockProps} />
      </TableSortContext.Provider>
    )
    const { getByText } = wrapper;
    expect(setSortOrder).not.toHaveBeenCalled();
    expect(setSortPredicate).not.toHaveBeenCalled();
    fireEvent(
      getByText(mockProps.name),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(setSortOrder).toHaveBeenCalledWith(SORT_ORDERS.DESC);
    expect(setSortPredicate).not.toHaveBeenCalled();
  })

  it('click event disabled', async () => {
    const setSortOrder = jest.fn();
    const setSortPredicate = jest.fn();
    const wrapper = render(
      <TableSortContext.Provider value={{...mockContext, setSortOrder, setSortPredicate }}>
        <HeaderCellComponent {...{...mockProps, disableSort: true}} />
      </TableSortContext.Provider>
    )
    const { getByText } = wrapper;
    expect(setSortOrder).not.toHaveBeenCalled();
    fireEvent(
      getByText(mockProps.name),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(setSortOrder).not.toHaveBeenCalled();
    expect(setSortPredicate).not.toHaveBeenCalled();
  })

  it('changes the sort predicate if the header call has a different field than the sort predicate', async () => {
    const setSortOrder = jest.fn();
    const setSortPredicate = jest.fn();
    const wrapper = render(
      <TableSortContext.Provider value={{...mockContext, setSortOrder, setSortPredicate }}>
        <HeaderCellComponent {...{...mockProps, field: 'name'}} />
      </TableSortContext.Provider>
    )
    const { getByText } = wrapper;
    expect(setSortOrder).not.toHaveBeenCalled();
    expect(setSortPredicate).not.toHaveBeenCalled();
    fireEvent(
      getByText(mockProps.name),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(setSortOrder).toHaveBeenCalled();
    expect(setSortPredicate).toHaveBeenCalled();
  })

  it('overrides the sort method', async () => {
    const setSortOrder = jest.fn();
    const setSortPredicate = jest.fn();
    const onSort = jest.fn();
    const wrapper = render(
      <TableSortContext.Provider value={{...mockContext, overrideSortMethod: true, onSort }}>
        <HeaderCellComponent {...{...mockProps }} />
      </TableSortContext.Provider>
    )
    const { getByText } = wrapper;
    expect(setSortOrder).not.toHaveBeenCalled();
    expect(setSortPredicate).not.toHaveBeenCalled();
    expect(onSort).not.toHaveBeenCalled();
    fireEvent(
      getByText(mockProps.name),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(setSortOrder).not.toHaveBeenCalled();
    expect(setSortPredicate).not.toHaveBeenCalled();
    expect(onSort).toHaveBeenCalledWith({
      sortField: testFieldName,
      sortOrder: SORT_ORDERS.DESC,
    })
  })

  it('overrides the sort method and changes the field', async () => {
    const setSortOrder = jest.fn();
    const setSortPredicate = jest.fn();
    const onSort = jest.fn();
    const wrapper = render(
      <TableSortContext.Provider value={{...mockContext, overrideSortMethod: true, onSort }}>
        <HeaderCellComponent {...{...mockProps, field: 'name' }} />
      </TableSortContext.Provider>
    )
    const { getByText } = wrapper;
    expect(setSortOrder).not.toHaveBeenCalled();
    expect(setSortPredicate).not.toHaveBeenCalled();
    expect(onSort).not.toHaveBeenCalled();
    fireEvent(
      getByText(mockProps.name),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(setSortOrder).not.toHaveBeenCalled();
    expect(setSortPredicate).not.toHaveBeenCalled();
    expect(onSort).toHaveBeenCalledWith({
      sortField: 'name',
      sortOrder: SORT_ORDERS.ASC,
    })
  })
})
