import Character from './character';
import GameObject from './game_object';
import { TILE_CENTER, GAME_OBJECT_FRAME_RATE, TILE_SIZE, PLAYER_MOVE_SPEED, MOVE_ARRAY } from '../consts';
import DungeonScreen from '../screens/dungeon_screen';
import { PendingTurnAction } from './pending_actions/pending_turn_actions';
import { PendingMoveAction } from './pending_actions/pending_move_action';
/**
* Monster object
*/
export default class Mob extends Character {
  private idleAnimation : Phaser.Animation;

  constructor(screen : DungeonScreen, spriteKey: string, parent? : PIXI.DisplayObjectContainer) {
    super(screen, parent);
    this.sprite = this.game.add.sprite(TILE_CENTER, TILE_CENTER, spriteKey, null, this);
    this.sprite.anchor.set(0.5,0.5);
    this.sprite.autoCull = true;

    this.idleAnimation = this.sprite.animations.add('idle', [0, 1], GAME_OBJECT_FRAME_RATE, true);
    this.idleAnimation.play();
  }

  /**
  * Monster logic goes here.
  */
  public takeTurn() : PendingTurnAction<GameObject> {
    return null;
  }

  /**
  * Creates move action for {GameObject}
  * @param target - place to go on map in tile position
  */
  public move(target : Phaser.Point) : PendingMoveAction {
    this.virtualPosition.set(target.x, target.y);
    return new PendingMoveAction(this.game, this, target);
  }

  /**
  * Move Mob in random position that is passable and not occupied by another monster
  */
  public wander() : PendingMoveAction {
    var nextTilePos : Phaser.Point = new Phaser.Point();
    nextTilePos.set(this.virtualPosition.x, this.virtualPosition.y);
    var dir : Phaser.Point       = Phaser.ArrayUtils.getRandomItem(MOVE_ARRAY, 0, MOVE_ARRAY.length);
    nextTilePos.add(dir.x, dir.y);
    if (this.isPassable(nextTilePos)) {
      return this.move(nextTilePos);
    } else {
      return null;
    }
  }
}
