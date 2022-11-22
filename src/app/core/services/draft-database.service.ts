import { Injectable } from '@angular/core';
import { Draft, IDraft } from 'src/app/interfaces/draft.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { TeamDatabaseService } from './team-database.service';
import { UserDatabaseService } from './user-database.service';

@Injectable({
    providedIn: 'root',
})
export class DraftDatabaseService {
    public drafts: IDraft[];

    constructor(private userdb: UserDatabaseService, private teamdb: TeamDatabaseService) {
        this.drafts = [
            new Draft(userdb.get("Andrew"), [teamdb.get('France'),teamdb.get('USA'),teamdb.get('Wales'),teamdb.get('Japan')]),
            new Draft(userdb.get("Cooper"), [teamdb.get('England'),teamdb.get('Senegal'),teamdb.get('Uruguay'),teamdb.get('Korea')]),
            new Draft(userdb.get("Ryan"),   [teamdb.get('Brazil'),teamdb.get('Denmark'),teamdb.get('Croatia'),teamdb.get('Ecuador')]),
            new Draft(userdb.get("TJ"),     [teamdb.get('Argentina'),teamdb.get('Portugal'),teamdb.get('Mexico'),teamdb.get('Canada')]),
            new Draft(userdb.get("Micah"),  [teamdb.get('Spain'),teamdb.get('Belgium'),teamdb.get('Switzerland'),teamdb.get('Poland')]),
            new Draft(userdb.get("Bardia"), [teamdb.get('Netherlands'),teamdb.get('Germany'),teamdb.get('Iran'),teamdb.get('Ghana')])
        ]
    }

    public getUserByAbbr(abbr: string): IUser {
        for (const draft of this.drafts) {
            for (const team of draft.teams) {
                if (team.abbr === abbr) return draft.user;
            }
        }

        return this.userdb.none;
    }

    public getDraftByUser(name: string): IDraft {
        for (const draft of this.drafts) {
            if (draft.user.name === name) return draft;
        }

        throw new Error('Unable to find draft for user named ' + name);
    }
}
