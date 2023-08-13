import { Component, Prop, h, State } from '@stencil/core';
import { Standing } from '../ftb-store/interfaces/standing.interface';

@Component({
  tag: 'ftb-schedule-team',
  styleUrl: 'ftb-schedule-team.scss',
  shadow: false,
})
export class FtbScheduleTeam {

  @Prop() team: Standing;
  @Prop() even: boolean;
  @State() showDetails: boolean = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  render() {
    return (
      <div>
        <div class={`team-item ${this.even ? 'alt' : ''}`} role="button" tabIndex={0} onClick={() => {this.toggleDetails()}}>
          <div class="t-name">
          <span>
            <div class="t-color" style={{backgroundColor: this.team.color}}></div>
            { this.team.team } <sup title={`${this.team.conf} Seed: ${this.team.seed}`}>{ this.team.seed }</sup>
            </span>
          </div>

          <div class="wins" title="Wins">
            <span>{ this.team.wins }</span>
          </div>

          <div class="losses" title="Losses">
            <span>{ this.team.losses }</span>
          </div>

          <div class="div-wins" title="Division Wins">
            <span>{ this.team.divisionWins }</span>
          </div>

          <div class="div-losses" title="Division Losses">
            <span>{ this.team.divisionLosses }</span>
          </div>

          <div class="conf-wins" title="Conference Wins">
            <span>{ this.team.conferenceWins }</span>
          </div>

          <div class="conf-losses" title="Conference Losses">
            <span>{ this.team.conferenceLosses }</span>
          </div>
        </div>

        {this.showDetails && (
          <div class="standing-details">
            {this.team.matchDetails.map((detail) => (
              <div>
                <div class="detail-week">{ detail.week }</div>
                <div>
                  <span class={detail.win ? 'win' : 'loss'}>{detail.win ? 'Win' : 'Loss'}</span> &nbsp;
                  {detail.isHome ? 'against' : '@'} &nbsp;
                  <span>{ detail.opponent }</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

}
