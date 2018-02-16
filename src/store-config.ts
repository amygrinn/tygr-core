import { Reducer, Middleware } from 'redux';

import { Effects } from './effects';

export interface StoreConfig {
  name: string;
  reducer?: Reducer<any>;
  effects?: Effects;
  middlewares?: Middleware[];
  [key: string]: any;
}
