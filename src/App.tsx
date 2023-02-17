import { useEffect, useState } from 'react';
import { useQuery, gql } from "@apollo/client"
import styles from './App.module.scss';
import Table from './components/Table';
import type { ITableColumn } from './interfaces';

interface IPokemon {
  id: string;
  name: string;
  height: number;
  weight: number;
}

interface IPokemonQueryResp {
  pokemon_v2_pokemon: IPokemon[];
}


const GET_POKEMON = gql`
query {
  pokemon_v2_pokemon(limit: 4) {
    id
    name
    height
    weight
  }
}
`

export const columns: ITableColumn<IPokemon>[] = [
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
  {
    name: 'Weight',
    index: 4,
    field: 'weight',
  },
];

function App() {
  const [pokemon, setPokemon] = useState<IPokemon[]>([])

  const pokemonData = useQuery<IPokemonQueryResp>(GET_POKEMON)
  // const items = useQuery(GET_ITEMS)
  console.log(pokemonData)
  // console.log(items)


  
  useEffect(() => {
    const {data, loading, error} = pokemonData;
    if (data && !loading && !error) {
      setPokemon(data.pokemon_v2_pokemon)
    }
  }, [pokemonData])
  return (
    <>
      <p className={styles.hello}>Hello World</p>
      {pokemon.map(poke => <p>{poke.name}</p>)}
      <Table
        id="_id"
        rows={pokemon} 
        columns={columns} 
        defaultSortPredicate="id" 
        backupSortPredicate="id"
        filters={[]}
      />
    </>
  );
}

export default App;
