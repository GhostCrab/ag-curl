import { Component, OnInit } from '@angular/core';
import { sprintf } from 'sprintf-js';

import { Game } from '../game';
import { GameService } from '../game.service';

import { PlayersComponent } from '../players/players.component';
import { TeamsComponent } from '../teams/teams.component';

import { ApplicationStateService } from 'src/app/core/services/application-state.service';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
    games: Game[] = [];
    showScores: boolean = true;
    playerScores = [
        ['TJ', 0, 0],
        ['Andrew', 0, 0],
        ['Cooper', 0, 0],
        ['Ryan', 0, 0],
        ['Bardia', 0, 0],
        ['Micah', 0, 0],
    ];

    isMobile: boolean;

    constructor(
        private gameService: GameService,
        private teams: TeamsComponent,
        private players: PlayersComponent,
        private readonly appState: ApplicationStateService,
    ) {
        this.isMobile = appState.getIsMobileResolution();
    }

    ngOnInit(): void {
        this.getGames();
    }

    processRawInput(raw: any) {
        for (const match of raw.Results) {
            const c1: undefined | string = match?.Home?.ShortClubName;
            const c2: undefined | string = match?.Away?.ShortClubName;
            const id: undefined | number = match?.MatchNumber;
            let c1Score: undefined | number | null = match?.HomeTeamScore;
            let c2Score: undefined | number | null = match?.AwayTeamScore;
            const c1PScore: undefined | number | null =
                match?.HomeTeamPenaltyScore;
            const c2PScore: undefined | number | null =
                match?.AwayTeamPenaltyScore;
            let c1Img: undefined | string = match?.Home?.PictureUrl;
            let c2Img: undefined | string = match?.Away?.PictureUrl;
            const startTime = new Date(match?.LocalDate).getTime() - 10800000;

            let finished: undefined | boolean = match?.MatchStatus === 0;
            let inProgress: undefined | boolean = match?.MatchStatus > 1;
            let isKnockout: undefined | boolean = match?.b_KnockoutPhase;
            const phase: undefined | string = match?.c_Phase;

            // c1Score = Math.floor(Math.random() * 4);
            // c2Score = Math.floor(Math.random() * 4);

            isKnockout = false;

            if (
                !c1 ||
                !c2 ||
                !id ||
                finished === undefined ||
                inProgress === undefined ||
                c1Score === undefined ||
                c2Score === undefined
            ) {
                console.log(
                    sprintf(
                        '%s %s %s %s %s %s %s',
                        c1,
                        c2,
                        id,
                        finished,
                        inProgress,
                        c1Score,
                        c2Score
                    )
                );
                continue;
            }

            if (!c1Img) c1Img = '';
            if (!c2Img) c2Img = '';

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
                    if (c1Score === c2Score) {
                        p1Score = 1;
                        p2Score = 1;

                        p1Class = 'tie';
                        p2Class = 'tie';

                        let ps1 = this.playerScores.find(
                            (x) => x[0] === player1.name
                        );
                        let ps2 = this.playerScores.find(
                            (x) => x[0] === player2.name
                        );

                        if (ps1) {
                            ps1[1] = Number(ps1[1]) + 1;
                            ps1[2] = Number(ps1[2]) + 1;
                        }
                        if (ps2) {
                            ps2[1] = Number(ps2[1]) + 1;
                            ps2[2] = Number(ps2[2]) + 1;
                        }
                    }
                    else if (c1Score > c2Score) {
                        p1Score = 3;
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
                                ps1[1] = Number(ps1[1]) + 3;
                                ps1[2] = Number(ps1[2]) + 1;
                            }
                            if (ps2) {
                                ps2[2] = Number(ps2[2]) + 1;
                            }
                        }
                    } else {
                        p1Score = 0;
                        p2Score = 3;

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
                                ps2[1] = Number(ps2[1]) + 3;
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
                    url: '',
                    homeImg: c1Img,
                    awayImg: c2Img,
                });
            } catch (e) {
                console.log(e);
                continue;
            }

            console.log(match);
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

    processRawInput_(raw: any) {}

    getGames(): void {
        this.gameService.getGames().subscribe((x) => this.processRawInput(x));
    }

    toggleScores(): void {
        this.showScores = !this.showScores;
    }
}