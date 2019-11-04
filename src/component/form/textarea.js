import { html, component, BaseElement } from '../../core';

function inputHandler(evt) {
  const { value } = evt.target;
  this.change(value);
}

export default @component('wolf-textarea')
class Textarea extends BaseElement {
  render() {
    const { hint, value } = this.$props;
    return html`
    <textarea 
      @input="${inputHandler.bind(this)}"
      @change.stop="${inputHandler.bind(this)}"
      .value="${value || ''}"
      placeholder="${hint || ''}"
      autocomplete="off"></textarea>
    `;
  }
}
