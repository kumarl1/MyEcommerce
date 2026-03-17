import { NgModule } from '@angular/core';
import { CheckoutStore } from './checkout-store';
import { StoreModule } from '@ngrx/store';

@NgModule({
    imports: [
        CheckoutStore,
        StoreModule.forRoot({}),]
})
export class RootStoreModule  {}