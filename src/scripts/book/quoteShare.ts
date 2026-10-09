type FittedQuote = { lines: string[]; size: number; lineHeight: number };

const FONT = '"Vazirmatn Variable", Vazirmatn, Tahoma, sans-serif';

const wrapQuote = (context: CanvasRenderingContext2D, text: string, maxWidth: number, maxHeight: number): FittedQuote | null => {
  for (let size = 64; size >= 34; size -= 2) {
    context.font = `600 ${size}px ${FONT}`;
    const lines: string[] = [];
    let line = '';
    for (const word of text.split(' ')) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && context.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    if (line) lines.push(line);
    const lineHeight = size * 1.7;
    if (lines.length * lineHeight <= maxHeight) return { lines, size, lineHeight };
  }
  return null;
};

const drawJustifiedRtlLine = (
  context: CanvasRenderingContext2D,
  line: string,
  right: number,
  y: number,
  width: number,
  justify: boolean,
) => {
  const words = line.split(' ');
  if (!justify || words.length < 2) {
    context.fillText(line, right, y);
    return;
  }

  const wordsWidth = words.reduce((total, word) => total + context.measureText(word).width, 0);
  const gap = (width - wordsWidth) / (words.length - 1);
  let x = right;

  for (const word of words) {
    context.fillText(word, x, y);
    x -= context.measureText(word).width + gap;
  }
};

export const initializeQuoteShare = (bookPage: HTMLElement) => {
  const prose = document.querySelector<HTMLElement>('.prose');
  const trigger = document.querySelector<HTMLButtonElement>('.selection-share-trigger');
  const dialog = document.querySelector<HTMLDialogElement>('.quote-share-dialog');
  const canvas = document.querySelector<HTMLCanvasElement>('.quote-share-canvas');
  const status = document.querySelector<HTMLElement>('.quote-share-status');
  const usesMobileSelection = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  let selectedQuote = '';
  let selectionTimer: number | undefined;

  if (!prose || !trigger || !dialog || !canvas) return;

  const selectedProseText = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return '';
    if (!prose.contains(selection.getRangeAt(0).commonAncestorContainer)) return '';
    return selection.toString().replace(/\s+/g, ' ').trim().slice(0, 700);
  };

  const positionTrigger = () => {
    const text = selectedProseText();
    if (text.length < 3) {
      trigger.hidden = true;
      return;
    }
    const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
    if (!rect) return;
    selectedQuote = text;
    trigger.hidden = false;
    trigger.classList.toggle('selection-share-trigger--mobile', usesMobileSelection);
    if (usesMobileSelection) {
      trigger.style.removeProperty('left');
      trigger.style.removeProperty('top');
      return;
    }
    const width = trigger.offsetWidth;
    trigger.style.left = `${Math.max(8, Math.min(innerWidth - width - 8, rect.left + rect.width / 2 - width / 2))}px`;
    trigger.style.top = `${Math.max(8, rect.top - trigger.offsetHeight - 10)}px`;
  };

  const drawCard = async () => {
    await document.fonts.ready;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = '#f7f0e2';
    context.fillRect(0, 0, 1080, 1080);
    context.fillStyle = '#174c3c';
    context.beginPath();
    context.roundRect(72, 72, 936, 936, 42);
    context.fill();
    context.direction = 'rtl';
    context.textBaseline = 'middle';
    context.textAlign = 'right';
    context.fillStyle = '#d9b95f';
    context.font = `700 82px ${FONT}`;
    context.fillText('“', 930, 170);

    const fitted = wrapQuote(context, selectedQuote, 800, 610);
    if (fitted) {
      context.fillStyle = '#fffdf8';
      context.font = `600 ${fitted.size}px ${FONT}`;
      let y = 470 - (fitted.lines.length * fitted.lineHeight) / 2 + fitted.lineHeight / 2;
      for (const [index, line] of fitted.lines.entries()) {
        drawJustifiedRtlLine(context, line, 930, y, 800, index < fitted.lines.length - 1);
        y += fitted.lineHeight;
      }
    }

    context.fillStyle = '#d9b95f';
    context.fillRect(150, 850, 780, 3);
    context.textAlign = 'center';
    context.fillStyle = '#fffdf8';
    context.font = `700 38px ${FONT}`;
    context.fillText(bookPage.dataset.bookTitle ?? '', 540, 905, 780);
    context.fillStyle = '#cbd9d2';
    context.font = `500 27px ${FONT}`;
    context.fillText(bookPage.dataset.bookAuthors ?? '', 540, 955, 780);
  };

  const imageBlob = () => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  const downloadImage = async () => {
    const blob = await imageBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: `${bookPage.dataset.bookId ?? 'quote'}.png` });
    link.click();
    URL.revokeObjectURL(url);
    if (status) status.textContent = 'تصویر دانلود شد.';
  };

  document.addEventListener('selectionchange', () => {
    window.clearTimeout(selectionTimer);
    selectionTimer = window.setTimeout(positionTrigger, usesMobileSelection ? 350 : 0);
  });
  window.addEventListener('scroll', () => { trigger.hidden = true; }, { passive: true });
  trigger.addEventListener('click', async () => {
    trigger.hidden = true;
    if (status) status.textContent = '';
    dialog.showModal();
    await drawCard();
  });
  document.querySelector<HTMLButtonElement>('.quote-share-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  document.querySelector<HTMLButtonElement>('.quote-share-download')?.addEventListener('click', downloadImage);
  document.querySelector<HTMLButtonElement>('.quote-share-primary')?.addEventListener('click', async () => {
    const blob = await imageBlob();
    if (!blob) return;
    const file = new File([blob], `${bookPage.dataset.bookId ?? 'quote'}.png`, { type: 'image/png' });
    try {
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: bookPage.dataset.bookTitle, files: [file] });
      } else await downloadImage();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError') && status) status.textContent = 'اشتراک انجام نشد؛ تصویر را دانلود کنید.';
    }
  });
};
