import { Component, h, State, Element } from '@stencil/core';

@Component({
  tag: 'ftb-settings',
  styleUrl: 'ftb-settings.scss'
})
export class FtbSettings {

  private store: any = document.querySelector('ftb-app');

  @Element() root: HTMLElement;
  @State() teamData: string;
  @State() scheduleData: string;

  componentWillLoad() {
    this.teamData = localStorage.getItem('schedule');
    this.scheduleData = localStorage.getItem('teams');
  }

  reset() {
    this.store.reset();
  }

  update() {
    const team = (this.root.querySelector('#teamdata') as HTMLInputElement).value;
    const schedule = (this.root.querySelector('#scheduledata') as HTMLInputElement).value;

    this.store.manualDataUpdate(team, schedule);
  }

  render() {
    return (
      <div class="settings panel">
        <h2>Settings</h2>
        <div class="setting-section">
          <h3>Clear Data</h3>
          <div
            class="btn"
            role='button'
            tabIndex={0}
            onClick={() => {this.reset()}}><span>Delete Data & Reset App</span></div>
        </div>
        <div class="setting-section">
          <h3>App Data</h3>
          <label htmlFor="teamdata">Team Data</label>
          <textarea value={this.teamData} id="teamdata"></textarea>

          <label htmlFor="schdeduledata">Schedule Data</label>
          <textarea value={this.scheduleData} id="scheduledata"></textarea>

          <div
            class="btn"
            role='button'
            tabIndex={0}
            onClick={() => {this.update()}}><span>Update Data</span></div> <span>Only do this if you know what you are doing.</span>
        </div>
      </div>
    );
  }

}
