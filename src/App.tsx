import { useEffect, useState } from 'react';
import capitalize from 'lodash/capitalize';
import { useQuery, gql } from "@apollo/client"
import styles from './App.module.scss';

import PokeSpriteCell from './components/PokeSpriteCell';
import AbilitiesCell from './components/AbilitiesCell';
import Table from './components/Table';
import { formatPokemonRow } from './util';
import type { ITableColumn, IPokemonRow, IPokemonQueryData } from './interfaces';



const GET_POKEMON = gql`
query {
  pokemon_v2_pokemon(limit: 60) {
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
    // formatFunction: row => row.abilities.map(ability => ability.name).join('\n')
    component: AbilitiesCell,
  },
];

function App() {
  const [pokemonRows, setPokemonRows] = useState<IPokemonRow[]>([])

  const pokemonData = useQuery<IPokemonQueryData>(GET_POKEMON)
  // const items = useQuery(GET_ITEMS)
  console.log(pokemonData)
  // console.log(items)


  
  useEffect(() => {
    const {data, loading, error} = pokemonData;
    if (data && !loading && !error) {
      setPokemonRows(data.pokemon_v2_pokemon.map( poke => formatPokemonRow(poke)))
    }
  }, [pokemonData])

  console.log(pokemonData)
  console.log(pokemonRows)

  // const pokemonRows = pokemon.map(poke => ({
  //   ...poke,
  //   image: {
  //     props: {
  //       id: poke.id,
  //       name: poke.name,
  //     }
  //   }
  // }))
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
