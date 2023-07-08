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
      // new Draft(userdb.get("Player 1"), []),
      // new Draft(userdb.get("Player 2"), []),
      // new Draft(userdb.get("Player 3"), []),
      // new Draft(userdb.get("Player 4"), []),
      // new Draft(userdb.get("Player 5"), []),
      // new Draft(userdb.get("Player 6"), []),
    ];

    userdb.all().forEach(user => this.drafts.push(new Draft(user, [])));
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
    const users = this.userdb.all();
    const teams = this.teamdb
      .all()
      .filter((a) => a.rank > 0)
      .sort((a, b) => a.rank - b.rank);
    let snakes = 0;
    let draftIndex = 0;
    let draftDirection: 'up' | 'down' = 'up';

    this.drafts = [];
    users.forEach((user) => this.drafts.push(new Draft(user, [])));

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
