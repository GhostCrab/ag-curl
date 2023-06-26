import { gaussianRandom } from '../app.util';
import { DraftDatabaseService } from '../core/services/draft-database.service';
import { TeamDatabaseService } from '../core/services/team-database.service';
import { FIFADataResult } from './fifa-api.interface';
import { ITeam } from './team.interface';
import { IUser } from './user.interface';

export interface IGame {
  id: number;
  home: ITeam;
  away: ITeam;
  homeScore: number;
  awayScore: number;
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
  winner(): ITeam;
  getScore(abbr: string): number;
  gameStr(): string;
  roundStr(): string;
  simulate(games: IGame[], teamGroups?: { [key: string]: ITeam[]; }): void;
  includesTeam(team: ITeam): boolean;
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

  private matchTime: string;
  private teamdb: TeamDatabaseService;
  private draftdb: DraftDatabaseService;

  //https://api.fifa.com/api/v3/picture/flags-{format}-{size}/ECU

  constructor(
    result: FIFADataResult,
    teamdb: TeamDatabaseService,
    draftdb: DraftDatabaseService
  ) {
    this.id = result.MatchNumber;
    this.home = teamdb.get(result.Home?.Abbreviation ? result.Home.Abbreviation : result.PlaceHolderA);
    this.away = teamdb.get(result.Away?.Abbreviation ? result.Away.Abbreviation : result.PlaceHolderB);
    this.homeScore = result.HomeTeamScore === null ? 0 : result.HomeTeamScore;
    this.awayScore = result.AwayTeamScore === null ? 0 : result.AwayTeamScore;
    this.homePenaltyScore =
      result.HomeTeamPenaltyScore === null ? 0 : result.HomeTeamPenaltyScore;
    this.awayPenaltyScore =
      result.AwayTeamPenaltyScore === null ? 0 : result.AwayTeamPenaltyScore;
    this.active = result.MatchStatus === 3;
    this.complete = result.MatchStatus === 0;
    this.gt = new Date(result.LocalDate).getTime() - 10800000;
    this.homeUser = draftdb.getUserByAbbr(this.home.abbr);
    this.awayUser = draftdb.getUserByAbbr(this.away.abbr);
    this.knockout = result.StageName[0].Description.toLowerCase() !== 'first stage';
    this.matchTime = result.MatchTime === null ? '' : result.MatchTime;
    this.round = 0;
    if (this.knockout) {
      if (result.StageName[0].Description === 'Round of 16') this.round = 1;
      else if (result.StageName[0].Description === 'Quarter-final')
        this.round = 2;
      else if (result.StageName[0].Description === 'Semi-final') this.round = 3;
      else if (result.StageName[0].Description === 'Final') this.round = 4;
      else this.round = -1; // play-off for 3rd
    }

    this.teamdb = teamdb;
    this.draftdb = draftdb;

    if (this.complete) {
      this.home.registerGame(this);
      this.away.registerGame(this);
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

  public tie(): boolean {
    if (this.complete) {
      if (this.knockout) return false;

      return this.homeScore === this.awayScore;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public winner(): ITeam {
    if (this.complete) {
      if (!this.knockout && this.homeScore === this.awayScore)
        throw Error('Game ended in a tie');

      if (this.homeScore === this.awayScore) {
        if (this.homePenaltyScore > this.awayPenaltyScore) return this.home;
        return this.away;
      }

      if (this.homeScore > this.awayScore) return this.home;
      return this.away;
    }

    throw Error('Attempted to get winner from incomplete game');
  }

  public getScore(abbr: string): number {
    if (!this.complete) return 0;

    if (this.round === -1) // playoff for 3rd doesnt count for points
      return 0;

    let ro16Bonus = 0;
    if (this.round === 1) // bonus point for making it to knockout
      ro16Bonus = 1;

    let finalBonus = 0;
    if (this.round === 4) // bonus point for winning the final
      finalBonus = 1;

    if (this.tie()) return 1;

    if (this.winner().abbr === abbr) {
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

  simulate(games: IGame[], teamGroups?: { [key: string]: ITeam[]; }): void {
    if (this.complete) return;

    if (this.home.rank === 0) {
      if (this.round === 1 && teamGroups) {
        const groupRank = Number(this.home.name[0]) - 1;
        const group = this.home.name[1];

        this.home = teamGroups[group][groupRank];
        this.homeUser = this.draftdb.getUserByAbbr(this.home.abbr);
      } else if (this.home.name[0] === 'W') {
        const gameIndex = Number(this.home.name.substring(1)) - 1;
        if (gameIndex < games.length && games[gameIndex].complete) {
          this.home = games[gameIndex].winner();
          this.homeUser = this.draftdb.getUserByAbbr(this.home.abbr);
        }
      }
    }

    if (this.away.rank === 0) {
      if (this.round === 1 && teamGroups) {
        const groupRank = Number(this.away.name[0]) - 1;
        const group = this.away.name[1];

        this.away = teamGroups[group][groupRank];
        this.awayUser = this.draftdb.getUserByAbbr(this.away.abbr);
      } else if (this.away.name[0] === 'W') {
        const gameIndex = Number(this.away.name.substring(1)) - 1;
        if (gameIndex < games.length && games[gameIndex].complete) {
          this.away = games[gameIndex].winner();
          this.awayUser = this.draftdb.getUserByAbbr(this.away.abbr);
        }
      }
    }

    let homeBonus = 0;
    let awayBonus = 0;
    if (this.home.logOdds > this.away.logOdds) {
      awayBonus = this.home.logOdds - this.away.logOdds;
    } else {
      homeBonus = this.away.logOdds - this.home.logOdds;
    }
    this.homeScore = gaussianRandom(.5, 1) + homeBonus;
    this.awayScore = gaussianRandom(.5, 1) + awayBonus;

    if (this.homeScore < 0) {
      this.awayScore -= this.homeScore;
      this.homeScore = 0;
    }

    if (this.awayScore < 0) {
      this.homeScore -= this.awayScore;
      this.awayScore = 0;
    }
    this.homeScore = Math.round(this.homeScore);
    this.awayScore = Math.round(this.awayScore);

    if (this.homeScore === this.awayScore && this.knockout) {
      while (this.homePenaltyScore === this.awayPenaltyScore) {
        this.homePenaltyScore = Math.round(Math.random() * 5)
        this.awayPenaltyScore = Math.round(Math.random() * 5)
      }
    }

    this.active = false;
    this.complete = true;

    this.home.registerGame(this);
    this.away.registerGame(this);
  }

  includesTeam(team: ITeam): boolean {
    return this.away.abbr === team.abbr || this.home.abbr === team.abbr;
  }
}
