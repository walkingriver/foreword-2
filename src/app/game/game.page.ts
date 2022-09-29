import { Component, isDevMode, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { GameService } from '../game.service';
import { Puzzle } from '../puzzle';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  puzzle: Puzzle =
    {
      level: 0,
      size: 4,
      solution: ['MADEAREADEAREARN']
      // solution: ['FOURWORDACESMAST']
    };

  letters = []; // this.puzzle.solution.split('').sort();
  totalMoves = 0;
  isDebugging: boolean = isDevMode();
  isMuted: boolean;
  gameSize = 4;

  gameBoard = [
    ['*', '*', '*', '*'],
    ['*', '*', '*', '*'],
    ['*', '*', '*', '*'],
    ['*', '*', '*', '*'],
  ];

  hintClasses = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];

  hintsActive = false;
  isDragging = false;
  gameOver: boolean;
  isRecycling: boolean;
  dropSounds: HTMLAudioElement[] = [];
  shuffleSound: HTMLAudioElement;
  soundFiles = 4;
  order: number;
  isiOS: boolean;

  constructor(
    private alertController: AlertController,
    private games: GameService,
    private platform: Platform,
    private router: Router,
    route: ActivatedRoute) {
    this.puzzle = route.snapshot.data.puzzle;
    this.gameSize = route.snapshot.params.order;
  }

  async ngOnInit() {
    await this.platform.ready();
    this.isiOS = this.platform.is('ios');
    this.loadSounds();

    this.newGame();
  }

  async loadSounds(): Promise<void> {
    this.dropSounds['boardboard'] = new Audio('./assets/sounds/boardboard.wav');
    this.dropSounds['boardshelf'] = new Audio('./assets/sounds/boardshelf.wav');
    this.dropSounds['shelfboard'] = new Audio('./assets/sounds/shelfboard.wav');
    this.dropSounds['shelfshelf'] = new Audio('./assets/sounds/shelfshelf.wav');
    this.shuffleSound = new Audio('./assets/sounds/shuffle.wav');
  }

  loadLevel(level: number) {
    // this.puzzle = this.games.getByLevel(this.gameSize, level);
    // this.newGame();
    this.router.navigate(['/game', this.gameSize, level]);
  }

  async newGame() {
    if (!this.isMuted) {
      try {
        await this.shuffleSound.play();
      } catch (error) {
        // We can ignore this error.
      }
    }

    this.gameOver = false;
    this.totalMoves = 0;

    // This will either compute to 3, 4, or 5.
    const square = this.puzzle.size / this.puzzle.solution.length;

    this.gameBoard = [];
    this.hintClasses = [
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
    ];

    for (let i = 0; i < square; i++) {
      const row = [];
      for (let j = 0; j < square; j++) {
        row.push('*');
      }
      this.gameBoard.push(row);
    }

    this.letters = this.puzzle.solution[0].split('').sort();

    if (this.puzzle.level % 3 === 0) {
      this.launchInterstitial();
    }
  }

  launchInterstitial() {
  }

  resetGame() {
    if (this.totalMoves) {
      this.presentAlertConfirm(() => this.newGame());
    } else {
      this.newGame();
    }
  }

  homePage() {
    if (this.totalMoves) {
      this.presentAlertConfirm(() => this.goHome());
    } else {
      this.goHome();
    }
  }

  goHome() {
    this.router.navigateByUrl('/');
  }

  async presentAlertConfirm(successFn) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'This will reset your game in progress.',
      cssClass: 'panel',
      buttons: [
        {
          text: 'Nevermind',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            successFn();
          }
        }
      ]
    });

    await alert.present();
  }

  async winLevel() {
    this.isRecycling = true;
    this.gameOver = false;
    setTimeout(() => {
      this.gameBoard = this.puzzleToGameBoard(this.puzzle);
      this.gameBoard[0][0] = '*';
      this.letters = [];
      this.letters.push(this.puzzle.solution[0][0]);
      this.isRecycling = false;
    }, 1000);
  }

  puzzleToGameBoard(puzzle): string[][] {
    const size = Math.sqrt(puzzle.solution[0].length);
    const board: string[][] = [];
    const letters: string[] = puzzle.solution[0].split('');

    letters.forEach((v, i) => {
      const row = Math.floor(i / size);
      const col = i % size;
      if (col === 0) {
        board[row] = [];
      }
      board[row][col] = v;
    });

    return board;
  }

  testGame() {
    return this.gameBoardToString() === this.puzzle.solution[0];
  }

  gameBoardToString() {
    let board = '';
    this.gameBoard.forEach((row) => {
      board += row.join('');
    });

    return board;
  }

  url(val: string) {
    const letter = val.toLowerCase();
    return `./assets/images/${letter}.png`;
  }

  canDrag(val) {
    return !this.gameOver && (/[A-Za-z]/.test(val));
  }

  dragOver(ev) {
    // console.log('Drag Over: ', ev.target);
    ev.preventDefault();
    ev.stopPropagation();
  }

  dragStart(ev, source, row, col, letter) {
    // dragStart($event, 'board', row, col, c)
    this.isDragging = true;

    // Set the drag's format and data. Use the event target's id for the data.
    const dropSource = {
      set: source,
      row,
      col,
      letter
    };

    ev.dataTransfer.setData('text/json', JSON.stringify(dropSource));
    ev.dataTransfer.effectAllowed = 'move';
  }

  dragEnter(ev) {
    ev.preventDefault();
    ev.stopPropagation(); // stop it here to prevent it bubble up
    const element = ev.currentTarget as HTMLElement;
    if (element) {
      element.classList.add('hover');
    }
    // console.log('Enter:', ev);
  }

  dragLeave(ev: DragEvent) {
    ev.stopPropagation(); // stop it here to prevent it bubble up
    const element = ev.currentTarget as HTMLElement;
    if (element) {
      element.classList.remove('hover');
    }
    // console.log('Leave:', ev);
  }

  dragEnd(ev) {
    this.isDragging = false;
    const elements = document.getElementsByClassName('hover');
    Array.from(elements).forEach((e) => e.classList.remove('hover'));
    // console.log('End:', ev.dataTransfer.dropEffect);
  }

  async drop(ev, dest, row, col) {
    // drop($event, 'board', row, col)
    ev.preventDefault();
    // console.log(ev);

    // Get the data, which is the id of the drop target
    const dropSource = JSON.parse(ev.dataTransfer.getData('text/json'));
    const dropDest = { set: dest, row, col };
    // console.log('Dropped: ', dropSource, dropDest);

    await this.swapTiles(dropSource, dropDest);
    this.hintsActive = false;

    this.dragEnd(ev);

    if (this.testGame()) {
      this.gameOver = true;
      await this.games.saveProgress(this.puzzle, this.totalMoves);
    }
  }

  isLetter(val) {
    return (/[A-Za-z]/.test(val));
  }

  async swapTiles(source, destination) {
    const swapFn = {
      boardboard: (src, dest) => {
        // Dragging a tile from one game board cell to another.
        this.gameBoard[src.row][src.col] = this.gameBoard[dest.row][dest.col];
        this.gameBoard[dest.row][dest.col] = src.letter;
        this.totalMoves++;
      },
      shelfshelf: (src, dest) => {
        // No-op
      },
      shelfboard: (src, dest) => {
        // Dragging a tile from the shelf to the game board.
        const tmp = this.gameBoard[dest.row][dest.col];
        this.gameBoard[dest.row][dest.col] = this.letters[src.row];
        if (this.isLetter(tmp)) {
          // Swap
          this.letters[src.row] = tmp;
        } else {
          // Remove it
          this.letters.splice(src.row, 1);
        }
        this.totalMoves++;
      },
      boardshelf: (src, dest) => { // Dragging a tile from the game board to the shelf.
        this.letters.push(this.gameBoard[src.row][src.col]);
        this.gameBoard[src.row][src.col] = '*';
        this.totalMoves++;
      }
    };

    const funcKey = source.set + destination.set;
    swapFn[funcKey](source, destination);

    if (!this.isMuted) {
      try {

        await this.dropSounds[funcKey].play();
      } catch (e) {
        // It's OK to ignore a sound play error
      }
    }
  }

  async toggleHints(gameBoard, puzzle: Puzzle) {
    this.hintsActive = !this.hintsActive;

    console.table(gameBoard);

    for (let row = 0; row < puzzle.order; row++) {
      console.log('Puzzle Row: ', puzzle.rows[row]);
      for (let column = 0; column < puzzle.order; column++) {
        this.setHintClass(row, column, puzzle, gameBoard[row][column]);
      }
    }

    console.table(this.hintClasses);
  }

  setHintClass(row, column, puzzle, letter) {
    const isLetter = /[A-Za-z]/.test(letter);
    if (!isLetter) {
      this.removeClass(row, column);
      return;
    }

    console.log(`Letter at ${row}, ${column} is ${letter}`);
    console.log(`Letter in puzzle at ${row}, ${column} is ${puzzle.rows[row][column]}`);
    const puzzleRow = puzzle.rows[row];
    const puzzleColumn = puzzle.columns[column];
    console.log('This row is ' + puzzleRow);
    console.log('This column is ' + puzzleColumn);

    if (!puzzleColumn || !puzzleRow) {
      // eslint-disable-next-line no-debugger
      debugger;
      return;
    }

    let hintClass = '';

    const isCorrectRow = puzzleRow.includes(letter);
    const isCorrectColumn = puzzleColumn.includes(letter);
    const isCorrect = puzzleRow[column] === letter && puzzleColumn[row] === letter;

    if (isCorrect) {
      console.log('Correct');
      hintClass = 'hint-correct';
    } else if (isCorrectRow || isCorrectColumn) {
      console.log('Close');
      hintClass = 'hint-close';
    } else {
      console.log('Incorrect');
      hintClass = 'hint-incorrect';
    }

    this.setClass(row, column, hintClass);
  }

  removeClass(row, column) {
    this.hintClasses[row][column] = '';
  }

  setClass(row, column, className: string) {
    if (className) {
      this.hintClasses[row][column] = className;
    }
  }
}
