import Base from './base';


interface StateTable<T> {
  [key: string]: T;
}

/**
* Simple state machine
*/
export default class FSM<T> {
  public context: T;
  private _currentStateKey: string;
  private _nextStateKey: string;

  private states: StateTable<Base<T>> = {};

  constructor(context: T) {
    this.context = context;
  }

  /**
  * Registers new state for key
  * @param key a key that will be used to find state
  * @param state instance
  */
  public register(state : number, instance : Base<T>) {
    this.states[this.stateKey(state)] = instance;
  }

  /**
  * Generate state number
  * @param state number
  * @return state key
  */
  private stateKey(state : number) : string {
    return `state_${state}`;
  }

  /**
  * Switches current state
  * @param targetState key
  */
  public enter(state: number) {
    if (this._nextStateKey == null) {
      this._nextStateKey = this.stateKey(state);
    } else {
      throw "There is already pending state!!!!!";
    }
  }

  /**
  * Update state machine
  * @param delta time
  */
  public update(delta : number) {
    if (this._nextStateKey != null) {
      if (this._currentStateKey != null) {
        this.states[this._currentStateKey].onExit();
      }
      this._currentStateKey = this._nextStateKey;
      this.states[this._currentStateKey].setup(this);
      this.states[this._currentStateKey].onEnter();
      this._nextStateKey = null;
    }

    if (this._currentStateKey != null) {
      this.states[this._currentStateKey].onUpdate(delta);
    }
  }
}