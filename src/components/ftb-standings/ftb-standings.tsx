import { Component, h, State } from '@stencil/core';
import { Team, TeamsList } from '../../components';
import { Week } from '../ftb-app/interfaces/week.interface';
import { Standing } from '../ftb-app/interfaces/standing.interface';

@Component({
  tag: 'ftb-standings',
  styleUrl: 'ftb-standings.scss',
  shadow: false,
})
export class FtbStandings {

  private store: any = document.querySelector('ftb-app');

  @State() teams: Array<Standing> = [];
  @State() view: string = 'division';

  componentWillLoad() {
    this.store.getScheduleAndTeams()
      .then((res) => {
        this.calculateData(res.teams, res.schedule);
      });
  }

  calculateData(teams: TeamsList, schedule: Array<Week>) {
    let teamList = [];

    Object.keys(teams).forEach((t) => {
      const team: Team = teams[t];
      const standingItem = {
        team: team.title,
        teamCode: t,
        wins: team.wins.length,
        losses: team.losses.length,
        conf: team.conf,
        div: team.div,
        conferenceWins: 0,
        conferenceLosses: 0,
        divisionWins: 0,
        divisionLosses: 0,
        color: team.color,
        matchDetails: []
      };

      schedule.forEach((s) => {
        const game = s.games.filter(g => g.away == t || g.home == t);

        if (game.length) {
          standingItem.matchDetails.push({
            week: s.title,
            opponent: teams[game[0].home == t ? game[0].away : game[0].home].title,
            win: game[0].winner == t,
            isHome: game[0].home == t
          });
        }
      });

      team.wins.forEach((win) => {
        const winWeek = schedule.filter(s => s.title == win)[0];
        const winMatch = winWeek.games.filter(m => m.away == t || m.home == t)[0];

        const opponentCode = winMatch.home == t ? winMatch.away : winMatch.home;
        const opponent: Team = teams[opponentCode];

        if (opponent.conf == team.conf) {
          standingItem.conferenceWins += 1;

          if (opponent.div == team.div) {
            standingItem.divisionWins += 1;
          }
        }
      });

      team.losses.forEach((loss) => {
        const lossWeek = schedule.filter(s => s.title == loss)[0];
        const lossMatch = lossWeek.games.filter(m => m.away == t || m.home == t)[0];
        const opponentCode = lossMatch.home == t ? lossMatch.away : lossMatch.home;
        const opponent: Team = teams[opponentCode];

        if (opponent.conf == team.conf) {
          standingItem.conferenceLosses += 1;

          if (opponent.div == team.div) {
            standingItem.divisionLosses += 1;
          }
        }
      });

      teamList.push(standingItem);
    });

    teamList.sort((a,b) => b.conferenceWins - a.conferenceWins);
    teamList.sort((a,b) => b.divisionWins - a.divisionWins);
    teamList.sort((a,b) => b.wins - a.wins);

    let seedAfc = 1;
    let seedNfc = 1;

    let seedTracker = {
      AFCEast: false,
      AFCNorth: false,
      AFCSouth: false,
      AFCWest: false,
      NFCEast: false,
      NFCNorth: false,
      NFCSouth: false,
      NFCWest: false
    };

    //get division leader seeding
    teamList.forEach((team: Standing) => {
        const hasWinner = seedTracker[team.conf + team.div];

        if (!hasWinner) {
          seedTracker[team.conf + team.div] = true;

          if (team.conf == 'AFC') {
            team.seed = seedAfc;
            seedAfc += 1;
          }

          if (team.conf == 'NFC') {
            team.seed = seedNfc;
            seedNfc += 1;
          }
        }
    });

    //get non div leader seeding
    teamList.forEach((team) => {
        if (!team.seed && team.conf == 'AFC') {
            team.seed = seedAfc;
            seedAfc += 1;
        }

        if (!team.seed && team.conf == 'NFC') {
            team.seed = seedNfc;
            seedNfc += 1;
        }
    });

    this.teams = teamList;
  }

  setView(view: string) {
    this.view = view;
  }

  showColumnHeader() {
    return `
      <div><span>Team</span></div>
      <div><span>Wins</span></div>
      <div><span>Losses</span></div>
      <div><span>Div. Wins</span></div>
      <div><span>Div. Losses</span></div>
      <div><span>Conf. Wins</span></div>
      <div><span>Conf. Losses</span></div>
    `;
  }

  render() {
    return (
      <div class="standings panel">
        <h2>Standings</h2>

        <div class="btns">
          <div
            class={`btn ${this.view == 'division' ? 'active' : ''}`}
            role='button'
            tabIndex={0}
            onClick={() => {this.setView('division')}}><span>Division</span></div>

          <div
            class={`btn ${this.view == 'conference' ? 'active' : ''}`}
            role='button'
            tabIndex={0}
            onClick={() => {this.setView('conference')}}><span>Conference</span></div>

          <div
            class={`btn ${this.view == 'league' ? 'active' : ''}`}
            role='button'
            tabIndex={0}
            onClick={() => {this.setView('league')}}><span>League</span></div>
        </div>

        {this.view == 'division' && (
          <div class="div-view">
            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">AFC East</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'AFC' && t.div == 'East')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>

            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">AFC North</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'AFC' && t.div == 'North')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>

            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">AFC South</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'AFC' && t.div == 'South')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>

            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">AFC West</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'AFC' && t.div == 'West')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>

            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">NFC East</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'NFC' && t.div == 'East')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>

            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">NFC North</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'NFC' && t.div == 'North')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>

            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">NFC South</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'NFC' && t.div == 'South')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>

            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">NFC West</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'NFC' && t.div == 'West')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>
            
          </div>
        )}

        {this.view == 'conference' && (
          <div class="div-view">
            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">AFC</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'AFC')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>

            <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">NFC</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.filter(t => (t.conf == 'NFC')).map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
            </div>
            
          </div>
        )}

        {this.view == 'league' && (
          <div class="div-view">
             <div class="standing-wrapper">
              <div class="standing-section">
                <div class="standing-header">NFL</div>
                <div class="standing-cols" innerHTML={this.showColumnHeader()}></div>
                {this.teams.map((team, index) => (
                  <ftb-schedule-team team={team} even={index % 2 == 0}></ftb-schedule-team>
                ))}
              </div>
             </div>
          </div>
        )}
      </div>
    );
  }

}
