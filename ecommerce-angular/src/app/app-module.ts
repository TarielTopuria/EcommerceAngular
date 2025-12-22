import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { App } from './app';
import { Layout } from './layout/layout/layout';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { AddProductComponent } from './pages/admin/add-product/add-product';
import { NotFoundComponent } from './pages/not-found/not-found';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { CategoryFilterPipe } from './shared/pipes/category-filter.pipe';

@NgModule({
  declarations: [
    App,
    Layout,
    Header,
    Footer,
    HomeComponent,
    ProductDetailsComponent,
    CartComponent,
    AddProductComponent,
    NotFoundComponent,
    LoaderComponent,
    CategoryFilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
