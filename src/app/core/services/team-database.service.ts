import { Injectable } from '@angular/core';
import { IGameSimulationResult } from 'src/app/interfaces/simulation.interface';
import { ITeam, Team } from 'src/app/interfaces/team.interface';

export interface TeamGroupInfo { [key: string]: {logOdds: number, score: number, simulations: IGameSimulationResult[]} };
export interface TeamGroupDict { [key: string]: TeamGroupInfo };
export interface TeamGroupsRanked { [key: string]: {abbr: string, logOdds: number}[] };

@Injectable({
  providedIn: 'root',
})
export class TeamDatabaseService {
  private teams: ITeam[] = [
    /*15*/ new Team('New Zealand',         'NZL', 'A', 15, 6500),
    /*11*/ new Team('Norway',              'NOR', 'A', 11, 4000),
    /*29*/ new Team('Philippines',         'PHI', 'A', 29, 50000),
    /*23*/ new Team('Switzerland',         'SUI', 'A', 23, 25000),

    /*06*/ new Team('Australia',           'AUS', 'B',  6, 1200),
    /*19*/ new Team('Republic of Ireland', 'IRL', 'B', 19, 15000),
    /*25*/ new Team('Nigeria',             'NGA', 'B', 25, 25000),
    /*10*/ new Team('Canada',              'CAN', 'B', 10, 2500),
    
    /*03*/ new Team('Spain',               'ESP', 'C',  3, 650),
    /*31*/ new Team('Costa Rica',          'CRC', 'C', 31, 50000),
    /*27*/ new Team('Zambia',              'ZAM', 'C', 27, 50000),
    /*12*/ new Team('Japan',               'JPN', 'C', 12, 4000),
    
    /*02*/ new Team('England',             'ENG', 'D',  2, 350),
    /*21*/ new Team('Haiti',               'HAI', 'D', 21, 15000),
    /*13*/ new Team('Denmark',             'DEN', 'D', 13, 5000),
    /*17*/ new Team('China PR',            'CHN', 'D', 17, 8000),
    
    /*01*/ new Team('USA',                 'USA', 'E',  1, 250),
    /*28*/ new Team('Vietnam',             'VIE', 'E', 28, 50000),
    /*08*/ new Team('Netherlands',         'NED', 'E',  8, 1600),
    /*18*/ new Team('Portugal',            'POR', 'E', 18, 10000),
    
    /*05*/ new Team('France',              'FRA', 'F',  5, 750),
    /*30*/ new Team('Jamaica',             'JAM', 'F', 30, 50000),
    /*09*/ new Team('Brazil',              'BRA', 'F',  9, 2500),
    /*32*/ new Team('Panama',              'PAN', 'F', 32, 50000),

    /*07*/ new Team('Sweden',              'SWE', 'G',  7, 1400),
    /*24*/ new Team('South Africa',        'RSA', 'G', 24, 25000),
    /*16*/ new Team('Italy',               'ITA', 'G', 16, 6500),
    /*22*/ new Team('Argentina',           'ARG', 'G', 22, 20000),
    
    /*04*/ new Team('Germany',             'GER', 'H',  4, 650),
    /*26*/ new Team('Morocco',             'MAR', 'H', 26, 25000),
    /*20*/ new Team('Colombia',            'COL', 'H', 20, 15000),
    /*14*/ new Team('Korea Republic',      'KOR', 'H', 14, 6500),

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

    new Team('W49', 'W49', 'X', 0, 0.001),
    new Team('W51', 'W51', 'X', 0, 0.001),
    new Team('W50', 'W50', 'X', 0, 0.001),
    new Team('W52', 'W52', 'X', 0, 0.001),
    new Team('W53', 'W53', 'X', 0, 0.001),
    new Team('W55', 'W55', 'X', 0, 0.001),
    new Team('W54', 'W54', 'X', 0, 0.001),
    new Team('W56', 'W56', 'X', 0, 0.001),
    new Team('W57', 'W57', 'X', 0, 0.001),
    new Team('W58', 'W58', 'X', 0, 0.001),
    new Team('W59', 'W59', 'X', 0, 0.001),
    new Team('W60', 'W60', 'X', 0, 0.001),

    new Team('RU61', 'RU61', 'X', 0, 0.001),
    new Team('RU62', 'RU62', 'X', 0, 0.001),

    new Team('W61', 'W61', 'X', 0, 0.001),
    new Team('W62', 'W62', 'X', 0, 0.001),
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


//new Team('USA',                 'USA', 'E',  1, 250),
//new Team('England',             'ENG', 'D',  2, 350),
//new Team('Spain',               'ESP', 'C',  3, 650),
//new Team('Germany',             'GER', 'H',  4, 650),
//new Team('France',              'FRA', 'F',  5, 750),
//new Team('Australia',           'AUS', 'B',  6, 1200),

//new Team('Sweden',              'SWE', 'G',  7, 1400),
//new Team('Netherlands',         'NED', 'E',  8, 1600),
//new Team('Brazil',              'BRA', 'F',  9, 2500),
//new Team('Canada',              'CAN', 'B', 10, 2500),
//new Team('Norway',              'NOR', 'A', 11, 4000),
//new Team('Japan',               'JPN', 'C', 12, 4000),

//new Team('Denmark',             'DEN', 'D', 13, 5000),
//new Team('Korea Republic',      'KOR', 'H', 14, 6500),
//new Team('New Zealand',         'NZL', 'A', 15, 6500),
//new Team('Italy',               'ITA', 'G', 16, 6500),
//new Team('China PR',            'CHN', 'D', 17, 8000),
//new Team('Portugal',            'POR', 'E', 18, 10000),

//new Team('Republic of Ireland', 'IRL', 'B', 19, 15000),
//new Team('Colombia',            'COL', 'H', 20, 15000),
//new Team('Haiti',               'HAI', 'D', 21, 15000),
//new Team('Argentina',           'ARG', 'G', 22, 20000),
//new Team('Switzerland',         'SUI', 'A', 23, 25000),
//new Team('South Africa',        'RSA', 'G', 24, 25000),

//new Team('Nigeria',             'NGA', 'B', 25, 25000),
//new Team('Morocco',             'MAR', 'H', 26, 25000),
//new Team('Zambia',              'ZAM', 'C', 27, 50000),
//new Team('Vietnam',             'VIE', 'E', 28, 50000),
//new Team('Philippines',         'PHI', 'A', 29, 50000),
//new Team('Jamaica',             'JAM', 'F', 30, 50000),
//new Team('Costa Rica',          'CRC', 'C', 31, 50000),
//new Team('Panama',              'PAN', 'F', 32, 50000),