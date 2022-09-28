import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { GameService } from './game.service';
import { Puzzle } from './puzzle';

@Injectable({
  providedIn: 'root'
})
export class GameResolver implements Resolve<Puzzle> {
  gameSize = 0;
  level = 0;

  constructor(private games: GameService) {

  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Puzzle> {
    const progress = (await this.games.getHighestLevel()) || { 3: 0, 4: 0, 5: 0 };
    this.gameSize = route.params.order;
    this.level = route.params.level;

    if (!this.level) {
      if (progress[this.gameSize]) {
        this.level = progress[this.gameSize] + 1;
      } else {
        this.level = 1;
      }
    }

    const puzzle = this.loadLevel(this.level);

    return puzzle;
  }


  loadLevel(level: number): Puzzle {
    const puzzle = this.games.getByLevel(this.gameSize, level);
    return puzzle;
  }
}
