import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Game } from '../game';
import { GameService } from '../game.service';

@Component({
    selector: 'app-game-detail',
    templateUrl: './game-detail.component.html',
    styleUrls: ['./game-detail.component.css'],
})
export class GameDetailComponent implements OnInit {
    game: Game | undefined;

    constructor(
        private route: ActivatedRoute,
        private gameService: GameService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.getGame();
    }

    getGame(): void {
        const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
        this.game = this.gameService.getGame(id);
    }

    goBack(): void {
        this.location.back();
    }
}
