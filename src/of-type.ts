import { Action } from 'redux';

export function ofType(action: string): (Action) => boolean {
  return (a: Action) => a.type === action;
}