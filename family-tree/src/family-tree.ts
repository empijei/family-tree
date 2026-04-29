import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Labels, Sizing } from './common-styles.js';
import { Family, ID, Person } from './types.js';

import './descendants.js';
import { data } from './pii/family.js';

@customElement('family-tree')
export class FamilyTree extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
      #wrapper {
        position: relative;
      }
    `,
    Labels,
    Sizing,
  ];

  @property({ attribute: false })
  family: Family = {
    Name: '',
    People: new Map<ID, Person>(data),
  };

  render() {
    return html` <div id="wrapper">
      <family-tree-descendants
        lvl="1"
        .family="${this.family}"
        .siblings="${[91]}"
      ></family-tree-descendants>
    </div>`;
  }
}
