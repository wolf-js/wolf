function renderBorder(canvas, border, w, h) {
  const {
    top, right, bottom, left,
  } = border;
  canvas.saveRestore(() => {
    if (top) {
      canvas.lineStyle(...top)
        .line([0, 0], [w, 0]);
    }
    if (right) {
      canvas.lineStyle(...right)
        .line([w, 0], [w, h]);
    }
    if (bottom) {
      canvas.lineStyle(...bottom)
        .line([0, h], [w, h]);
    }
    if (left) {
      canvas.lineStyle(...left)
        .line([0, 0], [0, h]);
    }
  });
}

// type: bool | select | date
function renderIcon(canvas, type, w, h) {
  canvas.saveRestore(() => {
    if (type === 'bool') {
      canvas.attr({ strokeStyle: '#999999', lineWidth: 2 })
        .roundRect(w / 2 - 6, h / 2 - 6, 12, 12, 2)
        .stroke();
    } else if (type === 'select') {
      canvas.attr({ fillStyle: '#e6e6e6' })
        .translate(w - 20, h - 20)
        .beginPath()
        .moveTo(2, 4)
        .lineTo(12, 4)
        .lineTo(7, 12)
        .closePath()
        .fill();
    } else if (type === 'date') {
      canvas.attr({ strokeStyle: '#e6e6e6', lineWidth: 2 })
        .translate(w - 20, h - 20)
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
function texty(valign, height, padding = 2) {
  switch (valign) {
    case 'top':
      return padding;
    case 'middle':
      return height / 2;
    case 'bottom':
      return height - padding;
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

function renderText(canvas, txt, style, w, h) {
  const {
    align, valign, font, color, underline, textwrap, padding,
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

    const txtw = canvas.textWidth(txt);
    const [xp, yp] = padding || [5, 2];
    const cellTxtw = w + (xp * 2);
    const x = textx(align, w, xp);
    let y = texty(valign, h, yp);
    if (textwrap && txtw > cellTxtw) {
      const linesLen = Math.ceil(txtw / cellTxtw);
      if (valign === 'middle') {
        y -= (linesLen * (font.size + yp)) / 2;
      }
      let txtLine = { w: 0, start: 0, c: '' };
      for (let i = 0; i < txt.length; i += 1) {
        if (txtLine.w >= cellTxtw) {
          canvas.fillText(txtLine.c, x, y);
          if (underline) canvas.line(...textLine('underline', align, valign, x, y, txtw, font.size));
          txtLine = { w: 0, start: i, c: '' };
        }
        y += font.size + yp;
        txtLine.c += txt[i];
        txtLine.w += canvas.textWidth(txt[i]);
      }
      if (txtLine.w > 0) {
        canvas.fillText(txtLine.c, x, y);
        if (underline) canvas.line(...textLine('underline', align, valign, x, y, txtw, font.size));
      }
    } else {
      canvas.fillText(txt, x, y);
      if (underline) canvas.line(...textLine('underline', align, valign, x, y, txtw, font.size));
    }
  });
}

// cellBox: function
export function render(canvas, cellBox, cell) {
  const {
    left, top, width, height,
  } = cellBox();
  const [x, y] = [left, top];

  const { value, type, style } = cell;
  const { border, bgcolor } = style;
  if (border) {
    renderBorder(canvas, border, width, height);
  }

  // clip
  canvas.saveRestore(() => {
    canvas.translate(x, y);
    // border
    if (border) {
      renderBorder(canvas, border);
    }
    // clip
    canvas.attr({ fillStyle: bgcolor || '#fff' })
      .rect(1, 1, width - 2, height - 2)
      .clip()
      .fill();
    // render content
    // console.log('value:', value, ', type:', type);
    if (value) {
      renderText(canvas, value, style, width, height);
    }
    if (type !== undefined) {
      renderIcon(canvas, type, width, height);
    }
  });
}

export default {};
