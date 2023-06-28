import { gaussianRandom } from '../app.util';
import { DraftDatabaseService } from '../core/services/draft-database.service';
import { TeamDatabaseService, TeamGroupDict, TeamGroupsRanked } from '../core/services/team-database.service';
import { FIFADataResult } from './fifa-api.interface';
import { IGameSimulationResult } from './simulation.interface';
import { ITeam } from './team.interface';
import { IUser } from './user.interface';

export interface IGame {
  id: number;
  home: ITeam;
  away: ITeam;
  homeScore: number;
  awayScore: number;
  homePenaltyScore: number;
  awayPenaltyScore: number;
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
  getScore(abbr: string): number;
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
  public homeScore: number;
  public awayScore: number;
  public homePenaltyScore: number;
  public awayPenaltyScore: number;
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
    this.id = this.result.MatchNumber;
    this.home = this.teamdb.get(this.result.Home?.Abbreviation ? this.result.Home.Abbreviation : this.result.PlaceHolderA);
    this.away = this.teamdb.get(this.result.Away?.Abbreviation ? this.result.Away.Abbreviation : this.result.PlaceHolderB);
    this.homeScore = this.result.HomeTeamScore === null ? 0 : this.result.HomeTeamScore;
    this.awayScore = this.result.AwayTeamScore === null ? 0 : this.result.AwayTeamScore;
    this.homePenaltyScore =
      this.result.HomeTeamPenaltyScore === null ? 0 : this.result.HomeTeamPenaltyScore;
    this.awayPenaltyScore =
      this.result.AwayTeamPenaltyScore === null ? 0 : this.result.AwayTeamPenaltyScore;
    this.active = this.result.MatchStatus === 3;
    this.complete = this.result.MatchStatus === 0;
    this.gt = new Date(this.result.LocalDate).getTime() - 10800000;
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
      let tmpstr = `FINAL: ${this.awayScore} - ${this.homeScore}`;

      if (this.knockout && this.awayScore === this.homeScore)
        tmpstr =
          tmpstr + ` P[${this.awayPenaltyScore} - ${this.homePenaltyScore}]`;

      let homeUserScore = 0;
      let awayUserScore = 0;
      if (this.homeUser.name === this.awayUser.name) {
        homeUserScore = this.getScore(this.home.abbr) + this.getScore(this.away.abbr);
      } else {
        homeUserScore = this.getScore(this.home.abbr);
        awayUserScore = this.getScore(this.away.abbr);
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
      return `IN PROGRESS: ${this.awayScore} - ${this.homeScore}`;
    }

    return new Date(this.gt).toLocaleString();
  }

  public miniStatusTop(): string {
    if (this.complete) {
      let tmpstr = `FINAL: ${this.awayScore} - ${this.homeScore}`;

      if (this.knockout && this.awayScore === this.homeScore)
        tmpstr =
          tmpstr + ` P[${this.awayPenaltyScore} - ${this.homePenaltyScore}]`;

      return tmpstr;
    }

    if (this.active) {
      return `IN PROGRESS: ${this.awayScore} - ${this.homeScore}`;
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
          this.getScore(this.home.abbr) + this.getScore(this.away.abbr);
      } else {
        homeUserScore = this.getScore(this.home.abbr);
        awayUserScore = this.getScore(this.away.abbr);
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
    const homeScore = abstract ? abstract.homeScore : this.homeScore;
    const awayScore = abstract ? abstract.awayScore : this.awayScore;

    if (this.complete || abstract) {
      if (this.knockout) return false;

      return homeScore === awayScore;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public winner(abstract?: IGameSimulationResult): ITeam {
    if (this.complete || abstract) {
      
      const home = abstract ? this.teamdb.get(abstract.homeTeamAbbr) : this.home;
      const away = abstract ? this.teamdb.get(abstract.awayTeamAbbr) : this.home;
      const homeScore = abstract ? abstract.homeScore : this.homeScore;
      const awayScore = abstract ? abstract.awayScore : this.awayScore;
      const homePenaltyScore = abstract ? abstract.homePenaltyScore : this.homePenaltyScore;
      const awayPenaltyScore = abstract ? abstract.awayPenaltyScore : this.awayPenaltyScore;

      // if (!this.knockout && homeScore === awayScore)
      //   throw Error('Game ended in a tie');

      if (homeScore === awayScore) {
        if (homePenaltyScore > awayPenaltyScore) return home;
        return away;
      }

      if (homeScore > awayScore) return home;
      return away;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public winnerAbbr(abstract?: IGameSimulationResult): string {
    if (this.complete || abstract) {
      
      const homeTeamAbbr = abstract ? abstract.homeTeamAbbr : this.home.abbr;
      const awayTeamAbbr = abstract ? abstract.awayTeamAbbr : this.away.abbr;
      const homeScore = abstract ? abstract.homeScore : this.homeScore;
      const awayScore = abstract ? abstract.awayScore : this.awayScore;
      const homePenaltyScore = abstract ? abstract.homePenaltyScore : this.homePenaltyScore;
      const awayPenaltyScore = abstract ? abstract.awayPenaltyScore : this.awayPenaltyScore;

      // if (!this.knockout && homeScore === awayScore)
      //   throw Error('Game ended in a tie');

      if (homeScore === awayScore) {
        if (homePenaltyScore > awayPenaltyScore) return homeTeamAbbr;
        return awayTeamAbbr;
      }

      if (homeScore > awayScore) return homeTeamAbbr;
      return awayTeamAbbr;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public winnerLogOdds(abstract?: IGameSimulationResult): number {
    if (this.complete || abstract) {
      
      const homeLogOdds = abstract ? abstract.homeLogOdds : this.home.logOdds;
      const awayLogOdds = abstract ? abstract.awayLogOdds : this.away.logOdds;
      const homeScore = abstract ? abstract.homeScore : this.homeScore;
      const awayScore = abstract ? abstract.awayScore : this.awayScore;
      const homePenaltyScore = abstract ? abstract.homePenaltyScore : this.homePenaltyScore;
      const awayPenaltyScore = abstract ? abstract.awayPenaltyScore : this.awayPenaltyScore;

      // if (!this.knockout && homeScore === awayScore)
      //   throw Error('Game ended in a tie');

      if (homeScore === awayScore) {
        if (homePenaltyScore > awayPenaltyScore) return homeLogOdds;
        return awayLogOdds;
      }

      if (homeScore > awayScore) return homeLogOdds;
      return awayLogOdds;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public getScore(abbr: string, abstract?: IGameSimulationResult): number {
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
        }, None, ${this.awayScore}, ${this.homeScore}),`;

      return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${
        this.round
      }, ${this.winner().cleanName()}, ${this.awayScore}, ${this.homeScore}),`;
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
        homeScore: this.homeScore,
        awayScore: this.awayScore,
        homePenaltyScore: this.homePenaltyScore,
        awayPenaltyScore: this.awayPenaltyScore,
        homePoints: this.getScore(this.home.abbr),
        awayPoints: this.getScore(this.away.abbr),
        round: this.round,
        group: this.home.group
      };

    let result: IGameSimulationResult = {
      homeTeamAbbr: this.home.abbr,
      awayTeamAbbr: this.away.abbr,
      winnerTeamAbbr: '',
      homeLogOdds: this.home.logOdds,
      awayLogOdds: this.away.logOdds,
      homeScore: 0,
      awayScore: 0,
      homePenaltyScore: 0,
      awayPenaltyScore: 0,
      homePoints: 0,
      awayPoints: 0,
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

    result.homeScore = gaussianRandom(.5, 1) + homeBonus;
    result.awayScore = gaussianRandom(.5, 1) + awayBonus;
    
    if (result.homeScore < 0) {
      result.awayScore -= result.homeScore;
      result.homeScore = 0;
    }

    if (result.awayScore < 0) {
      result.homeScore -= result.awayScore;
      result.awayScore = 0;
    }
    result.homeScore = Math.round(result.homeScore);
    result.awayScore = Math.round(result.awayScore);

    if (write) {
      this.homeScore = result.homeScore;
      this.awayScore = result.awayScore;
    }

    if (result.homeScore === result.awayScore && this.knockout) {
      while (result.homePenaltyScore === result.awayPenaltyScore) {
        result.homePenaltyScore = Math.round(Math.random() * 5)
        result.awayPenaltyScore = Math.round(Math.random() * 5)
      }

      if (write) {
        this.homePenaltyScore = result.homePenaltyScore;
        this.awayPenaltyScore = result.awayPenaltyScore;
      }
    }

    result.homePoints = this.getScore(this.home.abbr, result);
    result.awayPoints = this.getScore(this.away.abbr, result);
    result.winnerTeamAbbr = this.winnerAbbr(result);

    if (write) {
      this.active = false;
      this.complete = true;
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
      this.awayScore !== game.awayScore ||
      this.homeScore !== game.homeScore ||
      this.awayPenaltyScore !== game.awayPenaltyScore ||
      this.homePenaltyScore !== game.homePenaltyScore
    )
      return false;

    return true;
  }
}
