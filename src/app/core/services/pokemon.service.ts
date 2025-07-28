import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PokemonDetails, PokemonListResponse } from '../../shared/types/pokemon.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Pokemon {
  constructor(private http: HttpClient) { }

  static readonly BASE_URL = 'https://pokeapi.co/api/v2/';
  static readonly ENDPOINTS = {
    POKEMON: 'pokemon',
  } as const;

  getPokemons(limit: number, offset: number): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${Pokemon.BASE_URL}${Pokemon.ENDPOINTS.POKEMON}?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(url: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(url);
  }

  getPokemonDetailsByName(name: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`${Pokemon.BASE_URL}${Pokemon.ENDPOINTS.POKEMON}/${name}`);
  }
}
