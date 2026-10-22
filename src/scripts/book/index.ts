import { initializeHeadingAnchors } from './headingAnchors';
import { initializePageShare } from './pageShare';
import { initializeQuoteShare } from './quoteShare';

const bookPage = document.querySelector<HTMLElement>('[data-book-page]');

if (bookPage) {
  initializeQuoteShare(bookPage);
}
initializePageShare();
initializeHeadingAnchors();
