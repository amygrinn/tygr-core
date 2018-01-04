import { Observable } from 'rxjs/Observable';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {
  Action,
  Store,
  createStore,
  applyMiddleware,
  combineReducers,
  Unsubscribe,
  compose,
  Reducer,
  Middleware,
} from 'redux';

import { StoreConfig } from './store-config';

import { effectsMiddleware } from './effects.middleware';

declare var window: any;

export class TygrStoreSingleton implements Store<any> {

  private store: Store<any>;

  private configs = [];

  private middlewares: Middleware[] = [effectsMiddleware];

  private defaultReducer: Reducer<null> = (state, action) => null;

  private composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  constructor() {
    this.store = this.createStore()
  }

  public injectConfig(config: StoreConfig<any>) {
    if (!this.has(config)) {
      this.configs.push(config);
      this.refreshReducer();
    } else {
      console.error('Configuration already exists in store, did you import it into two modules?');
    }
  }

  public injectMiddleware(middleware: Middleware) {
    this.middlewares.push(middleware);
    this.store = this.createStore();
  }

  public select<T>(selector: (state) => T): T {
    return selector(this.getState());
  }

  public select$<T>(selector: (state) => T): Observable<T> {
    return bindCallback(this.subscribe)()
      .map(() => selector(this.getState()));
  }

  public has(...configs: StoreConfig<any>[]): boolean {

    if (this.configs.length > 0) {

      configs.forEach((config: StoreConfig<any>) => {

        if (!this.configs.find(
          (c: StoreConfig<any>) => config.equals(c)
        )) {
          return false;
        }
      });

      return true;
    }

    return false;
  }

  public dispatch(action) {
    return this.store.dispatch({ ...action });
  }

  public getState() {
    return this.store.getState();
  }

  public subscribe(listener) {
    return this.store.subscribe(listener);
  }

  public replaceReducer(reducer: Reducer<any>) {
    return this.store.replaceReducer(reducer);
  }

  private createStore(): Store<any> {
    return createStore(
      this.getReducer(),
      this.store
        ? this.store.getState()
        : null,
      this.composeEnhancers(
        applyMiddleware(...this.middlewares)
      )
    );
  }

  private refreshReducer() {
    this.replaceReducer(this.getReducer());
  }

  private getReducer(): Reducer<any> {
    let reducersMap;

    if (this.configs.length > 0) {
      reducersMap = {};
      this.configs.forEach(config =>
        reducersMap[config.name] = config.reducer
      );
    } else {
      reducersMap = { root: this.defaultReducer };
    }

    return combineReducers(reducersMap);
  }
}
