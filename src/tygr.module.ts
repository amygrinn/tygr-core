import { NgModule, Injectable } from '@angular/core';

import { Action } from 'redux';

import { Observable } from 'rxjs/Observable';

import { actions$ } from './effects.middleware';
import { TygrStore } from './tygr.store';

@Injectable() export class Store extends TygrStore { }

@Injectable() export class Actions$ extends Observable<Action> { }

@NgModule({
  providers: [
    { provide: Actions$, useValue: actions$ },
    Store
  ]
})
export class TygrModule { }