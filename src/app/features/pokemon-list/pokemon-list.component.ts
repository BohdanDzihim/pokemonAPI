import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonDetails, PokemonListResult } from '../../shared/types/pokemon.model';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonList implements OnInit {
  pokemons: PokemonDetails[] = [];
  sortBy: 'name' | 'moves' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.fetchRandomPokemons();
  }

  sortPokemons() {
    const multiplier = this.sortDirection === 'asc' ? 1 : -1;

    const sorted = [...this.pokemons].sort((a, b) => {
      if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name) * multiplier;
      } else if (this.sortBy === 'moves') {
        const moveA = a.moves?.[0]?.move?.name || '';
        const moveB = b.moves?.[0]?.move?.name || '';
        return moveA.localeCompare(moveB) * multiplier;
      }
      return 0;
    })

    this.pokemons = sorted;
  }

  hasDefaultPokemon(list: PokemonListResult[]): boolean {
    return list.some(pokemon => pokemon.name?.toLowerCase() === PokemonService.DEFAULT_POKEMON);
  }

  randomizeOffsetAndLimit(): { offset: number, limit: number} {
    const offset = Math.floor(Math.random() * 100);
    const limit = Math.floor(Math.random() * 6) + 10;
    return {offset, limit};
  }

  setSortOrder(order: 'name' | 'moves', sortDirection: 'asc' | 'desc' = 'asc'
  ) {
    this.sortDirection = sortDirection === 'asc' ? 'asc' : 'desc';
    this.sortBy = order;
    this.sortPokemons();
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const [sortBy, sortDirection] = value.split('-') as ['name' | 'moves', 'asc' | 'desc']

    this.setSortOrder(sortBy, sortDirection);
  }

  private handleError = (customMessage?: string) => (error: any): void => {
    this.loading = false;

    if (!navigator.onLine) {
      this.errorMessage = "You're offline. Please check your internet connection.";
      console.error('Offline error:', error);
      return;
    }

    this.errorMessage = customMessage || 'An error occurred. Please try again.';
    console.error('Error', error);
  }

  private handleNext = () => (results: PokemonDetails[]): void => {
    if (results.length > 0) {          
          this.pokemons = results;
          this.sortPokemons();
        } else {
          this.errorMessage = navigator.onLine ? "No details returned (requests failed)." : "Offline - Pokémon details weren't cached yet.";
        }
        this.loading = false;
  }

  fetchRandomPokemons(): void {
    this.loading = true;
    this.errorMessage = null;

    const { offset, limit } = this.randomizeOffsetAndLimit();

    this.pokemonService.getPokemons(limit, offset).pipe(
      switchMap((data) => {
        const requests = data.results.map((e: PokemonListResult) => this.pokemonService.getPokemonDetailsByName(e.name));
        
        if (!this.hasDefaultPokemon(data.results)) {
          requests.push(this.pokemonService.getPokemonDetailsByName(PokemonService.DEFAULT_POKEMON));
        }
        return forkJoin(requests);
      })
    ).subscribe({
      next: this.handleNext(),      
      error: this.handleError(),
    });
  }
}