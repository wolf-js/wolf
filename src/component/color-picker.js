import {
  html, component,
} from '../core';
import { onChange, Dropdown } from './dropdown';
import './color-palette';
import './icon';

export default @component('otter-color-picker')
class ColorPicker extends Dropdown {
  render() {
    const { icon, value } = this.$props;
    const { $visible } = this;
    return html`
    <otter-icon .type="${icon}"
      style="border-bottom: 3px solid ${value}; height: 16px;">
    </otter-icon>
    <otter-color-palette class="content" .show="${$visible}"
      @change="${onChange.bind(this)}"></otter-color-palette>
    `;
  }
}
