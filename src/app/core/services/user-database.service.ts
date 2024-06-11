import { Injectable } from '@angular/core';
import { IUser, User } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDatabaseService {
  private users: IUser[] = [
    new User('Cooper'),
    new User('TJ'),
    new User('Andrew'),
    new User('Ryan'),
    new User('Micah'),
    new User('Bardia'),
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
