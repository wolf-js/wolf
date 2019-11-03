/*
 * name, icon, fields, validator, trigger, multiple
 */
const precisions = [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']];
const types = {
  text: {
    fields: {
      required: 'checkbox',
      pattern: 'input',
    },
  },
  integer: {
    fields: {
      required: 'checkbox',
      min: { type: 'input', maxLength: 6 },
      max: { type: 'input', maxLength: 6 },
    },
    validator() {},
  },
  number: {
    fields: {
      required: 'checkbox',
      min: { type: 'input', maxLength: 10 },
      max: { type: 'input', maxLength: 10 },
      precision: {
        type: 'select',
        defaultValue: 2,
        width: '46px',
        items: precisions,
      },
    },
    validator() {},
  },
  /*
  email: {
    name: 'email',
    icon: '@',
    fields: ['required'],
    validator() {},
  },
  phone: {
    name: 'phone',
    icon: '',
    fields: ['required'],
    validator() {},
  },
  */
  bool: {
    fields: {},
  },
  /*
  radio: {
    fields: ['required', 'options'],
    validator() {},
  },
  checkbox: {
    fields: ['required', 'options'],
    validator() {},
  },
  */
  select: {
    fields: {
      required: 'checkbox',
      multiple: 'checkbox',
      url: {
        type: 'select',
        defaultValue: -1,
        items: [[-1, 'custom']],
      },
      options: {
        type: 'textarea',
        defaultValue: '[["key","Value"]]',
        hint: '[[k,Name]]',
      },
    },
    validator() {},
  },
  date: {
    fields: {
      required: 'checkbox',
      format: { type: 'input', defaultValue: 'yyyy-MM-dd' },
    },
    validator() {},
    format([, d], { format }) {
      return d.format(format);
    },
  },
};

export default {
  types,
};
