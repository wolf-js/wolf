import {
  component, html, BaseElement, bindClickoutside, unbindClickoutside,
} from '../core';

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
      offset, type, items, value, show,
    } = this.$props;
    if (offset) this.setOffset(offset);

    // console.log('$props:', this.$props);
    if (show === true) {
      let firstShow = true;
      bindClickoutside(this, () => {
        if (firstShow) firstShow = false;
        else this.change();
      });
    } else {
      unbindClickoutside(this);
    }

    // console.log('type:', type, items, value, offset);
    return html`
    <wolf-calendar class="picker"
      .show="${type === 'date'}"
      .cell-render="${(type, v, title) => title}"
      @change="${onChange.bind(this)}"
      ></wolf-calendar>
    <ul class="wolf-list" .show="${type === 'select'}">
      ${items.map(it => html`<li @click.stop="${onChange.bind(this, it[0])}">${it[1]}</li>`)}
    </ul>
    `;
  }
}
