import { Injectable } from '@angular/core';
import { IUser, User } from 'src/app/interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class UserDatabaseService {
    private users: IUser[] = [
        new User('Andrew'),
        new User('Bardia'),
        new User('Cooper'),
        new User('Micah'),
        new User('Ryan'),
        new User('TJ')
    ];

    public none: IUser = new User('');

    constructor() {}

    get(s: string): IUser {
        for (const user of this.users) {
            if (user.name === s) return user;
        }

        throw new Error('Unable to find user with name ' + s);
    }
}
