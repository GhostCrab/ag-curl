import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GamesComponent } from './games/games.component';
import { MessagesComponent } from './messages/messages.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
    imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
    declarations: [
        AppComponent,
        DashboardComponent,
        GamesComponent,
        GameDetailComponent,
        MessagesComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
