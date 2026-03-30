import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductService } from './core/services/product.service'
import { RootStoreModule } from './root-store/root-store.module';
import { GlobalErrorHandler } from './core/ErrorHandler/basic-error-handler';
import { ErrorIntercept } from './core/interceptor/http-interceptor';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './module/header/header.component';
import { FooterComponent } from './module/footer/footer.component';
import { ErrorComponent } from './module/error/error.component';
import { HomeComponent } from './module/home/home.component';


// --- MSAL Imports ---
// import { 
//   MsalModule, MsalInterceptor, MsalGuard, 
//   MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG 
// } from '@azure/msal-angular';

import { msalConfig, loginRequest } from './auth-config'; 
/**
 * Here we pass the configuration parameters to create an MSAL instance.
 * For more info, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/configuration.md
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}


/**
 * Set your default interaction type for MSALGuard here. If you have any
 * additional scopes you want the user to consent upon login, add them here as well.
 */
export function MsalGuardConfigurationFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest
  };
}
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
} from '@azure/msal-browser';

import {
  MSAL_INSTANCE,
  MsalGuardConfiguration,
  MSAL_GUARD_CONFIG,
  MsalService,
  MsalBroadcastService,
  MsalGuard,
  MsalRedirectComponent,
  MsalInterceptor,
  MsalModule,
} from '@azure/msal-angular';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent, HeaderComponent, FooterComponent, ErrorComponent, HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    RootStoreModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    // --- Initialize MSAL ---
   MsalModule
  ],
  providers: [
    ProductService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MsalGuardConfigurationFactory,
    },
    MsalService,
    MsalBroadcastService,
    MsalGuard,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }