import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    // Allow common HTML tags and attributes
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'strike', 'del', 'ins',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
      'input' // For checkboxes in markdown
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height',
      'class', 'id', 'style',
      'type', 'checked', 'disabled' // For checkboxes
    ],
    // Allow data attributes for styling
    ALLOW_DATA_ATTR: true,
    // Keep relative URLs
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // Remove script tags and event handlers
    FORBID_TAGS: ['script', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
  });
};

/**
 * Creates a sanitized object for dangerouslySetInnerHTML
 * @param html - The HTML string to sanitize
 * @returns Object with __html property containing sanitized HTML
 */
export const createSafeHtml = (html: string): { __html: string } => {
  return { __html: sanitizeHtml(html) };
};