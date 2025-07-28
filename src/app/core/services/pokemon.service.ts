import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PokemonDetails, PokemonListResponse } from '../../shared/types/pokemon.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Pokemon {

  constructor(private http: HttpClient) { }

  getPokemons(limit: number, offset: number): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(url: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(url);
  }

  getPokemonDetailsByName(name: string): Observable<PokemonDetails> {
    return this.http.get<PokemonDetails>(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
}
