import { Team } from './team';
import { Player } from './player';

export interface Game {
    id: number;
    teams: Team[];
    players: Player[];
    scores: (number | null)[];
	playerScores: (number | null)[];
    winClasses: string[];
    inProgress: boolean;
    finished: boolean;
	startTime: number;
	statusStr: string;
    url: string;
}
