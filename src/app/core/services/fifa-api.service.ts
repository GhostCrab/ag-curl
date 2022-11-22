import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { FIFAData } from '../../interfaces/fifa-api.interface';
import { Game, IGame } from 'src/app/interfaces/game.interface';
import { TeamDatabaseService } from './team-database.service';
import { DraftDatabaseService } from './draft-database.service';
import { UserDatabaseService } from './user-database.service';

// 'https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=255711'

@Injectable({
    providedIn: 'root',
})
export class FIFAApiService {
    private apiUrl = 'https://api.fifa.com/api/v3/calendar/matches';
    private apiSearchParams = {
        language: 'en',
        count: '500',
        idSeason: '255711',
    };

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    constructor(
        private http: HttpClient,
        private teamdb: TeamDatabaseService,
        private userdb: UserDatabaseService,
        private draftdb: DraftDatabaseService,
    ) {}

    getGames(): Observable<IGame[]> {
        const url = new URL(this.apiUrl);
        for (const [key, value] of Object.entries(this.apiSearchParams)) {
            url.searchParams.set(key, value);
        }

        return this.http.get<FIFAData>(url.href).pipe(
            map((data) => {
                const games: IGame[] = [];
                for (const result of data.Results) {
                    if (result.Away)
                        games.push(new Game(result, this.teamdb, this.draftdb));
                }
                return games;
            })
        );
    }
}
