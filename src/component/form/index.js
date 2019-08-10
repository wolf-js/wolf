import './input';
import './checkbox';
import './select';

export function validate() {
  const elements = this.querySelectorAll('otter-input, otter-checkbox, otter-select');
  return Array.from(elements).every(it => it.validate());
}

export default {};
