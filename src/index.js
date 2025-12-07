/**
 * @fileoverview aki-info-detect - Browser information detection library
 * @author lacvietanh
 * @version 2.0.0
 * @license MIT
 * @see https://github.com/lacvietanh/akiInfoDetect.js
 * 
 * @description
 * Lightweight library for detecting device, browser, hardware, and network information.
 * Works in browser environments only. Supports ES Modules and UMD.
 * 
 * @example
 * import akiInfoDetect from 'aki-info-detect';
 * const info = await akiInfoDetect();
 * console.log(info.browser, info.os.string, info.GPU);
 */

import { parseUserAgent, getHighEntropyValues } from './modules/ua-parser.js';
import { detectGPU, getHardwareInfo } from './modules/hardware.js';
import { getNetworkInfo, getIP, getISP, getCountry, getConnection, getLocation, networkCache } from './modules/network.js';
import { getScreen } from './modules/screen.js';
import { getBattery } from './modules/battery.js';
import { detectOS } from './modules/os.js';
import { detectBrowser } from './modules/browser.js';

/**
 * @typedef {Object} AkiInfoResult
 * @property {string} browser - Browser name and version
 * @property {string} product - Device product name
 * @property {string} manufacturer - Device manufacturer
 * @property {boolean} isMobile - Is mobile device
 * @property {string} language - Preferred languages (space-separated 2-char codes)
 * @property {string} CPU - CPU/chip type
 * @property {number} CPUCore - Number of logical CPU cores
 * @property {string} arch - CPU architecture (x86_64, arm64)
 * @property {number} RAM - Device memory in GB
 * @property {string} GPU - GPU renderer string
 * @property {Object} battery - Battery status
 * @property {Object} os - Operating system info
 * @property {Object} network - Network info (reactive getters)
 * @property {Function} getIP - Fetch IP address
 * @property {Function} getISP - Fetch ISP info
 * @property {Function} getCountry - Fetch country code
 * @property {Function} getNetworkInfo - Fetch all network info
 * @property {Function} getLocation - Fetch geolocation
 * @property {Function} getConnection - Get connection quality
 * @property {Function} getScreen - Get screen info
 */

/**
 * Main detection function
 * @param {boolean} [forceNetworkRefresh=false] - Force refresh network data
 * @returns {Promise<AkiInfoResult>} Complete system information
 */
async function akiInfoDetect(forceNetworkRefresh = false) {
  // Parallel async operations for performance
  const [hev, battery, gpu] = await Promise.all([
    getHighEntropyValues(),
    getBattery(),
    Promise.resolve(detectGPU())
  ]);

  // Parse user agent
  const parsedUA = parseUserAgent();
  
  // Get hardware info with GPU-based chip detection
  const hardware = getHardwareInfo(gpu);

  // Detect OS (prefer Client Hints)
  const os = detectOS(hev, parsedUA.os);

  // Detect browser (prefer Client Hints)
  const browser = detectBrowser(hev, parsedUA);

  // Detect mobile status
  const isMobile = hev.mobile ?? /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Get language preferences (top 3, 2-char codes)
  const languages = (navigator.languages || [navigator.language])
    .slice(0, 3)
    .map(l => l.substring(0, 2).toLowerCase())
    .join(' ');

  // Trigger network fetch in background (non-blocking)
  if (forceNetworkRefresh || !networkCache.IP) {
    getNetworkInfo(forceNetworkRefresh).catch(() => {});
  }

  return {
    // Basic info
    browser,
    product: parsedUA.product,
    manufacturer: parsedUA.manufacturer,
    isMobile,
    language: languages,

    // Hardware
    CPU: hardware.CPU,
    CPUCore: hardware.CPUCore,
    arch: hev.architecture || hardware.arch,
    RAM: hardware.RAM,
    GPU: hardware.GPU,

    // Battery
    battery,

    // OS
    os,

    // Network (reactive getters from cache)
    network: {
      get IP() { return networkCache.IP; },
      get ISP() { return networkCache.ISP; },
      get country() { return networkCache.country; }
    },

    // Async methods
    getIP,
    getISP,
    getCountry,
    getNetworkInfo,
    getLocation,
    getConnection,
    getScreen
  };
}

// Named exports for tree-shaking
export {
  akiInfoDetect,
  getNetworkInfo,
  getIP,
  getISP,
  getCountry,
  getConnection,
  getLocation,
  getScreen,
  getBattery,
  detectGPU,
  parseUserAgent,
  getHighEntropyValues
};

// Default export
export default akiInfoDetect;
