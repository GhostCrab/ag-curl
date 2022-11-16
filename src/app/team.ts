export interface Team {
    name: string;
    abbr: string;
    rank: number;
    group: string;
    odds: number;

}

export const TEAMS: Team[] = [
    { rank:  1, name: 'Brazil', abbr: 'BRA', group: 'G', odds: 400 },
    { rank:  2, name: 'France', abbr: 'FRA', group: 'D', odds: 600},
    { rank:  3, name: 'Argentina', abbr: 'ARG', group: 'C', odds: 550},
    { rank:  4, name: 'England', abbr: 'ENG', group: 'B', odds: 800 },
    { rank:  5, name: 'Netherlands', abbr: 'NED', group: 'A', odds: 1200},
    { rank:  6, name: 'Spain', abbr: 'ESP', group: 'E', odds: 850},
    { rank:  7, name: 'Portugal', abbr: 'POR', group: 'H', odds: 1400},
    { rank:  8, name: 'Germany', abbr: 'GER', group: 'E', odds: 1000},
    { rank:  9, name: 'Belgium', abbr: 'BEL', group: 'F', odds: 1600},
    { rank: 10, name: 'Denmark', abbr: 'DEN', group: 'D', odds: 2800},
    { rank: 11, name: 'Uruguay', abbr: 'URU', group: 'H', odds: 5000},
    { rank: 12, name: 'Croatia', abbr: 'CRO', group: 'F', odds: 5000},
    { rank: 13, name: 'Serbia', abbr: 'SRB', group: 'G', odds: 8000},
    { rank: 14, name: 'USA', abbr: 'USA', group: 'B', odds: 15000},
    { rank: 15, name: 'Mexico', abbr: 'MEX', group: 'C', odds: 15000},
    { rank: 16, name: 'Poland', abbr: 'POL', group: 'C', odds: 15000},
    { rank: 17, name: 'Senegal', abbr: 'SEN', group: 'A', odds: 12500},
    { rank: 18, name: 'Switzerland', abbr: 'SUI', group: 'G', odds: 10000},
    { rank: 19, name: 'Wales', abbr: 'WAL', group: 'B', odds: 20000},
    { rank: 20, name: 'Ecuador', abbr: 'ECU', group: 'A', odds: 15000},
    { rank: 21, name: 'Canada', abbr: 'CAN', group: 'F', odds: 20000},
    { rank: 22, name: 'Morocco', abbr: 'MAR', group: 'F', odds: 20000},
    { rank: 23, name: 'Qatar', abbr: 'QAT', group: 'A', odds: 25000},
    { rank: 24, name: 'Japan', abbr: 'JPN', group: 'E', odds: 25000},
    { rank: 25, name: 'Korea', abbr: 'KOR', group: 'H', odds: 25000},
    { rank: 26, name: 'Ghana', abbr: 'GHA', group: 'H', odds: 25000},
    { rank: 27, name: 'Australia', abbr: 'AUS', group: 'D', odds: 35000},
    { rank: 28, name: 'Cameroon', abbr: 'CMR', group: 'G', odds: 25000},
    { rank: 29, name: 'Iran', abbr: 'IRN', group: 'B', odds: 50000},
    { rank: 30, name: 'Tunisia', abbr: 'TUN', group: 'D', odds: 50000},
    { rank: 31, name: 'Saudi Arabia', abbr: 'KSA', group: 'C', odds: 75000},
    { rank: 32, name: 'Costa Rica', abbr: 'CRC', group: 'E', odds: 75000},
];
