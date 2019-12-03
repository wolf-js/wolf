import {
  html, component,
} from '../core';
import { onShow, onChange, Dropdown } from './dropdown';
import './palette';
import './icon';

export default @component('wolf-color-picker')
class ColorPicker extends Dropdown {
  render() {
    const { icon, value } = this.$props;
    const { $visible } = this;
    return html`
    <div class="item" @click="${onShow.bind(this)}">
      <wolf-icon .type="${icon}" style="border-bottom: 3px solid ${value}; height: 16px;">
      </wolf-icon>
    </div>
    <wolf-palette class="content" .show="${$visible}"
      @change="${onChange.bind(this)}"></wolf-palette>
    `;
  }
}
