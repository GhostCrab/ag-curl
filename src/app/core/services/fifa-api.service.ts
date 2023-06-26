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
// mlb - 'https://bdfed.stitch.mlbinfra.com/bdfed/transform-mlb-schedule?stitch_env=prod&sortTemplate=5&sportId=51&startDate=2023-03-7&endDate=2023-03-21&gameType=S&&gameType=R&&gameType=F&&gameType=D&&gameType=L&&gameType=W&&gameType=A&language=en&leagueId=159&&leagueId=160&contextTeamId='

@Injectable({
    providedIn: 'root',
})
export class FIFAApiService {
    private apiUrl = 'https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285026';

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

        return this.http.get<FIFAData>(url.href).pipe(
            map((data) => {
              const games: IGame[] = [];
              for (const result of data.Results) {
                  games.push(new Game(result, this.teamdb, this.draftdb));
              }

              return games;
            })
        );
    }
}
