import { Component, OnInit } from '@angular/core';

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

    getGames(): void {
        this.games = this.gameService.getGames();
    }
}
