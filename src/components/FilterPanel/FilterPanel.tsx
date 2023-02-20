import { useState } from 'react';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { BsSearch } from "react-icons/bs";
import type { IType } from '../../interfaces';
import styles from './FilterPanel.module.scss';
import { formatSearchQuery } from '../../util';

export type IFilterPanelProps = {
  search: string;
  resultsCount: number;
  allTypes: IType[];
  selectedTypes: number[];
  onSearchChange: (newSearch: string) => void;
  onSelectedTypesChange: (newTypeIds: number[]) => void;
}

function FilterPanel({ 
  search,
  resultsCount,
  allTypes,
  selectedTypes,
  onSearchChange,
  onSelectedTypesChange,
}: IFilterPanelProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    const searchValue = e.currentTarget.value;
    setSearchInput(searchValue);
    const formattedSearch = formatSearchQuery(searchValue);
    if (formattedSearch !== search) debouncedSetSearch(formatSearchQuery(searchValue));
  }

  const debouncedSetSearch = debounce(onSearchChange, 500);

  const toggleTypeSelected = (typeId: number) => {
    const newSelectedTypes = selectedTypes.includes(typeId) ? selectedTypes.filter(id => id !== typeId) : [...selectedTypes, typeId];
    onSelectedTypesChange(newSelectedTypes)
  };

  const onCheckClickEvent = (id: number) => () => toggleTypeSelected(id);

  return (
    <div className={styles.FilterPanel}>
      <div className={classnames(styles["FilterPanel__Row--head"], styles["FilterPanel__Row--label"])}>
        <p>{resultsCount} Matching Pokémon</p>
      </div>
      <div className={styles.FilterPanel__Row}>
        <div className={styles.FilterPanel__Search}>
          <input id="people-search" type="text" value={searchInput} onChange={handleSearchChange} placeholder="Search Pokémon Name" />
          <BsSearch />
        </div>
      </div>
      <div className={classnames(styles.FilterPanel__Row, styles.CheckboxList)}>
        {allTypes && allTypes.map(type => (
          <div className={styles.Checkbox} key={type.id}>
            <input 
              className={styles.Checkbox__checkbox} 
              type="checkbox" 
              checked={selectedTypes.includes(type.id)} 
              onChange={onCheckClickEvent(type.id)}
            />
            <label className={styles.Checkbox__label} onClick={onCheckClickEvent(type.id)}>{type.name}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterPanel;