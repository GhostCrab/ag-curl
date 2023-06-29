import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, lastValueFrom, Observable, of } from 'rxjs';
import { DraftDatabaseService } from 'src/app/core/services/draft-database.service';

import { FIFAApiService } from 'src/app/core/services/fifa-api.service';
import { TeamDatabaseService, TeamGroupDict, TeamGroupsRanked } from 'src/app/core/services/team-database.service';
import { IDraft } from 'src/app/interfaces/draft.interface';
import { IGame } from 'src/app/interfaces/game.interface';
import { IGameSimulationResult, ITournamentSimulationResult, TournamentSimulationResult } from 'src/app/interfaces/simulation.interface';

function rankTeams(simulations: IGameSimulationResult[], teamGroups: TeamGroupDict): TeamGroupsRanked {
  simulations.forEach( s => {
    if (s.group) {
      teamGroups[s.group][s.homeTeamAbbr].score += s.homeScore;
      teamGroups[s.group][s.homeTeamAbbr].simulations.push(s);

      teamGroups[s.group][s.awayTeamAbbr].score += s.awayScore;
      teamGroups[s.group][s.awayTeamAbbr].simulations.push(s);
    }
  });

  const result: TeamGroupsRanked = {}
  for (const [group, info] of Object.entries(teamGroups)) {
    if(!(group in result)) result[group] = [];
    for (const [abbr, data] of Object.entries(info)) {
      result[group].push({abbr: abbr, logOdds: data.logOdds});
    }
    result[group].sort( (a, b) => {
      const aInfo = info[a.abbr];
      const bInfo = info[b.abbr];

      if (aInfo.score === bInfo.score) {
        const vsGames = aInfo.simulations.filter( sim => sim.homeTeamAbbr === b.abbr || sim.awayTeamAbbr === b.abbr );
        if (vsGames.length === 0) 
          return Math.random() - 0.5;

        const sim = vsGames[0];
        if (sim.homePoints === sim.awayPoints)
          return Math.random() - 0.5;

        if (sim.winnerTeamAbbr === a.abbr)
          return -1;

        return 1;
      }

      return bInfo.score - aInfo.score;
    })
  }

  return result;
}

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
    this.draftdb.mockDraft();
    this.allGamesSub$ = new BehaviorSubject(new Array<IGame>());
    this.allGames$ = this.allGamesSub$.asObservable();

    this.allDrafts$ = from([this.draftdb.drafts]);

    this.updateGames().then((games) => {
      games.sort((a, b) => a.id - b.id);
      this.allGamesSub$.next(games.filter(game => game.round >= 0));

      let metaResult = TournamentSimulationResult.blank(this.teamdb);
      const iterations = 1;
      for (let i = 0; i < iterations; i++) {
        const simulations: IGameSimulationResult[] = [];
        games.filter(game => game.round === 0).forEach(game => {
          if (!game.complete) {
            simulations.push(game.simulate(true, simulations));
          }
        })

        const teamGroupsRanked = rankTeams(simulations, this.teamdb.teamsByGroup());;

        games.filter(game => game.round > 0).forEach(game => {
          simulations.push(game.simulate(true, simulations, teamGroupsRanked));
        })

        metaResult.add(new TournamentSimulationResult(simulations));
      }

      console.log(metaResult.divide(iterations).raw());
    });

    // this.updateInterval = setInterval(() => {
    //   this.updateGames().then((games) => {
    //     this.allGamesSub$.next(games.filter(game => game.round >= 0));
    //   });
    // }, 20000);
  }

  updateGames(): Promise<IGame[]> {
    return lastValueFrom(this.fifaapi.getGames());
  }
}
