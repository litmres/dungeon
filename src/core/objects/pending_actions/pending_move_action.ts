import { PendingTurnAction } from './pending_turn_actions';
import GameObject from '../game_object';
import Player from '../player';
import Env from '../../env';
import { TILE_CENTER, TILE_SIZE, GAME_OBJECT_FRAME_RATE, PLAYER_MOVE_SPEED } from '../../consts';
/**
* This action will move game object
*/
export class PendingMoveAction extends PendingTurnAction<GameObject> {
  protected targetTile : Phaser.Point;

  constructor(env: Env, owner : GameObject, targetTile : Phaser.Point) {
    super(env, owner);
    this.targetTile = targetTile;
  }

  protected buildMoveTween() : Phaser.Tween {
    var moveTween : Phaser.Tween = this.env.game.make.tween(this.owner);
    moveTween.to({
      x: this.targetTile.x * TILE_SIZE,
      y: this.targetTile.y * TILE_SIZE
    }, PLAYER_MOVE_SPEED);
    return moveTween;
  }

  protected performTurn() {
    var moveTween : Phaser.Tween = this.buildMoveTween();
    moveTween.onComplete.addOnce(() => { this.onCompleteSignal.dispatch() }, this);
    moveTween.start();
  }
}

/**
* The same as {PendingMoveAction} excepts it play step sound on move start
*/
export class PendingPlayerMoveAction extends PendingMoveAction {

  constructor(env : Env, owner : Player, targetTile : Phaser.Point) {
    super(env, owner, targetTile);
  }

  protected buildMoveTween() : Phaser.Tween {
    var moveTween : Phaser.Tween = super.buildMoveTween();
    moveTween.onStart.addOnce(() => {
      this.env.sounds.step.play();
    }, this)
    return moveTween;
  }
}

/**
* This action plays animation with player movement being blocked by something
*/
export class PendingPlayerMoveBlockedAction extends PendingTurnAction<GameObject> {
  protected targetTile : Phaser.Point;
  private tempPoint : Phaser.Point;
  constructor(env: Env, owner : Player, targetTile : Phaser.Point) {
    super(env, owner);
    this.targetTile = targetTile;
    this.tempPoint  = new Phaser.Point();
  }

  protected performTurn() {
    // calculate direction of movement
    this.tempPoint.set(this.targetTile.x, this.targetTile.y)
                  .subtract(this.owner.tilePosition.x, this.owner.tilePosition.y)
                  .normalize()
                  .multiply(TILE_CENTER, TILE_CENTER);

    //console.log(this.tempPoint);
    var moveTween : Phaser.Tween = this.env.game.make.tween(this.owner);
    moveTween.to({
      x: this.owner.position.x + this.tempPoint.x,
      y: this.owner.position.y + this.tempPoint.y
    }, PLAYER_MOVE_SPEED);
    moveTween.yoyo(true);
    moveTween.onComplete.addOnce(() => {
      this.onCompleteSignal.dispatch();
    });

    moveTween.start();
  }
}
