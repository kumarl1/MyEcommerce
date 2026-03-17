import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout.component';

@NgModule({
    imports:[
        SharedModule,
        RouterModule.forChild([
            { path: '', component: CheckoutComponent}
        ])
    ],
    declarations: [CheckoutComponent]
})
export class CheckoutModule {}