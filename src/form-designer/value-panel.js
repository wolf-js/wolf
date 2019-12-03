import {
  component, html, BaseElement, bindClickoutside, unbindClickoutside,
} from '../core';

function onShow() {
  const { show, clickoutside } = this.$props;
  unbindClickoutside(this);
  if (show === true) {
    setTimeout(() => {
      bindClickoutside(this, () => {
        clickoutside();
      });
    }, 0);
  }
}

function onChange(...args) {
  const { type } = this.$props;
  if (type === 'date') {
    const [[dtype]] = args;
    if (dtype === 'day') {
      this.change(...args);
    }
  } else {
    this.change(...args);
  }
}

export default @component('wolf-form-value-panel')
class FormValuePanel extends BaseElement {
  render() {
    const {
      offset, type, items, clickoutside,
    } = this.$props;
    if (offset) this.setOffset(offset);
    if (clickoutside) onShow.call(this);

    // console.log('type:', type, items, value, offset);
    return html`
    <wolf-calendar class="picker"
      .show="${type === 'date'}"
      .cell-render="${(p1, p2, title) => title}"
      @change="${onChange.bind(this)}"
      ></wolf-calendar>
    <ul class="wolf-list" .show="${type === 'select'}">
      ${items.map(it => html`<li @click.stop="${onChange.bind(this, it[0])}">${it[1]}</li>`)}
    </ul>
    `;
  }
}
