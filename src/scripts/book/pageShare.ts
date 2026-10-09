export const initializePageShare = () => {
  const button = document.querySelector<HTMLButtonElement>('.share-button');
  button?.addEventListener('click', async () => {
    const title = button.dataset.shareTitle ?? document.title;
    const text = `خلاصهٔ کتاب «${title}»\n${window.location.href}`;

    try {
      if (navigator.share) await navigator.share({ title, text });
      else await navigator.clipboard.writeText(text);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  });
};
