import { html, BaseElement, component } from '../core';
import { validate } from '../component';
import { t } from '../locale/locale';

const precisions = [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']];

function valueChange(prop, v) {
  // console.log('prop:', prop, ', v:', v);
  const { value } = this.$props;
  if (prop === 'key') {
    value.key = v;
  } else {
    value.rule[prop] = v;
  }
  this.update();
}

function change(type) {
  // console.log('validate:', validate.call(this));
  if (type === 'remove' || validate.call(this)) {
    this.change(type);
  }
}

function buildField(prop, v) {
  // console.log('prop:', prop, ', v:', v);
  let field = '';
  if (prop === 'min' || prop === 'max') {
    field = html`
      <wolf-input .type="number" .max-length="6"
        .value="${v}" .width="80px"
        @change="${valueChange.bind(this, `${prop}`)}"
        ></wolf-input>
    `;
  } else if (prop === 'required' || prop === 'multiple') {
    field = html`
      <wolf-checkbox .value="${v}"
        @change="${valueChange.bind(this, `${prop}`)}"
        ></wolf-checkbox>
    `;
  } else if (prop === 'precision') {
    field = html`
      <wolf-select class="bottom left" .value="${v || 2}"
        @change="${valueChange.bind(this, `${prop}`)}"
        .width="46px" .items="${precisions}"></wolf-form-select>
    `;
  } else if (prop === 'options') {
    field = html`
      <wolf-input .value="${v}" .width="80px" .required="true" .hint="k:na,k1:xx"
        @change="${valueChange.bind(this, `${prop}`)}"></wolf-input>
    `;
  } else {
    field = html`
      <wolf-input .value="${v}" .width="80px"
        @change="${valueChange.bind(this, `${prop}`)}"></wolf-input>
    `;
  }
  const label = t(`form.property.${prop}`);
  return html`
    <div class="field">
      <label style="width: 60px;">${label}</label>
      ${field}
    </div>
  `;
}

export default @component('wolf-form-property-panel')
class FormPropertyPanel extends BaseElement {
  render() {
    const { value, fields } = this.$props;
    const { ref, key, rule } = value;
    // set precision default value is 2
    if (fields && fields.includes('precision')) {
      rule.precision = rule.precision || 2;
    }
    // console.log(ref, key, 'rule:', rule);
    const title = t('form.property.title');
    return html`
    <div class="header">${title}</div>
    <div class="wolf-form">
      <div class="field">
        <label style="width: 60px;">${t('form.property.type')}</label>
        <wolf-input class="disabled" .type="text"
          .value="${rule.type}" .width="80px"></wolf-input>
      </div>
      <div class="field">
        <label style="width: 60px;">${t('form.property.ref')}</label>
        <wolf-input class="disabled" .type="text"
          .value="${ref}" .width="80px"></wolf-input>
      </div>
      <div class="field">
        <label style="width: 60px;">${t('form.property.key')}</label>
        <wolf-input .type="key" .max-length="20"
          @change="${valueChange.bind(this, 'key')}"
          .value="${key}" .width="80px"></wolf-input>
      </div>
      ${fields.map(it => buildField.call(this, it, rule[it]))}
      <div class="wolf-buttons">
        <div class="wolf-button primary"
          @click="${change.bind(this, 'save')}">
          ${t('button.save')}
        </div>
        <div class="wolf-button"
          @click="${change.bind(this, 'remove')}">
          ${t('button.remove')}
        </div>
      </div>
    </div>
    `;
  }
}
