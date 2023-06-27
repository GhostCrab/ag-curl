export interface MLBData {
  copyright: string;
  dates: MLBDataResult[];
  status: number;
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  totalItems: number;
}

export interface MLBDataResult {
  date: string;
  games: MLBGame[];
}

export interface MLBGame {
  linescore: MLBLinescore;
  status: MLBStatus;
  teams: MLBTeams;
  gamePk: number;
  gameDate: string;
  description: string;
}

export interface MLBLinescore {
  balls?: number;
  strikes?: number;
  outs?: number;
  currentInning?: number;
  currentInningOrdinal?: string;
  inningHalf?: string;
  teams: MLBLinescoreTeams;
}

export interface MLBStatus {
  detailedState: string;
}

export interface MLBTeams {
  away: MLBTeam;
  home: MLBTeam;
}

export interface MLBTeam {
  team: {
      abbreviation: string;
      clubName: string;
      link: string;
  }

  score: number;
}

export interface MLBLinescoreTeams {
  away: MLBLinescoreTeam;
  home: MLBLinescoreTeam;
}

export interface MLBLinescoreTeam {
  errors?: number;
  hits?: number;
  leftOnBase?: number;
  runs?: number;
}