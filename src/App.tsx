import { useEffect, useState } from 'react';
import { useQuery, gql } from "@apollo/client"
import styles from './App.module.scss';
import Table from './components/Table';
import type { ITableColumn } from './interfaces';
import PokeSprite from './components/PokeSprite';
import capitalize from 'lodash/capitalize';

import type { IPokemon, IPokemonQueryData } from './interfaces';
import { formatPokemon } from './util';


const GET_POKEMON = gql`
query {
  pokemon_v2_pokemon(limit: 20) {
    id
    name
    height
    weight
    pokemon_v2_pokemonabilities{
      id
      pokemon_v2_ability {
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
  {
    name: 'Abilities',
    index: 6,
    field: 'image',
    disableSort: true,
    component: PokeSprite,
  },
];

function App() {
  const [pokemon, setPokemon] = useState<IPokemon[]>([])

  const pokemonData = useQuery<IPokemonQueryData>(GET_POKEMON)
  // const items = useQuery(GET_ITEMS)
  console.log(pokemonData)
  // console.log(items)


  
  useEffect(() => {
    const {data, loading, error} = pokemonData;
    if (data && !loading && !error) {
      setPokemon(data.pokemon_v2_pokemon.map( poke => formatPokemon(poke)))
    }
  }, [pokemonData])

  console.log(pokemonData)
  console.log(pokemon)

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
    <div className={styles.App}>
      <p>Hello World</p>
      <Table
        id="_id"
        rows={pokemonRows} 
        columns={columns} 
        defaultSortPredicate="id" 
        backupSortPredicate="id"
        filters={[]}
      />
    </div>
  );
}

export default App;
