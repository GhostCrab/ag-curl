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
      result[group].push({abbr: abbr, logOdds: data.logOdds, score: data.score, group: group});
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

  // create a group of all the 3rd place teams and rank them against eachother
  result['3'] = Object.entries(result).map(([group, teams]) => teams[2]);

  result['3'].sort( (a, b) => {
    const aInfo: TeamGroupInfoData = teamGroups[a.group][a.abbr];
    const bInfo: TeamGroupInfoData = teamGroups[b.group][b.abbr];

    if (aInfo.score === bInfo.score)
      return Math.random() - 0.5;

    return bInfo.score - aInfo.score;
  });

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

  // Cached results to prevent flickering
  overallResults: Array<{abbr: string, imgURL: string, player: string, score: number, round: number}> = [];
  groupResults: Array<{group: string, teams: Array<{abbr: string, imgURL: string, player: string, score: number, round: number}>}> = [];
  draftResults: Array<{player: string, teams: Array<{abbr: string, imgURL: string, score: number, round: number}>, total: number}> = [];

  constructor(
    readonly fifaapi: FIFAApiService,
    readonly teamdb: TeamDatabaseService,
    readonly userdb: UserDatabaseService,
    readonly draftdb: DraftDatabaseService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('Simulator ngOnInit started');
    this.allGamesSub$ = new BehaviorSubject(new Array<IGame>());
    this.allGames$ = this.allGamesSub$.asObservable();

    console.log('Calling mockDraft');
    // this.draftdb.mockDraft();
    console.log('Draft teams:', this.draftdb.drafts.map(d => ({ user: d.user.name, teamCount: d.teams.length })));
    this.allDrafts$ = from([this.draftdb.drafts]);

    console.log('Fetching games from FIFA API');
    this.updateGames().then(async (games) => {
      console.log('Games fetched:', games.length);
      console.log('Game ID range:', 'first:', games[0]?.id, 'last:', games[games.length - 1]?.id);
      console.log('First knockout game IDs:', games.filter(g => g.round === 1).slice(0, 3).map(g => ({ id: g.id, home: g.home.name, away: g.away.name })));
      games.sort((a, b) => a.id - b.id);

      this.metaResult = TournamentSimulationResult.blank(this.teamdb);
      this.metaDraft = {};

      this.userdb.all().forEach(user => {
        this.metaDraft[user.name] = [0,0,0,0,0,0,0,0];
      })

      let counter = 0;

      console.log('Starting simulation loop, iterations:', this.iterations);
      for (this.iterate = 0; this.iterate < this.iterations; this.iterate++) {
        if (this.iterate % 500 === 0) {
          console.log('Simulation progress:', this.iterate, '/', this.iterations);
          await sleep(0);
        }

        let simulations: IGameSimulationResult[] = [];
        try {
          games.forEach(game => game.reinitialize());
          this.teamdb.all().forEach(team=>team.resetGames());

          const round0Games = games.filter(game => game.round === 0);
          if (this.iterate === 0) console.log('Round 0 games:', round0Games.length);

          round0Games.forEach(game => {
            simulations.push(game.simulate(true, simulations));
          })

          if (this.iterate === 0) console.log('After round 0 simulations:', simulations.length);

          const teamGroupsRanked = rankTeams(simulations, this.teamdb.teamsByGroup());
          if (this.iterate === 0) console.log('Team groups ranked:', Object.keys(teamGroupsRanked));

          const knockoutGames = games.filter(game => game.round > 0);
          if (this.iterate === 0) {
            console.log('Knockout games:', knockoutGames.length);
            console.log('First few knockout games:', knockoutGames.slice(0, 3).map(g => ({
              round: g.round,
              home: g.home.name,
              away: g.away.name,
              homeRank: g.home.rank,
              awayRank: g.away.rank
            })));
          }

          knockoutGames.forEach((game, index) => {
            try {
              if (this.iterate === 0 && index === 16) {
                console.log('About to simulate game 16 (round 2):', game.home.name, 'vs', game.away.name);
                console.log('Game ID:', game.id, 'Current simulations count:', simulations.length);
                console.log('Looking for W74 - that should be at index 73, simulations[73]:', simulations[73]);
              }
              simulations.push(game.simulate(false, simulations, teamGroupsRanked));
            } catch (error) {
              console.error('Error simulating knockout game', index, ':', game.home.name, 'vs', game.away.name, 'round:', game.round, 'game ID:', game.id, error);
              throw error;
            }
          })

          if (this.iterate === 0) console.log('Total simulations after knockout:', simulations.length);
        } catch (error) {
          console.error('Error in simulation iteration', this.iterate, ':', error);
          throw error;
        }

        const tournamentResult = new TournamentSimulationResult(simulations);
        if (this.iterate === 0) console.log('Tournament result created');
        this.metaResult.add(tournamentResult);
        if (this.iterate === 0) console.log('Meta result updated');

        if (this.iterate === 0) console.log('Building draft array');
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

        if (this.iterate === 0) console.log('Sorting draft array');
        draftarr.sort((a, b) => Number(b[1]) - Number(a[1]));
        // console.log(draftarr);

        // const drafts = this.draftdb.drafts.sort((a, b) => b.score() - a.score());
        // drafts.forEach((draft, index) => this.metaDraft[draft.user.name][index]++);
        // draftarr.forEach((draft, index) => this.metaDraft[String(draft[0])][index]++)

        if (this.iterate === 0) console.log('Calculating placements');
        for (let place = 0, realplace = 0; place < draftarr.length; place++) {
          if (place > 0) {
            if (draftarr[place-1][1] !== draftarr[place][1])
              realplace = place;
            else if (place === 1) {
              counter++;
            }
          }

          this.metaDraft[String(draftarr[place][0])][realplace]++;
        }
        if (this.iterate === 0) console.log('Iteration 0 complete');
      }

      // console.log(counter);
      // console.log(counter / this.iterations);

      // console.log(this.metaDraft);

      this.metaResult.divide(this.iterations);

      this.metaDraftSorted = [];
      for (const [key, value] of Object.entries(this.metaDraft)) {
        this.metaDraftSorted.push([key, value[0]/(this.iterations/100)]);
      }
      this.metaDraftSorted.sort((a, b) => Number(b[1]) - Number(a[1]));

      // Build cached results to prevent flickering on scroll
      this.buildCachedResults();

      this.allGamesSub$.next(games.filter(game => game.round >= 0));
    });
  }

  buildCachedResults(): void {
    // Build overall results
    this.overallResults = this.metaResult.raw().map(result => ({
      abbr: result.abbr,
      imgURL: this.teamdb.get(result.abbr).imgURL,
      player: this.getPlayerByTeam(result.abbr),
      score: result.score,
      round: result.round
    }));

    // Build group results
    this.groupResults = this.getGroups().map(group => ({
      group: group,
      teams: this.getTeamsByGroup(group).map(result => ({
        abbr: result.abbr,
        imgURL: this.teamdb.get(result.abbr).imgURL,
        player: this.getPlayerByTeam(result.abbr),
        score: result.score,
        round: result.round
      }))
    }));

    // Build draft results
    this.draftResults = this.getDraftsSortedByScore().map(draft => ({
      player: draft.user.name,
      teams: draft.teams.map(team => ({
        abbr: team.abbr,
        imgURL: team.imgURL,
        score: this.getTeamScore(team.abbr),
        round: this.getTeamRound(team.abbr)
      })),
      total: this.getDraftTotalScore(draft)
    }));
  }

  updateGames(): Promise<IGame[]> {
    return lastValueFrom(this.fifaapi.getGames()).catch(error => {
      console.error('Error fetching games from FIFA API:', error);
      throw error;
    });
  }

  getGroups(): string[] {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  }

  getTeamsByGroup(group: string): {abbr: string, score: number, round: number}[] {
    return this.metaResult.raw()
      .filter(result => this.teamdb.get(result.abbr).group === group)
      .sort((a, b) => b.score - a.score);
  }

  getTeamScore(abbr: string): number {
    return this.metaResult.teamData[abbr]?.score || 0;
  }

  getTeamRound(abbr: string): number {
    return this.metaResult.teamData[abbr]?.round || 0;
  }

  getDraftsSortedByScore(): IDraft[] {
    return [...this.draftdb.drafts].sort((a, b) => {
      const aTotal = this.getDraftTotalScore(a);
      const bTotal = this.getDraftTotalScore(b);
      return bTotal - aTotal;
    });
  }

  getDraftTotalScore(draft: IDraft): number {
    return draft.teams.reduce((total, team) => total + this.getTeamScore(team.abbr), 0);
  }

  getPlayerByTeam(abbr: string): string {
    for (const draft of this.draftdb.drafts) {
      if (draft.teams.some(team => team.abbr === abbr)) {
        return draft.user.name;
      }
    }
    return '';
  }

  // TrackBy functions to improve performance and prevent flickering
  trackByAbbr(index: number, item: any): string {
    return item.abbr;
  }

  trackByGroup(index: number, item: any): string {
    return item.group;
  }

  trackByPlayer(index: number, item: any): string {
    return item.player;
  }

}
