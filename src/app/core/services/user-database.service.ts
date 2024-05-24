import { Injectable } from '@angular/core';
import { IUser, User } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserDatabaseService {
  private users: IUser[] = [
    new User('Position 1'),
    new User('Position 2'),
    new User('Position 3'),
    new User('Position 4'),
    new User('Position 5'),
    new User('Position 6'),
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
