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
            new Draft(userdb.get("Andrew"), [teamdb.get('VEN'),teamdb.get('PUR'),teamdb.get('AUS'),teamdb.get('COL'),teamdb.get('NCA')]),
            new Draft(userdb.get("Brad"),   [teamdb.get('USA'),teamdb.get('MEX'),teamdb.get('NED'),teamdb.get('ISR'),teamdb.get('CZE')]),
            new Draft(userdb.get("Cooper"), [teamdb.get('DOM'),teamdb.get('CUB'),teamdb.get('TPE'),teamdb.get('ITA'),teamdb.get('CHN')]),
            new Draft(userdb.get("Ryan"),   [teamdb.get('JPN'),teamdb.get('KOR'),teamdb.get('CAN'),teamdb.get('PAN'),teamdb.get('GBR')]),
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
