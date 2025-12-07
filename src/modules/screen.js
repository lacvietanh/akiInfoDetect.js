/**
 * @fileoverview Screen and Display Module
 * @description Detects screen resolution, pixel ratio, orientation
 */

/**
 * Get screen and display information
 * @returns {ScreenInfo}
 * 
 * @typedef {Object} ScreenInfo
 * @property {number} width - Screen width in pixels
 * @property {number} height - Screen height in pixels
 * @property {number} availWidth - Available width (excluding taskbars)
 * @property {number} availHeight - Available height
 * @property {number} colorDepth - Color depth in bits
 * @property {number} pixelRatio - Device pixel ratio
 * @property {string} orientation - Screen orientation
 */
export function getScreen() {
  const { screen } = window;
  
  return {
    width: screen.width,
    height: screen.height,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    orientation: screen.orientation?.type || 
                 (window.innerWidth > window.innerHeight ? 'landscape-primary' : 'portrait-primary')
  };
}
