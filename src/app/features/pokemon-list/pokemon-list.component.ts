import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../core/services/pokemon.service';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { PokemonDetails, PokemonListResult } from '../../shared/types/pokemon.model';

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

  constructor(private pokemonService: Pokemon) {}

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

    const randomOffset = Math.floor(Math.random() * 100);
    const limit = Math.floor(Math.random() * 6) + 10;

    this.pokemonService.getPokemons(limit, randomOffset).subscribe({
      next: (data) => {
        const list = data.results;

        const detailRequests = list.map((element: PokemonListResult) =>
          this.pokemonService.getPokemonDetails(element.url)
        );

        forkJoin(detailRequests as Observable<PokemonDetails>[]).subscribe({
          next: (results: PokemonDetails[]) => {
            this.pokemons = [...results];
            this.sortPokemons();
            console.log(this.pokemons);
            this.loading = false;
          }, 
          error: (error) => {
            if (error.status === 500) {
              this.errorMessage = 'Internal Server Error. Please try again later.'
            } else {
              this.errorMessage = 'Failed to load Pokemon details.';
            }
            console.error('Error fetching Pokemon details', error);
            this.loading = false;  
          }
        });
      }, 
      error: (error) => {
        if (error.status === 500) {
          this.errorMessage = 'Internal Server Error. Please try again later.'
        } else {        
          this.errorMessage = 'Failed to load Pokemon list.';
        }
        console.error('Error fetching Pokemon list', error);
        this.loading = false;
      }
    });
  }
}