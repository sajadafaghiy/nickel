export const initializeReadingProgress = (bookPage: HTMLElement) => {
  const storageKey = 'nickel:last-read-book';
  let saveTimer: number | undefined;

  const save = () => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? Math.min(1, window.scrollY / documentHeight) : 0;

    if (progress >= 0.98) {
      localStorage.removeItem(storageKey);
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify({
      id: bookPage.dataset.bookId,
      title: bookPage.dataset.bookTitle,
      url: window.location.pathname + window.location.search,
      scrollY: window.scrollY,
      progress,
      updatedAt: Date.now(),
    }));
  };

  save();
  window.addEventListener('scroll', () => {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(save, 150);
  }, { passive: true });
  window.addEventListener('pagehide', save);
};
