import { useEffect, useState } from 'react';
import capitalize from 'lodash/capitalize';
import { useQuery, gql } from "@apollo/client"
import styles from './App.module.scss';

import PokeSpriteCell from './components/PokeSpriteCell';
import AbilitiesCell from './components/AbilitiesCell';
import Table from './components/Table';
import { formatPokemonRow } from './util';
import type { ITableColumn, IPokemonRow, IPokemonQueryData } from './interfaces';

const PAGE_SIZE = 20;



const GET_POKEMON = gql`
query Pokemon($offset: Int!) {
  pokemon_v2_pokemon(limit: ${PAGE_SIZE}, offset: $offset) {
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

  const { data: pokemonData, loading: pokemonLoading, error: pokemonError, refetch: pokemonRefetch } = useQuery<IPokemonQueryData>(GET_POKEMON, {
    variables: { offset: page * PAGE_SIZE },
  })

  useEffect(() => {
    if (pokemonData && !pokemonLoading && !pokemonError) {
      console.log('loadNextPage')
      console.log(pokemonData)

      setPokemonRows(pokemonData.pokemon_v2_pokemon.map( poke => formatPokemonRow(poke)))
    }
  }, [pokemonData])


  const loadNextPage = () => {
    console.log('loadNextPage')
    console.log({
      nextPage: page + 1,
      nextOffset: (page + 1) * PAGE_SIZE,
    })
    setPage(prev => prev + 1)
    pokemonRefetch({
      offset: (page + 1) * PAGE_SIZE,
    })
  }

  return (
    <div className={styles.App}>
      <Table
        id="_id"
        rows={pokemonRows} 
        columns={columns} 
        defaultSortPredicate="id" 
        backupSortPredicate="id"
        filters={[]}
      />
      <button onClick={loadNextPage}>Load More</button>
    </div>
  );
}

export default App;
