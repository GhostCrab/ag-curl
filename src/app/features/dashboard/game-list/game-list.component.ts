import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApplicationStateService } from 'src/app/core/services/application-state.service';
import { IGame } from 'src/app/interfaces/game.interface';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
})
export class GameListComponent implements OnInit {
  @Input() games$: Observable<IGame[]>;

  public games: IGame[] = [];

  isMobile: boolean;

  constructor(private readonly appState: ApplicationStateService) {
    this.isMobile = appState.getIsMobileResolution();
  }

  ngOnInit(): void {
    this.games$.subscribe((data) => {
      console.log(data);
      if (this.games.length === 0) {
        this.games = data;
      }
      for (let i = 0; i < data.length; i++) {
        if (!this.games[i].compare(data[i])) {
          this.games[i] = data[i];
        }
      }
    });
  }
}
