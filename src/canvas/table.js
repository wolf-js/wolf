import Canvas from './core';
import TableCell from './cell';
import { stringAt } from '../data/alphabet';

function renderGrid(viewRange) {
  const { canvas, data } = this;
  const {
    rows, cols,
  } = data;
  const {
    sri, sci, eri, eci, w, h,
  } = viewRange;
  canvas.saveRestore(() => {
    canvas.attr({
      lineWidth: 1,
      strokeStyle: '#e6e6e6',
    });
    // console.log('sri:', sri, ', eri:', eri);
    rows.heights(sri, eri, (i, hh, total) => {
      canvas.line([0, total], [w, total]);
    });
    cols.widths(sci, eci, (i, ww, total) => {
      canvas.line([total, 0], [total, h]);
    });
  });
}

function renderSelectedHeader(x, y, w, h) {
  const { canvas } = this;
  canvas.saveRestore(() => {
    canvas.attr({ fillStyle: 'rgba(75, 137, 255, 0.08)' })
      .fillRect(x, y, w, h);
  });
}

function renderHeader(viewRange) {
  const { canvas, data } = this;
  const {
    indexWidth, indexHeight, rows, cols, select,
  } = data;
  const { range } = select;
  const {
    sri, sci, eri, eci, w, h,
  } = viewRange;
  canvas.saveRestore(() => {
    // 1 draw background
    canvas.attr({ fillStyle: '#f4f5f8' })
      .fillRect(0, 0, w, indexHeight)
      .fillRect(0, 0, indexWidth, h);
    // 2 text, border
    canvas.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: '500 9pt Source Sans Pro',
      fillStyle: '#585757',
      lineWidth: 1,
      strokeStyle: '#e6e6e6',
    });
    // console.log('viewRange:', viewRange);
    canvas.saveRestore(() => {
      canvas.translate(0, indexHeight);
      rows.heights(sri, eri, (i, hh, total) => {
        const y = total;
        if (range.inRow(i)) {
          renderSelectedHeader.call(this, 0, y, indexWidth, hh);
        }
        canvas.line([0, y], [indexWidth, y])
          .fillText(i + 1, indexWidth / 2, y + (hh / 2));
      });
      canvas.line([indexWidth, indexHeight], [indexWidth, h]);
    }).saveRestore(() => {
      canvas.translate(indexWidth, 0);
      cols.widths(sci, eci, (i, ww, total) => {
        const x = total;
        if (range.inCol(i)) {
          renderSelectedHeader.call(this, x, 0, ww, indexHeight);
        }
        canvas.line([x, 0], [x, indexHeight])
          .fillText(stringAt(i), x + (ww / 2), indexHeight / 2);
      });
      canvas.line([indexWidth, indexHeight], [w, indexHeight]);
    });
  });
}

function renderCell(ri, ci, cellBox, merge = false) {
  const cell = this.data.cell(ri, ci);
  if (!merge && !cell.$) return;
  this.cell.render(cellBox(), cell);
}

function renderContent(viewRange) {
  const { canvas, data } = this;
  const {
    merges,
  } = data;
  canvas.saveRestore(() => {
    // 1 render cell
    viewRange.each((ri, ci) => {
      renderCell.call(this, ri, ci, () => data.cellBox(ri, ci));
    });
    // 2 render merge
    merges.each(viewRange, (it) => {
      renderCell.call(this, it.sri, it.sci, () => data.cellBox(it), true);
    });
  });
}

export default class Table {
  constructor(el, data) {
    this.canvas = Canvas.create(el);
    this.cell = new TableCell(this.canvas);
    this.data = data;
  }

  render() {
    const { canvas, data } = this;
    const {
      viewRange, mode, indexWidth, indexHeight,
    } = data;
    const { w, h } = viewRange;
    canvas.resize(w, h);

    if (mode.isDesign()) {
      canvas.saveRestore(() => {
        canvas.translate(indexWidth, indexHeight);
        renderGrid.call(this, viewRange);
        renderContent.call(this, viewRange);
      });
      renderHeader.call(this, viewRange);
    } else {
      renderContent.call(this, viewRange);
    }
  }
}
