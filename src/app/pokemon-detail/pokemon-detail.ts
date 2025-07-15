import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule, RouterModule, TitleCasePipe],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss'
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: Pokemon
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.pokemonService.getPokemonDetailsByName(name).subscribe(data => {
        this.pokemon = data;
      });
    }
  }
}
