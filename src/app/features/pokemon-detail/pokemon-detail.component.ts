import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../core/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonDetails } from '../../shared/types/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule, RouterModule, TitleCasePipe],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.scss'
})
export class PokemonDetailComponent implements OnInit {
  pokemon!: PokemonDetails;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: Pokemon
  ) {}

  ngOnInit(): void {
    this.errorMessage = null;
    const name = this.route.snapshot.paramMap.get('name');

    if (name) {
      this.pokemonService.getPokemonDetailsByName(name).subscribe({
        next: data => {
          this.pokemon = data;
        }, error: (error) => {
          if (error.status === 500) {
            this.errorMessage = 'Internal Server Error. Please try again later.'
          } else {
            this.errorMessage = 'Failed to load Pokemon details.';
          }
          console.error('Error fetching Pokemon details', error);
        }
      });
    }
  }
}
