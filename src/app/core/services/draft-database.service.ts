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
      new Draft(this.userdb.get("Bardia"), [teamdb.get('FRA'),teamdb.get('MAR'),teamdb.get('ECU'),teamdb.get('PAR'),teamdb.get('IRN'),teamdb.get('CPV')]),
      new Draft(this.userdb.get("Brad"),   [teamdb.get('ESP'),teamdb.get('NOR'),teamdb.get('USA'),teamdb.get('CIV'),teamdb.get('EGY'),teamdb.get('UZB')]),
      new Draft(this.userdb.get("Cooper"), [teamdb.get('ENG'),teamdb.get('MEX'),teamdb.get('JPN'),teamdb.get('SWE'),teamdb.get('ALG'),teamdb.get('TUN')]),
      new Draft(this.userdb.get("TJ"),     [teamdb.get('BRA'),teamdb.get('COL'),teamdb.get('SEN'),teamdb.get('KOR'),teamdb.get('CZE'),teamdb.get('COD')]),
      new Draft(this.userdb.get("Andrew"), [teamdb.get('ARG'),teamdb.get('URU'),teamdb.get('CRO'),teamdb.get('SCO'),teamdb.get('AUS'),teamdb.get('NZL')]),
      new Draft(this.userdb.get("Micah"),  [teamdb.get('POR'),teamdb.get('NED'),teamdb.get('SUI'),teamdb.get('TUR'),teamdb.get('GHA'),teamdb.get('KSA')]),
      new Draft(this.userdb.get("Ryan"),   [teamdb.get('GER'),teamdb.get('BEL'),teamdb.get('AUT'),teamdb.get('CAN'),teamdb.get('BIH'),teamdb.get('RSA')]),
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
    let rounds = 0;
    let draftIndex = 0;
    let draftDirection: 'up' | 'down' = 'up';

    // this.drafts = [];
    // users.forEach((user) => this.drafts.push(new Draft(user, [])));

    this.drafts = [
        new Draft(this.userdb.get("Cooper"), []),
        new Draft(this.userdb.get("TJ"), []),
        new Draft(this.userdb.get("Andrew"), []),
        new Draft(this.userdb.get("Ryan"), []),
        new Draft(this.userdb.get("Micah"), []),
        new Draft(this.userdb.get("Bardia"), []),
        new Draft(this.userdb.get("Brad"), []),
      ];

    while (teams.length > 0 && rounds < 6) {
      if (draftIndex >= this.drafts.length) {
        draftDirection = 'down';
        draftIndex = this.drafts.length - 1;
      }

      if (draftIndex < 0) {
        rounds++;
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
