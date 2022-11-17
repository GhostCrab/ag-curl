import { Component, OnInit } from '@angular/core';
import { Player } from '../player';
import { Team } from '../team';
import { TeamsComponent } from '../teams/teams.component';

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
    players: Player[] = [];

    constructor(private teams: TeamsComponent) {
        this.players.push({
            name: 'Andrew',
            teams: [
                this.teams.getTeam('France'),
                this.teams.getTeam('USA'),
                this.teams.getTeam('Wales'),
                this.teams.getTeam('Japan'),
            ],
        });
        this.players.push({
            name: 'Cooper',
            teams: [
                this.teams.getTeam('England'),
                this.teams.getTeam('Senegal'),
                this.teams.getTeam('Uruguay'),
                this.teams.getTeam('Korea'),
            ],
        });
        this.players.push({
            name: 'Ryan',
            teams: [
                this.teams.getTeam('Brazil'),
                this.teams.getTeam('Denmark'),
                this.teams.getTeam('Croatia'),
                this.teams.getTeam('Ecuador'),
            ],
        });
        this.players.push({
            name: 'TJ',
            teams: [
                this.teams.getTeam('Argentina'),
                this.teams.getTeam('Portugal'),
                this.teams.getTeam('Mexico'),
                this.teams.getTeam('Canada'),

            ],
        });
        this.players.push({
            name: 'Micah',
            teams: [
                this.teams.getTeam('Spain'),
                this.teams.getTeam('Belgium'),
                this.teams.getTeam('Switzerland'),
                this.teams.getTeam('Poland'),

            ],
        });
        this.players.push({
            name: 'Bardia',
            teams: [
                this.teams.getTeam('Netherlands'),
                this.teams.getTeam('Germany'),
                this.teams.getTeam('Iran'),
                this.teams.getTeam('Ghana'),
            ],
        });
        this.players.push({
            name: ' ',
            teams: [
                this.teams.getTeam('Morocco'),
                this.teams.getTeam('Qatar'),
                this.teams.getTeam('Serbia'),
                this.teams.getTeam('Australia'),
                this.teams.getTeam('Cameroon'),
                this.teams.getTeam('Tunisia'),
                this.teams.getTeam('Saudi Arabia'),
                this.teams.getTeam('Costa Rica'),
            ],
        });
    }

    ngOnInit(): void {}

    getPlayers(): Player[] {
        return this.players;
    }

    getPlayer(team: Team): Player {
        let player = this.players.find((x) =>
            x.teams.find(
                (y) => y.name === team.name
            )
        );

        if (!player)
            throw `unable to find player with team ${team.name}`;

        return player;
    }
}
