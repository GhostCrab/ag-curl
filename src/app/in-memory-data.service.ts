import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Game } from './game';

@Injectable({
    providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const games = [
            { id: 11, name: 'Dr Nice' },
            { id: 12, name: 'Narco' },
            { id: 13, name: 'Bombasto' },
            { id: 14, name: 'Celeritas' },
            { id: 15, name: 'Magneta' },
            { id: 16, name: 'RubberMan' },
            { id: 17, name: 'Dynama' },
            { id: 18, name: 'Dr IQ' },
            { id: 19, name: 'Magma' },
            { id: 20, name: 'Tornado' },
        ];
        return { games };
    }

    // Overrides the genId method to ensure that a game always has an id.
    // If the games array is empty,
    // the method below returns the initial number (11).
    // if the games array is not empty, the method below returns the highest
    // game id + 1.
    genId(games: Game[]): number {
        return games.length > 0
            ? Math.max(...games.map((game) => game.id)) + 1
            : 11;
    }
}
