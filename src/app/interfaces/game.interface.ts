import { gaussianRandom } from '../app.util';
import { DraftDatabaseService } from '../core/services/draft-database.service';
import { TeamDatabaseService, TeamGroupDict, TeamGroupsRanked } from '../core/services/team-database.service';
import { UserDatabaseService } from '../core/services/user-database.service';
import { FIFADataResult } from './fifa-api.interface';
import { IGameSimulationResult } from './simulation.interface';
import { ITeam } from './team.interface';
import { IUser } from './user.interface';

export interface IGame {
  id: number;
  home: ITeam;
  away: ITeam;
  homeGoals: number;
  awayGoals: number;
  homePenaltyGoals: number;
  awayPenaltyGoals: number;
  active: boolean;
  complete: boolean;
  gt: number;
  homeUser: IUser;
  awayUser: IUser;
  knockout: boolean;
  round: number;

  status(): string;
  miniStatusTop(): string;
  miniStatusBottom(): string;
  tie(): boolean;
  winner(abstract?: IGameSimulationResult): ITeam;
  winnerAbbr(abstract?: IGameSimulationResult): string;
  winnerLogOdds(abstract?: IGameSimulationResult): number;
  getAwardedPoints(abbr: string): number;
  gameStr(): string;
  roundStr(): string;
  simulate(write: boolean, results: IGameSimulationResult[], teamGroups?: TeamGroupsRanked): IGameSimulationResult;
  includesTeam(team: ITeam): boolean;
  compare(game: IGame): boolean;
  initalizeFromResult(): void;
}

export class Game implements IGame {
  public id: number;
  public home: ITeam;
  public away: ITeam;
  public homeGoals: number;
  public awayGoals: number;
  public homePenaltyGoals: number;
  public awayPenaltyGoals: number;
  public active: boolean;
  public complete: boolean;
  public gt: number;
  public homeUser: IUser;
  public awayUser: IUser;
  public knockout: boolean;
  public round: number;

  //https://api.fifa.com/api/v3/picture/flags-{format}-{size}/ECU

  constructor(
    private readonly result: FIFADataResult,
    private readonly teamdb: TeamDatabaseService,
    private readonly draftdb: DraftDatabaseService
  ) {
    this.result = result;
    this.initalizeFromResult();
  }

  initalizeFromResult() {
    // console.log(this.result);
    this.id = this.result.MatchNumber;
    this.home = this.teamdb.get(this.result.Home?.Abbreviation ? this.result.Home.Abbreviation : this.result.PlaceHolderA);
    this.away = this.teamdb.get(this.result.Away?.Abbreviation ? this.result.Away.Abbreviation : this.result.PlaceHolderB);
    this.homeGoals = this.result.HomeTeamScore === null ? 0 : this.result.HomeTeamScore;
    this.awayGoals = this.result.AwayTeamScore === null ? 0 : this.result.AwayTeamScore;
    this.homePenaltyGoals =
      this.result.HomeTeamPenaltyScore === null ? 0 : this.result.HomeTeamPenaltyScore;
    this.awayPenaltyGoals =
      this.result.AwayTeamPenaltyScore === null ? 0 : this.result.AwayTeamPenaltyScore;
    this.active = this.result.MatchStatus === 3;
    this.complete = this.result.MatchStatus === 0;
    this.gt = new Date(this.result.Date).getTime();
    this.homeUser = this.draftdb.getUserByAbbr(this.home.abbr);
    this.awayUser = this.draftdb.getUserByAbbr(this.away.abbr);
    this.knockout = this.result.StageName[0].Description.toLowerCase() !== 'first stage';
    this.round = 0;
    if (this.knockout) {
      if (this.result.StageName[0].Description === 'Round of 16') this.round = 1;
      else if (this.result.StageName[0].Description === 'Quarter-final')
        this.round = 2;
      else if (this.result.StageName[0].Description === 'Semi-final') this.round = 3;
      else if (this.result.StageName[0].Description === 'Final') this.round = 4;
      else this.round = -1; // play-off for 3rd
    }
  }

  public status(): string {
    if (this.complete) {
      let tmpstr = `FINAL: ${this.awayGoals} - ${this.homeGoals}`;

      if (this.knockout && this.awayGoals === this.homeGoals)
        tmpstr =
          tmpstr + ` P[${this.awayPenaltyGoals} - ${this.homePenaltyGoals}]`;

      let homeUserScore = 0;
      let awayUserScore = 0;
      if (this.homeUser.name === this.awayUser.name) {
        homeUserScore = this.getAwardedPoints(this.home.abbr) + this.getAwardedPoints(this.away.abbr);
      } else {
        homeUserScore = this.getAwardedPoints(this.home.abbr);
        awayUserScore = this.getAwardedPoints(this.away.abbr);
      }

      if (
        homeUserScore > 0 &&
        awayUserScore > 0 &&
        !this.homeUser.isNone() &&
        !this.awayUser.isNone()
      ) {
        tmpstr = tmpstr + `, ${this.homeUser.name} +${homeUserScore}, ${this.awayUser.name} +${awayUserScore}`;
      }
      else if (homeUserScore > 0 && !this.homeUser.isNone())
        tmpstr = tmpstr + `, ${this.homeUser.name} +${homeUserScore}`;
      else if (awayUserScore > 0 && !this.awayUser.isNone())
        tmpstr = tmpstr + `, ${this.awayUser.name} +${awayUserScore}`;

      return tmpstr;
    }

    if (this.active) {
      return `IN PROGRESS: ${this.awayGoals} - ${this.homeGoals}`;
    }

    return new Date(this.gt).toLocaleString();
  }

  public miniStatusTop(): string {
    if (this.complete) {
      let tmpstr = `FINAL: ${this.awayGoals} - ${this.homeGoals}`;

      if (this.knockout && this.awayGoals === this.homeGoals)
        tmpstr =
          tmpstr + ` P[${this.awayPenaltyGoals} - ${this.homePenaltyGoals}]`;

      return tmpstr;
    }

    if (this.active) {
      return `IN PROGRESS: ${this.awayGoals} - ${this.homeGoals}`;
    }

    return new Date(this.gt).toLocaleString();
  }

  public miniStatusBottom(): string {
    if (this.complete) {
      let tmpstr = '';

      let homeUserScore = 0;
      let awayUserScore = 0;
      if (this.homeUser.abbr() === this.awayUser.abbr()) {
        homeUserScore =
          this.getAwardedPoints(this.home.abbr) + this.getAwardedPoints(this.away.abbr);
      } else {
        homeUserScore = this.getAwardedPoints(this.home.abbr);
        awayUserScore = this.getAwardedPoints(this.away.abbr);
      }

      if (
        homeUserScore > 0 &&
        awayUserScore > 0 &&
        !this.homeUser.isNone() &&
        !this.awayUser.isNone()
      )
        tmpstr =
          tmpstr +
          `${this.homeUser.name} +${homeUserScore}, ${this.awayUser.name} +${awayUserScore}`;
      else if (homeUserScore > 0 && !this.homeUser.isNone())
        tmpstr = tmpstr + `${this.homeUser.name} +${homeUserScore}`;
      else if (awayUserScore > 0 && !this.awayUser.isNone())
        tmpstr = tmpstr + `${this.awayUser.name} +${awayUserScore}`;

      return tmpstr;
    }

    return '';
  }

  public roundStr() {
    if (this.round === 1) return '16';
    if (this.round === 2) return 'QF';
    if (this.round === 3) return 'SF';
    if (this.round === 4) return 'F';

    return '';
  }

  public tie(abstract?: IGameSimulationResult): boolean {
    const homeGoals = abstract ? abstract.homeGoals : this.homeGoals;
    const awayGoals = abstract ? abstract.awayGoals : this.awayGoals;

    if (this.complete || abstract) {
      if (this.knockout) return false;

      return homeGoals === awayGoals;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public winner(abstract?: IGameSimulationResult): ITeam {
    if (this.complete || abstract) {
      
      const home = abstract ? this.teamdb.get(abstract.homeTeamAbbr) : this.home;
      const away = abstract ? this.teamdb.get(abstract.awayTeamAbbr) : this.away;
      const homeGoals = abstract ? abstract.homeGoals : this.homeGoals;
      const awayGoals = abstract ? abstract.awayGoals : this.awayGoals;
      const homePenaltyGoals = abstract ? abstract.homePenaltyGoals : this.homePenaltyGoals;
      const awayPenaltyGoals = abstract ? abstract.awayPenaltyGoals : this.awayPenaltyGoals;

      // if (!this.knockout && homeScore === awayScore)
      //   throw Error('Game ended in a tie');

      if (homeGoals === awayGoals) {
        if (homePenaltyGoals > awayPenaltyGoals) return home;
        return away;
      }

      if (homeGoals > awayGoals) return home;
      return away;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public winnerAbbr(abstract?: IGameSimulationResult): string {
    if (this.complete || abstract) {
      
      const homeTeamAbbr = abstract ? abstract.homeTeamAbbr : this.home.abbr;
      const awayTeamAbbr = abstract ? abstract.awayTeamAbbr : this.away.abbr;
      const homeGoals = abstract ? abstract.homeGoals : this.homeGoals;
      const awayGoals = abstract ? abstract.awayGoals : this.awayGoals;
      const homePenaltyGoals = abstract ? abstract.homePenaltyGoals : this.homePenaltyGoals;
      const awayPenaltyGoals = abstract ? abstract.awayPenaltyGoals : this.awayPenaltyGoals;

      // if (!this.knockout && homeGoals === awayGoals)
      //   throw Error('Game ended in a tie');

      if (homeGoals === awayGoals) {
        if (homePenaltyGoals > awayPenaltyGoals) return homeTeamAbbr;
        return awayTeamAbbr;
      }

      if (homeGoals > awayGoals) return homeTeamAbbr;
      return awayTeamAbbr;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public winnerLogOdds(abstract?: IGameSimulationResult): number {
    if (this.complete || abstract) {
      
      const homeLogOdds = abstract ? abstract.homeLogOdds : this.home.logOdds;
      const awayLogOdds = abstract ? abstract.awayLogOdds : this.away.logOdds;
      const homeGoals = abstract ? abstract.homeGoals : this.homeGoals;
      const awayGoals = abstract ? abstract.awayGoals : this.awayGoals;
      const homePenaltyGoals = abstract ? abstract.homePenaltyGoals : this.homePenaltyGoals;
      const awayPenaltyGoals = abstract ? abstract.awayPenaltyGoals : this.awayPenaltyGoals;

      // if (!this.knockout && homeGoals === awayGoals)
      //   throw Error('Game ended in a tie');

      if (homeGoals === awayGoals) {
        if (homePenaltyGoals > awayPenaltyGoals) return homeLogOdds;
        return awayLogOdds;
      }

      if (homeGoals > awayGoals) return homeLogOdds;
      return awayLogOdds;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public getAwardedPoints(abbr: string, abstract?: IGameSimulationResult): number {
    if (!this.complete && !abstract) return 0;

    if (this.round === -1) // playoff for 3rd doesnt count for points
      return 0;

    let ro16Bonus = 0;
    if (this.round === 1) // bonus point for making it to knockout
      ro16Bonus = 1;

    let finalBonus = 0;
    if (this.round === 4) // bonus point for winning the final
      finalBonus = 1;

    if (this.tie(abstract)) return 1;

    if (this.winnerAbbr(abstract) === abbr) {
      return 3 + ro16Bonus + finalBonus;
    }

    return ro16Bonus;
  }

  public gameStr(): string {
    if (this.complete) {
      if (this.tie())
        return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${
          this.round
        }, None, ${this.awayGoals}, ${this.homeGoals}),`;

      return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${
        this.round
      }, ${this.winner().cleanName()}, ${this.awayGoals}, ${this.homeGoals}),`;
    }

    return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${
      this.round
    }),`;
  }

  simulate(write: boolean, results: IGameSimulationResult[], teamGroups?: TeamGroupsRanked): IGameSimulationResult {
    if (this.complete) 
      return {
        homeTeamAbbr: this.home.abbr,
        awayTeamAbbr: this.away.abbr,
        winnerTeamAbbr: this.winnerAbbr(),
        homeLogOdds: this.home.logOdds,
        awayLogOdds: this.away.logOdds,
        homeGoals: this.homeGoals,
        awayGoals: this.awayGoals,
        homePenaltyGoals: this.homePenaltyGoals,
        awayPenaltyGoals: this.awayPenaltyGoals,
        homeAwardedPoints: this.getAwardedPoints(this.home.abbr),
        awayAwardedPoints: this.getAwardedPoints(this.away.abbr),
        round: this.round,
        group: this.home.group
      };

    let result: IGameSimulationResult = {
      homeTeamAbbr: this.home.abbr,
      awayTeamAbbr: this.away.abbr,
      winnerTeamAbbr: '',
      homeLogOdds: this.home.logOdds,
      awayLogOdds: this.away.logOdds,
      homeGoals: 0,
      awayGoals: 0,
      homePenaltyGoals: 0,
      awayPenaltyGoals: 0,
      homeAwardedPoints: 0,
      awayAwardedPoints: 0,
      round: this.round
    };

    if (this.round === 0)
      result.group = this.home.group;

    if (this.home.rank === 0) {
      if (this.round === 1 && teamGroups) {
        const groupRank = Number(this.home.name[0]) - 1;
        const group = this.home.name[1];

        result.homeTeamAbbr = teamGroups[group][groupRank].abbr;
        result.homeLogOdds = teamGroups[group][groupRank].logOdds;
      } else if (this.home.name[0] === 'W') {
        const gameIndex = Number(this.home.name.substring(1)) - 1;

        result.homeTeamAbbr = this.winnerAbbr(results[gameIndex]);
        result.homeLogOdds = this.winnerLogOdds(results[gameIndex]);
      }

      if (write) {
        this.home = this.teamdb.get(result.homeTeamAbbr);
        this.homeUser = this.draftdb.getUserByAbbr(result.homeTeamAbbr);
      }
    }

    if (this.away.rank === 0) {
      if (this.round === 1 && teamGroups) {
        const groupRank = Number(this.away.name[0]) - 1;
        const group = this.away.name[1];

        result.awayTeamAbbr = teamGroups[group][groupRank].abbr;
        result.awayLogOdds = teamGroups[group][groupRank].logOdds;
      } else if (this.away.name[0] === 'W') {
        const gameIndex = Number(this.away.name.substring(1)) - 1;

        result.awayTeamAbbr = this.winnerAbbr(results[gameIndex]);
        result.awayLogOdds = this.winnerLogOdds(results[gameIndex]);
      }

      if (write) {
        this.away = this.teamdb.get(result.awayTeamAbbr);
        this.awayUser = this.draftdb.getUserByAbbr(result.awayTeamAbbr);
      }
    }

    let homeBonus = 0;
    let awayBonus = 0;
    if (result.homeLogOdds > result.awayLogOdds) {
      awayBonus = result.homeLogOdds - result.awayLogOdds;
    } else {
      homeBonus = result.awayLogOdds - result.homeLogOdds;
    }

    result.homeGoals = gaussianRandom(.5, 1) + homeBonus;
    result.awayGoals = gaussianRandom(.5, 1) + awayBonus;
    
    if (result.homeGoals < 0) {
      result.awayGoals -= result.homeGoals;
      result.homeGoals = 0;
    }

    if (result.awayGoals < 0) {
      result.homeGoals -= result.awayGoals;
      result.awayGoals = 0;
    }
    result.homeGoals = Math.round(result.homeGoals);
    result.awayGoals = Math.round(result.awayGoals);

    if (write) {
      this.homeGoals = result.homeGoals;
      this.awayGoals = result.awayGoals;
    }

    if (result.homeGoals === result.awayGoals && this.knockout) {
      while (result.homePenaltyGoals === result.awayPenaltyGoals) {
        result.homePenaltyGoals = Math.round(Math.random() * 5)
        result.awayPenaltyGoals = Math.round(Math.random() * 5)
      }

      if (write) {
        this.homePenaltyGoals = result.homePenaltyGoals;
        this.awayPenaltyGoals = result.awayPenaltyGoals;
      }
    }

    result.homeAwardedPoints = this.getAwardedPoints(result.homeTeamAbbr, result);
    result.awayAwardedPoints = this.getAwardedPoints(result.awayTeamAbbr, result);
    if (this.tie(result))
        result.winnerTeamAbbr = 'TIE';
    else
        result.winnerTeamAbbr = this.winnerAbbr(result);

    if (write) {
      this.active = false;
      this.complete = true;

      this.home.registerGame(this);
      this.away.registerGame(this);
    }

    return result;
  }

  includesTeam(team: ITeam): boolean {
    return this.away.abbr === team.abbr || this.home.abbr === team.abbr;
  }

  compare(game: IGame): boolean {
    if (
      this.active !== game.active ||
      this.complete !== game.complete ||
      this.awayGoals !== game.awayGoals ||
      this.homeGoals !== game.homeGoals ||
      this.awayPenaltyGoals !== game.awayPenaltyGoals ||
      this.homePenaltyGoals !== game.homePenaltyGoals
    )
      return false;

    return true;
  }
}
