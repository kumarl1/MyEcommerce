import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './module/home/home.component';
import { ErrorComponent } from './module/error/error.component';

const routes: Routes = [
   {path: '', 
   redirectTo: '/home', 
   pathMatch: 'full'},
   {
    path: 'home',
    component: HomeComponent
   },
   {
    path: 'checkout',
    loadChildren: () => import('./module/checkout/checkout.module').then(m => m.CheckoutModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./module/product/product.module').then(m => m.ProductModule)
  }, 
  {
    path: '**', component: ErrorComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

