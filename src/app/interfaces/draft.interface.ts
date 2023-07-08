import { ITeam } from "./team.interface";
import { IUser } from "./user.interface";

export interface IDraft {
    user: IUser;
    teams: ITeam[];

    score(): number;
    toString(): string;
}

export class Draft implements IDraft {
    public user: IUser;
    public teams: ITeam[];
    
    constructor(user: IUser, teams: ITeam[]) {
        this.user = user;
        this.teams = teams;
    }

    score(): number {
        return this.teams.reduce((score, team) => score + team.totalScore, 0);
    }

    toString(): string {
        return `${this.user.full()}: ${this.teams.map(team=>team.abbr).join(',')} ${this.score()}`
    }
}
