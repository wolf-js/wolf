import { component } from '../../core';
import { Base } from './base';
import { onShow, renderContent } from '../dropdown';

export default @component('wolf-select')
class Select extends Base {
  $visible = false;

  onclick = onShow.bind(this);

  render() {
    const { offset } = this.$props;
    if (offset) this.setOffset(offset);
    return renderContent.call(this);
  }
}
