import { Component, OnInit } from '@angular/core';
import { sprintf } from 'sprintf-js';

import { Game } from '../game';
import { GameService } from '../game.service';

import { PlayersComponent } from '../players/players.component';
import { TeamsComponent } from '../teams/teams.component';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
    games: Game[] = [];
    showScores: boolean = false;
    playerScores = [
        ['TJ', 0, 0],
        ['Andrew', 0, 0],
        ['Cooper', 0, 0],
        ['Ryan', 0, 0],
        ['Bardia', 0, 0],
        ['Micah', 0, 0],
    ];

    constructor(
        private gameService: GameService,
        private teams: TeamsComponent,
        private players: PlayersComponent
    ) {}

    ngOnInit(): void {
        this.getGames();
    }

    processRawInput(raw: any) {
        for (const match of raw.Results) {
            const c1: undefined | string = match?.Home?.ShortClubName;
            const c2: undefined | string = match?.Away?.ShortClubName;
            const id: undefined | number = match?.MatchNumber;
            const c1Score: undefined | number | null = match?.HomeTeamScore;
            const c2Score: undefined | number | null = match?.AwayTeamScore;
            const c1PScore: undefined | number | null =
                match?.HomeTeamPenaltyScore;
            const c2PScore: undefined | number | null =
                match?.AwayTeamPenaltyScore;
            const startTime = new Date(match?.LocalDate).getTime();

            if (
                !c1 ||
                !c2 ||
                !id ||
                c1Score === undefined ||
                c2Score === undefined
            ) {
                console.log(
                    sprintf('%s %s %s %s %s', c1, c2, id, c1Score, c2Score)
                );
                continue;
            }

            const team1 = this.teams.getTeam(c1);
            const team2 = this.teams.getTeam(c2);
            const player1 = this.players.getPlayer(team1);
            const player2 = this.players.getPlayer(team2);

            let p1Score = null;
            let p2Score = null;

            let p1Class = '';
            let p2Class = '';

            const finished: boolean = false;
            const inProgress: boolean = false;
            let statusStr = inProgress
                ? 'IN PROGRESS'
                : finished
                ? 'COMPLETE'
                : new Date(startTime).toLocaleString();
            let url = '';

            this.games.push({
                id: id,
                teams: [team1, team2],
                players: [player1, player2],
                scores: [c1Score, c2Score],
                playerScores: [p1Score, p2Score],
                winClasses: [p1Class, p2Class],
                inProgress: inProgress,
                finished: finished,
                startTime: startTime,
                statusStr: statusStr,
                url: url,
            });
        }
    }

    processRawInput_(raw: any) {
        for (const date of raw.DateList) {
            for (const match of date.EventPhaseMatchList) {
                const gender: undefined | string = match?.Gender?.c_Name;
                if (gender === 'Mixed') continue;

                const c1: undefined | string =
                    match?.Match?.Competitor1?.c_Name;
                const c2: undefined | string =
                    match?.Match?.Competitor2?.c_Name;
                const id: undefined | number = match?.Match?.n_ID;
                const url: undefined | string = match?.c_ClientStreamURL;
                const finished: undefined | boolean = match?.b_Finished;
                const inProgress: undefined | boolean = match?.b_InProgress;
                const isKnockout: undefined | boolean = match?.b_KnockoutPhase;
                const phase: undefined | string = match?.c_Phase;
                const c1Score: undefined | number | null =
                    match?.Match?.Competitor1?.n_Result;
                const c2Score: undefined | number | null =
                    match?.Match?.Competitor2?.n_Result;
                const startTime = new Date(
                    match?.c_TimeFirstEventUTC + 'Z'
                ).getTime();

                if (
                    !c1 ||
                    !c2 ||
                    !id ||
                    !url ||
                    !gender ||
                    finished === undefined ||
                    inProgress === undefined ||
                    c1Score === undefined ||
                    c2Score === undefined
                ) {
                    console.log(
                        sprintf(
                            '%s %s %s %s %s %s %s %s %s',
                            c1,
                            c2,
                            id,
                            url,
                            gender,
                            finished,
                            inProgress,
                            c1Score,
                            c2Score
                        )
                    );
                    continue;
                }

                try {
                    const team1 = this.teams.getTeam(c1);
                    const team2 = this.teams.getTeam(c2);
                    const player1 = this.players.getPlayer(team1);
                    const player2 = this.players.getPlayer(team2);

                    let p1Score = null;
                    let p2Score = null;

                    let p1Class = '';
                    let p2Class = '';

                    if (c1Score !== null && c2Score !== null && finished) {
                        if (c1Score > c2Score) {
                            p1Score = 1;
                            p2Score = 0;

                            p1Class = 'win';

                            let ps1 = this.playerScores.find(
                                (x) => x[0] === player1.name
                            );
                            let ps2 = this.playerScores.find(
                                (x) => x[0] === player2.name
                            );
                            if (isKnockout) {
                                p1Score = 0;
                                p2Score = 0;
                                if (phase === 'Bronze Medal Game') {
                                    p1Score = 2;
                                    p2Score = 1;
                                    if (ps1) {
                                        ps1[1] = Number(ps1[1]) + 2;
                                    }
                                    if (ps2) {
                                        ps2[1] = Number(ps2[1]) + 1;
                                    }
                                }
                                if (phase === 'Gold Medal Game') {
                                    p1Score = 6;
                                    p2Score = 4;
                                    if (ps1) {
                                        ps1[1] = Number(ps1[1]) + 6;
                                    }
                                    if (ps2) {
                                        ps2[1] = Number(ps2[1]) + 4;
                                    }
                                }
                            } else {
                                if (ps1) {
                                    ps1[1] = Number(ps1[1]) + 1;
                                    ps1[2] = Number(ps1[2]) + 1;
                                }
                                if (ps2) {
                                    ps2[2] = Number(ps2[2]) + 1;
                                }
                            }
                        } else {
                            p1Score = 0;
                            p2Score = 1;

                            p2Class = 'win';

                            let ps1 = this.playerScores.find(
                                (x) => x[0] === player1.name
                            );
                            let ps2 = this.playerScores.find(
                                (x) => x[0] === player2.name
                            );
                            if (isKnockout) {
                                p1Score = 0;
                                p2Score = 0;
                                if (phase === 'Bronze Medal Game') {
                                    p1Score = 1;
                                    p2Score = 2;
                                    if (ps1) {
                                        ps1[1] = Number(ps1[1]) + 1;
                                    }
                                    if (ps2) {
                                        ps2[1] = Number(ps2[1]) + 2;
                                    }
                                }
                                if (phase === 'Gold Medal Game') {
                                    p1Score = 4;
                                    p2Score = 6;
                                    if (ps1) {
                                        ps1[1] = Number(ps1[1]) + 4;
                                    }
                                    if (ps2) {
                                        ps2[1] = Number(ps2[1]) + 6;
                                    }
                                }
                            } else {
                                if (ps1) {
                                    ps1[2] = Number(ps1[2]) + 1;
                                }
                                if (ps2) {
                                    ps2[1] = Number(ps2[1]) + 1;
                                    ps2[2] = Number(ps2[2]) + 1;
                                }
                            }
                        }
                    }

                    let statusStr = inProgress
                        ? 'IN PROGRESS'
                        : finished
                        ? 'COMPLETE'
                        : new Date(startTime).toLocaleString();

                    this.games.push({
                        id: id,
                        teams: [team1, team2],
                        players: [player1, player2],
                        scores: [c1Score, c2Score],
                        playerScores: [p1Score, p2Score],
                        winClasses: [p1Class, p2Class],
                        inProgress: inProgress,
                        finished: finished,
                        startTime: startTime,
                        statusStr: statusStr,
                        url: url,
                    });
                } catch (e) {
                    console.log(e);
                    continue;
                }

                console.log(match);
            }
        }

        this.playerScores = this.playerScores.sort((a, b) =>
            b[1] === a[1]
                ? Number(a[2]) - Number(b[2])
                : Number(b[1]) - Number(a[1])
        );

        this.games = this.games.sort((a, b) =>
            a.startTime === b.startTime
                ? a.id - b.id
                : a.startTime - b.startTime
        );
    }

    getGames(): void {
        this.gameService.getGames().subscribe((x) => this.processRawInput(x));
    }

    toggleScores(): void {
        this.showScores = !this.showScores;
    }
}
