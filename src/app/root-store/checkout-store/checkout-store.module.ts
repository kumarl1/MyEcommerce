import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';

@NgModule({
    imports:[StoreModule.forFeature('counter', featureReducer)]
})
export class CheckoutStore {}