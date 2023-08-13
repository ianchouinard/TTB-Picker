import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ftb-match',
  styleUrl: 'ftb-match.scss',
  shadow: true,
})
export class FtbMatch {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
