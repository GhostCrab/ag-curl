import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { GamesComponent } from './games/games.component';
import { MessagesComponent } from './messages/messages.component';
import { TeamsComponent } from './teams/teams.component';
import { PlayersComponent } from './players/players.component';

@NgModule({
    imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
    declarations: [
        AppComponent,
        DashboardComponent,
        GamesComponent,
        GameDetailComponent,
        MessagesComponent,
        TeamsComponent,
        PlayersComponent,
    ],
    providers: [TeamsComponent, PlayersComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
