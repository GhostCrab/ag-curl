import { Team } from './team';

export interface Player {
    name: string;
    teams: Team[];
}

export const PLAYERS = [
    {
        name: 'TJ',
        teams: [
            { name: 'Canada', sex: 'men' },
            { name: 'Switzerland', sex: 'women' },
            { name: 'United States', sex: 'men' },
            { name: 'Korea', sex: 'women' },
            { name: 'China', sex: 'women' },
        ],
    },
    {
        name: 'Andrew',
        teams: [
            { name: 'Great Britain', sex: 'men' },
            { name: 'Switzerland', sex: 'men' },
            { name: 'Japan', sex: 'women' },
            { name: 'Denmark', sex: 'men' },
            { name: 'ROC', sex: 'women' },
        ],
    },
    {
        name: 'Cooper',
        teams: [
            { name: 'Canada', sex: 'women' },
            { name: 'Great Britain', sex: 'women' },
            { name: 'Italy', sex: 'men' },
            { name: 'China', sex: 'men' },
            { name: 'Denmark', sex: 'women' },
        ],
    },
    {
        name: 'Ryan',
        teams: [
            { name: 'Sweden', sex: 'men' },
            { name: 'Sweden', sex: 'women' },
            { name: 'United States', sex: 'women' },
            { name: 'Norway', sex: 'men' },
            { name: 'ROC', sex: 'men' },
        ],
    },
];

/*





















*/
