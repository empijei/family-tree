import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Labels, Sizing } from './common-styles.js';
import { Family, ID, Person } from './types.js';

import './descendants.js';

@customElement('family-tree')
export class FamilyTree extends LitElement {
  static styles = [
    css`
      #wrapper {
        position: relative;
      }
    `,
    Labels,
    Sizing,
  ];

  @property({ attribute: false })
  family: Family = {
    Name: 'S',
    People: new Map<ID, Person>([
      [
        1,
        {
          Name: 'A',
          Surname: 'B',
          Descendants: [3, 4],
        },
      ],
      [
        2,
        {
          Name: 'L',
          Surname: 'DP',
          Descendants: [1],
        },
      ],
      [
        3,
        {
          Name: 'A',
          Surname: 'B C',
        },
      ],
      [
        4,
        {
          Name: 'Z',
          Surname: 'B C',
        },
      ],
    ]),
  };

  render() {
    return html` <div id="wrapper">
      <span class="label">Famiglia ${this.family.Name}</span
      ><family-tree-descendants
        lvl="1"
        .onlyChild="${true}"
        .descendants="${this.family}"
        .personID="${2}"
      ></family-tree-descendants>
    </div>`;
  }
}
