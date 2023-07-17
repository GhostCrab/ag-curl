import { IGame } from "./game.interface";

export interface ITeam {
    name: string;
    abbr: string;
    rank: number;
    group: string;
    odds: number;
    logOdds: number;
    rrScore: number;
    totalScore: number;
    games: IGame[];
    imgURL: string;
    
    resetGames(): void;
    registerGame(game: IGame): void;
    cleanName(): string;
    rrSort(vs: ITeam): number;
}

export class Team {
    public name: string;
    public abbr: string;
    public rank: number;
    public group: string;
    public odds: number;
    public logOdds: number;
    public rrScore: number;
    public totalScore: number;
    public games: IGame[] = [];
    public imgURL: string;

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
        this.logOdds = Math.log10(this.odds);
        this.rrScore = 0;
        this.totalScore = 0;
        this.imgURL = this.rank > 0 ? `https://api.fifa.com/api/v3/picture/flags-sq-1/${this.abbr}` : '';
    }

    registerGame(game: IGame): void {
      this.games.push(game);
      if (game.complete) {
        const score = game.getAwardedPoints(this.abbr);
        this.totalScore += score;
        if (!game.knockout) {
          this.rrScore += score;
        }
      }
    }

    cleanName(): string {
      if (this.name === 'Republic of Ireland') return 'Ireland';
      if (this.name === 'Korea Republic') return 'Korea';
      if (this.name === 'China PR') return 'China';

      if (this.name === 'W49') return '1A|2C';
      if (this.name === 'W50') return '1C|2A';
      if (this.name === 'W51') return '1E|2G';
      if (this.name === 'W52') return '1G|2E';
      if (this.name === 'W53') return '1D|2B';
      if (this.name === 'W54') return '1B|2D';
      if (this.name === 'W55') return '1H|2F';
      if (this.name === 'W56') return '1F|2H';
      if (this.name === 'W57') return '1A|2C|1E|2G';
      if (this.name === 'W58') return '1C|2A|1G|2E';
      if (this.name === 'W59') return '1D|2B|1H|2F';
      if (this.name === 'W60') return '1B|2D|1F|2H';
      if (this.name === 'W61') return 'WA|WC|WE|WG';
      if (this.name === 'W62') return 'WB|WD|WF|WH';
      return this.name;
    }

    resetGames(): void {
      this.games = [];
      this.totalScore = 0;
      this.rrScore = 0;
    }

    rrSort(vs: ITeam): number {
      if (this.rrScore === vs.rrScore) {
        const vsGames = this.games.filter( a => a.includesTeam(vs) );
        if (vsGames.length === 0) 
          return Math.random() - 0.5;

        if (vsGames[0].tie())
          return Math.random() - 0.5;

        if (vsGames[0].winner().abbr === this.abbr)
          return -1;

        return 1;
      }

      return vs.rrScore - this.rrScore;
    }
}
