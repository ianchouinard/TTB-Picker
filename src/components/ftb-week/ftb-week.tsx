import { Component, h, Prop, State, Element } from '@stencil/core';
import { Match } from '../../components';
import { TeamsList } from '../ftb-store/interfaces/teams-list.interface';

@Component({
  tag: 'ftb-week',
  styleUrl: 'ftb-week.scss',
  shadow: false,
})
export class FtbWeek {

  @Element() root: HTMLElement;
  @Prop() weekName: string;
  @Prop() teams: TeamsList;
  @State() matches: Array<Match> = [];
  @State() ready: boolean;
  private store: any = document.querySelector('ftb-store');
  private isUpdating: boolean;

  componentWillLoad() {
    this.getData();
  }

  getData() {
    this.store.getWeekMatches(this.weekName)
      .then((m) => {
        this.matches = [...m];
      });
  }

  showTeamName(teamCode: string): string {
    return this.teams[teamCode].title;
  }

  showTeamColor(teamCode: string): string {
    return this.teams[teamCode].color;
  }

  getMatchKey(match: Match) {
    return `${this.weekName.replace(/\s/g, "X")}_${match.home}_${match.away}`;
  }

  updateMatchResult(winningTeam: string, losingTeam: string) {
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    this.store.updateMatch(this.weekName, winningTeam, losingTeam)
      .then(() => {
        this.getData();
        this.isUpdating = false;
      });
  }

  navigateView(direction = 'next') {
    let num = parseInt(this.weekName.split(' ')[1], 10);

    if (direction == 'next') {
      num += 1;
    } else {
      num -= 1;
    }

    let view = '';

    if (num > 18) {
      view = 'standings';
    } else {
      view = `Week ${num}`;
    }

    this.store.setView(view);
  }

  componentDidRender() {
    const options = this.root.querySelectorAll('.match__contest > div');

    options.forEach((op: HTMLElement) => {
      op.onmouseenter = () => {
        op.style.borderColor = op.getAttribute('data-hex');
      };

      op.onmouseleave = () => {
        op.style.borderColor = 'transparent';
      };
    });
  }

  render() {
    return (
      <div class="week panel">
        <h2>{ this.weekName }</h2>

        <div class="matches">
          {this.matches.map((match) => (
            <div class="match" key={this.getMatchKey(match)}>
              <h3>{ match.date }</h3>
              <div class="match__contest">
              <div
                  class={`away ${((match.winner + '') == match.away) ? 'win' : ''}`}
                  role="button"
                  tabIndex={0}
                  title="Click to choose winner"
                  data-hex={this.showTeamColor(match.away)}
                  onClick={() => {this.updateMatchResult(match.away, match.home)}}>
                    <span style={{backgroundColor: this.showTeamColor(match.away)}}></span> { this.showTeamName(match.away) }
                </div>

                <span>@</span>

                <div
                  class={`home ${((match.winner + '') == match.home) ? 'win' : ''}`}
                  role="button"
                  tabIndex={0}
                  title="Click to choose winner"
                  data-hex={this.showTeamColor(match.home)}
                  onClick={() => {this.updateMatchResult(match.home, match.away)}}>
                    <span style={{backgroundColor: this.showTeamColor(match.home)}}></span> { this.showTeamName(match.home) }
                </div>
              </div>
            </div>
          ))}
        </div>

        <div class="controls">
          {this.weekName != 'Week 1' && (
            <div>
              <div
                role='button'
                tabIndex={0}
                class="control"
                onClick={() => {this.navigateView('prev')}}>Prev</div>
            </div>
          )}
          <div>
            <div
              role='button'
              tabIndex={0}
              class="control"
              onClick={() => {this.navigateView('next')}}>Next</div>
          </div>
        </div>
      </div>
    );
  }

}
