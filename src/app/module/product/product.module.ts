import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProductListComponent },
            { path: ':id', component: ProductDetailComponent}
        ]),
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ProductListComponent,
        ProductDetailComponent
    ]
})

export class ProductModule {}
