/**
 * @fileoverview Browser Detection Module
 * @description Detects browser name and version with Client Hints support
 */

/**
 * Detect browser from Client Hints or User Agent
 * @param {Object} hev - High Entropy Values from Client Hints
 * @param {Object} parsedUA - Parsed user agent data
 * @returns {string} Browser name and version (e.g., "Chrome 120")
 */
export function detectBrowser(hev, parsedUA) {
  // Priority: Client Hints > User Agent
  const brands = hev.fullVersionList || hev.brands || [];
  
  if (brands.length) {
    // Known browsers to look for (in priority order)
    const knownBrowsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave', 'Vivaldi', 'Arc'];
    
    for (const brand of brands) {
      // Skip placeholder brands
      if (/Not.?A.?Brand|Chromium/i.test(brand.brand)) continue;
      
      // Check if it's a known browser
      const match = knownBrowsers.find(b => brand.brand.includes(b));
      if (match) {
        const majorVersion = brand.version.split('.')[0];
        return `${brand.brand} ${majorVersion}`;
      }
    }

    // If no known browser found, use first non-placeholder brand
    for (const brand of brands) {
      if (!/Not.?A.?Brand|Chromium/i.test(brand.brand)) {
        return `${brand.brand} ${brand.version.split('.')[0]}`;
      }
    }
  }

  // Fallback to parsed User Agent
  if (parsedUA.name) {
    const majorVersion = parsedUA.version?.split('.')[0] || '';
    return `${parsedUA.name} ${majorVersion}`.trim();
  }

  return 'Unknown Browser';
}
