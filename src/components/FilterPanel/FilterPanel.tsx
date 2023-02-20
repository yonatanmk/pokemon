import { useState } from 'react';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import { BsSearch } from "react-icons/bs";
import type { IType } from '../../interfaces';
import styles from './FilterPanel.module.scss';

export type IFilterPanelProps = {
  resultsCount: number;
  allTypes: IType[];
  selectedTypes: number[];
  onSearchChange: (newSearch: string) => void;
  onSelectedTypesChange: (newTypeIds: number[]) => void;
}

function FilterPanel({ 
  resultsCount,
  allTypes,
  selectedTypes,
  onSearchChange,
  onSelectedTypesChange,
}: IFilterPanelProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchInput(e.currentTarget.value);
    debouncedSetSearch(e.currentTarget.value)
  }

  const debouncedSetSearch = debounce(onSearchChange, 500);

  const toggleTypeSelected = (typeId: number) => {
    const newSelectedTypes = selectedTypes.includes(typeId) ? selectedTypes.filter(id => id !== typeId) : [...selectedTypes, typeId];
    onSelectedTypesChange(newSelectedTypes)
  };

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
              onChange={() => toggleTypeSelected(type.id)}
            />
            <label className={styles.Checkbox__label}>{type.name}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FilterPanel;