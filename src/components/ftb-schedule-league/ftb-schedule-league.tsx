import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ftb-schedule-league',
  styleUrl: 'ftb-schedule-league.scss',
  shadow: true,
})
export class FtbScheduleLeague {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
