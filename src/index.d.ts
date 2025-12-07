/**
 * aki-info-detect - TypeScript declarations
 */

export interface BatteryInfo {
  isCharging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

export interface OSInfo {
  name: string;
  version: string | number;
  string: string;
}

export interface NetworkInfo {
  IP: string;
  ISP: string;
  country: string;
}

export interface ScreenInfo {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelRatio: number;
  orientation: string;
}

export interface ConnectionInfo {
  type: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface AkiInfoResult {
  /** Browser name and version (e.g., "Chrome 120") */
  browser: string;
  /** Device product name (e.g., "iPhone", "Galaxy S21") */
  product: string;
  /** Device manufacturer (e.g., "Apple", "Samsung") */
  manufacturer: string;
  /** Whether the device is mobile */
  isMobile: boolean;
  /** Preferred languages (space-separated 2-char codes) */
  language: string;
  /** CPU/chip type (e.g., "Apple Silicon", "Intel") */
  CPU: string;
  /** Number of logical CPU cores */
  CPUCore: number;
  /** CPU architecture (e.g., "x86_64", "arm64") */
  arch: string;
  /** Device memory in GB */
  RAM: number;
  /** GPU renderer string */
  GPU: string;
  /** Battery status */
  battery: BatteryInfo;
  /** Operating system info */
  os: OSInfo;
  /** Network info (reactive getters) */
  network: NetworkInfo;
  /** Fetch public IP address */
  getIP(forceRefresh?: boolean): Promise<string>;
  /** Fetch ISP information */
  getISP(forceRefresh?: boolean): Promise<string>;
  /** Fetch country code */
  getCountry(forceRefresh?: boolean): Promise<string>;
  /** Fetch all network info */
  getNetworkInfo(forceRefresh?: boolean): Promise<NetworkInfo>;
  /** Fetch geolocation (requires user permission) */
  getLocation(options?: PositionOptions): Promise<GeolocationData | null>;
  /** Get network connection quality info */
  getConnection(): ConnectionInfo | null;
  /** Get screen/display info */
  getScreen(): ScreenInfo;
}

/**
 * Main detection function
 * @param forceNetworkRefresh - Force refresh of cached network data
 * @returns Promise resolving to complete system information
 */
declare function akiInfoDetect(forceNetworkRefresh?: boolean): Promise<AkiInfoResult>;

export { akiInfoDetect };
export default akiInfoDetect;

// Individual exports for tree-shaking
export declare function getNetworkInfo(forceRefresh?: boolean): Promise<NetworkInfo>;
export declare function getIP(forceRefresh?: boolean): Promise<string>;
export declare function getISP(forceRefresh?: boolean): Promise<string>;
export declare function getCountry(forceRefresh?: boolean): Promise<string>;
export declare function getConnection(): ConnectionInfo | null;
export declare function getLocation(options?: PositionOptions): Promise<GeolocationData | null>;
export declare function getScreen(): ScreenInfo;
export declare function getBattery(): Promise<BatteryInfo>;
export declare function detectGPU(): string;
export declare function parseUserAgent(ua?: string): {
  name: string;
  version: string;
  product: string;
  manufacturer: string;
  os: { family: string; version: string; architecture: number } | null;
  layout: string;
};
export declare function getHighEntropyValues(): Promise<Record<string, unknown>>;
