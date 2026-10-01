const WORDS_PER_MINUTE = 200;

/** Estimates reading time from a Markdown document at build time. */
export function getReadingTime(markdown: string): string {
  const text = markdown
    .replace(/^---[\s\S]*?---/u, ' ')
    .replace(/```[\s\S]*?```|`[^`]*`/gu, ' ')
    .replace(/!?(?:\[([^\]]*)\])\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/[#>*_~|=-]/gu, ' ');

  const wordCount = text.match(/[\p{L}\p{N}]+(?:[‌'’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return `${minutes.toLocaleString('fa-IR')} دقیقه`;
}
