import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, lastValueFrom, Observable } from 'rxjs';
import { DraftDatabaseService } from 'src/app/core/services/draft-database.service';

import { FIFAApiService } from 'src/app/core/services/fifa-api.service';
import { IDraft } from 'src/app/interfaces/draft.interface';
import { IGame } from 'src/app/interfaces/game.interface';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    allGamesSub$: BehaviorSubject<IGame[]>;
    allGames$: Observable<IGame[]>;

    allDrafts$: Observable<IDraft[]>;

    updateInterval: NodeJS.Timer;

    constructor(private readonly fifaapi: FIFAApiService, private readonly draftdb: DraftDatabaseService) {}

    ngOnDestroy(): void {
        console.log('Shutting down dashboard update');
        clearInterval(this.updateInterval);
    }

    async ngOnInit(): Promise<void> {
        this.allGamesSub$ = new BehaviorSubject(new Array<IGame>());
        this.allGames$ = this.allGamesSub$.asObservable();

        this.allDrafts$ = from([this.draftdb.drafts])

        const games = (await this.updateGames()).sort((a, b) => a.gt - b.gt);
        this.allGamesSub$.next(games);

        this.updateInterval = setInterval(async () => {
            const games = await this.updateGames();
            this.allGamesSub$.next(games);
        }, 20000);
    }

    async updateGames(): Promise<IGame[]> {
        return lastValueFrom(this.fifaapi.getGames());
    }
}
