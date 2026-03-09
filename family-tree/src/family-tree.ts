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
          Name: 'L',
          Surname: 'DP',
          Descendants: [2],
        },
      ],
      [
        2,
        {
          Name: 'A',
          Surname: 'B',
          Descendants: [3, 4],
          Partners: [30],
        },
      ],
      [
        30,
        {
          Name: 'R',
          Surname: 'C',
          Descendants: [],
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
      // T

      [
        5,
        {
          Name: 'T',
          Surname: 'DP',
          Descendants: [6, 7],
        },
      ],
      [
        6,
        {
          Name: 'A',
          Surname: 'G',
          Descendants: [8, 9, 20, 21],
        },
      ],
      [
        7,
        {
          Name: 'C',
          Surname: 'G',
          Descendants: [10],
        },
      ],
      [
        8,
        {
          Name: 'M',
          Surname: 'M',
          Descendants: [],
        },
      ],
      [
        9,
        {
          Name: 'G',
          Surname: 'M',
          Descendants: [],
        },
      ],
      [
        10,
        {
          Name: 'E',
          Surname: 'B',
          Descendants: [],
        },
      ],

      [
        20,
        {
          Name: 'A',
          Surname: 'G',
          Descendants: [],
          Partners: [41],
        },
      ],
      [
        21,
        {
          Name: 'A',
          Surname: 'G',
          Descendants: [],
          Partners: [41],
        },
      ],
      [
        41,
        {
          Name: 'A',
          Surname: 'G',
          Descendants: [],
        },
      ],
    ]),
  };

  render() {
    return html` <div id="wrapper">
      <span class="label">Famiglia ${this.family.Name}</span
      ><family-tree-descendants
        lvl="1"
        .family="${this.family}"
        .siblings="${[1, 5]}"
      ></family-tree-descendants>
    </div>`;
  }
}
