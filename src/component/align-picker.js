import {
  html, component,
} from '../core';
import { onShow, onChange, Dropdown } from './dropdown';
import './icon';

export default @component('wolf-align-picker')
class AlignPicker extends Dropdown {
  render() {
    const { items, value } = this.$props;
    const { $visible } = this;
    return html`
    <div class="item" @click="${onShow.bind(this)}">
      <wolf-icon .type="${`align-${value}`}"></wolf-icon>
    </div>
    <ul class="content wolf-list" .show="${$visible}">
      ${items.map(it => html`<li @click.stop="${onChange.bind(this, it)}"><wolf-icon .type="${`align-${it}`}"></wolf-icon></li>`)}
    </ul>
    `;
  }
}
