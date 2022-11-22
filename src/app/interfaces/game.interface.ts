import { DraftDatabaseService } from "../core/services/draft-database.service";
import { TeamDatabaseService } from "../core/services/team-database.service";
import { FIFADataResult } from "./fifa-api.interface";
import { ITeam } from "./team.interface";
import { IUser } from "./user.interface";

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
    tie(): boolean;
    winner(): ITeam;
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

    private matchTime: string;

    //https://api.fifa.com/api/v3/picture/flags-{format}-{size}/ECU

    constructor(result: FIFADataResult, teamdb: TeamDatabaseService, draftdb: DraftDatabaseService) {
        this.id = result.MatchNumber;
        this.home = teamdb.get(result.Home.Abbreviation)
        this.away = teamdb.get(result.Away.Abbreviation)
        this.homeScore = (result.HomeTeamScore === null) ? 0 : result.HomeTeamScore;
        this.awayScore = (result.AwayTeamScore === null) ? 0 : result.AwayTeamScore;
        this.homePenaltyScore = (result.HomeTeamPenaltyScore === null) ? 0 : result.HomeTeamPenaltyScore;
        this.awayPenaltyScore = (result.AwayTeamPenaltyScore === null) ? 0 : result.AwayTeamPenaltyScore;
        this.active = result.MatchStatus > 1;
        this.complete = result.MatchStatus === 0;
        this.gt = new Date(result.LocalDate).getTime() - 10800000;
        this.homeImg = result.Home.PictureUrl.replace('{format}', 'sq').replace('{size}', '1');
        this.awayImg = result.Away.PictureUrl.replace('{format}', 'sq').replace('{size}', '1');
        this.homeUser = draftdb.getUserByAbbr(result.Home.Abbreviation);
        this.awayUser = draftdb.getUserByAbbr(result.Away.Abbreviation);
        this.knockout = result.StageName[0].Description !== "First stage";
        this.matchTime = (result.MatchTime === null) ? '' : result.MatchTime;
    }

    public status(): string {
        if (this.complete) {
            let tmpstr = `FINAL: ${this.awayScore} - ${this.homeScore}`;

            if (this.knockout && this.awayScore === this.homeScore)
                tmpstr = tmpstr + ` P[${this.awayPenaltyScore} - ${this.homePenaltyScore}]`;

            if (this.tie()) {
                if (this.homeUser.abbr() === this.awayUser.abbr()) tmpstr = tmpstr + ` ${this.homeUser.name} +2`;
                else tmpstr = tmpstr + ` ${this.homeUser.name} + 1, ${this.awayUser.name} + 1`;
            } else {
                if (this.winner().abbr === this.home.abbr)
                    tmpstr = tmpstr + ` ${this.homeUser.name} +3`;
                else
                    tmpstr = tmpstr + ` ${this.awayUser.name} +3`;
            }

            return tmpstr;
        }

        if (this.active) {
            return `${this.matchTime}: ${this.awayScore} - ${this.homeScore}`;
        }

        return new Date(this.gt).toLocaleString();
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
            if (!this.knockout && this.homeScore === this.awayScore) throw Error('Game ended in a tie');

            if (this.homeScore === this.awayScore) {
                if (this.homePenaltyScore > this.awayPenaltyScore) return this.home;
                return this.away;
            }

            if (this.homeScore > this.awayScore) return this.home
            return this.away;
        }

        throw Error('Attempted to get winner from incomplete game');
    }
}