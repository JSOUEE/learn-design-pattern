import { UIEvent, SelectEventArg } from './event';

export interface IControl {
  id: string;
  dispose(): void;
}

export interface IDropdownList<T> extends IControl {
  selectedEvent: UIEvent<SelectEventArg>;
  data: Array<T>
}

export interface IList<T> extends IControl {
  data: Array<T>
}