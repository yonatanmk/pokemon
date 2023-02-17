import { useEffect, useState } from 'react';
import { useQuery, gql } from "@apollo/client"
import styles from './App.module.scss';
import Table from './components/Table';
import type { ITableColumn } from './interfaces';
import PokeSprite from './components/PokeSprite';
import capitalize from 'lodash/capitalize';

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
  pokemon_v2_pokemon(limit: 20) {
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
    component: PokeSprite,
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

  const pokemonRows = pokemon.map(poke => ({
    ...poke,
    image: {
      props: {
        id: poke.id,
        name: poke.name,
      }
    }
  }))
  return (
    <>
      <p className={styles.hello}>Hello World</p>
      {/* {pokemon.map(poke => <p>{poke.name}</p>)} */}
      <Table
        id="_id"
        rows={pokemonRows} 
        columns={columns} 
        defaultSortPredicate="id" 
        backupSortPredicate="id"
        filters={[]}
      />
    </>
  );
}

export default App;
