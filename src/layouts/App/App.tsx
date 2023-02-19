import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import styles from './App.module.scss';
import { BsSearch } from "react-icons/bs";
import { useQuery } from "@apollo/client"
import classnames from 'classnames';
import Table from '../../components/Table';
import Loading from '../../components/Loading';
import InfoPanel from '../../components/InfoPanel';
import { formatPokemonRow, formatPokemonType, PAGE_SIZE, SORT_FIELDS, pokemonColumns } from '../../util';
import type { IPokemonRow, IType, ISortOrder, ISortField, ITypeQueryData } from '../../interfaces';
import { SORT_ORDERS } from '../../components/Table/util';
import { usePokemonQuery } from '../../hooks';
import { GET_POKEMON_TYPES } from '../../graphql/queries';

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
  const [selectedPokemon, setSelectedPokemon] = useState<IPokemonRow | null>(null)
  const [loading, setLoading] = useState(false);

  const { data: typeData, loading: typeLoading, error: typeError } = useQuery<ITypeQueryData>(GET_POKEMON_TYPES);

  const { data: pokemonData, loading: pokemonLoading, error: pokemonError, loadPokemon } = usePokemonQuery(); 

  const isLoading = loading || typeLoading || pokemonLoading

  useEffect(() => {
    if (pokemonData && !pokemonLoading && !pokemonError) {
      const newRows = pokemonData.pokemon_v2_pokemon.map( poke => formatPokemonRow(poke));
      setPokemonRows(prev => page === 0 ? newRows : [...prev, ...newRows]);
      setResultsCount(pokemonData.pokemon_v2_pokemon_aggregate.aggregate.count);
      setLoading(false)
    }
  }, [pokemonData])

  useEffect(() => {
    if (typeData && !typeLoading && !typeError) {
      if (allTypes.length === 0) {
        setAllTypes(typeData.pokemon_v2_pokemontype.map(formatPokemonType));
      }
    }
  }, [typeData])

  useEffect(() => {
    loadPokemon({
      offset: 0,
      nameSearch: `%%`,
      sortOrder: SORT_ORDERS.ASC,
      sortField: SORT_FIELDS.ID,
      selectedTypes: allTypes.map(type => type.id),
    })
  }, [allTypes])

  const refetch = ({
    reset = false,
    offset: offsetArg = 0,
    limit,
    nameSearch: nameSearchArg,
    sortOrder: sortOrderArg,
    sortField: sortFieldArg,
    selectedTypes: selectedTypesArg,
  }: {
    reset?: boolean;
    offset?: number;
    limit?: number;
    nameSearch?: string;
    sortOrder?: ISortOrder;
    sortField?: ISortField;
    selectedTypes?: number[];
  }) => {
    setLoading(true)
    if (reset) {
      setPage(0)
      setPokemonRows([])
    }

    loadPokemon({
      offset: offsetArg || 0,
      limit,
      nameSearch: `%${nameSearchArg || search}%`,
      sortOrder: sortOrderArg || sortOrder,
      sortField: sortFieldArg || sortField,
      selectedTypes: selectedTypesArg || (selectedTypes.length == 0 ? allTypes.map(type => type.id) : selectedTypes),
    })

  }

  const loadNextPage = () => {
    setPage(prev => prev + 1)
    refetch({
      offset: (page + 1) * PAGE_SIZE,
    })
  }

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchInput(e.currentTarget.value);
    debouncedSetSearch(e.currentTarget.value)
  }

  const debouncedSetSearch = debounce(
    (newSearch: string) => {
      setSearch(newSearch)
      refetch({
        reset: true,
        nameSearch: `%${newSearch}%`,
      })
    }, 500)

  const toggleTypeSelected = (typeId: number) => {
    console.log('toggleTypeSelected')
    const newSelectedTypes = selectedTypes.includes(typeId) ? selectedTypes.filter(id => id !== typeId) : [...selectedTypes, typeId]
    setSelectedTypes(newSelectedTypes)
    refetch({
      reset: true,
      selectedTypes: newSelectedTypes.length == 0 ? allTypes.map(type => type.id) : newSelectedTypes,
    })
  }

  const onSortUpdate = ({
    sortField: newSortField,
    sortOrder: newSortOrder,
  }: {
    sortField: ISortField,
    sortOrder: ISortOrder
  }) => {
    if (newSortField) setSortField(newSortField);
    if (newSortOrder) setSortOrder(newSortOrder);
    setPokemonRows([])
    refetch({
      limit: PAGE_SIZE + page * PAGE_SIZE,
      sortOrder: newSortOrder || sortOrder,
      sortField: newSortField|| sortField,
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
          <div className={classnames(styles["App__Sidebar__Row--head"], styles["App__Sidebar__Row--label"])}>
            <p>{resultsCount} Matching Pokémon</p>
          </div>
          <div className={styles.App__Sidebar__Row}>
            <div className={styles.App__Sidebar__Search}>
              <input id="people-search" type="text" value={searchInput} onChange={handleSearchChange} placeholder="Search Pokémon Name" />
              <BsSearch />
            </div>
          </div>
          <div className={classnames(styles.App__Sidebar__Row, styles.CheckboxList)}>
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
          <InfoPanel selectedPokemon={selectedPokemon} />
        </div>
        <div className={styles.App__Content}>
          <Table
            id="_id"
            rows={pokemonRows} 
            columns={pokemonColumns} 
            defaultSortPredicate="id" 
            backupSortPredicate="id"
            filters={[]}
            sortOrderOverride={sortOrder}
            sortFieldOverride={sortField}
            onSort={onSortUpdate}
            onRowSelect={setSelectedPokemon}
          />
          {!onLastPage && !pokemonLoading && !!pokemonRows[0] && <button className={styles.loadmore} onClick={loadNextPage}>Load More</button>}
          <Loading display={isLoading}/>
        </div>
      </div>
    </div>
  );
}

export default App;
