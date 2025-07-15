import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pokemon/:name', component: PokemonDetailComponent }
];
