import { Routes } from '@angular/router';
import { PokemonList } from './features/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './features/pokemon-detail/pokemon-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: PokemonList },
  { path: 'pokemon/:name', component: PokemonDetailComponent },
  { path: '**', redirectTo: '/pokemon' }
];
