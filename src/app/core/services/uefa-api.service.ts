import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UEFAMatch } from '../../interfaces/uefa-api.interface';
import { Game, IGame, newGameFromUEFA } from 'src/app/interfaces/game.interface';
import { TeamDatabaseService } from './team-database.service';
import { DraftDatabaseService } from './draft-database.service';

@Injectable({
    providedIn: 'root',
})
export class UEFAApiService {
    private apiUrl = 'https://match.uefa.com/v5/matches?competitionId=3&fromDate=2024-06-14&limit=200&offset=0&order=ASC&phase=ALL&seasonYear=2024&toDate=2024-07-15&utcOffset=-7';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    constructor(
        private readonly http: HttpClient,
        private readonly teamdb: TeamDatabaseService,
        private readonly draftdb: DraftDatabaseService,
    ) {}

    getGames(): Observable<IGame[]> {
        const url = new URL(this.apiUrl);

        return this.http.get<UEFAMatch[]>(url.href).pipe(
            map((data) => {
              const games: IGame[] = data.map(match => newGameFromUEFA(match, this.teamdb, this.draftdb));
              return games;
            })
        );
    }
}
