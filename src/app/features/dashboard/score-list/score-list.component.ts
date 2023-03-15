import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DraftDatabaseService } from 'src/app/core/services/draft-database.service';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';
import { IDraft } from 'src/app/interfaces/draft.interface';
import { IGame } from 'src/app/interfaces/game.interface';

@Component({
    selector: 'app-score-list',
    templateUrl: './score-list.component.html',
    styleUrls: ['./score-list.component.css'],
})
export class ScoreListComponent implements OnInit {
    @Input() drafts$: Observable<IDraft[]>;
    @Input() games$: Observable<IGame[]>;

    drafts: IDraft[];
    games: IGame[];

    scoreSubject$: BehaviorSubject<[string, [number, number, string]][]>;
    scores$: Observable<[string, [number, number, string]][]>;
    scores: Record<string, [number, number, string]>;

    constructor(private userdb: UserDatabaseService, private draftdb: DraftDatabaseService) {
        this.drafts = [];
        this.games = [];
        this.scores = {};
    }

    ngOnInit(): void {
        const tmpScores: [string, [number, number, string]][] = [];
        for (const user of this.userdb.all()) {
            this.scores[user.name] = [0, 0, '0'];
            tmpScores.push([user.name, [0, 0, '0']]);
        }
        this.scoreSubject$ = new BehaviorSubject(tmpScores);
        this.scores$ = this.scoreSubject$.asObservable();

        this.drafts$.subscribe((data) => {
            this.drafts = data;
            this.updateScore();
        });

        this.games$.subscribe((data) => {
            this.games = data;
            this.updateScore();
        });
    }

    updateScore(): void {
        for (const user of this.userdb.all()) {
            let wonGames = 0;
            let completedGames = 0;
            let score = 0;

            // get draft for this user
            const draft = this.draftdb.getDraftByUser(user.name);

            // for each team in user's draft, collect games and tally completed and gained points
            for (const team of draft.teams) {
                for (const game of this.games.filter(a => a.home.abbr === team.abbr || a.away.abbr === team.abbr)) {
                    if (game.complete) completedGames++;
                    let addScore = game.getScore(team.abbr);

                    if (addScore > 1) {
                        score += game.getScore(team.abbr);
                        wonGames += 1;
                    }
                }
            }

            this.scores[user.name] = [score, completedGames, (wonGames / completedGames).toFixed(3)];
        }

        const tmpScores: [string, [number, number, string]][] = [];
        for (const [name, score] of Object.entries(this.scores).sort((a, b) => {
          if (a[1][0] === b[1][0]) return a[0].localeCompare(b[0]);
          return b[1][0] - a[1][0];
        })) {
          tmpScores.push([name, score]);
        }
        this.scoreSubject$.next(tmpScores);
    }
}
