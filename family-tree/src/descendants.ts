import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { Family, ID, Person } from './types.js';
import { Labels, Sizing } from './common-styles.js';

@customElement('family-tree-descendants')
export class FamilyTreeDescendants extends LitElement {
  static styles = [
    css`
      ::host {
        position: relative;
      }
      .branch {
        position: relative;
        margin-left: 350px;
      }
      .branch:before {
        content: '';
        width: 50px;
        border-top: 2px solid #eee9dc;
        position: absolute;
        left: -100px;
        top: 50%;
        margin-top: 1px;
      }

      .entry {
        position: relative;
        min-height: 80px;
      }
      .entry:before {
        content: '';
        height: 100%;
        border-left: 2px solid #eee9dc;
        position: absolute;
        left: -50px;
      }
      .entry:after {
        content: '';
        width: 50px;
        border-top: 2px solid #eee9dc;
        position: absolute;
        left: -50px;
        top: 50%;
        margin-top: 1px;
      }
      .entry:first-child:before {
        width: 10px;
        height: 50%;
        top: 50%;
        margin-top: 2px;
        border-radius: 10px 0 0 0;
      }
      .entry:first-child:after {
        height: 10px;
        border-radius: 10px 0 0 0;
      }
      .entry:last-child:before {
        width: 10px;
        height: 50%;
        border-radius: 0 0 0 10px;
      }
      .entry:last-child:after {
        height: 10px;
        border-top: none;
        border-bottom: 2px solid #eee9dc;
        border-radius: 0 0 0 10px;
        margin-top: -9px;
      }
      .entry.sole:before {
        display: none;
      }
      .label.married {
        margin-top: -25px;
      }
      .entry.sole:after {
        width: 50px;
        height: 0;
        margin-top: 1px;
        border-radius: 0;
      }
    `,
    Labels,
    Sizing,
  ];

  @property({ type: Number })
  lvl = 0;

  @property({ attribute: false })
  family!: Family;

  @property({ attribute: false })
  siblings: ID[] = [];

  personOverview(id: ID): string {
    const p = this.family.People.get(id)!;
    return `${p.Name} ${p.NickName ? `${p.NickName} ` : ''}${p.Surname}`;
  }

  person(id: ID): Person {
    const p = this.family.People.get(id)!;
    return p;
  }

  descDesc(descID: ID): ID[] {
    const p = this.family.People.get(descID)!;
    if (!p.Descendants) {
      return [];
    }
    return p.Descendants;
  }

  render() {
    if (this.siblings.length === 0) {
      return html``;
    }
    return html`<div class="branch lv${this.lvl}">
      ${map(this.siblings, descID => {
        if (this.person(descID) === undefined) {
          console.log(`Undefined person ${descID}`);
          return html``;
        }
        if (
          this.person(descID).Partner &&
          this.person(this.person(descID).Partner!) === undefined
        ) {
          console.log(`Undefined partner for ${this.person(descID).Partner}`);
          return html``;
        }

        return html`<div
          class="entry ${this.siblings.length === 1 ? 'sole' : ''}"
        >
          <span class="label ${this.person(descID).Partner ? 'married' : ''}"
            >${this.personOverview(descID)}<br />
            ${this.person(descID).Partner
              ? html`${this.personOverview(this.person(descID).Partner!)}`
              : ''}
          </span>
          ${this.descDesc(descID)
            ? html`<family-tree-descendants
                .lvl=${this.lvl + 1}
                .family="${this.family}"
                .siblings="${this.descDesc(descID)}"
              ></family-tree-descendants>`
            : ''}
        </div> `;
      })}
    </div>`;
  }
}
