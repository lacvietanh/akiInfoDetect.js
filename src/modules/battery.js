/**
 * @fileoverview Battery Status Module
 * @description Detects battery level and charging status
 */

/**
 * Get battery information
 * @returns {Promise<BatteryInfo>}
 * 
 * @typedef {Object} BatteryInfo
 * @property {boolean} isCharging - Whether device is charging
 * @property {number} level - Battery percentage (0-100)
 * @property {number} chargingTime - Seconds until fully charged (Infinity if not charging)
 * @property {number} dischargingTime - Seconds until empty (Infinity if charging)
 */
export async function getBattery() {
  // Battery API may not be available in all browsers (e.g., Safari)
  if (!('getBattery' in navigator)) {
    return { isCharging: false, level: 0, chargingTime: Infinity, dischargingTime: Infinity };
  }

  try {
    const battery = await navigator.getBattery();
    return {
      isCharging: battery.charging,
      level: Math.round(battery.level * 100),
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime
    };
  } catch {
    return { isCharging: false, level: 0, chargingTime: Infinity, dischargingTime: Infinity };
  }
}
