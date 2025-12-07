/**
 * @fileoverview User Agent and Browser/OS Parser
 * @description Parses user agent string and Client Hints for browser and OS detection
 */

/**
 * Parse user agent string to extract browser and OS info
 * @param {string} [ua] - User agent string (defaults to navigator.userAgent)
 * @returns {ParsedUA} Parsed platform information
 * 
 * @typedef {Object} ParsedUA
 * @property {string} name - Browser name
 * @property {string} version - Browser version
 * @property {string} product - Device product name
 * @property {string} manufacturer - Device manufacturer
 * @property {Object|null} os - Operating system info
 * @property {string} layout - Rendering engine
 */
export function parseUserAgent(ua = navigator.userAgent) {
  let os = null;
  let name = '';
  let version = '';
  let product = '';
  let manufacturer = '';

  // Browser detection (order matters - more specific first)
  const browserPatterns = [
    { test: /Edg(?:e)?\//, name: 'Edge', regex: /Edg(?:e)?\/([\d.]+)/ },
    { test: /OPR\/|Opera\//, name: 'Opera', regex: /(?:OPR|Opera)\/([\d.]+)/ },
    { test: /Firefox\//, name: 'Firefox', regex: /Firefox\/([\d.]+)/, exclude: /Seamonkey/ },
    { test: /Chrome\//, name: 'Chrome', regex: /Chrome\/([\d.]+)/, exclude: /Edge|Edg|OPR|Opera/ },
    { test: /Safari\//, name: 'Safari', regex: /Version\/([\d.]+)/, exclude: /Chrome|Edge|Edg|OPR|Opera/ },
    { test: /MSIE|Trident/, name: 'IE', regex: /(?:MSIE |rv:)([\d.]+)/ }
  ];

  for (const { test, name: browserName, regex, exclude } of browserPatterns) {
    if (test.test(ua) && (!exclude || !exclude.test(ua))) {
      name = browserName;
      const match = ua.match(regex);
      version = match?.[1] || '';
      break;
    }
  }

  // OS detection
  const osPatterns = [
    {
      test: /Windows/,
      parse: () => {
        const verMap = { '10.0': '10', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.1': 'XP' };
        const match = ua.match(/Windows NT ([\d.]+)/);
        const ntVer = match?.[1] || '';
        const winVer = verMap[ntVer] || ntVer;
        return {
          family: `Windows ${winVer}`,
          version: winVer,
          architecture: /WOW64|Win64|x64/.test(ua) ? 64 : 32
        };
      }
    },
    {
      test: /Mac OS X/,
      parse: () => {
        const match = ua.match(/Mac OS X ([\d_.]+)/);
        const ver = match?.[1]?.replace(/_/g, '.') || '';
        return { family: `macOS ${ver}`, version: ver, architecture: 64 };
      }
    },
    {
      test: /Android/,
      parse: () => {
        const match = ua.match(/Android ([\d.]+)/);
        const ver = match?.[1] || '';
        return { family: `Android ${ver}`, version: ver, architecture: 64 };
      }
    },
    {
      test: /iPhone|iPad|iPod/,
      parse: () => {
        const match = ua.match(/OS ([\d_]+)/);
        const ver = match?.[1]?.replace(/_/g, '.') || '';
        return { family: `iOS ${ver}`, version: ver, architecture: 64 };
      }
    },
    {
      test: /Linux/,
      parse: () => ({
        family: 'Linux',
        version: '',
        architecture: /x86_64|amd64/.test(ua) ? 64 : 32
      })
    }
  ];

  for (const { test, parse } of osPatterns) {
    if (test.test(ua)) {
      os = parse();
      break;
    }
  }

  // Device detection
  if (/iPhone/.test(ua)) {
    product = 'iPhone';
    manufacturer = 'Apple';
  } else if (/iPad/.test(ua)) {
    product = 'iPad';
    manufacturer = 'Apple';
  } else if (/Android/.test(ua)) {
    const match = ua.match(/Android[^;]+;\s*([^;)]+)/);
    if (match) {
      product = match[1].trim();
      // Detect manufacturer from product string
      const mfrMatch = product.match(/^(Samsung|LG|Motorola|HTC|Huawei|Xiaomi|OnePlus|Google|Sony|OPPO|Vivo|Realme)/i);
      manufacturer = mfrMatch?.[1] || '';
    }
  }

  // Rendering engine
  const layout = /AppleWebKit/.test(ua) ? 'WebKit' :
                 /Gecko\//.test(ua) ? 'Gecko' :
                 /Trident/.test(ua) ? 'Trident' : '';

  return { name, version, product, manufacturer, os, layout };
}

/**
 * Get High Entropy Values from Client Hints API
 * @returns {Promise<Object>} High entropy values object
 */
export async function getHighEntropyValues() {
  if (!navigator.userAgentData?.getHighEntropyValues) {
    return {};
  }

  try {
    return await navigator.userAgentData.getHighEntropyValues([
      'platform',
      'platformVersion',
      'architecture',
      'model',
      'mobile',
      'bitness',
      'brands',
      'fullVersionList'
    ]);
  } catch {
    return {};
  }
}
