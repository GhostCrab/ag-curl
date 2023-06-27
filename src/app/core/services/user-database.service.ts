import { Injectable } from '@angular/core';
import { IUser, User } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDatabaseService {
  private users: IUser[] = [
    new User('P1'),
    new User('P2'),
    new User('P3'),
    new User('P4'),
    new User('P5'),
    new User('P6'),
  ];

  public none: IUser = new User('');

  constructor() {}

  public get(s: string): IUser {
    for (const user of this.users) {
      if (user.name === s) return user;
    }

    throw new Error('Unable to find user with name ' + s);
  }

  public all(): IUser[] {
    return this.users;
  }
}
