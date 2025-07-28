export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
}

export interface PokemonDetails {
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      }
    }
  };
  types: PokemonType[];
  moves: PokemonMove[];
}

export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListResult[];
}
