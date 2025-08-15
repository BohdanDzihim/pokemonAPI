import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonDetails, PokemonListResult } from '../../shared/types/pokemon.model';
import { from, mergeMap, catchError, EMPTY, toArray } from 'rxjs';

@Component({
  selector: 'app-root',
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

  fetchRandomPokemons(): void {
    this.loading = true;
    this.errorMessage = null;
  
    const offset = Math.floor(Math.random() * 100);
    const limit = Math.floor(Math.random() * 6) + 10;

    this.pokemonService.getPokemons(limit, offset).subscribe({
      next: (data) => {
        const list = data.results;
        const hasPikachu = list.some(e => e.name.toLowerCase() === 'pikachu');
        const requests = [
          ...(hasPikachu ? [] : [this.pokemonService.getPokemonDetails('https://pokeapi.co/api/v2/pokemon/25/')]),
          ...list.map((e: PokemonListResult) => this.pokemonService.getPokemonDetails(e.url))
        ];

        from(requests).pipe(
          mergeMap(req => req.pipe(catchError(() => EMPTY))),
          toArray()
        ).subscribe({
          next: (results) => {
            if (results.length > 0) {          
              this.pokemons = results;
              this.sortPokemons();
            } else {
              this.errorMessage = navigator.onLine ? "No details returned (requests failed)." : "Offline - Pokémon details weren't cached yet.";
            }
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = navigator.onLine
              ? 'Failed to load Pokémon details.'
              : 'Offline – some Pokémon aren’t cached yet.';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        if (!navigator.onLine) {
          this.errorMessage = "You're offline";
          return;
        }

        this.errorMessage = navigator.onLine
          ? 'Failed to load Pokémon list.'
          : 'Offline – Pokémon list not cached yet.';
        console.error(err);
      }
    });
  }
}