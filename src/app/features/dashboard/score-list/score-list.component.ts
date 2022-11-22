import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

    constructor() {}

    ngOnInit(): void {}
}
