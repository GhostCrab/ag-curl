import { Component, Input, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { IGame } from 'src/app/interfaces/game.interface';
import { IDraft } from 'src/app/interfaces/draft.interface';
import { ITeam } from 'src/app/interfaces/team.interface';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';

interface TeamStats {
  team: ITeam;
  wins: number;
  losses: number;
  points: number;
}

interface GroupStats {
  group: string;
  teams: TeamStats[];
}

interface DraftStats {
  userName: string;
  teamStats: TeamStats[];
  totalPoints: number;
}

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css']
})
export class TeamStatsComponent implements OnInit {
  @Input() games$: Observable<IGame[]>;
  @Input() drafts$: Observable<IDraft[]>;

  groupStats$: Observable<GroupStats[]>;
  draftStats$: Observable<DraftStats[]>;

  constructor(private teamdb: TeamDatabaseService) { }

  ngOnInit(): void {
    this.groupStats$ = this.games$.pipe(
      map(games => this.calculateGroupStats(games))
    );

    this.draftStats$ = combineLatest([this.games$, this.drafts$]).pipe(
      map(([games, drafts]) => this.calculateDraftStats(games, drafts))
    );
  }

  private calculateGroupStats(games: IGame[]): GroupStats[] {
    const teamStatsMap = new Map<string, TeamStats>();

    // Initialize all teams
    this.teamdb.all().forEach(team => {
      // Only include real teams (not placeholders)
      if (!['A1', 'B1', 'C1', 'D1', 'A2', 'B2', 'C2', 'D2', 'Q1W', 'Q2W', 'Q3W', 'Q4W', 'QW', 'TBD', 'S1W', 'S2W', 'A', 'B', 'C', 'D'].includes(team.abbr)) {
        teamStatsMap.set(team.abbr, {
          team: team,
          wins: 0,
          losses: 0,
          points: 0
        });
      }
    });

    // Calculate stats from completed games
    games.filter(g => g.complete).forEach(game => {
      const homeStats = teamStatsMap.get(game.home.abbr);
      const awayStats = teamStatsMap.get(game.away.abbr);

      if (!homeStats || !awayStats) return;

      homeStats.points += game.getScore(game.home.abbr);
      awayStats.points += game.getScore(game.away.abbr);

      const winner = game.winner();
      if (winner.abbr === game.home.abbr) {
        homeStats.wins++;
        awayStats.losses++;
      } else {
        awayStats.wins++;
        homeStats.losses++;
      }
    });

    // Group by pool and sort by points (then wins)
    const groupMap = new Map<string, TeamStats[]>();
    teamStatsMap.forEach(stats => {
      if (!groupMap.has(stats.team.group)) {
        groupMap.set(stats.team.group, []);
      }
      groupMap.get(stats.team.group)!.push(stats);
    });

    const groupStats: GroupStats[] = [];
    ['A', 'B', 'C', 'D'].forEach(group => {
      const teams = groupMap.get(group) || [];
      teams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return a.losses - b.losses;
      });
      groupStats.push({ group, teams });
    });

    return groupStats;
  }

  private calculateDraftStats(games: IGame[], drafts: IDraft[]): DraftStats[] {
    return drafts.map(draft => {
      let totalPoints = 0;
      const teamStats: TeamStats[] = [];

      draft.teams.forEach(team => {
        if (team.abbr === "GBR") {
           debugger; 
        }

        const stats: TeamStats = {
          team: team,
          wins: 0,
          losses: 0,
          points: 0
        };

        games.filter(g => g.complete).forEach(game => {
          const teamPoints = game.getScore(team.abbr);
          stats.points += teamPoints;
          totalPoints += teamPoints;

          // Track W/L for this specific team
          if (game.home.abbr === team.abbr || game.away.abbr === team.abbr) {
            const winner = game.winner();
            if (winner.abbr === team.abbr) {
              stats.wins++;
            } else {
              stats.losses++;
            }
          }
        });

        teamStats.push(stats);
      });

      return {
        userName: draft.user.name,
        teamStats: teamStats,
        totalPoints
      };
    });
  }
}
