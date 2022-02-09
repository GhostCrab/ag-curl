import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Game } from './game';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class GameService {
    private gamesUrl =
        'https://api-gracenote.nbcolympics.com/svc/games_v2.svc/json/GetScheduleSport?competitionSetId=2&season=20212022&sportId=212&languageCode=2'; // URL to web api

    private games?: Game[];
    private rawGames: any;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {}

    /** GET games from the server */
    getGames(): Game[] {
        console.log("calling getGames()")
        if (!this.games) {
            console.log("test")
            this.http.get(this.gamesUrl).forEach(x => this.rawGames = x)

            this.games = []
        }

        console.log(this.rawGames)

        return this.games;
    }

    getGame(id: number): Game | undefined {
        if (!this.games) {
            this.getGames();
        }
        return this.games?.find(x => x.id === id)
    }
}
