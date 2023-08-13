import { Component, Host, State, h, Method, Element } from '@stencil/core';
import { Week } from './interfaces/week.interface';
import { TeamsList } from './interfaces/teams-list.interface';
import { Team } from './interfaces/team.interface';
import { Match } from './interfaces/match.interface';
import { gear } from './icon/gear';
import { info } from './icon/info';

@Component({
  tag: 'ftb-store',
  shadow: false,
  styleUrl: 'ftb-store.scss'
})
export class FtbStore {

  @Element() root: HTMLElement;
  public schedule: Array<Week>;
  public teams: TeamsList;
  @State() isReady: boolean;
  @State() currentView: string = 'standings';

  componentWillLoad() {
    this.setup();
  }

  setup() {
    const storedSchedule = localStorage.getItem('schedule');
    const storedTeams = localStorage.getItem('teams');
    let isReturnSession = false;

    if (storedTeams && storedSchedule) {
      isReturnSession = this.stateSetFromStorage(storedSchedule, storedTeams);
      this.isReady = true;
      this.showDoneStates();
    }

    if (!isReturnSession) {
      let returned = 0;

      fetch('/assets/data/schedule.json', { 
        method: 'GET'
      })
      .then((response) => { return response.json(); })
      .then((json) => {
        this.schedule = json;
        returned += 1;
        if (returned >= 2) {
          this.isReady = true;
        }
      });

      fetch('/assets/data/teams.json', { 
        method: 'GET'
      })
      .then((response) => { return response.json(); })
      .then((json) => {
        this.teams = json;
        returned += 1;
        if (returned >= 2) {
          this.isReady = true;
        }
      });
    }
  }

  private stateSetFromStorage(storedSchedule: string, storedTeams: string): boolean {
    let isSetSeccsefully = true;

    try {
      this.schedule = JSON.parse(storedSchedule);
      this.teams = JSON.parse(storedTeams);
    } catch(ex) {
      console.warn('could not setup from storage: ' + ex);
      isSetSeccsefully = false;
    }

    return isSetSeccsefully;
  }

  @Method()
  async reset() {
    localStorage.removeItem('schedule');
    localStorage.removeItem('teams');

    this.setup();

    this.setView('info');
  }

  @Method()
  async manualDataUpdate(newTeams, newSchedule) {
    localStorage.setItem('teams', newTeams);
    localStorage.setItem('schedule', newSchedule);
    this.setup();
  }

  @Method()
  async getScheduleAndTeams(): Promise<any> {
    return {
      teams: {...this.teams},
      schedule: [...this.schedule]
    };
  }

  @Method()
  async getTeamByCode(teamCode: string): Promise<Team> {
    return this.teams[teamCode];
  }

  @Method()
  async getWeekMatches(week: string): Promise<Array<Match>> {
    const filtered = this.schedule.filter((w) => w.title.includes(week));
    return (filtered && filtered.length) ? filtered[0].games : [];
  }

  @Method()
  async updateMatch(week: string, winningTeamCode: string): Promise<any> {
    const weekEntry = [...this.schedule].filter(w => w.title == week)[0];
    const match = weekEntry.games.filter(m => m.away == winningTeamCode || m.home == winningTeamCode)[0];
    const teamList = {...this.teams};
    const winningTeam: Team = teamList[winningTeamCode];
    const losingTeam: Team = teamList[(match.away == winningTeamCode) ? match.home : match.away];

    if (!winningTeam.wins.includes(week)) {
      winningTeam.wins.push(week);
    } 
    if (winningTeam.losses.includes(week)) {
      winningTeam.losses.splice(winningTeam.losses.indexOf(week), 1);
    }

    if (!losingTeam.losses.includes(week)) {
      losingTeam.losses.push(week);
    }
    if (losingTeam.wins.includes(week)) {
      losingTeam.wins.splice(losingTeam.wins.indexOf(week), 1);
    }

    match.winner = winningTeamCode;

    const undecidedMatchesInWeek = weekEntry.games.filter(g => (!g.winner || g.winner == ''));

    if (!undecidedMatchesInWeek.length) {
      weekEntry.completed = true;
    } else {
      weekEntry.completed = false;
    }

    this.showDoneStates();

    this.schedule = this.schedule;
    this.teams = teamList;

    localStorage.setItem('schedule', JSON.stringify(this.schedule));
    localStorage.setItem('teams', JSON.stringify(this.teams));
  }

  tupdateMatch(week: string, winningTeamCode: string){
    const weekEntry = [...this.schedule].filter(w => w.title == week)[0];
    const match = weekEntry.games.filter(m => m.away == winningTeamCode || m.home == winningTeamCode)[0];
    const teamList = {...this.teams};
    const winningTeam: Team = teamList[winningTeamCode];
    const losingTeam: Team = teamList[(match.away == winningTeamCode) ? match.home : match.away];

    if (!winningTeam.wins.includes(week)) {
      winningTeam.wins.push(week);
    } else if (winningTeam.wins.includes(week)) {
      winningTeam.wins.splice(winningTeam.wins.indexOf(week), 1);
    }

    if (!losingTeam.losses.includes(week)) {
      losingTeam.losses.push(week);
    }else if (losingTeam.losses.includes(week)) {
      losingTeam.losses.splice(losingTeam.losses.indexOf(week), 1);
    }

    match.winner = winningTeamCode;

    const undecidedMatchesInWeek = weekEntry.games.filter(g => (!g.winner || g.winner == ''));

    if (!undecidedMatchesInWeek.length) {
      weekEntry.completed = true;
    } else {
      weekEntry.completed = false;
    }

    this.showDoneStates();

    this.schedule = this.schedule;
    this.teams = teamList;
  }

  @Method()
  async doDummyRun() {
    this.schedule.forEach((w) => {
      w.games.forEach((g) => {
        this.tupdateMatch(w.title, g.home);
      });
    });

    localStorage.setItem('schedule', JSON.stringify(this.schedule));
    localStorage.setItem('teams', JSON.stringify(this.teams));
  }

  showDoneStates() {
    const weeks = this.root.querySelectorAll('.nav .weeks-inner > div');
    weeks.forEach((w: HTMLElement) => {
      const weekEntry = this.schedule.filter(s => s.title == w.innerHTML)[0];
      w.classList[weekEntry.completed ? 'add' : 'remove']('completed');
    });
  }

  @Method()
  async setView(view: string) {
    this.currentView = view;
    window.scrollTo(0, 0);
  }

  componentDidRender() {
    this.showDoneStates();
  }

  render() {
    return (
      <Host>
        {this.isReady && (
          <div class="app">

            <div class="meta">
              FTB Picker
              <span>2023 / 2024</span>
            </div>

            <div>
              <div class="nav">
                <div class="top-nav">
                  <div
                    role="button"
                    tabIndex={0}
                    class={`${this.currentView == 'standings' ? 'active' : ''}`}
                    onClick={() => this.setView('standings')}>Standings</div>

                  <div
                    role="button"
                    tabIndex={0}
                    class={`${this.currentView == 'settings' ? 'active' : ''}`}
                    onClick={() => this.setView('settings')}
                    title="Settings"
                    innerHTML={gear}></div>

                  <div
                    role="button"
                    tabIndex={0}
                    class={`${this.currentView == 'info' ? 'active' : ''}`}
                    onClick={() => this.setView('info')}
                    title="Info"
                    innerHTML={info}></div>
                </div>
                <div class="weeks">
                  <div class="weeks-inner">
                    {this.schedule.map((w) => (
                      <div
                        role="button"
                        tabIndex={0}
                        class={`${this.currentView == w.title ? 'active' : ''}`}
                        onClick={() => this.setView(w.title)}>{ w.title }</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div class="action-pane">
              
              {this.currentView.includes('Week') && (
                <div>
                  {this.schedule.map((w) => (
                    <div>
                      {this.currentView == w.title && (
                        <ftb-week weekName={w.title} teams={this.teams}></ftb-week>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {this.currentView == 'standings' && (
                <ftb-standings></ftb-standings>
              )}

              {this.currentView == 'settings' && (
                <ftb-settings></ftb-settings>
              )}

              {this.currentView == 'info' && (
                <p>info</p>
              )}
            </div>
          </div>
        )}
      </Host>
    );
  }

}
