import { ITeam } from "./team.interface";
import { IUser } from "./user.interface";

export interface IDraft {
    user: IUser;
    teams: ITeam[];
}

export class Draft implements IDraft {
    public user: IUser;
    public teams: ITeam[];
    
    constructor(user: IUser, teams: ITeam[]) {
        this.user = user;
        this.teams = teams;
    }
}
