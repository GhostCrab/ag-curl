import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { FIFAData } from '../../interfaces/fifa-api.interface';
import { IGame } from 'src/app/interfaces/game.interface';

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

    constructor(private http: HttpClient) {}

    getData(week: string): Observable<FIFAData> {
        const url = new URL(this.apiUrl);
        for (const [key, value] of Object.entries(this.apiSearchParams)) {
            url.searchParams.set(key, value);
        }

        url.searchParams.set('round', week);

        return this.http.get<FIFAData>(url.href);
    }

    // getUpdatedGames(
    //     week: number,
    //     includeOdds = false
    // ): Observable<[IGame[], IGame[]]> {
    //     const url = new URL(this.apiUrl);
    //     for (const [key, value] of Object.entries(this.apiSearchParams)) {
    //         url.searchParams.set(key, value);
    //     }

    //     url.searchParams.set('round', `Week ${week}`);

    //     return this.http.get<FIFAData>(url.href).pipe(
    //         map((data) => {
    //             const newGames: IGame[] = [];
    //             const updatedGames: IGame[] = [];
    //             for (const result of data.results) {
    //                 try {
    //                     const dbGame = this.gamedb.fromTeamDate(
    //                         result.team2Name,
    //                         result.date
    //                     );
    //                     const refGame = new ParlayGame(
    //                         result.team2Name,
    //                         result.team1Name,
    //                         result.date,
    //                         this.teamdb
    //                     );
    //                     refGame.updateFromAPI(result);
    //                     refGame.updateOddsFromAPI(result);
    //                     dbGame.updateAll(refGame);
    //                     updatedGames.push(dbGame);
    //                 } catch (e) {
    //                     const newGame = new ParlayGame(
    //                         result.team2Name,
    //                         result.team1Name,
    //                         result.date,
    //                         this.teamdb
    //                     );
    //                     newGame.updateFromAPI(result);
    //                     newGame.updateOddsFromAPI(result);
    //                     console.log(`Adding new game: ${newGame.toString()}`);
    //                     newGames.push(newGame);
    //                 }
    //             }
    //             return [newGames, updatedGames];
    //         })
    //     );
    // }

    async updateGames(): Promise<IGame[]> {
        // await this.gamedb.waitForInit();

        // return new Promise((resolve, reject) => {
        //     this.getUpdatedGames(week, includeOdds).subscribe(async (data) => {
        //         const [newGames, updatedGames] = data;
        //         await this.gamedb.batchWrite(newGames, updatedGames);
        //         resolve([...newGames, ...updatedGames]);
        //     });
        // });

        return new Promise((resolve, reject) => {});
    }
}
