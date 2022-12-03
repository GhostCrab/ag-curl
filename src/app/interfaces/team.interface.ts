export interface ITeam {
    name: string;
    abbr: string;
    rank: number;
    group: string;
    odds: number;

    cleanName(): string;
}

export class Team {
    public name: string;
    public abbr: string;
    public rank: number;
    public group: string;
    public odds: number;

    constructor(
        name: string,
        abbr: string,
        group: string,
        rank: number,
        odds: number
    ) {
        this.name = name;
        this.abbr = abbr;
        this.rank = rank;
        this.group = group;
        this.odds = odds;
    }

    cleanName(): string {
        if (this.name === "Costa Rica") return "CostaRica";
        if (this.name === "Saudi Arabia") return "SaudiArabia";
        return this.name;
    }
}
