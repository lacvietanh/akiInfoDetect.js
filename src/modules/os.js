/**
 * @fileoverview OS Detection Module
 * @description Detects operating system with Client Hints support
 */

/**
 * Detect operating system from Client Hints or User Agent
 * @param {Object} hev - High Entropy Values from Client Hints
 * @param {Object|null} parsedOS - Parsed OS from user agent
 * @returns {OSInfo}
 * 
 * @typedef {Object} OSInfo
 * @property {string} name - Short OS name (win, mac, linux, android, ios)
 * @property {number|string} version - OS version
 * @property {string} string - Human-readable OS string
 */
export function detectOS(hev, parsedOS) {
  // Prefer Client Hints if available (more accurate)
  if (hev.platform) {
    const platform = hev.platform;
    const platformVersion = hev.platformVersion || '';

    if (platform === 'Windows') {
      // Windows 11 reports platformVersion >= 13.0
      const majorVer = parseInt(platformVersion.split('.')[0], 10);
      const winVer = majorVer >= 13 ? 11 : 10;
      return { name: 'win', version: winVer, string: `Windows ${winVer}` };
    }

    if (platform === 'macOS') {
      return { name: 'mac', version: platformVersion, string: `macOS ${platformVersion}` };
    }

    if (platform === 'Android') {
      return { name: 'android', version: platformVersion, string: `Android ${platformVersion}` };
    }

    if (platform === 'iOS') {
      return { name: 'ios', version: platformVersion, string: `iOS ${platformVersion}` };
    }

    if (platform === 'Linux') {
      return { name: 'linux', version: '', string: 'Linux' };
    }

    if (platform === 'Chrome OS') {
      return { name: 'chromeos', version: platformVersion, string: `Chrome OS ${platformVersion}` };
    }

    // Unknown platform from Client Hints
    return { name: platform.toLowerCase(), version: platformVersion, string: `${platform} ${platformVersion}` };
  }

  // Fallback to parsed User Agent
  if (parsedOS) {
    const family = parsedOS.family || '';
    
    if (family.includes('Windows')) {
      const ver = parseFloat(parsedOS.version) || 0;
      return { name: 'win', version: ver, string: family };
    }
    if (family.includes('macOS') || family.includes('Mac OS X')) {
      return { name: 'mac', version: parsedOS.version, string: family };
    }
    if (family.includes('Android')) {
      return { name: 'android', version: parsedOS.version, string: family };
    }
    if (family.includes('iOS')) {
      return { name: 'ios', version: parsedOS.version, string: family };
    }
    if (family.includes('Linux')) {
      return { name: 'linux', version: '', string: 'Linux' };
    }

    return { name: family.toLowerCase(), version: parsedOS.version || '', string: family };
  }

  return { name: '', version: '', string: 'Unknown OS' };
}
