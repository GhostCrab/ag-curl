import { DraftDatabaseService } from '../core/services/draft-database.service';
import { TeamDatabaseService } from '../core/services/team-database.service';
import { FIFAGame } from './fifa-api.interface';
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

    private inning: string;
    private teamdb: TeamDatabaseService;
    private draftdb: DraftDatabaseService;

    //https://api.fifa.com/api/v3/picture/flags-{format}-{size}/ECU

    constructor(
        game: FIFAGame,
        teamdb: TeamDatabaseService,
        draftdb: DraftDatabaseService
    ) {
        this.id = game.gamePk;
        this.home = teamdb.get(game.teams.home.team.abbreviation);
        this.away = teamdb.get(game.teams.away.team.abbreviation);
        this.homeScore =
            game.linescore.teams.home.runs === undefined ? 0 : game.linescore.teams.home.runs;
        this.awayScore =
            game.linescore.teams.away.runs === undefined ? 0 : game.linescore.teams.away.runs;
        this.homePenaltyScore = 0;
        this.awayPenaltyScore = 0;
        this.active = game.status.detailedState.includes("In Progress");
        this.complete = game.status.detailedState.includes("Final");
        this.gt = new Date(game.gameDate).getTime();
        // https://midfield.mlbstatic.com/v1/team/nm/spots/24
        this.homeImg = game.teams.home.team.link.replace('/api/', 'https://midfield.mlbstatic.com/').replace('teams', 'team') + '/spots/24'
        this.awayImg = game.teams.away.team.link.replace('/api/', 'https://midfield.mlbstatic.com/').replace('teams', 'team') + '/spots/24'
        this.homeUser = draftdb.getUserByAbbr(game.teams.home.team.abbreviation);
        this.awayUser = draftdb.getUserByAbbr(game.teams.away.team.abbreviation);
        this.knockout = !game.description.includes("Pool");
        this.inning = 
            this.active && 
            game.linescore.currentInningOrdinal !== undefined && 
            game.linescore.inningHalf !== undefined ? 
                game.linescore.inningHalf + ' ' + game.linescore.currentInningOrdinal 
            : 
                '';
        this.round = 0;
        if (this.knockout) {
            if (game.description.includes('Quarterfinal')) this.round = 2;
            else if (game.description.includes('Semifinal')) this.round = 3;
            else if (game.description.includes('Championship')) this.round = 4;
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
            return `${this.inning}: ${this.awayScore} - ${this.homeScore}`;
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
            return `${this.inning}: ${this.awayScore} - ${this.homeScore}`;
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
        if (this.round === 2) // bonus point for making it to knockout
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
                return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}, None, ${this.awayScore}, ${this.homeScore}),`

            return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}, ${this.winner().cleanName()}, ${this.awayScore}, ${this.homeScore}),`
        }

        return `Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}),`
    }
}
