import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { GameService } from './game.service';
import { Puzzle } from './puzzle';

@Injectable({
  providedIn: 'root'
})
export class GameResolver implements Resolve<Puzzle> {
  gameSize = 0;
  levelToLoad = 0;
  levelRequested: number | 'random' = 'random';

  constructor(private games: GameService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Puzzle> {
    const progress = (await this.games.getHighestLevel()) || { 3: 0, 4: 0, 5: 0 };
    this.gameSize = +route.params.order;
    this.levelRequested = route.params.level;

    if (this.levelRequested === 'random') {
      this.levelToLoad = Math.floor(Math.random() * this.games.getPuzzleCount(this.gameSize));
    }

    if (!this.levelToLoad) {
      if (progress[this.gameSize]) {
        this.levelToLoad = progress[this.gameSize] + 1;
      } else {
        this.levelToLoad = 1;
      }
    }

    const puzzle = this.loadLevel(this.levelToLoad);

    return puzzle;
  }


  loadLevel(level: number): Puzzle {
    const puzzle = this.games.getByLevel(this.gameSize, level);
    return puzzle;
  }
}
