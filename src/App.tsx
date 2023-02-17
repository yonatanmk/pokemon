import { useEffect, useState } from 'react';
import capitalize from 'lodash/capitalize';
import { useQuery, gql } from "@apollo/client"
import styles from './App.module.scss';
import { BsSearch } from "react-icons/bs";
import uniqBy from 'lodash/uniqBy';

import PokeSpriteCell from './components/PokeSpriteCell';
import AbilitiesCell from './components/AbilitiesCell';
import Table from './components/Table';
import { formatPokemonRow } from './util';
import type { ITableColumn, IPokemonRow, IPokemonQueryData, ITypeQueryDatum, IType } from './interfaces';
import { type } from 'os';

const PAGE_SIZE = 20;

const GET_POKEMON = gql`
query Pokemon($offset: Int!, $nameSearch: String) {
  pokemon_v2_pokemon(limit: ${PAGE_SIZE}, offset: $offset, where: { name: { _like: $nameSearch } }) {
    id
    name
    height
    weight
    pokemon_v2_pokemonabilities{
      id
      pokemon_v2_ability {
        id
        name
        pokemon_v2_abilityeffecttexts(limit: 1, where: { language_id:{ _eq: 9 } }) {
          short_effect
          effect
          language_id
        }
      }
    }
  }
  pokemon_v2_pokemon_aggregate(where: { name: { _like: $nameSearch } }) {
    aggregate {
      count
    }
  }
  pokemon_v2_pokemontype (distinct_on: type_id) {
    type_id
    pokemon_v2_type {
      name
    }
  }
}
`;

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
    formatFunction: row => capitalize(row.name)
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
    index: 6,
    field: 'abilities',
    disableSort: true,
    component: AbilitiesCell,
  },
];

function App() {
  const [pokemonRows, setPokemonRows] = useState<IPokemonRow[]>([])
  const [page, setPage] = useState<number>(0)
  const [search, setSearch] = useState('')
  const [resultsCount, setResultsCount] = useState(0)
  const [allTypes, setAllTypes] = useState<IType[]>([])
  const [selectedTypes, setSelectedTypes] = useState<number[]>([])

  const { data: pokemonData, loading: pokemonLoading, error: pokemonError, refetch: pokemonRefetch } = useQuery<IPokemonQueryData>(GET_POKEMON, {
    variables: { 
      offset: page * PAGE_SIZE,
      nameSearch: `%%`
    },
  })

  useEffect(() => {
    if (pokemonData && !pokemonLoading && !pokemonError) {
      const newRows = [...pokemonRows, ...pokemonData.pokemon_v2_pokemon.map( poke => formatPokemonRow(poke))]
      setPokemonRows(prev => page === 0 ? newRows : [...prev, ...newRows])
      setResultsCount(pokemonData.pokemon_v2_pokemon_aggregate.aggregate.count)

      if (allTypes.length === 0) {
        setAllTypes(pokemonData.pokemon_v2_pokemontype.map((type: ITypeQueryDatum) => ({ 
          id: type.type_id,
          name: capitalize(type.pokemon_v2_type.name),
        })));
      }
    }
  }, [pokemonData])

  const loadNextPage = () => {
    setPage(prev => prev + 1)
    pokemonRefetch({
      offset: (page + 1) * PAGE_SIZE,
    })
  }

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  }

  const onSearch = () => {
    setPage(0)
    setPokemonRows([])
    pokemonRefetch({ offset: 0, nameSearch: `%${search}%` })
  }

  const toggleTypeSelected = (typeId: number) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(prev => prev.filter(id => id !== typeId))
    } else {
      setSelectedTypes(prev => [...prev, typeId])
    }
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
              <input id="people-search" type="text" value={search} onChange={handleSearchChange} placeholder="Search Name" />
              <BsSearch />
            </div>
            <button className={styles.App__Sidebar__SearchButton} onClick={onSearch}>Search</button>
          </div>
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
        </div>
        <div className={styles.App__Content}>
          <Table
            id="_id"
            rows={pokemonRows} 
            columns={columns} 
            defaultSortPredicate="id" 
            backupSortPredicate="id"
            filters={[]}
          />
          {!onLastPage && !pokemonLoading && <button className={styles.loadmore} onClick={loadNextPage}>Load More</button>}
        </div>
      </div>

    </div>
  );
}

export default App;
