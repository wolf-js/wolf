import {
  html, component,
} from '../core';
import { onChange, Dropdown } from './dropdown';
import './icon';

export default @component('otter-align-picker')
class AlignPicker extends Dropdown {
  render() {
    const { items, value } = this.$props;
    const { $visible } = this;
    return html`
    <otter-icon .type="${`align-${value}`}"></otter-icon>
    <ul class="content otter-list" .show="${$visible}">
      ${items.map(it => html`<li @click.stop="${onChange.bind(this, it)}"><otter-icon .type="${`align-${it}`}"></otter-icon></li>`)}
    </ul>
    `;
  }
}
