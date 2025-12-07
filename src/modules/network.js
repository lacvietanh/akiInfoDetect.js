/**
 * @fileoverview Network Information Module
 * @description Handles IP, ISP, country detection with caching
 */

/** Cache for network data */
const cache = {
  IP: '',
  ISP: '',
  country: '',
  lastUpdated: 0,
  TTL: 3600000 // 1 hour
};

/**
 * Fetch with timeout
 * @param {string} url - URL to fetch
 * @param {number} [timeout=2500] - Timeout in ms
 * @returns {Promise<Object|null>} JSON response or null
 */
async function fetchJSON(url, timeout = 2500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok ? await res.json() : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Get network information (IP, ISP, country)
 * @param {boolean} [forceRefresh=false] - Bypass cache
 * @returns {Promise<NetworkInfo>}
 * 
 * @typedef {Object} NetworkInfo
 * @property {string} IP - Public IP address
 * @property {string} ISP - Internet Service Provider
 * @property {string} country - Country code (ISO 3166-1 alpha-2)
 */
export async function getNetworkInfo(forceRefresh = false) {
  // Return cached data if valid
  if (!forceRefresh && cache.IP && Date.now() - cache.lastUpdated < cache.TTL) {
    return { IP: cache.IP, ISP: cache.ISP, country: cache.country };
  }

  // Service providers in priority order
  const services = [
    {
      url: 'https://ipinfo.io/json',
      parse: (d) => ({ IP: d.ip, ISP: d.org || '', country: d.country || '' })
    },
    {
      url: 'https://ipwhois.app/json/',
      parse: (d) => ({ IP: d.ip, ISP: d.isp || '', country: d.country_code || '' })
    },
    {
      url: 'https://api.ipify.org?format=json',
      parse: (d) => ({ IP: d.ip, ISP: '', country: '' })
    }
  ];

  for (const { url, parse } of services) {
    const data = await fetchJSON(url);
    if (data) {
      const result = parse(data);
      if (result.IP) {
        cache.IP = result.IP;
        cache.ISP = result.ISP || cache.ISP;
        cache.country = result.country || cache.country;
        cache.lastUpdated = Date.now();
        return result;
      }
    }
  }

  // Return whatever we have in cache
  return { IP: cache.IP, ISP: cache.ISP, country: cache.country };
}

/**
 * Get public IP address
 * @param {boolean} [forceRefresh=false] - Bypass cache
 * @returns {Promise<string>}
 */
export async function getIP(forceRefresh = false) {
  const info = await getNetworkInfo(forceRefresh);
  return info.IP;
}

/**
 * Get ISP information
 * @param {boolean} [forceRefresh=false] - Bypass cache
 * @returns {Promise<string>}
 */
export async function getISP(forceRefresh = false) {
  const info = await getNetworkInfo(forceRefresh);
  return info.ISP;
}

/**
 * Get country code
 * @param {boolean} [forceRefresh=false] - Bypass cache
 * @returns {Promise<string>}
 */
export async function getCountry(forceRefresh = false) {
  const info = await getNetworkInfo(forceRefresh);
  return info.country;
}

/**
 * Get connection quality info (Network Information API)
 * @returns {ConnectionInfo|null}
 * 
 * @typedef {Object} ConnectionInfo
 * @property {string} type - Connection type (wifi, cellular, etc.)
 * @property {string} effectiveType - Effective connection type (4g, 3g, etc.)
 * @property {number} downlink - Downlink speed in Mbps
 * @property {number} rtt - Round-trip time in ms
 * @property {boolean} saveData - Data saver mode enabled
 */
export function getConnection() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!conn) return null;

  return {
    type: conn.type || 'unknown',
    effectiveType: conn.effectiveType || 'unknown',
    downlink: conn.downlink || 0,
    rtt: conn.rtt || 0,
    saveData: conn.saveData || false
  };
}

/**
 * Get geolocation (requires user permission)
 * @param {Object} [options] - Geolocation options
 * @returns {Promise<GeolocationData|null>}
 * 
 * @typedef {Object} GeolocationData
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} accuracy - Accuracy in meters
 * @property {number} timestamp
 */
export function getLocation(options = { timeout: 10000, enableHighAccuracy: false }) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp
      }),
      () => resolve(null),
      options
    );
  });
}

/** Expose cache for reactive access */
export const networkCache = cache;
