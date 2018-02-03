import { Reducer, Middleware } from 'redux';

import { Effects } from './effects';

export interface StoreConfig {
  name: string;
  reducer?: Reducer<any>;
  effects?: Effects;
  middlewares?: Middleware[];
}

let tygrConfig;

let resolves = {};

export function getConfig(key: string): Promise<any> {

  if(tygrConfig) {
    if(tygrConfig[key]) {
      return Promise.resolve(tygrConfig[key]);
    }
    return Promise.resolve({});
  }

  return new Promise(resolve => {
    if(!resolves[key]) {
      resolves[key] = [resolve];
    } else {
      resolves[key].push(resolve);
    }
  });

}

import('../../../../src/configs/' + 'tygr.config')
  .then(conf => {
    tygrConfig = conf.default;
    resolver();
  })
  .catch(err => {
    console.log('no tygr config');
    tygrConfig = {};
    resolver();
  });

function resolver() {
  for(let key in resolves) {
    if(tygrConfig[key]) {
      resolves[key].forEach(resolve => {
        resolve(tygrConfig[key]);
      });
    } else {
      resolves[key].forEach(resolve => {
        resolve({});
      })
    }
  }
}
