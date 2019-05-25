import { UIEvent, SelectEventArg } from './event'
import { IRecord, IAuthor } from './model';
import { IDropdownList, IList } from './control';

//#region - view
//只对需要和Presenter交互的部分做抽象，底层元素可能是会根据平台而变化，所以对上层隐藏
export interface IPresenterView {
  selectedEvent: UIEvent<SelectEventArg>;
  bindRecords<T extends IRecord>(data: Array<T>): void;
  bindAuthors<T extends IAuthor>(data: Array<T>): void;
}

export class PresenterView implements IPresenterView {
  selectedEvent: UIEvent<SelectEventArg>;
  dropdownList: IDropdownList<IAuthor>;
  list: IList<IRecord>;

  constructor() {
    this.dropdownList.selectedEvent.on(this.onAuthorSelected);
  }

  bindRecords<T extends IRecord>(data: T[]): void {
    this.list.data = data;
  }

  bindAuthors<T extends IAuthor>(data: T[]): void {
    this.dropdownList.data = data;
  }

  onAuthorSelected(arg: SelectEventArg) {
    this.selectedEvent.emit(arg);
  }
}
//#endregion

//#region - model 
export class RecordsRepos {
  private static data: Array<IRecord>;

  getRecords(): Array<IRecord> {
    return RecordsRepos.data;
  }

  getRecordsByAuthorName(name: string): Array<IRecord> {
    return RecordsRepos.data.filter(r => r.name === name);
  }
}

export class AuthorsRepos {
  private static data: Array<IAuthor>;

  getAuthors(): Array<IAuthor> {
    return AuthorsRepos.data;
  }
}
//#endregion

//#region - presenter
export class RecordsPresenter {
  recordsRepo: RecordsRepos;
  authorRepo: AuthorsRepos;
  view: IPresenterView;

  constructor(view: IPresenterView) {
    this.view = view;
    this.view.bindAuthors(this.authorRepo.getAuthors());
    this.view.bindRecords(this.recordsRepo.getRecords());
    this.view.selectedEvent.on(this.onAuthorSelected);
  }

  onAuthorSelected(arg: SelectEventArg) {
    let records = this.recordsRepo.getRecordsByAuthorName(arg.name);
    this.view.bindRecords(records);
  }
}
//#endregion