import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  pokemons: any[] = [];
  sortBy: 'name' | 'moves' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = false;

  constructor(private pokemonService: Pokemon) {}

  ngOnInit(): void {
    this.loading = true;
    this.pokemonService.getPokemons().subscribe((data) => {
      const list = data.results;

      const detailRequests = list.map((element: any) =>
        this.pokemonService.getPokemonDetails(element.url)
      );
      forkJoin(detailRequests as Observable<any>[]).subscribe((results: any[]) => {
        this.pokemons = [...results];
        this.sortPokemons();
        this.loading = false;
      });
    });
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
    const randomOffset = Math.floor(Math.random() * 100);
    const limit = Math.floor(Math.random() * 6) + 10;

    this.pokemonService.getPokemons(limit, randomOffset).subscribe((data) => {
      const list = data.results;

      const detailRequests = list.map((element: any) =>
        this.pokemonService.getPokemonDetails(element.url)
      );

      forkJoin(detailRequests as Observable<any>[]).subscribe((results: any[]) => {
        this.pokemons = [...results];
        this.sortPokemons();
        this.loading = false;
      })
    })
  }
}
