const checkedColor = '#4b89ff';
function renderBorder() {
  const { canvas, data, box } = this;
  const { width, height } = box;
  const { border } = data.style;
  if (!border) return;
  const {
    top, right, bottom, left,
  } = border;
  canvas.saveRestore(() => {
    if (top) {
      canvas.lineStyle(...top)
        .line([0, 0], [width, 0]);
    }
    if (right) {
      canvas.lineStyle(...right)
        .line([width, 0], [width, height]);
    }
    if (bottom) {
      canvas.lineStyle(...bottom)
        .line([0, height], [width, height]);
    }
    if (left) {
      canvas.lineStyle(...left)
        .line([0, 0], [0, height]);
    }
  });
}

// type: bool | select | date
function renderIcon() {
  const { canvas, data, box } = this;
  const { width, height } = box;
  const { type, value } = data;
  if (type === undefined) {
    this.removeIconBox();
    return;
  }
  canvas.saveRestore(() => {
    if (type === 'bool') {
      const [x, y, w, h] = [width / 2 - 6, height / 2 - 7, 12, 12];
      this.addIconBox(x, y, w, h);
      if (value === true) {
        canvas.fill();
        canvas.attr({ fillStyle: checkedColor, lineWidth: 2, strokeStyle: checkedColor })
          .roundRect(x, y, w, h, 2).fill().stroke()
          .attr({ strokeStyle: '#fff' })
          .beginPath()
          .moveTo(x + 2, y + 5)
          .lineTo(x + w / 2 - 1, y + h - 3)
          .lineTo(x + w - 1, y + 3)
          .stroke();
      } else {
        canvas.attr({ strokeStyle: '#999', lineWidth: 2 })
          .roundRect(x, y, w, h, 2)
          .stroke();
      }
    } else if (type === 'select') {
      const [x, y, w, h] = [width - 20, height - 20, 12, 12];
      this.addIconBox(x, y, w, h);
      canvas.attr({ fillStyle: '#e6e6e6' })
        .translate(x, y)
        .beginPath()
        .moveTo(2, 4)
        .lineTo(w, 4)
        .lineTo(7, w)
        .closePath()
        .fill();
    } else if (type === 'date') {
      const [x, y, w, h] = [width - 20, height - 20, 12, 12];
      this.addIconBox(x, y, w, h);
      canvas.attr({ strokeStyle: '#e6e6e6', lineWidth: 2 })
        .translate(x, y)
        .line([5, 2], [5, 5])
        .line([11, 2], [11, 5])
        .line([2, 7], [14, 7])
        .rect(2, 4, 12, 10)
        .stroke();
    }
  });
}

// align: left | center | right
function textx(align, width, padding = 5) {
  switch (align) {
    case 'left':
      return padding;
    case 'center':
      return width / 2;
    case 'right':
      return width - padding;
    default:
      return 0;
  }
}

// align: top | middle | bottom
function texty(valign, height, txtHeight, padding) {
  switch (valign) {
    case 'top':
      return padding;
    case 'middle':
      return height / 2 - txtHeight / 2;
    case 'bottom':
      return height - padding - txtHeight;
    default:
      return 0;
  }
}

// type: underline | strike
// align: top | middle | bottom
// align: left | center | right
function textLine(type, align, valign, x, y, w, h) {
  const offset = { x: 0, y: 0 };
  // offset.y
  if (type === 'underline') {
    if (valign === 'top') {
      offset.y = -h;
    } else if (valign === 'middle') {
      offset.y = -h / 2;
    }
  } else if (type === 'strike') {
    if (valign === 'bottom') {
      offset.y = h / 2;
    } else if (valign === 'top') {
      offset.y = -h / 2;
    }
  }
  // offset.x
  if (align === 'center') {
    offset.x = w / 2;
  } else if (align === 'right') {
    offset.x = w;
  }
  return [
    [x - offset.x, y - offset.y],
    [x - offset.x + w, y - offset.y],
  ];
}

function renderText() {
  const { canvas, box, data } = this;
  const [w, h] = [box.width, box.height];
  const { value, style, type } = data;
  if (!value || type === 'bool') return;
  const txt = `${value}`;
  const {
    align, valign, font, color, underline, strike, textwrap, padding,
  } = style;

  const {
    italic, bold, size, name,
  } = font;

  canvas.saveRestore(() => {
    canvas.attr({
      textAlign: align,
      textBaseline: valign,
      font: `${italic ? 'italic' : ''} ${bold ? 'bold' : ''} ${size}pt ${name}`,
      fillStyle: color,
      strokeStyle: color,
    });

    const [xp, yp] = padding || [5, 5];
    const tx = textx(align, w, xp);
    const txts = txt.split('\n');
    const biw = w - (xp * 2);
    const ntxts = [];
    txts.forEach((it) => {
      const txtWidth = canvas.textWidth(it);
      if (textwrap && txtWidth > biw) {
        let tline = { w: 0, len: 0, start: 0 };
        for (let i = 0; i < it.length; i += 1) {
          if (tline.w >= biw) {
            ntxts.push(it.substr(tline.start, tline.len));
            tline = { w: 0, len: 0, start: i };
          }
          tline.len += 1;
          tline.w += canvas.textWidth(it[i]) + 1;
        }
        if (tline.len > 0) {
          ntxts.push(it.substr(tline.start, tline.len));
        }
      } else {
        ntxts.push(it);
      }
    });
    const lineHeight = font.size * 1.425;
    const txtHeight = (ntxts.length - 1) * lineHeight;
    let ty = texty(valign, h, txtHeight, yp);
    ntxts.forEach((it) => {
      const txtWidth = canvas.textWidth(it);
      canvas.fillText(it, tx, ty);
      if (strike) canvas.line(...textLine('strike', align, valign, tx, ty, txtWidth, font.size));
      if (underline) canvas.line(...textLine('underline', align, valign, tx, ty, txtWidth, font.size));
      ty += lineHeight;
    });
  });
}

export default class TableCell {
  constructor(canvas) {
    this.canvas = canvas;
    this.box = null;
    this.data = null;
    // { ri_ci: { left, top, width, height } }
    this.iconBoxes = new Map();
  }

  get iconBoxKey() {
    const { ri, ci } = this.data;
    return `${ri}_${ci}`;
  }

  hasIconBox(ri, ci) {
    return this.iconBoxes.has(`${ri}_${ci}`);
  }

  // ox: offsetx, oy: offsety
  inIconBoxes(ri, ci, ox, oy) {
    if (this.hasIconBox(ri, ci)) {
      const [x, y, w, h] = this.getIconBox(ri, ci);
      if (ox >= x && ox <= (x + w) && oy >= y && oy <= (y + h)) return true;
    }
    return false;
  }

  getIconBox(ri, ci) {
    return this.iconBoxes.get(`${ri}_${ci}`);
  }

  addIconBox(x, y, w, h) {
    this.iconBoxes.set(this.iconBoxKey, [x, y, w, h]);
  }

  removeIconBox() {
    const key = this.iconBoxKey;
    if (this.iconBoxes.has(key)) this.iconBoxes.delete(key);
  }

  render(box, cell) {
    this.box = box;
    this.data = cell;
    const { canvas } = this;
    const {
      width, height, left, top,
    } = box;

    // clip
    canvas.saveRestore(() => {
      canvas.translate(left, top);
      // border
      renderBorder.call(this);
      // clip
      canvas.attr({ fillStyle: cell.style.bgcolor || '#fff' })
        .rect(1, 1, width - 2, height - 2)
        .clip()
        .fill();
      // render content
      // console.log('value:', value, ', type:', type);
      renderText.call(this);
      renderIcon.call(this);
    });
  }
}
