import { gaussianRandom } from '../app.util';
import { DraftDatabaseService } from '../core/services/draft-database.service';
import { TeamDatabaseService, TeamGroupDict, TeamGroupsRanked } from '../core/services/team-database.service';
import { UserDatabaseService } from '../core/services/user-database.service';
import { FIFADataResult } from './fifa-api.interface';
import { IGameSimulationResult } from './simulation.interface';
import { ITeam } from './team.interface';
import { MetaDataType, Status, UEFAMatch } from './uefa-api.interface';
import { IUser } from './user.interface';

export interface IGameInitializer {
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
}

export function newGameFromUEFA(match: UEFAMatch, teamdb: TeamDatabaseService, draftdb: DraftDatabaseService): Game {
  const homeTeamAbbr = match.homeTeam.teamCode !== '' ? match.homeTeam.teamCode : match.homeTeam.internationalName;
  const awayTeamAbbr = match.awayTeam.teamCode !== '' ? match.awayTeam.teamCode : match.awayTeam.internationalName;

  let homeTeam, awayTeam: ITeam;
  let homeUser, awayUser: IUser;

  homeTeam = teamdb.get(homeTeamAbbr);
  homeUser = draftdb.getUserByAbbr(homeTeam.abbr);

  awayTeam = teamdb.get(awayTeamAbbr);
  awayUser = draftdb.getUserByAbbr(awayTeam.abbr);

  const init: IGameInitializer = {
    id: match.matchNumber || 0,
    home: homeTeam,
    away: awayTeam,
    homeGoals: match.score?.total.home || match.score?.regular.home || 0,
    awayGoals: match.score?.total.away || match.score?.regular.away || 0,
    homePenaltyGoals: match.score?.penalty?.home || 0,
    awayPenaltyGoals: match.score?.penalty?.away || 0,
    active: match.status !== Status.Finished && match.status !== Status.Upcoming,
    complete: match.status === Status.Finished,
    gt: new Date(match.kickOffTime.dateTime).getTime(),
    homeUser: homeUser,
    awayUser: awayUser,
    knockout: match.round.metaData.type !== MetaDataType.GroupStandings,
    round: 0
  }

  if (init.knockout) {
    if (match.round.metaData.type === MetaDataType.RoundOf16) init.round = 1;
    else if (match.round.metaData.type === MetaDataType.QuarterFinals) init.round = 2;
    else if (match.round.metaData.type === MetaDataType.Semifinal) init.round = 3;
    else if (match.round.metaData.type === MetaDataType.Final) init.round = 4;
    else init.round = -1; // play-off for 3rd
  }

  return new Game(init, teamdb, draftdb);
}

export function newGameFromFIFA(result: FIFADataResult, teamdb: TeamDatabaseService, draftdb: DraftDatabaseService): Game {
  const homeTeam = teamdb.get(result.Home?.Abbreviation ? result.Home.Abbreviation : result.PlaceHolderA);
  const awayTeam = teamdb.get(result.Away?.Abbreviation ? result.Away.Abbreviation : result.PlaceHolderB);

  const homeUser = draftdb.getUserByAbbr(homeTeam.abbr);
  const awayUser = draftdb.getUserByAbbr(awayTeam.abbr);
  
  const init: IGameInitializer = {
    id: result.MatchNumber,
    home: homeTeam,
    away: awayTeam,
    homeGoals: result.HomeTeamScore === null ? 0 : result.HomeTeamScore,
    awayGoals: result.AwayTeamScore === null ? 0 : result.AwayTeamScore,
    homePenaltyGoals: result.HomeTeamPenaltyScore === null ? 0 : result.HomeTeamPenaltyScore,
    awayPenaltyGoals: result.AwayTeamPenaltyScore === null ? 0 : result.AwayTeamPenaltyScore,
    active: result.MatchStatus === 3,
    complete: result.MatchStatus === 0,
    gt: new Date(result.Date).getTime(),
    homeUser: homeUser,
    awayUser: awayUser,
    knockout: result.StageName[0].Description.toLowerCase() !== 'first stage',
    round: 0
  }
  
  if (init.knockout) {
    if (result.StageName[0].Description === 'Round of 16') init.round = 1;
    else if (result.StageName[0].Description === 'Quarter-final')
      init.round = 2;
    else if (result.StageName[0].Description === 'Semi-final') init.round = 3;
    else if (result.StageName[0].Description === 'Final') init.round = 4;
    else init.round = -1; // play-off for 3rd
  }

  return new Game(init, teamdb, draftdb);
}

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
  reinitialize(): void;
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
    private readonly init: IGameInitializer,
    private readonly teamdb: TeamDatabaseService,
    private readonly draftdb: DraftDatabaseService
  ) {
    this.reinitialize();
  }

  public reinitialize(): void {
    this.id = this.init.id;
    this.home = this.init.home;
    this.away = this.init.away;
    this.homeGoals = this.init.homeGoals;
    this.awayGoals = this.init.awayGoals;
    this.homePenaltyGoals = this.init.homePenaltyGoals;
    this.awayPenaltyGoals = this.init.awayPenaltyGoals;
    this.active = this.init.active;
    this.complete = this.init.complete;
    this.gt = this.init.gt;
    this.homeUser = this.init.homeUser;
    this.awayUser = this.init.awayUser;
    this.knockout = this.init.knockout;
    this.round = this.init.round;
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

  getBestGroupOf3rds(groups: string, teamGroups: TeamGroupsRanked): string {
    // playing 1C
    const thirdGroupStr = teamGroups['3'].slice(0, 4).map(info => info.group).sort().join("");

    /*
    ABCD 3A 3D 3B 3C
    ABCE 3A 3E 3B 3C
    ABCF 3A 3F 3B 3C
    ABDE 3D 3E 3A 3B
    ABDF 3D 3F 3A 3B
    ABEF 3E 3F 3B 3A
    ACDE 3E 3D 3C 3A
    ACDF 3F 3D 3C 3A
    ACEF 3E 3F 3C 3A
    ADEF 3E 3F 3D 3A
    BCDE 3E 3D 3B 3C
    BCDF 3F 3D 3C 3B
    BCEF 3F 3E 3C 3B
    BDEF 3F 3E 3D 3B
    CDEF 3F 3E 3D 3C
    */

    // vs 1B
    if (groups === 'ADEF') {
      if (thirdGroupStr === 'ABCF' || thirdGroupStr === 'ABCE' || thirdGroupStr === 'ABCD') return 'A';
      if (thirdGroupStr === 'ABDF' || thirdGroupStr === 'ABDE') return 'D';
      if (thirdGroupStr === 'BCDE' || thirdGroupStr === 'ADEF' || thirdGroupStr === 'ACEF' || thirdGroupStr === 'ACDE' || thirdGroupStr === 'ABEF') return 'E';
      if (thirdGroupStr === 'CDEF' || thirdGroupStr === 'BDEF' || thirdGroupStr === 'BCEF' || thirdGroupStr === 'BCDF' || thirdGroupStr === 'ACDF') return 'F';
    }

    // vs 1C
    if (groups === 'DEF') {
      if (thirdGroupStr === 'ABCD' || thirdGroupStr === 'ACDE' || thirdGroupStr === 'ACDF' || thirdGroupStr === 'BCDE' || thirdGroupStr === 'BCDF') return 'D';
      if (thirdGroupStr === 'ABCE' || thirdGroupStr === 'ABDE' || thirdGroupStr === 'BCEF' || thirdGroupStr === 'BDEF' || thirdGroupStr === 'CDEF') return 'E';
      if (thirdGroupStr === 'ABCF' || thirdGroupStr === 'ABDF' || thirdGroupStr === 'ABEF' || thirdGroupStr === 'ACEF' || thirdGroupStr === 'ADEF') return 'F';
    }

    // vs 1E
    if (groups === 'ABCD') {
      if (thirdGroupStr === 'ABDE' || thirdGroupStr === 'ABDF') return 'A';
      if (thirdGroupStr === 'ABCD' || thirdGroupStr === 'ABCE' || thirdGroupStr === 'ABCF' || thirdGroupStr === 'ABEF' || thirdGroupStr === 'BCDE') return 'B';
      if (thirdGroupStr === 'ACDE' || thirdGroupStr === 'ACDF' || thirdGroupStr === 'ACEF' || thirdGroupStr === 'BCDF' || thirdGroupStr === 'BCEF') return 'C';
      if (thirdGroupStr === 'ADEF' || thirdGroupStr === 'BDEF' || thirdGroupStr === 'CDEF') return 'D';
    }

    // vs 1F
    if (groups === 'ABC') {
      if (thirdGroupStr === 'ABEF' || thirdGroupStr === 'ACDE' || thirdGroupStr === 'ACDF' || thirdGroupStr === 'ACEF' || thirdGroupStr === 'ADEF') return 'A';
      if (thirdGroupStr === 'ABDE' || thirdGroupStr === 'ABDF' || thirdGroupStr === 'BCDF' || thirdGroupStr === 'BCEF' || thirdGroupStr === 'BDEF') return 'B';
      if (thirdGroupStr === 'ABCD' || thirdGroupStr === 'ABCE' || thirdGroupStr === 'ABCF' || thirdGroupStr === 'BCDE' || thirdGroupStr === 'CDEF') return 'C';
    }

    return 'X';
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
        const group = this.home.name.slice(-1);

        result.homeTeamAbbr = teamGroups[group][groupRank].abbr;
        result.homeLogOdds = teamGroups[group][groupRank].logOdds;
      } else if (this.home.name[0] === 'W') {
        const gameIndex = Number(this.home.name.substring(1)) - 1;

        result.homeTeamAbbr = this.winnerAbbr(results[gameIndex]);
        result.homeLogOdds = this.winnerLogOdds(results[gameIndex]);
      } else if (this.home.name.length === 7) {
        const [homeAbbr, awayAbbr] = this.home.name.split('/');
        for (let gameIndex = results.length - 1; gameIndex >= 0; gameIndex--) {
          if(results[gameIndex].awayTeamAbbr === awayAbbr && results[gameIndex].homeTeamAbbr === homeAbbr) {
            result.homeTeamAbbr = this.winnerAbbr(results[gameIndex]);
            result.homeLogOdds = this.winnerLogOdds(results[gameIndex]);
            break;
          };
        }
      }

      if (write) {
        this.home = this.teamdb.get(result.homeTeamAbbr);
        this.homeUser = this.draftdb.getUserByAbbr(result.homeTeamAbbr);
      }
    }

    

    if (this.away.rank === 0) {
      if (this.round === 1 && teamGroups) {
        const groupRank = Number(this.away.name[0]) - 1;
        let group = this.away.name.slice(-1);

        if (groupRank === 2) {
          switch(this.home.name) {
            case '3rd: D/E/F': {
              group = this.getBestGroupOf3rds('DEF', teamGroups)
            } break;
            case '3rd: A/D/E/F': {
              group = this.getBestGroupOf3rds('ADEF', teamGroups)
            } break;
            case '3rd: A/B/C': {
              group = this.getBestGroupOf3rds('ABC', teamGroups)
            } break;
            case '3rd: A/B/C/D': {
              group = this.getBestGroupOf3rds('ABCD', teamGroups)
            } break;
          }
        }

        result.awayTeamAbbr = teamGroups[group][groupRank].abbr;
        result.awayLogOdds = teamGroups[group][groupRank].logOdds;
      } else if (this.away.name[0] === 'W') {
        const gameIndex = Number(this.away.name.substring(1)) - 1;

        result.awayTeamAbbr = this.winnerAbbr(results[gameIndex]);
        result.awayLogOdds = this.winnerLogOdds(results[gameIndex]);
      } else if (this.away.name.length === 7) {
        const [homeAbbr, awayAbbr] = this.away.name.split('/');
        for (let gameIndex = results.length - 1; gameIndex >= 0; gameIndex--) {
          if(results[gameIndex].awayTeamAbbr === awayAbbr && results[gameIndex].homeTeamAbbr === homeAbbr) {
            result.awayTeamAbbr = this.winnerAbbr(results[gameIndex]);
            result.awayLogOdds = this.winnerLogOdds(results[gameIndex]);
            break;
          };
        }
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
