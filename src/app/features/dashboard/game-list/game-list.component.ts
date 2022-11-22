import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStateService } from 'src/app/core/services/application-state.service';
import { IGame } from 'src/app/interfaces/game.interface';

@Component({
    selector: 'app-game-list',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.css'],
})
export class GameListComponent implements OnInit {
    @Input() games$: Observable<IGame[]>;

    isMobile: boolean;
    
    constructor(private readonly appState: ApplicationStateService) {
        this.isMobile = appState.getIsMobileResolution();
    }

    ngOnInit(): void {}
}
