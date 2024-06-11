import { Injectable } from '@angular/core';
import { gaussianRandom } from 'src/app/app.util';
import { Draft, IDraft } from 'src/app/interfaces/draft.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { TeamDatabaseService } from './team-database.service';
import { UserDatabaseService } from './user-database.service';

@Injectable({
  providedIn: 'root',
})
export class DraftDatabaseService {
  public drafts: IDraft[];

  constructor(
    private userdb: UserDatabaseService,
    private teamdb: TeamDatabaseService
  ) {
    this.drafts = [
      new Draft(this.userdb.get("Cooper"), [this.teamdb.get('ENG'),this.teamdb.get('TUR'),this.teamdb.get('HUN'),this.teamdb.get('SVK')]),
      new Draft(this.userdb.get("TJ"),     [this.teamdb.get('FRA'),this.teamdb.get('SUI'),this.teamdb.get('SRB'),this.teamdb.get('ALB')]),
      new Draft(this.userdb.get("Andrew"), [this.teamdb.get('GER'),this.teamdb.get('CRO'),this.teamdb.get('SCO'),this.teamdb.get('SVN')]),
      new Draft(this.userdb.get("Ryan"),   [this.teamdb.get('POR'),this.teamdb.get('DEN'),this.teamdb.get('UKR'),this.teamdb.get('GEO')]),
      new Draft(this.userdb.get("Micah"),  [this.teamdb.get('BEL'),this.teamdb.get('ESP'),this.teamdb.get('CZE'),this.teamdb.get('AUT')]),
      new Draft(this.userdb.get("Bardia"), [this.teamdb.get('NED'),this.teamdb.get('ITA'),this.teamdb.get('POL'),this.teamdb.get('ROU')]),
    ];
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

  public mockDraft() {
    const pickedTeams: string[] = [];
    const users = this.userdb.all();
    const teams = this.teamdb
      .all()
      .filter((a) => a.rank > 0)
      .filter((a) => !pickedTeams.includes(a.abbr))
      .sort((a, b) => a.rank - b.rank);
    let snakes = 0;
    let draftIndex = 0;
    let draftDirection: 'up' | 'down' = 'up';

    // this.drafts = [];
    // users.forEach((user) => this.drafts.push(new Draft(user, [])));

    this.drafts = [
        new Draft(this.userdb.get("Keegan"), []),
        new Draft(this.userdb.get("Ryan"),   []),
        new Draft(this.userdb.get("SBrad"),  []),
        new Draft(this.userdb.get("Andrew"), []),
        new Draft(this.userdb.get("TJ"),     []),
        new Draft(this.userdb.get("Bardia"), []),
        new Draft(this.userdb.get("Micah"),  []),
        new Draft(this.userdb.get("Cooper"), []),
      ];

    while (teams.length > 0) {
      if (draftIndex >= this.drafts.length) {
        draftDirection = 'down';
        draftIndex = this.drafts.length - 1;
      }

      if (draftIndex < 0) {
        if (++snakes >= 2) break;
        draftDirection = 'up';
        draftIndex = 0;
      }

      const splicePos = Math.min(
        Math.floor(Math.abs(gaussianRandom(0, .5))),
        teams.length - 1
      );

      this.drafts[draftIndex].teams.push(teams.splice(splicePos, 1)[0]);

      if (draftDirection === 'up') {
        draftIndex++;
      } else if (draftDirection === 'down') {
        draftIndex--;
      }
    }
  }
}
