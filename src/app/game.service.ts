import { Preferences } from '@capacitor/preferences';
import { Injectable } from '@angular/core';
import { Puzzle } from './puzzle';
import { games4 } from './games-4';
import { games3 } from './games-3';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentPuzzle: Puzzle;

  getCurrentPuzzle(): Puzzle {
    return this.currentPuzzle;
  }

  getByLevel(size: number, level: number): Puzzle {
    const puzzles = {
      3: games3,
      4: games4
      // 5: games5
    };

    this.currentPuzzle = puzzles[size][level];
    this.currentPuzzle.level = level;
    this.currentPuzzle.rows = this.getRows(this.currentPuzzle.solution[0], size);
    this.currentPuzzle.columns = this.getColumns(this.currentPuzzle.solution[0], size);
    this.currentPuzzle.order = size;

    return this.currentPuzzle;
  }

  getPuzzleCount(order: number = 4): number {
    if (order === 4) {
      return games4.length;
    } else if (order === 3) {
      return games3.length;
    }
    return 0;
  }

  async saveProgress(puzzle: Puzzle, score: number) {
    const size = puzzle.size / puzzle.solution.length;
    const progress: Map<number, number> = (await this.getHighestLevel()) || { size: 0 };
    // await Preferences.set('foreword-' + puzzle.solution[0].split('').sort(), score);
    progress[size] = Math.max(progress[size] || 0, puzzle.level);
    return Preferences.set({ key: 'foreword-highest-level', value: JSON.stringify(progress) });
  }

  async getHighestLevel(): Promise<any> {
    const entry = await Preferences.get({ key: 'foreword-highest-level' });
    return JSON.parse(entry.value);
  }

  getRows(arr, size) {
    const output = [];
    for (let i = 0; i < size; i++) {
      output.push(arr.substr(i * size, size));
    }
    return output;
  }

  getColumns(arr, size) {
    const output = [];
    for (let i = 0; i < size; i++) {
      const column = [];
      for (let j = 0; j < size; j++) {
        column.push(arr[j * size + i]);
      }
      output.push(column.join(''));
    }
    return output;
  }

  // private allPuzzles(): Puzzle[] {
  //   return [{ size: 4, 'solution': ['MADEAREADEAREARN'] },
  //   { 'size': 4, 'solution': ['RUSHUNTOSTEMHOME'] },
  //   { 'size': 4, 'solution': ['WILDIDEANESTDATE'] },
  //   { 'size': 4, 'solution': ['abetbabeebontend'] },
  //   { 'size': 4, 'solution': ['abetbabeebontent'] },
  //   { 'size': 4, 'solution': ['icedcaveevendent'] },
  //   { 'size': 4, 'solution': ['icedcaveevendeny'] },
  //   { 'size': 4, 'solution': ['icedcoveevendent'] },
  //   { 'size': 4, 'solution': ['icedcoveevendeny'] },
  //   { 'size': 8, 'solution': ['WIFEACIDLONGKNEE'] },
  //   { 'size': 8, 'solution': ['abetbabeerostent', 'abetbareebontest'] },
  //   { 'size': 8, 'solution': ['abetracemirestun', 'armsbaitecruteen'] },
  //   { 'size': 8, 'solution': ['cageheaturicmyth', 'chumaerygaitetch'] },
  //   { 'size': 8, 'solution': ['daftobeyclapketo', 'dockablefeattypo'] },
  //   { 'size': 8, 'solution': ['daftrileuricmyth', 'drumairyflittech'] },
  //   { 'size': 8, 'solution': ['daftuglypeakedge', 'dupeagedflagtyke'] },
  //   { 'size': 8, 'solution': ['iceddoveevenaery', 'ideacoveeverdeny'] },
  //   { 'size': 8, 'solution': ['iceddoveevensent', 'idescoveevendent'] },
  //   { 'size': 8, 'solution': ['iceddoveovenlent', 'idolcoveevendent'] },
  //   { 'size': 8, 'solution': ['massyeahtriohold', 'mythaerosailshod'] },
  //   { 'size': 8, 'solution': ['massyeahtriohole', 'mythaerosailshoe'] },
  //   { 'size': 8, 'solution': ['pactyeahroleonly', 'pyroaeoncallthey'] },
  //   { 'size': 8, 'solution': ['riotundostowtorn', 'rustintoodortown'] },
  //   { 'size': 8, 'solution': ['sackebonelsemete', 'seemablecostknee'] },
  //   { 'size': 8, 'solution': ['sackoboenudestep', 'sonsabutcodekeep'] },
  //   { 'size': 8, 'solution': ['sackoboenukestep', 'sonsabutcokekeep'] },
  //   { 'size': 8, 'solution': ['sackoboenullstep', 'sonsabutcolekelp'] },
  //   { 'size': 8, 'solution': ['wadeicedshaghere', 'wishachedearedge'] },
  //   { 'size': 8, 'solution': ['wadeicedsnaghere', 'wishacnedearedge'] },
  //   { 'size': 8, 'solution': ['wadeicedshagpyre', 'wispachydearedge'] },
  //   { 'size': 8, 'solution': ['wadereadaridposy', 'wrapaerodaiseddy'] },
  //   ];
  // }
}
