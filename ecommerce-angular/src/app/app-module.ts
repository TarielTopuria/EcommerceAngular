import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Layout } from './layout/layout/layout';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart';
import { AddProductComponent } from './pages/admin/add-product/add-product';
import { NotFoundComponent } from './pages/not-found/not-found';

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
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
