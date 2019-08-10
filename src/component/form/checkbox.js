import { html, component, toggle } from '../../core';
import { Base } from './base';

export default @component('otter-checkbox')
class Checkbox extends Base {
  onclick = () => {
    const nval = !this.$props.value;
    this.change(nval);
  };

  render() {
    const { value } = this.$props;
    toggle.call(this, value);
    return html`
    <label></label>
    `;
  }
}
