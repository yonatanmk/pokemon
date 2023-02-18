import { useEffect, useState } from 'react';
import startCase from 'lodash/startCase';
import debounce from 'lodash/debounce';
import styles from './App.module.scss';
import { BsSearch } from "react-icons/bs";
import { useQuery } from "@apollo/client"
import PokeSpriteCell from './components/PokeSpriteCell';
import AbilitiesCell from './components/AbilitiesCell';
import TypesCell from './components/TypesCell';
import Table from './components/Table';
import { formatPokemonRow, formatPokemonType, PAGE_SIZE, SORT_FIELDS, range } from './util';
import type { ITableColumn, IPokemonRow, IType, ISortOrder, ISortField, ITypeQueryData } from './interfaces';
import { SORT_ORDERS } from './components/Table/util';
import { usePokemonQuery } from './hooks';
import { GET_POKEMON_TYPES } from './graphql/queries';

export const columns: ITableColumn<IPokemonRow>[] = [
  {
    name: 'Pokédex No.',
    index: 1,
    field: 'id',
  },
  {
    name: 'Name',
    index: 2,
    field: 'name',
    formatFunction: row => startCase(row.name.split('-').join(' '))
  },
  {
    name: 'Height',
    index: 4,
    field: 'height',
    formatFunction: row => `${row.height / 10}m`
  },
  {
    name: 'Weight',
    index: 5,
    field: 'weight',
    disableSort: true,
    formatFunction: row => `${row.weight / 10}kg`
  },
  {
    name: 'Image',
    index: 3,
    field: 'image',
    disableSort: true,
    component: PokeSpriteCell,
  },
  {
    name: 'Abilities',
    index: 8,
    field: 'abilities',
    disableSort: true,
    component: AbilitiesCell,
  },
  {
    name: 'Types',
    index: 7,
    field: 'types',
    disableSort: true,
    component: TypesCell,
  },
];

function App() {
  const [pokemonRows, setPokemonRows] = useState<IPokemonRow[]>([]);
  const [page, setPage] = useState<number>(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [resultsCount, setResultsCount] = useState(0);
  const [allTypes, setAllTypes] = useState<IType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<ISortOrder>(SORT_ORDERS.ASC);
  const [sortField, setSortField] = useState<ISortField>(SORT_FIELDS.ID);

  const { data: typeData, loading: typeLoading, error: typeError } = useQuery<ITypeQueryData>(GET_POKEMON_TYPES);

  const { data: pokemonData, loading: pokemonLoading, error: pokemonError, refetch: pokemonRefetch } = usePokemonQuery({
    offset: 0,
    nameSearch: `%%`,
    sortOrder: SORT_ORDERS.ASC,
    sortField: SORT_FIELDS.ID,
    // selectedTypes: selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes,
    selectedTypes: range(1, 18)
  });

  // const { data: pokemonData, loading: pokemonLoading, error: pokemonError, refetch: pokemonRefetch } = usePokemonQuery({
  //   offset: page * PAGE_SIZE,
  //   nameSearch: `%${search}%`,
  //   sortOrder,
  //   sortField,
  //   // selectedTypes: selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes,
  //   selectedTypes: selectedTypes.length == 0 ? range(1, 18) : selectedTypes,
  // });

  useEffect(() => {
    if (pokemonData && !pokemonLoading && !pokemonError) {
      console.log('LOAD pokemonData')
      console.log({
        pokemonData,
        search,
        sortField,
        sortOrder
      })
      const newRows = pokemonData.pokemon_v2_pokemon.map( poke => formatPokemonRow(poke));
      setPokemonRows(prev => page === 0 ? newRows : [...prev, ...newRows])
      setResultsCount(pokemonData.pokemon_v2_pokemon_aggregate.aggregate.count)
    }
  }, [pokemonData])

  useEffect(() => {
    if (typeData && !typeLoading && !typeError) {
      if (allTypes.length === 0) {
        setAllTypes(typeData.pokemon_v2_pokemontype.map(formatPokemonType));
      }
    }
  }, [typeData])

  // useEffect(() => {
  //   console.log('REFETCH WATCHER')
  //   console.log({
  //     selectedTypes: selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes,
  //     sortField, sortOrder, search,
  //   })
  //   pokemonRefetch({ 
  //     offset: 0,
  //     nameSearch: `%${search}%`,
  //     sortOrder,
  //     sortField,
  //     selectedTypes: selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes,
  //   })
  // }, [selectedTypes, sortField, sortOrder, search])

  const loadNextPage = () => {
    setPage(prev => prev + 1)
    pokemonRefetch({
      offset: (page + 1) * PAGE_SIZE,
      nameSearch: `%${search}%`,
      sortOrder,
      sortField,
      selectedTypes: selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes,
    })
  }

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchInput(e.currentTarget.value);
    // console.log(debounce)
    // // debounce(() => {
    // //   console.log('DEBOUNCE')
    // //   setSearch(e.currentTarget.value)
    // // }, 1000)()
    debouncedSetSearch(e.currentTarget.value)
  }

  const debouncedSetSearch = debounce(
    (newSearch: string) => {
      setSearch(newSearch)
      pokemonRefetch({ 
        offset: 0,
        nameSearch: `%${newSearch}%`,
        sortOrder,
        sortField,
        selectedTypes: selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes,
      })
    }, 500)

  // const onSearch = () => {
  //   setPage(0)
  //   setPokemonRows([])
  //   pokemonRefetch({ 
  //     offset: 0,
  //     nameSearch: `%${search}%`,
  //     sortOrder,
  //     sortField,
  //     selectedTypes: selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes,
  //   })
  // }

  const toggleTypeSelected = (typeId: number) => {
    console.log('toggleTypeSelected')
    const newSelectedTypes = selectedTypes.includes(typeId) ? selectedTypes.filter(id => id !== typeId) : [...selectedTypes, typeId]
    setSelectedTypes(newSelectedTypes)
    pokemonRefetch({ 
      offset: 0, 
      nameSearch: `%${search}%`,
      sortOrder,
      sortField,
      selectedTypes: newSelectedTypes.length == 0 ? allTypes.map(type => type.id) : newSelectedTypes,
    }) // TODO FILTER BY TYPE
  }

  const onSortUpdate = ({
    newSortField,
    newSortOrder,
  }: {
    newSortField?: ISortField,
    newSortOrder?: ISortOrder
  }) => {
    if (newSortField) setSortField(newSortField);
    if (newSortOrder) setSortOrder(newSortOrder);
    pokemonRefetch({ 
      offset: 0,
      nameSearch: `%${search}%`,
      sortOrder: newSortOrder || sortOrder,
      sortField: newSortField|| sortField,
      selectedTypes: selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes,
    })
  }

  const onLastPage = pokemonRows.length === resultsCount;

  return (
    <div className={styles.App}>
      <div className={styles.Header}>
        <h1>Pokédex</h1>
      </div>
      <div className={styles.App__Body}>
        <div className={styles.App__Sidebar}>
        <div className={styles["App__Sidebar__Row--label"]}>
          <p>{resultsCount} Matching Pokémon</p>
        </div>
          <div className={styles.App__Sidebar__Row}>
            <div className={styles.App__Sidebar__Search}>
              <input id="people-search" type="text" value={searchInput} onChange={handleSearchChange} placeholder="Search Name" />
              <BsSearch />
            </div>
            {/* <button className={styles.App__Sidebar__SearchButton} onClick={onSearch}>Search</button> */}
          </div>
          <p>Search Input: {searchInput}</p>
          <p>Search: {search}</p>
          <div className={styles["App__Sidebar__Row--label"]}>
            <p>Types</p>
          </div>
          <div className={styles.App__Sidebar__Row}>
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
          {/* <p>{sortField} : {sortOrder}</p> */}
          {/* {selectedTypes.map(type => <p key={type}>{type}</p>)} */}
        </div>
        <div className={styles.App__Content}>
          <Table
            id="_id"
            rows={pokemonRows} 
            columns={columns} 
            defaultSortPredicate="id" 
            backupSortPredicate="id"
            filters={[]}
            setSortFieldOverride={(val: ISortField) => onSortUpdate({ newSortField: val })}
            setSortOrderOverride={(val: ISortOrder) => onSortUpdate({ newSortOrder: val })}
            sortOrderOverride={sortOrder}
            sortFieldOverride={sortField}
          />
          {!onLastPage && !pokemonLoading && <button className={styles.loadmore} onClick={loadNextPage}>Load More</button>}
        </div>
      </div>
    </div>
  );
}

export default App;
