import {
  html, component,
} from '../core';
import { onChange, Dropdown } from './dropdown';
import './color-palette';
import './icon';

export default @component('wolf-color-picker')
class ColorPicker extends Dropdown {
  render() {
    const { icon, value } = this.$props;
    const { $visible } = this;
    return html`
    <wolf-icon .type="${icon}"
      style="border-bottom: 3px solid ${value}; height: 16px;">
    </wolf-icon>
    <wolf-color-palette class="content" .show="${$visible}"
      @change="${onChange.bind(this)}"></wolf-color-palette>
    `;
  }
}
