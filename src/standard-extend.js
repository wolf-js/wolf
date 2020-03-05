// date extend
Object.assign(Date.prototype, {
  // author: meizz
  format(v) {
    let fmt = v;
    const o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      S: this.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    Object.keys(o).forEach((k) => {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
      }
    });
    return fmt;
  },
});

// string extend
Object.assign(String.prototype, {
  capitalize() {
    return this.replace(/\b[a-z]/g, letter => letter.toUpperCase());
  },
});

// Array extend
Object.assign(Array.prototype, {
  first() {
    return this[0];
  },

  last() {
    return this[this.length - 1];
  },
});
