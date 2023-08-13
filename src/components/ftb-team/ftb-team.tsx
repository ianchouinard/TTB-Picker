import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ftb-team',
  styleUrl: 'ftb-team.scss',
  shadow: true,
})
export class FtbTeam {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
