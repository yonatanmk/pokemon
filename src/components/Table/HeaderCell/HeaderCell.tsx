import style from "./HeaderCell.module.scss";
import { useContext } from 'react';
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import classnames from "classnames";
import { SORT_ORDERS } from '../util';
import { TableSortContext } from '../contexts';
import type { ISortField } from '../../../interfaces';

export type IHeaderCellProps = {
  name: string;
  field: string;
  disableSort: boolean;
};

function HeaderCell({ name, field, disableSort }: IHeaderCellProps) {
  const { sortPredicate, setSortPredicate, sortOrder, setSortOrder } = useContext(TableSortContext);

  const isSorted = field === sortPredicate;
  const ArrowIcon = sortOrder === SORT_ORDERS.ASC ? BsArrowDown : BsArrowUp;


  const toggleSortOrder = () => {
    setSortOrder(sortOrder === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.ASC)
  }

  const onHeaderClick = () => {
    if (disableSort) {
      return;
    } else if (isSorted) {
      toggleSortOrder()
    } else {
      setSortPredicate(field as ISortField)
      setSortOrder(SORT_ORDERS.ASC)
    }
  }

  return (
    <div className={classnames(style.HeaderCell, {[ style.HeaderCell__unsorted]: !isSorted })}>
      <button disabled={disableSort} onClick={onHeaderClick}>
        <p>{name}</p>
        <ArrowIcon />
      </button>
    </div>
  )
}

export default HeaderCell;
