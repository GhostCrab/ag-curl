import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, lastValueFrom, Observable, of } from 'rxjs';
import { DraftDatabaseService } from 'src/app/core/services/draft-database.service';

import { FIFAApiService } from 'src/app/core/services/fifa-api.service';
import { TeamDatabaseService, TeamGroupDict, TeamGroupInfoData, TeamGroupsRanked } from 'src/app/core/services/team-database.service';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';
import { IDraft } from 'src/app/interfaces/draft.interface';
import { IGame } from 'src/app/interfaces/game.interface';
import { IGameSimulationResult, ITournamentSimulationResult, TournamentSimulationResult } from 'src/app/interfaces/simulation.interface';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function rankTeams(simulations: IGameSimulationResult[], teamGroups: TeamGroupDict): TeamGroupsRanked {
  simulations.forEach( s => {
    if (s.group) {
      teamGroups[s.group][s.homeTeamAbbr].score += s.homeAwardedPoints;
      teamGroups[s.group][s.homeTeamAbbr].simulations.push(s);

      teamGroups[s.group][s.awayTeamAbbr].score += s.awayAwardedPoints;
      teamGroups[s.group][s.awayTeamAbbr].simulations.push(s);
    }
  });

  const result: TeamGroupsRanked = {}
  for (const [group, info] of Object.entries(teamGroups)) {
    if(!(group in result)) result[group] = [];
    for (const [abbr, data] of Object.entries(info)) {
      result[group].push({abbr: abbr, logOdds: data.logOdds, score: data.score});
    }
    result[group].sort( (a, b) => {
      const aInfo: TeamGroupInfoData = info[a.abbr];
      const bInfo: TeamGroupInfoData = info[b.abbr];

      if (aInfo.score === bInfo.score) {
        const vsGames = aInfo.simulations.filter( sim => sim.homeTeamAbbr === b.abbr || sim.awayTeamAbbr === b.abbr );
        if (vsGames.length === 0) 
          return Math.random() - 0.5;

        const sim = vsGames[0];
        if (sim.homeAwardedPoints === sim.awayAwardedPoints)
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
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {
  allGamesSub$: BehaviorSubject<IGame[]>;
  allGames$: Observable<IGame[]>;

  allDrafts$: Observable<IDraft[]>;

  metaDraft: { [key: string]: number[] };
  metaResult: ITournamentSimulationResult;
  metaDraftSorted: (string | number)[][];

  iterate: number = 0;
  iterations = 50000;

  updateInterval: NodeJS.Timer;

  constructor(
    readonly fifaapi: FIFAApiService,
    readonly teamdb: TeamDatabaseService,
    readonly userdb: UserDatabaseService,
    readonly draftdb: DraftDatabaseService
  ) {}

  async ngOnInit(): Promise<void> {
    this.allGamesSub$ = new BehaviorSubject(new Array<IGame>());
    this.allGames$ = this.allGamesSub$.asObservable();

    this.allDrafts$ = from([this.draftdb.drafts]);

    this.updateGames().then(async (games) => {
      games.sort((a, b) => a.id - b.id);

      this.metaResult = TournamentSimulationResult.blank(this.teamdb);
      this.metaDraft = {};

      this.userdb.all().forEach(user => {
        this.metaDraft[user.name] = [0,0,0,0,0,0,0,0];
      })

      for (this.iterate = 0; this.iterate < this.iterations; this.iterate++) {
        if (this.iterate % 500 === 0)
          await sleep(0);

        const simulations: IGameSimulationResult[] = [];
        games.forEach(game => game.initalizeFromResult());
        this.teamdb.all().forEach(team=>team.resetGames());

        games.filter(game => game.round === 0).forEach(game => {
          simulations.push(game.simulate(true, simulations));
        })

        const teamGroupsRanked = rankTeams(simulations, this.teamdb.teamsByGroup());

        games.filter(game => game.round > 0).forEach(game => {
          simulations.push(game.simulate(false, simulations, teamGroupsRanked));
        })

        const tournamentResult = new TournamentSimulationResult(simulations);
        this.metaResult.add(tournamentResult);

        const draftarr: (string | { score: number; round: number; results: IGameSimulationResult[]; } | number | (string | { score: number; round: number; results: IGameSimulationResult[]; })[][])[][] = [];
        this.draftdb.drafts.forEach(draft => {
          const draftteams: (string | { score: number; round: number; results: IGameSimulationResult[]; })[][] = [];
          let draftScore = 0;
          draft.teams.forEach(team => {
            draftteams.push([team.abbr, tournamentResult.teamData[team.abbr]])
            draftScore += tournamentResult.teamData[team.abbr].score;
          });

          draftarr.push([draft.user.name, draftScore, draftteams]);
        });

        draftarr.sort((a, b) => Number(b[1]) - Number(a[1]));
        draftarr.forEach((draft, index) => this.metaDraft[String(draft[0])][index]++)
      }

      this.metaResult.divide(this.iterations);

      this.metaDraftSorted = [];
      for (const [key, value] of Object.entries(this.metaDraft)) {
        this.metaDraftSorted.push([key, value[0]/(this.iterations/100)]);
      }
      this.metaDraftSorted.sort((a, b) => Number(b[1]) - Number(a[1]));

      this.allGamesSub$.next(games.filter(game => game.round >= 0));
    });
  }

  updateGames(): Promise<IGame[]> {
    return lastValueFrom(this.fifaapi.getGames());
  }

}
