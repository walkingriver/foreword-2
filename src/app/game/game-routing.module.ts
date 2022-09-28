import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameResolver } from '../game.resolver';

import { GamePage } from './game.page';

const routes: Routes = [
  {
    path: ':order',
    component: GamePage,
    resolve: {
      puzzle: GameResolver
    }
  },
  {
    path: ':order/:level',
    component: GamePage,
    resolve: {
      puzzle: GameResolver
    }
  },
  {
    path: '',
    redirectTo: '/game/4',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamePageRoutingModule {}
