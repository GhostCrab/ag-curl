import { Injectable } from '@angular/core';
import { ITeam, Team } from 'src/app/interfaces/team.interface';

@Injectable({
    providedIn: 'root',
})
export class TeamDatabaseService {
    private teams: ITeam[] = [
        new Team('Netherlands', 'NED', 'A', 5, 1200),
        new Team('Senegal', 'SEN', 'A', 17, 12500),
        new Team('Ecuador', 'ECU', 'A', 20, 15000),
        new Team('Qatar', 'QAT', 'A', 23, 25000),
        new Team('England', 'ENG', 'B', 4, 800),
        new Team('USA', 'USA', 'B', 14, 15000),
        new Team('Wales', 'WAL', 'B', 19, 20000),
        new Team('Iran', 'IRN', 'B', 29, 50000),
        new Team('Argentina', 'ARG', 'C', 3, 550),
        new Team('Mexico', 'MEX', 'C', 15, 15000),
        new Team('Poland', 'POL', 'C', 16, 15000),
        new Team('Saudi Arabia', 'KSA', 'C', 31, 75000),
        new Team('France', 'FRA', 'D', 2, 600),
        new Team('Denmark', 'DEN', 'D', 10, 2800),
        new Team('Australia', 'AUS', 'D', 27, 35000),
        new Team('Tunisia', 'TUN', 'D', 30, 50000),
        new Team('Spain', 'ESP', 'E', 6, 850),
        new Team('Germany', 'GER', 'E', 8, 1000),
        new Team('Japan', 'JPN', 'E', 24, 25000),
        new Team('Costa Rica', 'CRC', 'E', 32, 75000),
        new Team('Belgium', 'BEL', 'F', 9, 1600),
        new Team('Croatia', 'CRO', 'F', 12, 5000),
        new Team('Canada', 'CAN', 'F', 21, 20000),
        new Team('Morocco', 'MAR', 'F', 22, 20000),
        new Team('Brazil', 'BRA', 'G', 1, 400),
        new Team('Serbia', 'SRB', 'G', 13, 8000),
        new Team('Switzerland', 'SUI', 'G', 18, 10000),
        new Team('Cameroon', 'CMR', 'G', 28, 25000),
        new Team('Portugal', 'POR', 'H', 7, 1400),
        new Team('Uruguay', 'URU', 'H', 11, 5000),
        new Team('Korea', 'KOR', 'H', 25, 25000),
        new Team('Ghana', 'GHA', 'H', 26, 25000),
    ];

    constructor() {}

    get(s: string): ITeam {
        if (s.length === 3) {
            for (const team of this.teams) {
                if (team.abbr === s) return team;
            }

            throw new Error('Unable to find team with abbreviation ' + s);
        }

        let fixed = s
        if (fixed === "IR Iran")
            fixed = "Iran"

        for (const team of this.teams) {
            if (team.name === fixed) return team;
        }

        throw new Error('Unable to find team with name ' + fixed);
    }

    public all(): ITeam[] {
        return this.teams;
    }
}
