import './input';
import './checkbox';
import './select';

export function validate() {
  const elements = this.querySelectorAll('wolf-input, wolf-checkbox, wolf-select');
  return Array.from(elements).every(it => it.validate());
}

export default {};
