import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, lastValueFrom, Observable, of } from 'rxjs';
import { DraftDatabaseService } from 'src/app/core/services/draft-database.service';

import { UEFAApiService } from 'src/app/core/services/uefa-api.service';
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

  constructor(
    private readonly uefaapi: UEFAApiService,
    private readonly draftdb: DraftDatabaseService
  ) {}

  ngOnDestroy(): void {
    console.log('Shutting down dashboard update');
    clearInterval(this.updateInterval);
  }

  ngOnInit(): void {
    this.allGamesSub$ = new BehaviorSubject(new Array<IGame>());
    this.allGames$ = this.allGamesSub$.asObservable();

    this.allDrafts$ = from([this.draftdb.drafts]);

    this.updateGames().then((games) => {
      this.allGamesSub$.next(games.filter(game => game.round >= 0));
    });

    this.updateInterval = setInterval(() => {
      this.updateGames().then((games) => {
        this.allGamesSub$.next(games.filter(game => game.round >= 0));
      });
    }, 20000);
  }

  updateGames(): Promise<IGame[]> {
    return lastValueFrom(this.uefaapi.getGames());
  }
}
