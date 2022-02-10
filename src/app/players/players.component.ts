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
            name: 'TJ',
            teams: [
                this.teams.getTeam('Men', 'Canada'),
                this.teams.getTeam('Women', 'Switzerland'),
                this.teams.getTeam('Men', 'United States'),
                this.teams.getTeam('Women', 'South Korea'),
                this.teams.getTeam('Women', 'China'),
            ],
        });
        this.players.push({
            name: 'Andrew',
            teams: [
                this.teams.getTeam('Men', 'Great Britain'),
                this.teams.getTeam('Men', 'Switzerland'),
                this.teams.getTeam('Women', 'Japan'),
                this.teams.getTeam('Men', 'Denmark'),
                this.teams.getTeam('Women', 'ROC'),
            ],
        });
        this.players.push({
            name: 'Cooper',
            teams: [
                this.teams.getTeam('Women', 'Canada'),
                this.teams.getTeam('Women', 'Great Britain'),
                this.teams.getTeam('Men', 'Italy'),
                this.teams.getTeam('Men', 'China'),
                this.teams.getTeam('Women', 'Denmark'),
            ],
        });
        this.players.push({
            name: 'Ryan',
            teams: [
                this.teams.getTeam('Men', 'Sweden'),
                this.teams.getTeam('Women', 'Sweden'),
                this.teams.getTeam('Women', 'United States'),
                this.teams.getTeam('Men', 'Norway'),
                this.teams.getTeam('Men', 'ROC'),
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
                (y) => y.gender === team.gender && y.name === team.name
            )
        );

        if (!player)
            throw `unable to find player with team ${team.gender}-${team.name}`;

        return player;
    }
}
