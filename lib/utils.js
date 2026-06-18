/**
 * Simple utility to merge classNames conditionally
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Normalizes and formats the price string
 */
export function formatPrice(price) {
  if (typeof price === "number") {
    return `$${price}`;
  }
  return price;
}

/**
 * Creates a clean Google Search query link for a given product
 */
export function getGoogleSearchUrl(productName) {
  if (!productName) return "#";
  const query = encodeURIComponent(`buy ${productName}`);
  return `https://www.google.com/search?q=${query}`;
}
