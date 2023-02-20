import { 
  formatPokemonRow,
  formatPokemonType,
  formatSearchQuery,
  BASE_SPRITE_URL,
  BASE_SHINY_SPRITE_URL,
  BASE_IMAGE_URL 
} from '../index';
import type { IPokemonQueryDatum, ITypeQueryDatum } from '../../interfaces';

describe('Util', () => {
  describe('formatPokemonRow', () => {
    const mockPokemonData = {
      id: 1111,
      name: 'test pokemon',
      height: 78,
      weight: 23435,
      pokemon_v2_pokemonsprites: [],
      pokemon_v2_pokemonabilities: [],
      pokemon_v2_pokemontypes: [],
    } as IPokemonQueryDatum;

    it('formats basic fields correctly', async () => {
      const formattedPokemon = formatPokemonRow(mockPokemonData);
      expect(formattedPokemon.id).toEqual(mockPokemonData.id);
      expect(formattedPokemon.name).toEqual('Test Pokemon');
      expect(formattedPokemon.height).toEqual(mockPokemonData.height);
      expect(formattedPokemon.weight).toEqual(mockPokemonData.weight);
      expect(formattedPokemon.imageUrl).toEqual(null);
      expect(formattedPokemon?.image?.props?.id).toEqual(mockPokemonData.id);
      expect(formattedPokemon?.image?.props?.name).toEqual(mockPokemonData.name);
      expect(formattedPokemon?.image?.props?.defaultUrl).toEqual(null);
      expect(formattedPokemon?.image?.props?.shinyUrl).toEqual(null);
    })

    it('formats sprite fields correctly', async () => {
      const spriteJSON = {
        "front_default": "front_default",
        "front_shiny": "front_shiny",
        "other" : {
          "official-artwork": {
            "front_default": "official_front_default",
          }
        }
      }
      const mockSpritePokemonData = {
        ...mockPokemonData,
        pokemon_v2_pokemonsprites: [
          {
            sprites: JSON.stringify(spriteJSON),
          },
        ],
      }
      const formattedPokemon = formatPokemonRow(mockSpritePokemonData);
      expect(formattedPokemon?.imageUrl).toEqual(`${BASE_IMAGE_URL}/${mockSpritePokemonData.id}.png`);
      expect(formattedPokemon?.image?.props?.defaultUrl).toEqual(`${BASE_SPRITE_URL}/${mockSpritePokemonData.id}.png`);
      expect(formattedPokemon?.image?.props?.shinyUrl).toEqual(`${BASE_SHINY_SPRITE_URL}/${mockSpritePokemonData.id}.png`);
    })
    describe('formats abilities', () => {
      const mockAbilityPokemonData = {
        ...mockPokemonData,
        pokemon_v2_pokemonabilities: [
          {
            id: 123412,
            pokemon_v2_ability: {
              id: 123412,
              name: 'test ability name',
              pokemon_v2_abilityeffecttexts: [
                {
                  effect: 'test effect',
                  short_effect: 'test short effect',
                }
              ]
            }
          },
          {
            id: 123413,
            pokemon_v2_ability: {
              id: 123413,
              name: 'test ability name 2',
              pokemon_v2_abilityeffecttexts: [
                {
                  effect: 'test effect 2',
                  short_effect: 'test short effect 2',
                }
              ]
            }
          },
        ],
      }

      it('formats abilities correctly', async () => {
        const formattedPokemon = formatPokemonRow(mockAbilityPokemonData);
        expect(formattedPokemon.abilities.props.abilities.length).toEqual(2);
        expect(formattedPokemon.abilities.props.abilities[0].id).toEqual(mockAbilityPokemonData.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.id);
        expect(formattedPokemon.abilities.props.abilities[0].name).toEqual(mockAbilityPokemonData.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.name);
        expect(formattedPokemon.abilities.props.abilities[0].effect).toEqual(mockAbilityPokemonData.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].effect);
        expect(formattedPokemon.abilities.props.abilities[0].short_effect).toEqual(mockAbilityPokemonData.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].short_effect);
      })

      it('filters out duplicate abilities', async () => {
        const formattedPokemon = formatPokemonRow({
          ...mockAbilityPokemonData,
          pokemon_v2_pokemonabilities: [
            mockAbilityPokemonData.pokemon_v2_pokemonabilities[0],
            mockAbilityPokemonData.pokemon_v2_pokemonabilities[0],
          ]
        });
        expect(formattedPokemon.abilities.props.abilities.length).toEqual(1);
        expect(formattedPokemon.abilities.props.abilities[0].id).toEqual(mockAbilityPokemonData.pokemon_v2_pokemonabilities[0].pokemon_v2_ability.id);
      })
    })
  })

  describe('formatPokemonType', () => {
    it('formats correctly', async () => {
      const type = {
        type_id: 123,
        pokemon_v2_type: {
          name: 'test',
        },
      } as ITypeQueryDatum;
      const formattedType = formatPokemonType(type);
      expect(formattedType.id).toEqual(type.type_id);
      expect(formattedType.name).toEqual('Test');
    })
  })

  describe('formatSearchQuery', () => {
    it('returns a string', async () => {
      expect(formatSearchQuery('applebanana')).toEqual('applebanana');
    })
    it('traims strings', async () => {
      expect(formatSearchQuery('     applebanana    ')).toEqual('applebanana');
    })
    it('replaces internal spaces with dashes', async () => {
      expect(formatSearchQuery('apple banana')).toEqual('apple-banana');
    })
    it('makes all characters lower case', async () => {
      expect(formatSearchQuery('AppLebaNana')).toEqual('applebanana');
    })
  })
})

