import type { IPokemonRow, IPokemonQueryDatum } from '../interfaces';

export const formatPokemonRow = (pokemonData: IPokemonQueryDatum): IPokemonRow => {
  const { id, name, height, weight, pokemon_v2_pokemonabilities } = pokemonData;
  return {
    id,
    name,
    height,
    weight,
    image: {
      props: {
        id,
        name,
      },
    },
    abilities: {
      props: {
        abilities: pokemon_v2_pokemonabilities.map(ability => ({
          name: ability.pokemon_v2_ability.name,
          effect: ability.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].effect,
          short_effect: ability.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].short_effect,
        }))
      }
    }

  }
}