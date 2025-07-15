import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Pokemon {

  constructor(private http: HttpClient) { }

  getPokemons(limit = 15, offset = 0) {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonDetails(url: string) {
    return this.http.get<any>(url);
  }

  getPokemonDetailsByName(name: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
}
