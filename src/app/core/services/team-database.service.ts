import { Injectable } from '@angular/core';
import { IGameSimulationResult } from 'src/app/interfaces/simulation.interface';
import { ITeam, Team } from 'src/app/interfaces/team.interface';

export interface TeamGroupInfoData { logOdds: number, score: number, simulations: IGameSimulationResult[] }
export interface TeamGroupInfo { [key: string]: TeamGroupInfoData };
export interface TeamGroupDict { [key: string]: TeamGroupInfo };
export interface TeamGroupsRanked { [key: string]: {abbr: string, logOdds: number, score: number, group: string}[] };

@Injectable({
  providedIn: 'root',
})
export class TeamDatabaseService {
  private teams: ITeam[] = [
    /* 03 */ new Team('Germany',     'GER', 'A', 3,  450   ), // 550
    /* 12 */ new Team('Switzerland', 'SUI', 'A', 12, 1400  ), // 6600
    /* 15 */ new Team('Hungary',     'HUN', 'A', 15, 8000  ), // 8000
    /* 16 */ new Team('Scotland',    'SCO', 'A', 16, 10000 ), // 10000
    
    /* 05 */ new Team('Spain',       'ESP', 'B', 5,  400   ), // 800
    /* 06 */ new Team('Italy',       'ITA', 'B', 6,  1400  ), // 1400
    /* 09 */ new Team('Croatia',     'CRO', 'B', 9,  4000  ), // 4000
    /* 22 */ new Team('Albania',     'ALB', 'B', 22, 50000 ), // 50000
    
    /* 01 */ new Team('England',     'ENG', 'C', 1,  380   ), // 300
    /* 10 */ new Team('Denmark',     'DEN', 'C', 10, 4000  ), // 4000
    /* 13 */ new Team('Serbia',      'SRB', 'C', 13, 8000  ), // 8000
    /* 21 */ new Team('Slovenia',    'SVN', 'C', 21, 25000 ), // 25000
    
    /* 02 */ new Team('France',      'FRA', 'D', 2,  450   ), // 400
    /* 08 */ new Team('Netherlands', 'NED', 'D', 8,  800   ), // 1600
    /* 14 */ new Team('Austria',     'AUT', 'D', 14, 8000  ), // 8000
    /* 19 */ new Team('Poland',      'POL', 'D', 19, 15000 ), // 15000
    
    /* 07 */ new Team('Belgium',     'BEL', 'E', 7,  1600  ), // 1600
    /* 17 */ new Team('Ukraine',     'UKR', 'E', 17, 10000 ), // 10000
    /* 20 */ new Team('Romania',     'ROU', 'E', 20, 20000 ), // 20000
    /* 24 */ new Team('Slovakia',    'SVK', 'E', 24, 50000 ), // 50000
    
    /* 04 */ new Team('Portugal',    'POR', 'F', 4,  800   ), // 800
    /* 11 */ new Team('Turkey',      'TUR', 'F', 11, 4000  ), // 5000
    /* 18 */ new Team('Czechia',     'CZE', 'F', 18, 15000 ), // 15000
    /* 23 */ new Team('Georgia',     'GEO', 'F', 23, 50000 ), // 50000
  ];

  constructor() {}

  get(s: string): ITeam {
    if (s.length === 3) {
      for (const team of this.teams) {
        if (team.abbr === s) return team;
      }

      console.warn(`Adding new temp team ${s}`);
      const newTeam = new Team(s, s, 'X', 0, 0.001);
      this.teams.push(newTeam);
      return newTeam;
    }

    let fixed = s;
    if (fixed === 'IR Iran') fixed = 'Iran';

    for (const team of this.teams) {
      if (team.name === fixed) return team;
    }

    console.warn(`Adding new temp team ${s}`);
    const newTeam = new Team(s, s, 'X', 0, 0.001);
    this.teams.push(newTeam);
    return newTeam;
  }

  public all(): ITeam[] {
    return this.teams;
  }

  public resetGames(): void {
    this.teams.forEach(team => team.resetGames());
  }

  public teamsByGroup() {
    const teamGroups: TeamGroupDict = {};

    this.teams.filter(team => team.rank > 0).forEach(team => {
      if(!(team.group in teamGroups)) teamGroups[team.group] = {};

      teamGroups[team.group][team.abbr] = {
        logOdds: team.logOdds,
        score: 0,
        simulations: []
      }
    });

    return teamGroups;
  }

  public addTeam(name: string) {
    this.teams.push(new Team(name, name, 'X', 0, 0.001));
  }
}