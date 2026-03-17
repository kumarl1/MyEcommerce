import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { State } from './state'; 

export const featureSelector: MemoizedSelector<object, State> = createFeatureSelector('counter');

export const selectCheckoutCount: MemoizedSelector<object, State> = createSelector(
	featureSelector,
	state => state
);
