import { render, fireEvent } from '@testing-library/react';
import TableComponent, { ITableProps } from '../Table';

const mockProps = {
  rows: [
    {
      id: 1,
      name: 'name1',
      height: 12,
    },
    {
      id: 2,
      name: 'A name2',
      height: 33,
    },
    {
      id: 3,
      name: 'name3',
      height: 33,
    }
  ],
  columns: [
    {
      name: 'Pokédex No.',
      index: 1,
      field: 'id',
    },
    {
      name: 'Name',
      index: 2,
      field: 'name',
    },
    {
      name: 'Height',
      index: 3,
      field: 'height',
    },
  ],
  defaultSortPredicate: 'id',
  backupSortPredicate: 'id',
} as ITableProps<{name: string, index: number, field: string}>;

describe('Cell', () => {
  it('renders successfully', async () => {
    const wrapper = render(<TableComponent {...mockProps}/>)
    const { getByText } = wrapper;
    expect(getByText(mockProps.rows[0].name)).toBeInTheDocument();
  })

  it('renders a header row', async () => {
    const onRowSelect = jest.fn();
    const wrapper = render(<TableComponent {...{...mockProps, onRowSelect}}/>)
    const { getByText, getAllByTestId } = wrapper;
    const rows = getAllByTestId('table-row');
    expect(rows.length).toEqual(mockProps.rows.length + 1)
    const cells = getAllByTestId('table-cell');
    expect(cells.length).toEqual((mockProps.rows.length + 1) * mockProps.columns.length)
    expect(onRowSelect).not.toHaveBeenCalled();
    fireEvent(
      getByText(mockProps.columns[0].name),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).not.toHaveBeenCalled();
  })

  it('handles click events', async () => {
    const onRowSelect = jest.fn();
    const wrapper = render(<TableComponent {...{...mockProps, onRowSelect}}/>)
    const { getAllByTestId } = wrapper;
    expect(onRowSelect).not.toHaveBeenCalled();
    const cells = getAllByTestId('table-cell');
    fireEvent(
      cells[3],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).toHaveBeenCalledWith(mockProps.rows[0]);
  })

  it('toggles sort order and sorts appropriately', async () => {
    const onRowSelect = jest.fn();
    const wrapper = render(<TableComponent {...{...mockProps, onRowSelect}}/>)
    const { getByText, getAllByTestId } = wrapper;
    expect(onRowSelect).not.toHaveBeenCalled();
    const idHeaderCell = getByText(mockProps.columns[0].name);
    fireEvent(
      idHeaderCell,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).not.toHaveBeenCalled();
    const cells = getAllByTestId('table-cell');
    fireEvent(
      cells[3],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).toHaveBeenCalledWith(mockProps.rows[2]);
  })

  it('changes sort predicate  and sorts appropriately', async () => {
    const onRowSelect = jest.fn();
    const wrapper = render(<TableComponent {...{...mockProps, onRowSelect}}/>)
    const { getByText, getAllByTestId } = wrapper;
    expect(onRowSelect).not.toHaveBeenCalled();
    const idHeaderCell = getByText(mockProps.columns[1].name);
    fireEvent(
      idHeaderCell,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).not.toHaveBeenCalled();
    const cells = getAllByTestId('table-cell');
    fireEvent(
      cells[3],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).toHaveBeenCalledWith(mockProps.rows[1]);
  })

  it('filters rows', async () => {
    const onRowSelect = jest.fn();
    const wrapper = render(<TableComponent {...{...mockProps, filters: [{ type: 'SEARCH', field: 'name', value: '2' }], onRowSelect}}/>)
    const { getAllByTestId } = wrapper;
    const rows = getAllByTestId('table-row');
    expect(rows.length).toEqual(2)
    const cells = getAllByTestId('table-cell');
    fireEvent(
      cells[3],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    expect(onRowSelect).toHaveBeenCalledWith(mockProps.rows[1]);
  })
})
