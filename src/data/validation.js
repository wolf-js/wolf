import helper from './helper';
import Base from './base';
import { xy2expr } from './alphabet';

class Validation {
  // ref: A1...
  // rule: { type, required, min, max, prescision, options, patttern }
  constructor(ref, key, rule) {
    this.refs = [ref];
    this.keys = [key];
    this.rule = rule;
  }

  includes(ref) {
    return this.refs.includes(ref);
  }

  findIndex(ref) {
    return this.refs.findIndex(it => it === ref);
  }

  findKey(ref) {
    const index = this.findIndex(ref);
    return index >= 0 ? this.keys[index] : ref;
  }

  add(ref, key) {
    const { refs, keys } = this;
    if (!refs.includes(ref)) {
      refs.push(ref);
      keys.push(key);
    }
  }

  remove(ref) {
    const index = this.findIndex(ref);
    if (index >= 0) {
      this.refs.splice(index, 1);
      this.keys.splice(index, 1);
    }
  }
}


function findByRule(rule) {
  return this.$.find(it => helper.equals(it.rule, rule));
}

function findByRef(ref) {
  return this.$.find(it => it.includes(ref));
}

function add(ref, key, rule) {
  const item = findByRule.call(this, rule);
  if (item !== undefined) {
    item.add(ref, key);
  } else {
    this.$.push(new Validation(ref, key, rule));
  }
}

function remove(ref) {
  const item = findByRef.call(this, ref);
  if (item !== undefined) {
    if (item.refs.length > 1) {
      item.remove(ref);
    } else {
      this.$.splice(this.$.findIndex(it => it.includes(ref)), 1);
    }
  }
}

export default class Validations extends Base {
  constructor() {
    super([]);
  }

  get(ri, ci) {
    const ref = xy2expr(ci, ri);
    return this.$.find(it => it.includes(ref));
  }

  find(ri, ci, type) {
    const ref = xy2expr(ci, ri);
    const v = findByRef.call(this, ref);
    if (v !== undefined && type === v.rule.type) {
      return { ref, key: v.findKey(ref), rule: v.rule };
    }
    return { ref, key: ref, rule: { type } };
  }

  update({ ref, key, rule }) {
    remove.call(this, ref);
    add.call(this, ref, key, rule);
  }
}
