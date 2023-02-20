import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import uniqBy from 'lodash/uniqBy';
import type { IPokemonRow, IPokemonQueryDatum, ITypeQueryDatum, IType, ISortField, IPokemonQueryAbility, IBaseMoveDatum, IBaseMove } from '../interfaces';

export { pokemonColumns } from './tableData';

export const PAGE_SIZE = 50;
export const BASE_SPRITE_URL = process.env.REACT_APP_BASE_SPRITE_URL;
export const BASE_SHINY_SPRITE_URL = `${BASE_SPRITE_URL}/shiny`;
export const BASE_IMAGE_URL = `${BASE_SPRITE_URL}/other/official-artwork`;

export const SORT_FIELDS = {
  ID: 'id' as ISortField,
  NAME: 'name' as ISortField,
  HEIGHT: 'height' as ISortField,
  WEIGHT: 'weight' as ISortField,
}

export const formatPokemonRow = (pokemonData: IPokemonQueryDatum): IPokemonRow => {
  const { id, name, height, weight, pokemon_v2_pokemonabilities, pokemon_v2_pokemontypes, pokemon_v2_pokemonsprites } = pokemonData;
  const spritesJSON = pokemon_v2_pokemonsprites && pokemon_v2_pokemonsprites && pokemon_v2_pokemonsprites[0]?.sprites ? JSON.parse(pokemon_v2_pokemonsprites[0]?.sprites) : {};

  return {
    id,
    name: startCase(name.split('-').join(' ')),
    height,
    weight,
    imageUrl: spritesJSON?.other?.['official-artwork']?.front_default ? `${BASE_IMAGE_URL}/${id}.png` : null,
    image: {
      props: {
        id,
        name,
        defaultUrl: spritesJSON.front_default ? `${BASE_SPRITE_URL}/${id}.png` : null,
        shinyUrl: spritesJSON.front_shiny ? `${BASE_SHINY_SPRITE_URL}/${id}.png` : null,
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

export const formatPokemonMove = (move: IBaseMoveDatum): IBaseMove => ({
  id: move.id,
  level: move.level,
  name: startCase(move?.pokemon_v2_move?.name.split('-').join(' ')),
  type: startCase(move?.pokemon_v2_move?.pokemon_v2_type?.name || ''),
  power: move?.pokemon_v2_move?.power || '-',
  accuracy: move?.pokemon_v2_move?.accuracy || '-',
  generation: move?.pokemon_v2_move?.pokemon_v2_generation?.name?.split('-')[1].toUpperCase(),
  effect: move.pokemon_v2_move.pokemon_v2_moveeffect?.pokemon_v2_moveeffecteffecttexts[0]?.short_effect,
})

export const formatPokemonType = (type: ITypeQueryDatum): IType => ({
  id: type.type_id,
  name: capitalize(type.pokemon_v2_type.name),
});

export const formatSearchQuery = (search: string): string => {
  return search.trim().replace(/ /g, '-').toLowerCase();
}
