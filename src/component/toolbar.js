import {
  html, BaseElement, component,
} from '../core';
import { t } from '../locale/locale';
import { fonts, fontSizePts } from '../data/font';
import tooltip from './tooltip';
import './icon';
import './dropdown';
import './color-picker';
import './border-picker';
import './align-picker';

const aligns = ['left', 'center', 'right'];
const valigns = ['top', 'middle', 'bottom'];

function bindTooltip(tip) {
  return (evt) => {
    tooltip(t(`toolbar.${tip}`), evt.target);
  };
}

function change(name, value) {
  this.change([name, value]);
}

export default @component('otter-toolbar')
class Toolbar extends BaseElement {
  render() {
    const { style, merge } = this.$props.value;
    const {
      font, underline, color, bgcolor, align, valign, textwrap,
    } = style;

    const active = v => (v ? 'active' : '');
    // merge: [merged, single]
    const merged = merge[1] ? 'disabled' : active(merge[0]);

    return html`
    <div class="otter-menu horizontal">
      <otter-dropdown class="item bottom left"
        .value="${font.name}" .items="${fonts}" .width="160px"
        @change="${change.bind(this, 'font-name')}"
        @mouseenter="${bindTooltip('fontName')}"></otter-dropdown>
      <otter-dropdown class="item bottom left"
        .value="${font.size}" .items="${fontSizePts}" .width="60px"
        @change="${change.bind(this, 'font-size')}"
        @mouseenter="${bindTooltip('fontSize')}"></otter-dropdown>
      <div class="divider"></div>
      <div class="item ${active(font.bold)}"
        @click="${change.bind(this, 'font-bold', !font.bold)}"
        @mouseenter="${bindTooltip('fontBold')}">
        <otter-icon .type="font-bold"></otter-icon>
      </div>
      <div class="item ${active(font.italic)}"
        @click="${change.bind(this, 'font-italic', !font.italic)}"
        @mouseenter="${bindTooltip('fontItalic')}">
        <otter-icon .type="font-italic"></otter-icon>
      </div>
      <div class="item ${active(underline)}"
        @click="${change.bind(this, 'underline', !underline)}"
        @mouseenter="${bindTooltip('underline')}">
        <otter-icon .type="underline"></otter-icon>
      </div>
      <otter-color-picker class="item bottom left"
        @change="${change.bind(this, 'color')}"
        @mouseenter="${bindTooltip('textColor')}"
        .icon="text-color" .value="${color}"></otter-color-picker>
      <div class="divider"></div>
      <otter-color-picker class="item bottom left"
        @change="${change.bind(this, 'bgcolor')}"
        @mouseenter="${bindTooltip('fillColor')}"
        .icon="fill-color" .value="${bgcolor}"></otter-color-picker>
      <otter-border-picker class="item bottom left"
        @change="${change.bind(this, 'border')}"
        @mouseenter="${bindTooltip('border')}">
      </otter-border-picker>
      <div class="item ${merged}"
        @click="${change.bind(this, 'merge', !merge[0])}"
        @mouseenter="${bindTooltip('merge')}">
        <otter-icon .type="merge"></otter-icon>
      </div>
      <div class="divider"></div>
      <otter-align-picker class="item bottom left"
        .value="${align}" .items="${aligns}"
        @change="${change.bind(this, 'align')}"
        @mouseenter="${bindTooltip('align')}"></otter-align-picker>
      <otter-align-picker class="item bottom left"
        .value="${valign}" .items="${valigns}"
        @change="${change.bind(this, 'valign')}"
        @mouseenter="${bindTooltip('valign')}"></otter-align-picker>
      <div class="item ${active(textwrap)}"
        @click="${change.bind(this, 'textwrap', !textwrap)}"
        @mouseenter="${bindTooltip('textwrap')}">
        <otter-icon .type="textwrap"></otter-icon>
      </div>
    </div>
    `;
  }
}
