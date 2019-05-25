import { IRecord, IAuthor } from './model';
import { UIEvent, UIEventArg, SelectEventArg } from './event';
import { IDropdownList, IList } from './control';

//#region - models

export class RecordChangeEventArg implements UIEventArg {
  target: object;
  data: Array<IRecord>;

  constructor(args: Array<IRecord>) {
    this.data = args;
  }
}

export class ObservableRecords {
  private static data: Array<IRecord>;
  changeEvent: UIEvent<RecordChangeEventArg>;

  getRecords(): Array<IRecord> {
    return ObservableRecords.data;
  }

  getRecordsByAuthorName(name: string): Array<IRecord> {
    return ObservableRecords.data.filter(r => r.name === name);
  }

  updateRecordsByAuthorName(name: string): void {
    this.changeEvent.emit(new RecordChangeEventArg(this.getRecordsByAuthorName(name)));
  }
}

export class ObservableAuthors {
  private static data: Array<IAuthor>;

  getAuthors(): Array<IAuthor> {
    return ObservableAuthors.data;
  }
}

//#endregion

//#region -view
export class View {
  private recordModel: ObservableRecords;
  private authorModel: ObservableAuthors;
  private dropdownList: IDropdownList<IAuthor>;
  private list: IList<IRecord>;

  selectChange: UIEvent<SelectEventArg>

  constructor() {
    this.recordModel.changeEvent.on(this.bindRecords);
    this.dropdownList.selectedEvent.on(this.onSelectChange);

    this.dropdownList.data = this.authorModel.getAuthors();
    this.list.data = this.recordModel.getRecords();
  }

  bindRecords(args: RecordChangeEventArg) {
    this.list.data = args.data;
  }

  onSelectChange(args: SelectEventArg) {
    this.selectChange.emit(args);
  }
}
//#endregion

//#region - controller
export class Controller {
  private recordModel: ObservableRecords;
  private view: View;

  constructor() {
    this.view.selectChange.on(this.updateRecords);
  }

  updateRecords(args: SelectEventArg) {
    this.recordModel.updateRecordsByAuthorName(args.name);
  }
}
//#endregion