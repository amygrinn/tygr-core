import { Store, Actions$ } from "./tygr.module";
import { StoreConfig } from "./store-config";

export abstract class StoreService {
  constructor(
    private _actions$: Actions$,
    private _store: Store,
    private _config: StoreConfig
  ) {
    _store.injectConfigs(_config);
    if (_config.effects) {
      _config.effects(_actions$, _store, this);
    }
  }
}