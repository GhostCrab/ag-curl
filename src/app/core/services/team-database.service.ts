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
    // Group A
    new Team('Mexico',        'MEX', 'A', 15, 6000,   'https://flagsapi.com/MX/shiny/64.png'),
    new Team('South Africa',  'RSA', 'A', 44, 250000, 'https://flagsapi.com/ZA/shiny/64.png'),
    new Team('Korea Republic','KOR', 'A', 33, 60000,  'https://flagsapi.com/KR/shiny/64.png'),
    new Team('Czechia',       'CZE', 'A', 32, 40000,  'https://flagsapi.com/CZ/shiny/64.png'),

    // Group B
    new Team('Canada',                 'CAN', 'B', 24, 17500,  'https://flagsapi.com/CA/shiny/64.png'),
    new Team('Bosnia and Herzegovina', 'BIH', 'B', 30, 30000,  'https://flagsapi.com/BA/shiny/64.png'),
    new Team('Qatar',                  'QAT', 'B', 42, 250000, 'https://flagsapi.com/QA/shiny/64.png'),
    new Team('Switzerland',            'SUI', 'B', 17, 6500,   'https://flagsapi.com/CH/shiny/64.png'),

    // Group C
    new Team('Brazil',   'BRA', 'C', 5,  850,    'https://flagsapi.com/BR/shiny/64.png'),
    new Team('Morocco',  'MAR', 'C', 13, 5000,   'https://flagsapi.com/MA/shiny/64.png'),
    new Team('Haiti',    'HAI', 'C', 39, 250000, 'https://flagsapi.com/HT/shiny/64.png'),
    new Team('Scotland', 'SCO', 'C', 27, 25000,  'https://flagcdn.com/w40/gb-sct.png'),

    // Group D
    new Team('USA',      'USA', 'D', 14, 5500,   'https://flagsapi.com/US/shiny/64.png'),
    new Team('Paraguay', 'PAR', 'D', 25, 20000,  'https://flagsapi.com/PY/shiny/64.png'),
    new Team('Australia','AUS', 'D', 35, 150000, 'https://flagsapi.com/AU/shiny/64.png'),
    new Team('Türkiye',  'TUR', 'D', 19, 8000,   'https://flagsapi.com/TR/shiny/64.png'),

    // Group E
    new Team('Germany',        'GER', 'E', 7,  1300,   'https://flagsapi.com/DE/shiny/64.png'),
    new Team('Curaçao',        'CUW', 'E', 40, 250000, 'https://flagsapi.com/CW/shiny/64.png'),
    new Team('Côte d\'Ivoire', 'CIV', 'E', 21, 15000,  'https://flagsapi.com/CI/shiny/64.png'),
    new Team('Ecuador',        'ECU', 'E', 20, 8000,   'https://flagsapi.com/EC/shiny/64.png'),

    // Group F
    new Team('Netherlands', 'NED', 'F', 8,  1600,   'https://flagsapi.com/NL/shiny/64.png'),
    new Team('Japan',       'JPN', 'F', 12, 4500,   'https://flagsapi.com/JP/shiny/64.png'),
    new Team('Sweden',      'SWE', 'F', 26, 20000,  'https://flagsapi.com/SE/shiny/64.png'),
    new Team('Tunisia',     'TUN', 'F', 34, 150000, 'https://flagsapi.com/TN/shiny/64.png'),

    // Group G
    new Team('Belgium',     'BEL', 'G', 9,  2200,   'https://flagsapi.com/BE/shiny/64.png'),
    new Team('Egypt',       'EGY', 'G', 29, 30000,  'https://flagsapi.com/EG/shiny/64.png'),
    new Team('IR Iran',     'IRN', 'G', 36, 75000,  'https://flagsapi.com/IR/shiny/64.png'),
    new Team('New Zealand', 'NZL', 'G', 45, 250000, 'https://flagsapi.com/NZ/shiny/64.png'),

    // Group H
    new Team('Spain',       'ESP', 'H', 1,  450,    'https://flagsapi.com/ES/shiny/64.png'),
    new Team('Cabo Verde',  'CPV', 'H', 37, 250000, 'https://flagsapi.com/CV/shiny/64.png'),
    new Team('Saudi Arabia','KSA', 'H', 48, 200000, 'https://flagsapi.com/SA/shiny/64.png'),
    new Team('Uruguay',     'URU', 'H', 16, 6000,   'https://flagsapi.com/UY/shiny/64.png'),

    // Group I
    new Team('France',  'FRA', 'I', 2,  500,    'https://flagsapi.com/FR/shiny/64.png'),
    new Team('Senegal', 'SEN', 'I', 22, 15000,  'https://flagsapi.com/SN/shiny/64.png'),
    new Team('Iraq',    'IRQ', 'I', 41, 250000, 'https://flagsapi.com/IQ/shiny/64.png'),
    new Team('Norway',  'NOR', 'I', 10, 3300,   'https://flagsapi.com/NO/shiny/64.png'),

    // Group J
    new Team('Argentina', 'ARG', 'J', 6,  1000,   'https://flagsapi.com/AR/shiny/64.png'),
    new Team('Algeria',   'ALG', 'J', 28, 25000,  'https://flagsapi.com/DZ/shiny/64.png'),
    new Team('Austria',   'AUT', 'J', 23, 10000,  'https://flagsapi.com/AT/shiny/64.png'),
    new Team('Jordan',    'JOR', 'J', 43, 250000, 'https://flagsapi.com/JO/shiny/64.png'),

    // Group K
    new Team('Portugal',  'POR', 'K', 4,  800,    'https://flagsapi.com/PT/shiny/64.png'),
    new Team('Congo DR',  'COD', 'K', 38, 150000, 'https://flagsapi.com/CD/shiny/64.png'),
    new Team('Uzbekistan','UZB', 'K', 46, 250000, 'https://flagsapi.com/UZ/shiny/64.png'),
    new Team('Colombia',  'COL', 'K', 11, 3500,   'https://flagsapi.com/CO/shiny/64.png'),

    // Group L
    new Team('England', 'ENG', 'L', 3,  700,   'https://flagcdn.com/w40/gb-eng.png'),
    new Team('Croatia', 'CRO', 'L', 18, 7500,  'https://flagsapi.com/HR/shiny/64.png'),
    new Team('Ghana',   'GHA', 'L', 31, 35000, 'https://flagsapi.com/GH/shiny/64.png'),
    new Team('Panama',  'PAN', 'L', 47, 250000,'https://flagsapi.com/PA/shiny/64.png'),
  ];

  constructor() {}

  get(s: string): ITeam {
    if (s.length <= 3) {
      for (const team of this.teams) {
        if (team.abbr === s) return team;
      }

      console.warn(`Adding new temp team ${s}`);
      const newTeam = new Team(s, s, 'X', 0, 0.001, 'assets/ball.png');
      this.teams.push(newTeam);
      return newTeam;
    }

    let fixed = s;
    if (fixed === 'IR Iran') fixed = 'Iran';

    for (const team of this.teams) {
      if (team.name === fixed) return team;
    }

    console.warn(`Adding new temp team ${s}`);
    const newTeam = new Team(s, s, 'X', 0, 0.001, 'assets/ball.png');
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
    this.teams.push(new Team(name, name, 'X', 0, 0.001, 'assets/ball.png'));
  }
}