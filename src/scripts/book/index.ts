import { initializeHeadingAnchors } from './headingAnchors';
import { initializePageShare } from './pageShare';
import { initializeQuoteShare } from './quoteShare';
import { initializeReadingProgress } from './readingProgress';

const bookPage = document.querySelector<HTMLElement>('[data-book-page]');

if (bookPage) {
  initializeReadingProgress(bookPage);
  initializeQuoteShare(bookPage);
}
initializePageShare();
initializeHeadingAnchors();
