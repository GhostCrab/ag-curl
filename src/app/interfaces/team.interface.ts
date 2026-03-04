export interface ITeam {
    name: string;
    abbr: string;
    rank: number;
    group: string;
    odds: number;
    flagUrl: string;

    cleanName(): string;
}

export class Team {
    public name: string;
    public abbr: string;
    public rank: number;
    public group: string;
    public odds: number;
    public flagUrl: string;

    constructor(
        name: string,
        abbr: string,
        group: string,
        rank: number,
        odds: number,
        flagUrl: string
    ) {
        this.name = name;
        this.abbr = abbr;
        this.rank = rank;
        this.group = group;
        this.odds = odds;
        this.flagUrl = flagUrl;
    }

    cleanName(): string {
        return this.name;
    }
}
