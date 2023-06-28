import { TeamDatabaseService } from "../core/services/team-database.service";

export interface TeamData { [key: string]: {score: number, round: number} };

export interface IGameSimulationResult {
  homeTeamAbbr: string;
  awayTeamAbbr: string;
  winnerTeamAbbr: string;
  homeLogOdds: number;
  awayLogOdds: number;
  homeScore: number;
  awayScore: number;
  homePenaltyScore: number;
  awayPenaltyScore: number;
  homePoints: number;
  awayPoints: number;
  round: number;
  group?: string;
}

export interface ITournamentSimulationResult {
  teamData: TeamData;

  add(result: ITournamentSimulationResult): ITournamentSimulationResult;
  divide(div: number): ITournamentSimulationResult;
  raw(): {abbr: string, score: number, round: number}[];
}

export class TournamentSimulationResult implements ITournamentSimulationResult {
  teamData: TeamData = {};

  constructor(sims: IGameSimulationResult[]) {
    sims.forEach(sim => {
      if(!(sim.homeTeamAbbr in this.teamData)) this.teamData[sim.homeTeamAbbr] = {score: 0, round: 0};
      if(!(sim.awayTeamAbbr in this.teamData)) this.teamData[sim.awayTeamAbbr] = {score: 0, round: 0};

      this.teamData[sim.homeTeamAbbr].score += sim.homeScore;
      this.teamData[sim.homeTeamAbbr].round = Math.max(this.teamData[sim.homeTeamAbbr].round, sim.round);
      this.teamData[sim.awayTeamAbbr].score += sim.awayScore;
      this.teamData[sim.awayTeamAbbr].round = Math.max(this.teamData[sim.awayTeamAbbr].round, sim.round);
    })
  }

  add(result: ITournamentSimulationResult): ITournamentSimulationResult {
    for (const [abbr, info] of Object.entries(result.teamData)) {
      this.teamData[abbr].round += info.round;
      this.teamData[abbr].score += info.score;
    }
    return this;
  }

  divide(div: number): ITournamentSimulationResult {
    for (const abbr of Object.keys(this.teamData)) {
      this.teamData[abbr].round /= div;
      this.teamData[abbr].score /= div;
    }
    return this;
  }

  raw(): {abbr: string, score: number, round: number}[] {
    const result = [];
    
    for (const [abbr, info] of Object.entries(this.teamData))
      result.push({abbr: abbr, score: info.score, round: info.round})
    
    return result.sort((a, b) => b.score - a.score);
  }

  public static blank(teamdb: TeamDatabaseService): ITournamentSimulationResult {
    const result = new TournamentSimulationResult([]);
    teamdb.all().forEach(team => {
      if (team.rank > 0)
        result.teamData[team.abbr] = {score: 0, round: 0};
    })
    return result;
  }
}