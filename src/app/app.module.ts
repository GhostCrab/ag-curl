import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule],
    declarations: [
        AppComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
