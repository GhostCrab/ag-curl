import { Injectable } from '@angular/core';
import { ITeam, Team } from 'src/app/interfaces/team.interface';

@Injectable({
    providedIn: 'root',
})
export class TeamDatabaseService {
    private teams: ITeam[] = [
        new Team('Dom. Republic',      'DOM',  'D', 1,  200, 'https://flagsapi.com/DO/shiny/64.png'),
        new Team('USA',                'USA', 'C', 2,  275, 'https://flagsapi.com/US/shiny/64.png'),
        new Team('Japan',              'JPN', 'B', 3,  300, 'https://flagsapi.com/JP/shiny/64.png'),
        new Team('Venezuela',          'VEN', 'D', 4,  1100, 'https://flagsapi.com/VE/shiny/64.png'),
        new Team('Puerto Rico',        'PUR',  'D', 5,  1100, 'https://flagsapi.com/PR/shiny/64.png'),
        new Team('Korea',              'KOR', 'B', 6,  1200, 'https://flagsapi.com/KR/shiny/64.png'),
        new Team('Cuba',               'CUB', 'A', 7,  2000, 'https://flagsapi.com/CU/shiny/64.png'),
        new Team('Mexico',             'MEX', 'C', 8,  2200, 'https://flagsapi.com/MX/shiny/64.png'),
        new Team('Chinese Taipei',     'TPE', 'A', 9,  5000, 'https://flagsapi.com/TW/shiny/64.png'),
        new Team('Canada',             'CAN', 'C', 10, 5000, 'https://flagsapi.com/CA/shiny/64.png'),
        new Team('Netherlands',        'NED', 'A', 11, 6500, 'https://flagsapi.com/NL/shiny/64.png'),
        new Team('Colombia',           'COL', 'C', 12, 13000, 'https://flagsapi.com/CO/shiny/64.png'),
        new Team('Australia',          'AUS', 'B', 13, 13000, 'https://flagsapi.com/AU/shiny/64.png'),
        new Team('Israel',             'ISR', 'D', 14, 15000, 'https://flagsapi.com/IL/shiny/64.png'),
        new Team('Panama',             'PAN', 'A', 15, 15000, 'https://flagsapi.com/PA/shiny/64.png'),
        new Team('Italy',              'ITA', 'A', 16, 15000, 'https://flagsapi.com/IT/shiny/64.png'),
        new Team('China',              'CHN', 'B', 17, 20000, 'https://flagsapi.com/CN/shiny/64.png'),
        new Team('Nicaragua',          'NCA', 'D', 18, 20000, 'https://flagsapi.com/NI/shiny/64.png'),
        new Team('Great Britain',      'GBR', 'C', 19, 50000, 'https://flagsapi.com/GB/shiny/64.png'),
        new Team('Czech Republic',     'CZE', 'B', 20, 50000, 'https://flagsapi.com/CZ/shiny/64.png'),

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
