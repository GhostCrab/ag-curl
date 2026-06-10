import { Injectable } from '@angular/core';
import { ITeam, Team } from 'src/app/interfaces/team.interface';

@Injectable({
    providedIn: 'root',
})
export class TeamDatabaseService {
    private teams: ITeam[] = [
        new Team('USA',                'USA', 'B', 1,    100, 'https://flagsapi.com/US/shiny/64.png'),
        new Team('Japan',              'JPN', 'C', 2,    300, 'https://flagsapi.com/JP/shiny/64.png'),
        new Team('Dom. Republic',      'DOM', 'D', 3,    450, 'https://flagsapi.com/DO/shiny/64.png'),
        new Team('Venezuela',          'VEN', 'D', 4,    900, 'https://flagsapi.com/VE/shiny/64.png'),
        new Team('Puerto Rico',        'PUR', 'A', 5,   1800, 'https://flagsapi.com/PR/shiny/64.png'),
        new Team('Mexico',             'MEX', 'B', 6,   2200, 'https://flagsapi.com/MX/shiny/64.png'),
        new Team('Canada',             'CAN', 'A', 7,   5000, 'https://flagsapi.com/CA/shiny/64.png'),
        new Team('Korea',              'KOR', 'C', 8,   6500, 'https://flagsapi.com/KR/shiny/64.png'),
        new Team('Colombia',           'COL', 'A', 9,   8000, 'https://flagsapi.com/CO/shiny/64.png'),
        new Team('Cuba',               'CUB', 'A', 10,  8000, 'https://flagsapi.com/CU/shiny/64.png'),
        new Team('Italy',              'ITA', 'B', 11,  8000, 'https://flagsapi.com/IT/shiny/64.png'),
        new Team('Netherlands',        'NED', 'D', 12, 10000, 'https://flagsapi.com/NL/shiny/64.png'),
        new Team('Panama',             'PAN', 'A', 13, 10000, 'https://flagsapi.com/PA/shiny/64.png'),
        new Team('Chinese Taipei',     'TPE', 'C', 14, 20000, 'https://flagsapi.com/TW/shiny/64.png'),
        new Team('Great Britain',      'GBR', 'B', 15, 25000, 'https://flagsapi.com/GB/shiny/64.png'),
        new Team('Israel',             'ISR', 'D', 16, 25000, 'https://flagsapi.com/IL/shiny/64.png'),
        new Team('Australia',          'AUS', 'C', 17, 25000, 'https://flagsapi.com/AU/shiny/64.png'),
        new Team('Czechia',            'CZE', 'C', 18, 40000, 'https://flagsapi.com/CZ/shiny/64.png'),
        new Team('Brazil',             'BRA', 'B', 19, 40000, 'https://flagsapi.com/BR/shiny/64.png'),
        new Team('Nicaragua',          'NCA', 'D', 20, 40000, 'https://flagsapi.com/NI/shiny/64.png'),

        new Team('A1', 'A1', 'A', 1, 100000, 'assets/wbc_icon.svg'),
        new Team('B1', 'B1', 'B', 2, 100000, 'assets/wbc_icon.svg'),
        new Team('C1', 'C1', 'C', 3, 100000, 'assets/wbc_icon.svg'),
        new Team('D1', 'D1', 'D', 4, 100000, 'assets/wbc_icon.svg'),
        new Team('A2', 'A2', 'A', 5, 100000, 'assets/wbc_icon.svg'),
        new Team('B2', 'B2', 'B', 6, 100000, 'assets/wbc_icon.svg'),
        new Team('C2', 'C2', 'C', 7, 100000, 'assets/wbc_icon.svg'),
        new Team('D2', 'D2', 'D', 8, 100000, 'assets/wbc_icon.svg'),

        new Team('Q1W', 'Q1W', 'A', 1, 100000, 'assets/wbc_icon.svg'),
        new Team('Q2W', 'Q2W', 'B', 2, 100000, 'assets/wbc_icon.svg'),
        new Team('Q3W', 'Q3W', 'C', 3, 100000, 'assets/wbc_icon.svg'),
        new Team('Q4W', 'Q4W', 'D', 4, 100000, 'assets/wbc_icon.svg'),

        new Team('QW',   'QW', 'D', 1, 100000, 'assets/wbc_icon.svg'),
        new Team('TBD', 'TBD', 'D', 1, 100000, 'assets/wbc_icon.svg'),

        new Team('S1W', 'S1W', 'A', 1, 100000, 'assets/wbc_icon.svg'),
        new Team('S2W', 'S2W', 'B', 2, 100000, 'assets/wbc_icon.svg'),

        new Team('A TBD', 'A', 'A', 1, 100000, 'assets/wbc_icon.svg'),
        new Team('B TBD', 'B', 'B', 2, 100000, 'assets/wbc_icon.svg'),
        new Team('C TBD', 'C', 'A', 3, 100000, 'assets/wbc_icon.svg'),
        new Team('D TBD', 'D', 'B', 4, 100000, 'assets/wbc_icon.svg'),
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
