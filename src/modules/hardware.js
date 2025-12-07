/**
 * @fileoverview Hardware Detection Module
 * @description Detects CPU, GPU, RAM, and other hardware information
 */

/**
 * Detect GPU information using WebGL
 * @returns {string} GPU renderer string
 */
export function detectGPU() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'No WebGL support';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'GPU info restricted';

    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown GPU';
  } catch {
    return 'GPU detection failed';
  }
}

/**
 * Parse GPU string to detect Apple Silicon or other notable chips
 * Uses future-proof regex patterns (M1, M2, M3... MX)
 * @param {string} gpu - GPU renderer string
 * @returns {Object} Parsed chip info
 */
export function parseChipInfo(gpu) {
  const gpuLower = gpu.toLowerCase();
  
  // Apple Silicon detection - future-proof pattern for M1, M2, M3, M4... MX
  const appleSiliconMatch = gpu.match(/Apple\s+M(\d+)(?:\s+(Pro|Max|Ultra))?/i);
  if (appleSiliconMatch) {
    const chipNum = appleSiliconMatch[1];
    const variant = appleSiliconMatch[2] || '';
    return {
      type: 'Apple Silicon',
      chip: `M${chipNum}${variant ? ' ' + variant : ''}`,
      architecture: 'arm64'
    };
  }

  // Generic Apple GPU (older or unidentified)
  if (gpuLower.includes('apple')) {
    return { type: 'Apple Silicon', chip: 'Apple GPU', architecture: 'arm64' };
  }

  // NVIDIA detection
  const nvidiaMatch = gpu.match(/NVIDIA\s+(.+?)(?:\s*\/|$)/i) || gpu.match(/(GeForce|Quadro|RTX|GTX)\s+[\w\s]+/i);
  if (nvidiaMatch) {
    return { type: 'NVIDIA', chip: nvidiaMatch[0].trim(), architecture: 'x86_64' };
  }

  // AMD detection
  const amdMatch = gpu.match(/(Radeon|AMD)\s+[\w\s]+/i);
  if (amdMatch) {
    return { type: 'AMD', chip: amdMatch[0].trim(), architecture: 'x86_64' };
  }

  // Intel detection
  const intelMatch = gpu.match(/Intel.*?(UHD|Iris|HD)\s*(?:Graphics)?\s*(\d*)/i);
  if (intelMatch || gpuLower.includes('intel')) {
    return { type: 'Intel', chip: intelMatch?.[0] || 'Intel Graphics', architecture: 'x86_64' };
  }

  return { type: 'Unknown', chip: gpu, architecture: '' };
}

/**
 * Get hardware information
 * @param {string} gpu - GPU string for chip detection
 * @returns {Object} Hardware specs
 */
export function getHardwareInfo(gpu) {
  const chipInfo = parseChipInfo(gpu);
  
  return {
    RAM: navigator.deviceMemory || 0,
    CPUCore: navigator.hardwareConcurrency || 0,
    GPU: gpu,
    CPU: chipInfo.type,
    arch: chipInfo.architecture || (navigator.userAgentData?.platform === 'macOS' ? 'arm64' : 'x86_64')
  };
}
