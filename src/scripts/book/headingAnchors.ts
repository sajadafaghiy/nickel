export const initializeHeadingAnchors = () => {
  document.querySelectorAll<HTMLElement>('.prose :is(h2, h3, h4, h5, h6)[id]').forEach((heading) => {
    if (heading.querySelector('.heading-anchor')) return;

    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = `#${encodeURIComponent(heading.id)}`;
    anchor.textContent = '#';
    anchor.setAttribute('aria-label', `پیوند به بخش «${heading.textContent?.trim() ?? ''}»`);
    heading.append(anchor);
  });
};
