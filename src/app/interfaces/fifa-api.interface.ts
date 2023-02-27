export interface FIFAData {
    copyright: string;
    dates: FIFADataResult[];
    status: number;
    totalEvents: number;
    totalGames: number;
    totalGamesInProgress: number;
    totalItems: number;
}

export interface FIFADataResult {
    date: string;
    games: FIFAGame[];
}

export interface FIFAGame {
    linescore: FIFALinescore;
    status: FIFAStatus;
    teams: FIFATeams;
    gamePk: number;
    gameDate: string;
    description: string;
}

export interface FIFALinescore {
    balls?: number;
    strikes?: number;
    outs?: number;
    currentInning?: number;
    currentInningOrdinal?: string;
    inningHalf?: string;
    teams: FIFALinescoreTeams;
}

export interface FIFAStatus {
    detailedState: string;
}

export interface FIFATeams {
    away: FIFATeam;
    home: FIFATeam;
}

export interface FIFATeam {
    team: {
        abbreviation: string;
        clubName: string;
        link: string;
    }

    score: number;
}

export interface FIFALinescoreTeams {
    away: FIFALinescoreTeam;
    home: FIFALinescoreTeam;
}

export interface FIFALinescoreTeam {
    errors?: number;
    hits?: number;
    leftOnBase?: number;
    runs?: number;
}