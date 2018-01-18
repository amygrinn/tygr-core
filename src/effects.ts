import { Action, Store } from 'redux';

import { Observable } from "rxjs/Observable";

export type Effects = (actions$: Observable<Action>, store: Store<any>, service?: any) => void;