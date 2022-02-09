import { Component, OnInit } from '@angular/core';
import { sprintf } from 'sprintf-js';

import { Game } from '../game';
import { GameService } from '../game.service';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
    games: Game[] = [];

    constructor(private gameService: GameService) {}

    ngOnInit(): void {
        this.getGames();
    }

    processRawInput(raw: any) {
        for (const date of raw.DateList) {
            for (const match of date.EventPhaseMatchList) {
                const sex = match?.Gender?.c_Name;
                if (sex === 'Mixed') continue;

                const c1 = match?.Match?.Competitor1?.c_Name;
                const c2 = match?.Match?.Competitor2?.c_Name;
                const id = match?.Match?.n_ID;
                const url = match?.c_ClientStreamURL;

                let name = sprintf("%s's %s vs %s", sex, c1, c2);
                if (match?.b_Finished) {
                    let c1Score = match?.Match?.Competitor1?.n_Result;
                    let c2Score = match?.Match?.Competitor2?.n_Result;
                    let winner = c1;
                    if (match?.Match?.n_Winner === 2) winner = c2;
                    name = sprintf(
                        "%s's %s [%d] vs %s [%d] | Winner: %s",
                        sex,
                        c1,
                        c1Score,
                        c2,
                        c2Score,
                        winner
                    );
                }

				if (match?.b_InProgress) {
                    let c1Score = match?.Match?.Competitor1?.n_Result;
                    let c2Score = match?.Match?.Competitor2?.n_Result;
                    name = sprintf(
                        "%s's %s [%d] vs %s [%d] | In Progress...",
                        sex,
                        c1,
                        c1Score,
                        c2,
                        c2Score
                    );
                }

                this.games.push({
                    id: id,
                    name: name,
                    url: url,
                });
                console.log(match);
            }
        }
    }

    getGames(): void {
        this.gameService.getGames().subscribe((x) => this.processRawInput(x));
    }

    add(name: string): void {
        name = name.trim();
        if (!name) {
            return;
        }
        this.gameService.addGame({ name } as Game).subscribe((game) => {
            this.games.push(game);
        });
    }

    delete(game: Game): void {
        this.games = this.games.filter((h) => h !== game);
        this.gameService.deleteGame(game.id).subscribe();
    }
}
