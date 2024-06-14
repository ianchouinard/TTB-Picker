import { Component, h } from '@stencil/core';

@Component({
  tag: 'ftb-info',
  styleUrl: 'ftb-info.scss'
})
export class FtbInfo {

  private store: any = document.querySelector('ftb-app');

  render() {
    return (
      <div class="info panel">
        <h2>FTB Picker</h2>
        <h3>2024 / 2025 Season</h3>
        <div class="spacer"></div>
        <p>FTB Picker allows you to pick the winners for each game during the current nfl season then view standings.</p>

        <div class="btns">
          <div
            class="btn"
            role='button'
            tabIndex={0}
            onClick={() => {this.store.setView('Week 1')}}><span>Start Picking</span></div>
        </div>

        <div class="screens">
          <img src="/assets/screen1.png" alt="Standings" />
          <img src="/assets/screen2.png" alt="Week" />
        </div>

        <p>See code on <a href="https://github.com/ianchouinard/FTB-Picker/tree/main" target="_blank">Github</a></p>
      </div>
    );
  }

}
