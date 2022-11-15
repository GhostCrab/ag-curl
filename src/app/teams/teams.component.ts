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

    getTeam(name: string): Team {
        if (name === "IR Iran") {
            let team = this.getTeams().find(
                (x) => x.name === "Iran"
            );

            if (!team) throw `unable to find team ${name}`

            return team
        } 

        if (name === "Korea Republic") {
            let team = this.getTeams().find(
                (x) => x.name === "Iran"
            );

            if (!team) throw `unable to find team ${name}`

            return team
        } 

		let team = this.getTeams().find(
            (x) => x.name === name
        );

		if (!team) throw `unable to find team ${name}`

		return team;
    }
}
