import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { bindCallback } from 'rxjs/observable/bindCallback';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { isEqual } from 'underscore';

import {
  Action,
  Store as IStore,
  createStore,
  applyMiddleware,
  combineReducers,
  Unsubscribe,
  compose,
  Reducer,
  Middleware,
} from 'redux';

import { Selector } from './selector';
import { StoreConfig } from './store-config';
import { effectsMiddleware } from './effects.middleware';

const defaultState = { root: '' };
const defaultReducer: Reducer<string> = (state, action) => '';

const composeEnhancers = (typeof window !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

declare var window: any;

export class TygrStore implements IStore<any> {

  private store: IStore<any>;

  private configs: StoreConfig[] = [];

  constructor(
    private customConfig,
    configs?: StoreConfig[]
  ) {

    if (configs) {
      this.configs = configs;
    }

    this.store = this.createStore()
  }

  public injectConfigs(...configs: StoreConfig[]) {

    configs = configs.map(config => { return { ...config, ...this.customConfig[config.name] } });

    configs.forEach((config: StoreConfig) => {
      if (this.has(config)) {
        console.error('Configuration already exists in store, did you import it into two modules?');
      } else {
        this.configs.unshift(config);
      }
    });

    if (configs.some(config => !!config.middlewares)) {
      this.store = this.createStore();
    } else if (configs.some(config => !!config.reducer)) {
      this.replaceReducer(this.getReducer());
    }
  }

  public select<T>(selector: Selector<T>): T {
    return selector(this.getState());
  }

  public select$<T>(selector: Selector<T>): Observable<T> {
    return bindCallback(this.subscribe)()
      .map(() => selector(this.getState()));
  }

  public require(...configs: StoreConfig[]): boolean {
    configs.forEach((config: StoreConfig) => {
      if (!this.has(config)) {
        console.error(`Store config for ${config.name} does not exist. Make sure to import it into a module`);
        return false;
      }
    })

    return true;
  }

  public dispatch(action) {
    return this.store.dispatch({ ...action });
  }

  public getState() {
    return this.store.getState();
  }

  public getConfig(name: string): StoreConfig {
    return this.configs.find((config: StoreConfig) => config.name === name);
  }

  public subscribe(listener) {
    return this.store.subscribe(listener);
  }

  public replaceReducer(reducer: Reducer<any>) {
    return this.store.replaceReducer(reducer);
  }

  private createStore(): IStore<any> {
    return createStore(
      this.getReducer(),
      this.store
        ? isEqual(this.store.getState(), defaultState) 
          ? {} 
          : this.store.getState()
        : defaultState,
      composeEnhancers(
        applyMiddleware(...this.getMiddlewares())
      )
    );
  }

  private getReducer(): Reducer<any> {
    let reducersMap;

    let reducerConfigs: StoreConfig[] =
      this.configs.filter((config: StoreConfig) => config.reducer)

    if (reducerConfigs.length > 0) {
      reducersMap = {};
      reducerConfigs.forEach((config: StoreConfig) =>
        reducersMap[config.name] = config.reducer
      );
    } else {
      reducersMap = { root: defaultReducer };
    }

    return combineReducers(reducersMap);
  }

  private getMiddlewares(): Middleware[] {
    return [].concat(
      ...this.configs.filter(config => config.middlewares).map(config => config.middlewares),
      [effectsMiddleware]
    );
  }

  private has(config: StoreConfig): boolean {

    if (this.configs.length === 0) {
      return false;
    }

    this.configs.forEach((c: StoreConfig) => {
      if (c.name === config.name) {
        return true;
      }
    });

    return false;
  }
}
