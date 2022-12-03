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
    homeImg: string;
    awayImg: string;
    homeUser: IUser;
    awayUser: IUser;
    knockout: boolean;

    status(): string;
    miniStatusTop(): string;
    miniStatusBottom(): string;
    tie(): boolean;
    winner(): ITeam;
    getScore(abbr: string): number;
    gameStr(): string;
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
    public homeImg: string;
    public awayImg: string;
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
        this.home = teamdb.get(result.Home.Abbreviation);
        this.away = teamdb.get(result.Away.Abbreviation);
        this.homeScore =
            result.HomeTeamScore === null ? 0 : result.HomeTeamScore;
        this.awayScore =
            result.AwayTeamScore === null ? 0 : result.AwayTeamScore;
        this.homePenaltyScore =
            result.HomeTeamPenaltyScore === null
                ? 0
                : result.HomeTeamPenaltyScore;
        this.awayPenaltyScore =
            result.AwayTeamPenaltyScore === null
                ? 0
                : result.AwayTeamPenaltyScore;
        this.active = result.MatchStatus === 3;
        this.complete = result.MatchStatus === 0;
        this.gt = new Date(result.LocalDate).getTime() - 10800000;
        this.homeImg = result.Home.PictureUrl.replace('{format}', 'sq').replace(
            '{size}',
            '1'
        );
        this.awayImg = result.Away.PictureUrl.replace('{format}', 'sq').replace(
            '{size}',
            '1'
        );
        this.homeUser = draftdb.getUserByAbbr(result.Home.Abbreviation);
        this.awayUser = draftdb.getUserByAbbr(result.Away.Abbreviation);
        this.knockout = result.StageName[0].Description !== 'First stage';
        this.matchTime = result.MatchTime === null ? '' : result.MatchTime;
        this.round = 0;
        if (this.knockout) {
            if (result.StageName[0].Description === "Round of 16") this.round = 1;
            else if (result.StageName[0].Description === "Quarter-final") this.round = 2;
            else if (result.StageName[0].Description === "Semi-final") this.round = 3;
            else if (result.StageName[0].Description === "Final") this.round = 4;
            else this.round = -1; // play-off for 3rd
        }

        this.teamdb = teamdb;
        this.draftdb = draftdb;
    }

    public status(): string {
        if (this.complete) {
            let tmpstr = `FINAL: ${this.awayScore} - ${this.homeScore}`;

            if (this.knockout && this.awayScore === this.homeScore)
                tmpstr =
                    tmpstr +
                    ` P[${this.awayPenaltyScore} - ${this.homePenaltyScore}]`;

            let homeUserScore = 0;
            let awayUserScore = 0;
            if (this.homeUser.abbr() === this.awayUser.abbr()) {
                homeUserScore = this.getScore(this.home.abbr) + this.getScore(this.away.abbr);
            } else {
                homeUserScore = this.getScore(this.home.abbr);
                awayUserScore = this.getScore(this.away.abbr);
            }

            if (homeUserScore > 0 && awayUserScore > 0 && !this.homeUser.isNone() && !this.awayUser.isNone())
                tmpstr = tmpstr + `, ${this.homeUser.name} +${homeUserScore}, ${this.awayUser.name} +${awayUserScore}`;
            else if (homeUserScore > 0 && !this.homeUser.isNone())
                tmpstr = tmpstr + `, ${this.homeUser.name} +${homeUserScore}`
            else if (awayUserScore > 0 && !this.awayUser.isNone())
                tmpstr = tmpstr + `, ${this.awayUser.name} +${awayUserScore}`

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
                    tmpstr +
                    ` P[${this.awayPenaltyScore} - ${this.homePenaltyScore}]`;

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
                homeUserScore = this.getScore(this.home.abbr) + this.getScore(this.away.abbr);
            } else {
                homeUserScore = this.getScore(this.home.abbr);
                awayUserScore = this.getScore(this.away.abbr);
            }

            if (homeUserScore > 0 && awayUserScore > 0 && !this.homeUser.isNone() && !this.awayUser.isNone())
                tmpstr = tmpstr + `, ${this.homeUser.name} +${homeUserScore}, ${this.awayUser.name} +${awayUserScore}`;
            else if (homeUserScore > 0 && !this.homeUser.isNone())
                tmpstr = tmpstr + `, ${this.homeUser.name} +${homeUserScore}`
            else if (awayUserScore > 0 && !this.awayUser.isNone())
                tmpstr = tmpstr + `, ${this.awayUser.name} +${awayUserScore}`

            return tmpstr;
        }

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
                if (this.homePenaltyScore > this.awayPenaltyScore)
                    return this.home;
                return this.away;
            }

            if (this.homeScore > this.awayScore) return this.home;
            return this.away;
        }

        throw Error('Attempted to get winner from incomplete game');
    }

    public getScore(abbr: string): number {
        if (!this.complete) return 0;

        let ro16Bonus = 0;
        if (this.round === 1) // bonus point for making it to round of 16
            ro16Bonus = 1;

        let finalBonus = 0;
        if (this.round === 4) // bonus point for making it to round of 16
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
                return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}, None, ${this.awayScore}, ${this.homeScore}),`

            return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}, ${this.winner().cleanName()}, ${this.awayScore}, ${this.homeScore}),`
        }

        return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}),`
    }
}
