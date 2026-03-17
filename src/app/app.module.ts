import { NgModule,ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductService} from './core/services/product.service'
import { RootStoreModule }  from './root-store/root-store.module';
import { GlobalErrorHandler } from './core/ErrorHandler/basic-error-handler';
import { ErrorIntercept } from './core/interceptor/http-interceptor';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './module/product/product.module';
import { HeaderComponent } from './module/header/header.component';
import { FooterComponent } from './module/footer/footer.component';
import { ErrorComponent } from './module/error/error.component';
import { HomeComponent } from './module/home/home.component';

@NgModule({
  declarations: [
    AppComponent,HeaderComponent,FooterComponent,ErrorComponent,HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ProductModule,
    HttpClientModule,
    RootStoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ ProductService,
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
