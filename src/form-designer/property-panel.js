import { html, BaseElement, component } from '../core';
import { validate } from '../component';
import { t } from '../locale/locale';

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

function buildField([prop, option], v) {
  // console.log('prop:', prop, ', option:', option, ', v:', v);
  let field = null;
  let nv = v;
  const isString = typeof option === 'string';
  const type = isString ? option : option.type;
  if (!isString) {
    if (v === undefined && option.defaultValue) {
      nv = option.defaultValue;
      this.$props.value.rule[prop] = nv;
    }
  }
  if (type === 'checkbox') {
    field = html`
    <wolf-checkbox .value="${nv}"
      @change="${valueChange.bind(this, `${prop}`)}"
      ></wolf-checkbox>
    `;
  } else if (type === 'select') {
    field = html`
    <wolf-select class="bottom left"
      .value="${nv}"
      .hint="${option.hint || ''}"
      @change="${valueChange.bind(this, `${prop}`)}"
      .width="${option.width || '100%'}"
      .items="${option.items}"></wolf-form-select>
    `;
  } else if (type === 'textarea') {
    field = html`
    <wolf-textarea .hint="${option.hint}" .value="${nv}"
      @change="${valueChange.bind(this, `${prop}`)}"></wolf-textarea>
    `;
  } else {
    field = html`
    <wolf-input .value="${nv}"
      .width="${option.width || '80px'}"
      .max-length="${option.maxLength || 200}"
      @change="${valueChange.bind(this, `${prop}`)}"></wolf-input>
    `;
  }
  // console.log('field:', field);
  const label = t(`form.property.${prop}`);
  return html`
    <div class="field" .key="${prop}">
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
      ${Object.entries(fields).map(it => buildField.call(this, it, rule[it[0]]))}
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
