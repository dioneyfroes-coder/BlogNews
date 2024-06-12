import DOMPurify from 'dompurify';

const sanitizeAndFixHtml = (html) => {
  const cleanHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  const fixedHtml = cleanHtml
    .replace(/<p>\s*(<p>)+/g, '<p>')
    .replace(/<\/p>\s*<\/p>/g, '</p>')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return fixedHtml;
};

export default sanitizeAndFixHtml;
