/* global document */
/* global Node */
import Expr from './expr';
import Template from './template';

function cc() {
  return document.createComment('');
}

function insertNode(node) {
  this.e.parentNode.insertBefore(node, this.e);
}

function replaceNode(newNode) {
  const { parentNode, previousElementSibling } = this.e;
  parentNode.replaceChild(newNode, previousElementSibling);
}

export default class NodeExpr extends Expr {
  constructor(snode, enode) {
    super();
    this.s = snode;
    this.e = enode;
  }

  update(value) {
    const { v } = this;
    const vtype = typeof value;
    // console.log('vtype:', vtype, value, value instanceof Template);
    if (vtype !== 'function' && vtype !== 'object') {
      if (value !== v) {
        this.updateText(value);
      }
    } else if (value instanceof Template) {
      this.updateTemplate(value);
    } else if (value instanceof Node) {
      this.updateNode(value);
    } else if (Array.isArray(value)) {
      this.updateArray(value);
    } else if (value.then !== undefined) {
      this.updatePromise(value);
    }
  }

  updateText(value) {
    const { s, e } = this;
    const node = e.previousSibling;
    if (node !== s) {
      node.textContent = value;
    } else {
      insertNode.call(this, document.createTextNode(value));
    }
    this.v = value;
  }

  updateNode(value) {
    if (this.v !== value) {
      insertNode.call(this, value);
      this.v = value;
    }
  }

  // value: Template
  updateTemplate({ strings, values }) {
    const { vstrings, v } = this;
    const isSameStrings = vstrings === strings;
    if (v === undefined || !isSameStrings) {
      const t = NodeExpr.getTemplateExpr(strings);
      const content = t.clone();
      t.update(values);
      if (v === undefined) insertNode.call(this, content);
      else replaceNode.call(this, content);
      this.v = t;
      this.vstrings = strings;
    } else {
      this.v.update(values);
    }
  }

  updateArray(value) {
    // console.log('this:', this);
    this.v = this.v || [];
    // console.log('v:', this.v);
    // const root = NodeExpr.insertAfter(this.e);

    let lastIndex = 0;
    let expr;
    // console.log('value:', value, this.v);
    value.forEach((item, index) => {
      expr = this.v[index];
      // console.log('index:', expr,  index, item);
      if (expr === undefined) {
        expr = NodeExpr.insertBefore(this.e);
        this.v.push(expr);
      }
      expr.update(item);
      lastIndex = index;
    });
    if (value.length > 0) lastIndex += 1;
    // console.log('v:', this.v, lastIndex);
    if (lastIndex < this.v.length) {
      const { s } = this.v[lastIndex];
      this.v.length = lastIndex;
      let node = s.nextSibling;
      while (node && node !== this.e) {
        const n = node.nextSibling;
        s.parentNode.removeChild(node);
        node = n;
      }
    }
  }

  updatePromise(value) {
    this.v = value;
    value.then((v) => {
      if (this.v === value) {
        this.update(v);
      }
    });
  }

  static root(container) {
    return new NodeExpr(...['', ''].map(() => container.appendChild(cc())));
  }

  static current(node) {
    return new NodeExpr(node.previousSibling, node);
  }

  static insertBefore(node) {
    const n = node.parentNode.insertBefore(cc(), node);
    return new NodeExpr(n.previousSibling, n);
  }
}
