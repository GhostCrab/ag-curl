import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, lastValueFrom, Observable } from 'rxjs';
import { DraftDatabaseService } from 'src/app/core/services/draft-database.service';

import { FIFAApiService } from 'src/app/core/services/fifa-api.service';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
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
    private readonly fifaapi: FIFAApiService,
    private readonly teamdb: TeamDatabaseService,
    private readonly draftdb: DraftDatabaseService
  ) {}

  ngOnDestroy(): void {
    console.log('Shutting down dashboard update');
    clearInterval(this.updateInterval);
  }

  ngOnInit(): void {
    // this.draftdb.mockDraft();
    this.allGamesSub$ = new BehaviorSubject(new Array<IGame>());
    this.allGames$ = this.allGamesSub$.asObservable();

    this.allDrafts$ = from([this.draftdb.drafts]);

    this.updateGames().then((games) => {
      // games.sort((a, b) => a.id - b.id);
      // games.filter(game => game.round === 0).forEach(game => {
      //   if (!game.complete) {
      //     game.simulate(games);
      //   }
      // })

      // const teamGroups = this.teamdb.teamsByGroup();
      // for (let key of Object.keys(teamGroups)) {
      //   teamGroups[key] = teamGroups[key].sort((a, b) => a.rrSort(b));
      // }

      // console.log(teamGroups);

      // games.filter(game => game.round > 0).forEach(game => {
      //   game.simulate(games, teamGroups);
      // })
      
      this.allGamesSub$.next(games.filter(game => game.round >= 0));
    });

    this.updateInterval = setInterval(() => {
      this.updateGames().then((games) => {
        this.allGamesSub$.next(games.filter(game => game.round >= 0));
      });
    }, 20000);
  }

  updateGames(): Promise<IGame[]> {
    return lastValueFrom(this.fifaapi.getGames());
  }
}
