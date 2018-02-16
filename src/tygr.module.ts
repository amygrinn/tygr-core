import { NgModule, Injectable, ModuleWithProviders } from '@angular/core';

import { Action } from 'redux';

import { Observable } from 'rxjs/Observable';

import { actions$ } from './effects.middleware';
import { TygrStore } from './tygr.store';

@Injectable() export class Store extends TygrStore { }

@Injectable() export class Actions$ extends Observable<Action> { }

@NgModule()
export class TygrModule {
  constructor(private actions: Actions$, private store: Store) { }

  public static forRoot(config): ModuleWithProviders {
    return {
      ngModule: TygrModule,
      providers: [
        { provide: Store, useValue: new TygrStore(config ? config : {}) },
        { provide: Actions$, useValue: actions$ },
      ]
    }
  }
}