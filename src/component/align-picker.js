import {
  html, component,
} from '../core';
import { onChange, Dropdown } from './dropdown';
import './icon';

export default @component('wolf-align-picker')
class AlignPicker extends Dropdown {
  render() {
    const { items, value } = this.$props;
    const { $visible } = this;
    return html`
    <wolf-icon .type="${`align-${value}`}"></wolf-icon>
    <ul class="content wolf-list" .show="${$visible}">
      ${items.map(it => html`<li @click.stop="${onChange.bind(this, it)}"><wolf-icon .type="${`align-${it}`}"></wolf-icon></li>`)}
    </ul>
    `;
  }
}
