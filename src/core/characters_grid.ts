import Character from './objects/character';
import Level from './level';
/**
* Contains grid of all characters in level
*/
export default class CharactersGrid {
  private _grid : Character[][];
  private columns : number;
  private rows    : number;

  constructor(level : Level) {
    this.columns = level.width;
    this.rows    = level.height;

    this._grid   = [];

    for (let column = 0; column < this.columns; column++) {
      this._grid.push(new Array(this.rows));
    }
  }

  /**
  * Set character in grid
  */
  public set(x : number, y : number, character : Character) {
    this._grid[x][y] = character;
  }

  /**
  * Return character for passed tile position
  */
  public get(x : number, y : number) : Character {
    return this._grid[x][y];
  }
}
