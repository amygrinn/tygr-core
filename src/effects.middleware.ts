import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Middleware, Action } from 'redux';

const actionsSubject: Subject<Action> = new Subject();

export const effectsMiddleware: Middleware = store => next => action => {
  const result = next(action);
  actionsSubject.next(action);
  return result;
};

export const actions$: Observable<Action> = actionsSubject.asObservable();