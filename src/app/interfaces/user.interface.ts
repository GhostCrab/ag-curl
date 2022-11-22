export interface IUser {
    name: string;

    abbr(): string;
    full(): string;
    isNone(): boolean;
}

export class User implements IUser {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }

    public abbr(): string {
        if (this.name.length > 0) return `[${this.name.charAt(0)}]`;

        return '';
    }

    public full(): string {
        if (this.name.length > 0) return `- ${this.name}`;

        return '';
    }

    public isNone(): boolean {
        return this.name === '';
    }
}
