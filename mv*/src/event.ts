export interface UIEventArg {
  target: object
}

export class SelectEventArg implements UIEventArg {
  target: object;
  name: string;
}

export type UIEventHandler<T extends UIEventArg> = (args: T) => void

export class UIEvent<T extends UIEventArg> {

  subs: Array<UIEventHandler<T>>;

  constructor() {
    this.subs = [];
  }

  on(cb: UIEventHandler<T>) {
    this.subs.push(cb);
  }

  off(cb: UIEventHandler<T>) {
    let index: number = this.subs.findIndex(handler => handler === cb);

    if (index > -1) {
      this.subs.splice(index, 1);
    }
  }

  emit(args: T) {
    this.subs.forEach(handler => {
      handler(args);
    });
  }
}