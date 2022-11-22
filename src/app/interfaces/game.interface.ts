import { ITeam } from "./team.interface";
import { IUser } from "./user.interface";

export interface IGame {
    id: number;
    teams: ITeam[];
    users: IUser[];
    scores: (number | null)[];
	playerScores: (number | null)[];
    winClasses: string[];
    inProgress: boolean;
    finished: boolean;
	startTime: number;
	statusStr: string;
    url: string;
    homeImg: string;
    awayImg: string;
}