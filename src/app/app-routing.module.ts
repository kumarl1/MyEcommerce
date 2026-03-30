import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './module/home/home.component';
import { ErrorComponent } from './module/error/error.component';
import { MsalGuard } from '@azure/msal-angular'; // 1. Import the Guard
import { BrowserUtils } from '@azure/msal-browser'
// const routes: Routes = [
//   { path: '', redirectTo: '/home', pathMatch: 'full' },
//   { path: 'home', component: HomeComponent },
//   // ADD THIS: It catches the redirect before it hits the '**' wildcard
//   { path: 'code', component: HomeComponent }, 
//   { path: 'checkout', component: CheckoutComponent, canActivate: [MsalGuard] },
//   // ... other routes
//   { path: '**', component: ErrorComponent }
// ];


const routes: Routes = [
  {
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'checkout',
    loadChildren: () => import('./module/checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate: [MsalGuard] // 2. Add the Guard here
  },
  {
    path: 'products',
    loadChildren: () => import('./module/product/product.module').then(m => m.ProductModule)
    // No guard here: Let people browse products without logging in!
  }, 
  {
    path: '**', 
    component: ErrorComponent
  }
];



@NgModule({
 imports: [
    RouterModule.forRoot(routes, {
      // Don't perform initial navigation in iframes or popups
      initialNavigation:
        !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
          ? 'enabledNonBlocking'
          : 'disabled', // Set to enabledBlocking to use Angular Universal
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }