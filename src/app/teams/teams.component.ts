import { Component, OnInit } from '@angular/core';
import { Team, TEAMS } from '../team';

@Component({
    selector: 'app-teams',
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.css'],
})
export class TeamsComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    getTeams(): Team[] {
        return TEAMS;
    }

    getTeam(gender: string, name: string): Team {
		let team = this.getTeams().find(
            (x) => x.gender === gender && x.name === name
        );

		if (!team) throw `unable to find team ${gender}-${name}`

		return team;
    }
}
