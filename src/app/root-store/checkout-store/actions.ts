import { Action } from '@ngrx/store';

export enum ActionTypes {
    increase = '[Increase Cart Component] increase',
    decrease = '[Decrease Cart Count Component] decrease'
}

export class IncreaseCountAction implements Action {
	readonly type = ActionTypes.increase;
}

export class DecreaseCountAction implements Action {
    readonly type = ActionTypes.decrease;
}

export type checkoutAction =  IncreaseCountAction | DecreaseCountAction;

