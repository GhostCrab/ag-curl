export interface Team {
    name: string;
    abbr: string;
    rank: number;
    group: string;
    odds: number;
}

export const TEAMS: Team[] = [
    { name: 'Netherlands', abbr: 'NED', group: 'A', rank: 5, odds: 1200 },
    { name: 'Senegal', abbr: 'SEN', group: 'A', rank: 17, odds: 12500 },
    { name: 'Ecuador', abbr: 'ECU', group: 'A', rank: 20, odds: 15000 },
    { name: 'Qatar', abbr: 'QAT', group: 'A', rank: 23, odds: 25000 },
    { name: 'England', abbr: 'ENG', group: 'B', rank: 4, odds: 800 },
    { name: 'USA', abbr: 'USA', group: 'B', rank: 14, odds: 15000 },
    { name: 'Wales', abbr: 'WAL', group: 'B', rank: 19, odds: 20000 },
    { name: 'Iran', abbr: 'IRN', group: 'B', rank: 29, odds: 50000 },
    { name: 'Argentina', abbr: 'ARG', group: 'C', rank: 3, odds: 550 },
    { name: 'Mexico', abbr: 'MEX', group: 'C', rank: 15, odds: 15000 },
    { name: 'Poland', abbr: 'POL', group: 'C', rank: 16, odds: 15000 },
    { name: 'Saudi Arabia', abbr: 'KSA', group: 'C', rank: 31, odds: 75000 },
    { name: 'France', abbr: 'FRA', group: 'D', rank: 2, odds: 600 },
    { name: 'Denmark', abbr: 'DEN', group: 'D', rank: 10, odds: 2800 },
    { name: 'Australia', abbr: 'AUS', group: 'D', rank: 27, odds: 35000 },
    { name: 'Tunisia', abbr: 'TUN', group: 'D', rank: 30, odds: 50000 },
    { name: 'Spain', abbr: 'ESP', group: 'E', rank: 6, odds: 850 },
    { name: 'Germany', abbr: 'GER', group: 'E', rank: 8, odds: 1000 },
    { name: 'Japan', abbr: 'JPN', group: 'E', rank: 24, odds: 25000 },
    { name: 'Costa Rica', abbr: 'CRC', group: 'E', rank: 32, odds: 75000 },
    { name: 'Belgium', abbr: 'BEL', group: 'F', rank: 9, odds: 1600 },
    { name: 'Croatia', abbr: 'CRO', group: 'F', rank: 12, odds: 5000 },
    { name: 'Canada', abbr: 'CAN', group: 'F', rank: 21, odds: 20000 },
    { name: 'Morocco', abbr: 'MAR', group: 'F', rank: 22, odds: 20000 },
    { name: 'Brazil', abbr: 'BRA', group: 'G', rank: 1, odds: 400 },
    { name: 'Serbia', abbr: 'SRB', group: 'G', rank: 13, odds: 8000 },
    { name: 'Switzerland', abbr: 'SUI', group: 'G', rank: 18, odds: 10000 },
    { name: 'Cameroon', abbr: 'CMR', group: 'G', rank: 28, odds: 25000 },
    { name: 'Portugal', abbr: 'POR', group: 'H', rank: 7, odds: 1400 },
    { name: 'Uruguay', abbr: 'URU', group: 'H', rank: 11, odds: 5000 },
    { name: 'Korea', abbr: 'KOR', group: 'H', rank: 25, odds: 25000 },
    { name: 'Ghana', abbr: 'GHA', group: 'H', rank: 26, odds: 25000 },
];
