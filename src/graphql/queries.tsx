import { gql } from "@apollo/client"

export const GET_POKEMON = gql`
query Pokemon(
  $offset: Int!,
  $limit: Int!,
  $nameSearch: String,
  $sortOrder: order_by,
  $sortById: Boolean!,
  $sortByName: Boolean!,
  $sortByHeight: Boolean!,
  $selectedTypes: [Int],
) {
  pokemon_v2_pokemon(
    limit: $limit, 
    offset: $offset, 
    where: {
      _and: [
        { id: { _lt: 10250 } }
        { name: { _like: $nameSearch } },
        { pokemon_v2_pokemontypes: { type_id: { _in: $selectedTypes } } }
      ]
    }
    order_by: {
      id: $sortOrder
    }
  ) @include(if: $sortById ) {
    id
    name
    height
    weight
    pokemon_v2_pokemonsprites (limit: 1) {
      sprites
    }
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
    pokemon_v2_pokemontypes {
      type_id
      pokemon_v2_type {
        name
      }
    }
  }
  pokemon_v2_pokemon(
    limit: $limit, 
    offset: $offset, 
    where: {
      _and: [
        { id: { _lt: 10250 } }
        { name: { _like: $nameSearch } },
        { pokemon_v2_pokemontypes: { type_id: { _in: $selectedTypes } } }
      ]
    }
    order_by: {
      name: $sortOrder
    }
  ) @include(if: $sortByName ) {
    id
    name
    height
    weight
    pokemon_v2_pokemonsprites (limit: 1) {
      sprites
    }
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
    pokemon_v2_pokemontypes {
      type_id
      pokemon_v2_type {
        name
      }
    }
  }
  pokemon_v2_pokemon(
    limit: $limit, 
    offset: $offset, 
    where: {
      _and: [
        { id: { _lt: 10250 } }
        { name: { _like: $nameSearch } },
        { pokemon_v2_pokemontypes: { type_id: { _in: $selectedTypes } } }
      ]
    }
    order_by: {
      height: $sortOrder
    }
  ) @include(if: $sortByHeight ) {
    id
    name
    height
    weight
    pokemon_v2_pokemonsprites (limit: 1) {
      sprites
    }
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
    pokemon_v2_pokemontypes {
      type_id
      pokemon_v2_type {
        name
      }
    }
  }
  pokemon_v2_pokemon_aggregate(
    where: {
      _and: [
        { id: { _lt: 10250 } },
        { name: { _like: $nameSearch } },
        { pokemon_v2_pokemontypes: { type_id: { _in: $selectedTypes } } }
      ]
    }
  ) {
    aggregate {
      count
    }
  }
}
`;

export const GET_POKEMON_TYPES = gql`
query PokemonTypes{
  pokemon_v2_pokemontype (distinct_on: type_id) {
    type_id
    pokemon_v2_type {
      name
    }
  }
}
`;

export const GET_POKEMON_FLAVOR = gql`
query getFlavorText(
  $pokemonId: Int,
) {
  pokemon_v2_pokemonspeciesflavortext (
    limit: 1,
    where: {
      _and: [
        { pokemon_species_id: { _eq: $pokemonId } },
        { language_id: { _eq: 9 } }
      ]
    }
  ) {
    pokemon_species_id
  	flavor_text
  }
}
`;


// export const GET_POKEMON_TYPE_FILTER = gql`
// query Pokemon(
//   $offset: Int!,
//   $nameSearch: String,
//   $typesList: [Int],
//   $typesListLength: Int,
// ) {
//   pokemon_v2_pokemon(
//     limit: ${PAGE_SIZE}, 
//     offset: $offset, 
//     where: {
//       _and: [
//         { name: { _like: $nameSearch } }
//         {
//           pokemon_v2_pokemontypes: {
//             type_id: {
//               _in: $typesList
//             }
//           }
//         }
//       ]
//     }
//   ) {
//     id
//     name
//     height
//     weight
//     pokemon_v2_pokemonabilities{
//       id
//       pokemon_v2_ability {
//         id
//         name
//         pokemon_v2_abilityeffecttexts(limit: 1, where: { language_id:{ _eq: 9 } }) {
//           short_effect
//           effect
//           language_id
//         }
//       }
//     }
//     pokemon_v2_pokemontypes {
//       type_id
//       pokemon_v2_type {
//         name
//       }
//     }
//   }
//   pokemon_v2_pokemon_aggregate(where: { name: { _like: $nameSearch } }) {
//     aggregate {
//       count
//     }
//   }
//   pokemon_v2_pokemontype (distinct_on: type_id) {
//     type_id
//     pokemon_v2_type {
//       name
//     }
//   }
// }
// `;

// export const GET_POKEMON_TYPE_FILTER = gql`
// query Pokemon(
//   $offset: Int!,
//   $nameSearch: String,
//   $typesList: [Int],
//   $typesListLength: Int,
// ) {
//   pokemon_v2_pokemon(
//     limit: ${PAGE_SIZE}, 
//     offset: $offset, 
//     where: {
//       _and: [
//         { name: { _like: $nameSearch } }
//         {
//           _or: [
//             {
//               pokemon_v2_pokemontypes: {
//                 type_id: {
//                   _in: $typesList
//                 }
//               }
//             }
//             { $typesListLength: { _gt: 0 } }
//           ]
//         }
//       ]
//     }
//   ) {
//     id
//     name
//     height
//     weight
//     pokemon_v2_pokemonabilities{
//       id
//       pokemon_v2_ability {
//         id
//         name
//         pokemon_v2_abilityeffecttexts(limit: 1, where: { language_id:{ _eq: 9 } }) {
//           short_effect
//           effect
//           language_id
//         }
//       }
//     }
//     pokemon_v2_pokemontypes {
//       type_id
//       pokemon_v2_type {
//         name
//       }
//     }
//   }
//   pokemon_v2_pokemon_aggregate(where: { name: { _like: $nameSearch } }) {
//     aggregate {
//       count
//     }
//   }
//   pokemon_v2_pokemontype (distinct_on: type_id) {
//     type_id
//     pokemon_v2_type {
//       name
//     }
//   }
// }
// `;

// export const GET_POKEMON_TYPE_FILTER = gql`
// query Pokemon(
//   $offset: Int!,
//   $nameSearch: String,
//   $typesList: [Int],
//   $typesListLength: Int,
// ) {
//   pokemon_v2_pokemon(
//     limit: ${PAGE_SIZE}, 
//     offset: $offset, 
//     where: {
//       _and: [
//         { name: { _like: $nameSearch } }
//         {
//           _or: [
//             {
//               pokemon_v2_pokemontypes: {
//                 type_id: {
//                   _in: $typesList
//                 }
//               }
//             }
//             { $typesListLength: { _gt: 0 } }
//           ]
//         }
//       ]
//     }
//   ) {
//     id
//     name
//     height
//     weight
//   }
// }
// `;
