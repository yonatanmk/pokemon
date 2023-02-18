import capitalize from 'lodash/capitalize';
import uniqBy from 'lodash/uniqBy';
import type { IPokemonRow, IPokemonQueryDatum, ITypeQueryDatum, IType, ISortField, IPokemonQueryAbility } from '../interfaces';

export const PAGE_SIZE = 20;

export const SORT_FIELDS = {
  ID: 'id' as ISortField,
  NAME: 'name' as ISortField,
  HEIGHT: 'height' as ISortField,
  WEIGHT: 'weight' as ISortField,
}

export const formatPokemonRow = (pokemonData: IPokemonQueryDatum): IPokemonRow => {
  const { id, name, height, weight, pokemon_v2_pokemonabilities, pokemon_v2_pokemontypes } = pokemonData;
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