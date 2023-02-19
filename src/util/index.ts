import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import uniqBy from 'lodash/uniqBy';
import type { IPokemonRow, IPokemonQueryDatum, ITypeQueryDatum, IType, ISortField, IPokemonQueryAbility } from '../interfaces';

export const PAGE_SIZE = 50;
export const BASE_SPRITE_URL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`
export const BASE_SHINY_SPRITE_URL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/`

export const SORT_FIELDS = {
  ID: 'id' as ISortField,
  NAME: 'name' as ISortField,
  HEIGHT: 'height' as ISortField,
  WEIGHT: 'weight' as ISortField,
}

export const formatPokemonRow = (pokemonData: IPokemonQueryDatum): IPokemonRow => {
  const { id, name, height, weight, pokemon_v2_pokemonabilities, pokemon_v2_pokemontypes, pokemon_v2_pokemonsprites } = pokemonData;
  const spritesJSON = pokemon_v2_pokemonsprites && pokemon_v2_pokemonsprites ? JSON.parse(pokemon_v2_pokemonsprites[0].sprites) : {};
  return {
    id,
    name:startCase(name.split('-').join(' ')),
    height,
    weight,
    image: {
      props: {
        id,
        name,
        defaultUrl: spritesJSON.front_default ? `${BASE_SPRITE_URL}${id}.png` : null,
        shinyUrl: spritesJSON.front_shiny ? `${BASE_SHINY_SPRITE_URL}${id}.png` : null,
      },
    },
    abilities: {
      props: {
        abilities: uniqBy(pokemon_v2_pokemonabilities, (ability: IPokemonQueryAbility) => ability.pokemon_v2_ability.id)
          .map((ability: IPokemonQueryAbility) => ({
            id: ability.id,
            name: ability.pokemon_v2_ability?.name,
            effect: ability.pokemon_v2_ability?.pokemon_v2_abilityeffecttexts[0]?.effect,
            short_effect: ability.pokemon_v2_ability?.pokemon_v2_abilityeffecttexts[0]?.short_effect,
          }))
      }
    },
    types: {
      props: {
        types: pokemon_v2_pokemontypes.map(formatPokemonType)
      }
    }
  }
}

export const formatPokemonType = (type: ITypeQueryDatum): IType => ({
  id: type.type_id,
  name: capitalize(type.pokemon_v2_type.name),
});

export const  range = (min: number, max: number) => {
  const len = max - min + 1;
  const arr = new Array(len);
  for (let i=0; i<len; i++) {
    arr[i] = min + i;
  }
  return arr;
}
