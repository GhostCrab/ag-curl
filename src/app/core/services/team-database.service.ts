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
    /* 03 */ new Team('Germany',     'GER', 'A', 3,  550   ),
    /* 12 */ new Team('Switzerland', 'SUI', 'A', 12, 6600  ),
    /* 15 */ new Team('Hungary',     'HUN', 'A', 15, 8000  ),
    /* 16 */ new Team('Scotland',    'SCO', 'A', 16, 10000 ),

    /* 05 */ new Team('Spain',       'ESP', 'B', 5,  800   ),
    /* 06 */ new Team('Italy',       'ITA', 'B', 6,  1400  ),
    /* 09 */ new Team('Croatia',     'CRO', 'B', 9,  4000  ),
    /* 22 */ new Team('Albania',     'ALB', 'B', 22, 50000 ),

    /* 01 */ new Team('England',     'ENG', 'C', 1,  300   ),
    /* 10 */ new Team('Denmark',     'DEN', 'C', 10, 4000  ),
    /* 13 */ new Team('Serbia',      'SRB', 'C', 13, 8000  ),
    /* 21 */ new Team('Slovenia',    'SVN', 'C', 21, 25000 ),

    /* 02 */ new Team('France',      'FRA', 'D', 2,  400   ),
    /* 08 */ new Team('Netherlands', 'NED', 'D', 8,  1600  ),
    /* 14 */ new Team('Austria',     'AUT', 'D', 14, 8000  ),
    /* 19 */ new Team('Poland',      'POL', 'D', 19, 15000 ),

    /* 07 */ new Team('Belgium',     'BEL', 'E', 7,  1600  ),
    /* 17 */ new Team('Ukraine',     'UKR', 'E', 17, 10000 ),
    /* 20 */ new Team('Romania',     'ROU', 'E', 20, 20000 ),
    /* 24 */ new Team('Slovakia',    'SVK', 'E', 24, 50000 ),

    /* 04 */ new Team('Portugal',    'POR', 'F', 4,  800   ),
    /* 11 */ new Team('Turkey',      'TUR', 'F', 11, 5000  ),
    /* 18 */ new Team('Czechia',     'CZE', 'F', 18, 15000 ),
    /* 23 */ new Team('Georgia',     'GEO', 'F', 23, 50000 ),

    new Team('1A', '1A', 'X', 0, 0.001),
    new Team('2C', '2C', 'X', 0, 0.001),
    new Team('1C', '1C', 'X', 0, 0.001),
    new Team('2A', '2A', 'X', 0, 0.001),
    new Team('1E', '1E', 'X', 0, 0.001),
    new Team('2G', '2G', 'X', 0, 0.001),
    new Team('1G', '1G', 'X', 0, 0.001),
    new Team('2E', '2E', 'X', 0, 0.001),
    new Team('1D', '1D', 'X', 0, 0.001),
    new Team('2B', '2B', 'X', 0, 0.001),
    new Team('1B', '1B', 'X', 0, 0.001),
    new Team('2D', '2D', 'X', 0, 0.001),
    new Team('1H', '1H', 'X', 0, 0.001),
    new Team('2F', '2F', 'X', 0, 0.001),
    new Team('1F', '1F', 'X', 0, 0.001),
    new Team('2H', '2H', 'X', 0, 0.001),

    new Team('2nd: A',       '2nd: A',       'X', 0, 0.001),
    new Team('2nd: B',       '2nd: B',       'X', 0, 0.001),
    new Team('1st: A',       '1st: A',       'X', 0, 0.001),
    new Team('2nd: C',       '2nd: C',       'X', 0, 0.001),
    new Team('1st: C',       '1st: C',       'X', 0, 0.001),
    new Team('3rd: D/E/F',   '3rd: D/E/F',   'X', 0, 0.001),
    new Team('1st: B',       '1st: B',       'X', 0, 0.001),
    new Team('3rd: A/D/E/F', '3rd: A/D/E/F', 'X', 0, 0.001),
    new Team('2nd: D',       '2nd: D',       'X', 0, 0.001),
    new Team('2nd: E',       '2nd: E',       'X', 0, 0.001),
    new Team('1st: F',       '1st: F',       'X', 0, 0.001),
    new Team('3rd: A/B/C',   '3rd: A/B/C',   'X', 0, 0.001),
    new Team('1st: E',       '1st: E',       'X', 0, 0.001),
    new Team('3rd: A/B/C/D', '3rd: A/B/C/D', 'X', 0, 0.001),
    new Team('1st: D',       '1st: D',       'X', 0, 0.001),
    new Team('2nd: F',       '2nd: F',       'X', 0, 0.001),
    
    new Team('W39',          'W39',          'X', 0, 0.001),
    new Team('W37',          'W37',          'X', 0, 0.001),
    new Team('W41',          'W41',          'X', 0, 0.001),
    new Team('W42',          'W42',          'X', 0, 0.001),
    new Team('W40',          'W40',          'X', 0, 0.001),
    new Team('W38',          'W38',          'X', 0, 0.001),
    new Team('W43',          'W43',          'X', 0, 0.001),
    new Team('W44',          'W44',          'X', 0, 0.001),
    new Team('W45',          'W45',          'X', 0, 0.001),
    new Team('W46',          'W46',          'X', 0, 0.001),
    new Team('W47',          'W47',          'X', 0, 0.001),
    new Team('W48',          'W48',          'X', 0, 0.001),
    new Team('W49',          'W49',          'X', 0, 0.001),
    new Team('W50',          'W50',          'X', 0, 0.001),
  ];

  constructor() {}

  get(s: string): ITeam {
    if (s.length === 3) {
      for (const team of this.teams) {
        if (team.abbr === s) return team;
      }

      throw new Error('Unable to find team with abbreviation ' + s);
    }

    let fixed = s;
    if (fixed === 'IR Iran') fixed = 'Iran';

    for (const team of this.teams) {
      if (team.name === fixed) return team;
    }

    throw new Error('Unable to find team with name ' + fixed);
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
}
