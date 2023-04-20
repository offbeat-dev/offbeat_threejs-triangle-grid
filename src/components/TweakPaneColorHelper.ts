export default class TweakPaneColorHelper {
  object: {
    [string] : 
  };
  prop: string;

  constructor(object: unknown, prop: string) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
