/*!
 * Platform.js v1.3.6
 * Copyright 2014-2020 Benjamin Tan
 * Copyright 2011-2013 John-David Dalton
 * Available under MIT license
 * Enhanced by lacvietanh 2024 Jun => global function "akiInfoDetect"
 */

(function (window, document) {
  'use strict';
  
  // Cache system for network information
  const cache = {
    IP: '',
    Ips: '',
    country: '',
    lastUpdated: 0,
    // Cache expiration time (1 hour in milliseconds)
    expirationTime: 3600000
  };

  // Main function to detect platform and other info
  window.akiInfoDetect = function () {
    return new Promise(async (resolve) => {
      try {
        // Initialize the result object with default values
        const result = {
          browser: '',
          product: '',
          manufacturer: '',
          isMobile: false,
          language: '',
          CPU: '',
          CPUCore: 0,
          arch: '',
          RAM: 0,
          GPU: '',
          battery: {
            isCharging: false,
            level: 0
          },
          os: {
            name: '',
            ver: 0,
            string: ''
          },
          network: {
            get IP() { return cache.IP; },
            get Ips() { return cache.Ips; },
            get country() { return cache.country; }
          },
          getIP: (forceRefresh = false) => getIP(true, forceRefresh),
          getIps: (forceRefresh = false) => getIps(forceRefresh),
          getCountry: (forceRefresh = false) => getCountry(forceRefresh),
          getNetworkInfo: (forceRefresh = false) => getNetworkInfo(forceRefresh),
          getLocation: () => getLocation(),
          getConnection: () => getConnection(),
          getScreen: () => getScreen()
        };

        // Get platform info using platform.js
        const plat = parse();

        // Try to get high entropy values if available
        let HEV = {};
        try {
          if (navigator.userAgentData) {
            HEV = await navigator.userAgentData.getHighEntropyValues([
              "platform",
              "platformVersion",
              "architecture",
              "model",
              "mobile",
              "bitness",
              "brands",
              "fullVersionList"
            ]);
          }
        } catch (e) {
          console.error("Error getting high entropy values:", e);
        }

        // Get OS information
        try {
          let osName = '';
          let osVer = 0;
          let osString = '';

          if (navigator.userAgentData && HEV.platform) {
            if (HEV.platform === "Windows") {
              let winVer = parseFloat(HEV.platformVersion);
              osName = "win";
              osVer = winVer >= 13 ? 11 : 10;
              osString = `Windows ${osVer}`;
            } else if (HEV.platform === "macOS") {
              osName = "mac";
              // Extract up to 2 decimal places
              let verParts = HEV.platformVersion.split('.');
              osVer = parseFloat(verParts[0] + (verParts[1] ? '.' + verParts[1] : '') + (verParts[2] ? '.' + verParts[2] : ''));
              osString = `macOS ${HEV.platformVersion}`;
            } else {
              osName = HEV.platform.toLowerCase();
              osVer = parseFloat(HEV.platformVersion) || 0;
              osString = `${HEV.platform} ${HEV.platformVersion}`;
            }
          } else if (plat.os) {
            let osFamily = plat.os.family || '';

            if (osFamily.includes('Windows')) {
              osName = "win";
              if (osFamily.includes('11')) {
                osVer = 11;
              } else if (osFamily.includes('10')) {
                osVer = 10;
              } else if (osFamily.includes('8.1')) {
                osVer = 8.1;
              } else if (osFamily.includes('8')) {
                osVer = 8;
              } else if (osFamily.includes('7')) {
                osVer = 7;
              } else {
                osVer = 0;
              }
              osString = osFamily;
            } else if (osFamily.includes('OS X') || osFamily.includes('Mac')) {
              osName = "mac";
              let verMatch = osFamily.match(/(\d+[._]\d+)/);
              if (verMatch) {
                osVer = parseFloat(verMatch[0].replace('_', '.'));
              }
              osString = osFamily;
            } else if (osFamily.includes('iOS')) {
              osName = "ios";
              let verMatch = osFamily.match(/(\d+[._]\d+)/);
              if (verMatch) {
                osVer = parseFloat(verMatch[0].replace('_', '.'));
              }
              osString = osFamily;
            } else if (osFamily.includes('Android')) {
              osName = "android";
              let verMatch = osFamily.match(/(\d+[._]\d+)/);
              if (verMatch) {
                osVer = parseFloat(verMatch[0].replace('_', '.'));
              }
              osString = osFamily;
            } else if (osFamily.includes('Linux')) {
              osName = "linux";
              osVer = 0;
              osString = osFamily;
            } else {
              osName = osFamily.toLowerCase();
              osVer = plat.os.version ? parseFloat(plat.os.version) : 0;
              osString = plat.os.toString();
            }
          }

          result.os = {
            name: osName,
            ver: osVer,
            string: osString
          };
        } catch (e) {
          console.error("Error detecting OS:", e);
        }

        // Get browser information
        try {
          let browserName = '';
          let browserVersion = '';

          // First try to use platform.js detection as it's more reliable
          if (plat.name) {
            browserName = plat.name;
            browserVersion = plat.version ? plat.version.split('.')[0] : '';
          }

          // Then try to enhance with userAgentData if available
          if (navigator.userAgentData && HEV.brands && HEV.brands.length) {
            // List of known browsers to look for
            const knownBrands = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave'];

            // First check fullVersionList if available (more accurate)
            if (HEV.fullVersionList && HEV.fullVersionList.length) {
              for (const brand of HEV.fullVersionList) {
                // Check if it's a known browser
                if (knownBrands.some(known => brand.brand.includes(known))) {
                  browserName = brand.brand;
                  browserVersion = brand.version.split('.')[0]; // Get major version
                  break;
                }

                // Skip any "Not" or "Brand" or "Chromium" entries
                if (!/Not|Brand|Chromium/i.test(brand.brand)) {
                  browserName = brand.brand;
                  browserVersion = brand.version.split('.')[0];
                  break;
                }
              }
            }

            // If we still don't have a browser name, try with brands
            if (!browserName || browserName.includes('Not') || browserName.includes('Brand')) {
              for (const brand of HEV.brands) {
                // Check if it's a known browser
                if (knownBrands.some(known => brand.brand.includes(known))) {
                  browserName = brand.brand;
                  browserVersion = brand.version;
                  break;
                }

                // Skip any "Not" or "Brand" or "Chromium" entries
                if (!/Not|Brand|Chromium/i.test(brand.brand)) {
                  browserName = brand.brand;
                  browserVersion = brand.version;
                  break;
                }
              }
            }
          }

          // If we still don't have a browser name or it contains "Not" or "Brand", 
          // use navigator.userAgent as a last resort
          if (!browserName || browserName.includes('Not') || browserName.includes('Brand')) {
            const ua = navigator.userAgent;
            if (ua.includes('Chrome')) {
              browserName = 'Chrome';
              const match = ua.match(/Chrome\/(\d+)/);
              if (match) browserVersion = match[1];
            } else if (ua.includes('Firefox')) {
              browserName = 'Firefox';
              const match = ua.match(/Firefox\/(\d+)/);
              if (match) browserVersion = match[1];
            } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
              browserName = 'Safari';
              const match = ua.match(/Version\/(\d+)/);
              if (match) browserVersion = match[1];
            } else if (ua.includes('Edge') || ua.includes('Edg')) {
              browserName = 'Edge';
              const match = ua.match(/Edge?\/(\d+)/);
              if (match) browserVersion = match[1];
            }
          }

          result.browser = `${browserName} ${browserVersion}`;
        } catch (e) {
          console.error("Error detecting browser:", e);
        }

        // Get device information
        try {
          result.product = plat.product || '';
          result.manufacturer = plat.manufacturer || '';
        } catch (e) {
          console.error("Error detecting device:", e);
        }

        // Get architecture and CPU information
        try {
          result.arch = HEV.architecture ||
            (plat.os && plat.os.architecture === 64 ? 'x86_64' :
              (plat.os && plat.os.architecture === 32 ? 'x86' : ''));

          // Detect CPU (Apple Silicon, etc.)
          if (result.os.name === 'mac' && result.arch === 'arm64') {
            result.CPU = 'Apple Silicon';
          } else if (result.os.name === 'mac') {
            result.CPU = 'Intel';
          } else {
            result.CPU = result.arch;
          }
        } catch (e) {
          console.error("Error detecting architecture:", e);
        }

        // Get mobile status
        try {
          result.isMobile = HEV.mobile !== undefined ?
            HEV.mobile :
            /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
        } catch (e) {
          console.error("Error detecting mobile status:", e);
        }

        // Get hardware info
        try {
          result.RAM = navigator.deviceMemory || 0;
          result.CPUCore = navigator.hardwareConcurrency || 0;
        } catch (e) {
          console.error("Error detecting hardware info:", e);
        }

        // Get language preferences
        try {
          // Get top 3 preferred languages in 2-char lowercase format
          const langList = (navigator.languages || [navigator.language || navigator.userLanguage])
            .slice(0, 3)
            .map(lang => lang.substring(0, 2).toLowerCase());

          result.language = langList.join(' ');
        } catch (e) {
          console.error("Error detecting language preferences:", e);
        }

        // Get battery information
        try {
          if ('getBattery' in navigator) {
            const battery = await navigator.getBattery();
            result.battery = {
              isCharging: battery.charging,
              level: Math.round(battery.level * 100)
            };
          }
        } catch (e) {
          console.error("Error detecting battery:", e);
        }

        // Get GPU information
        try {
          result.GPU = await detectGPU();

          // Update CPU info based on GPU detection for Apple Silicon
          if (result.GPU.toLowerCase().includes('apple') &&
            (result.GPU.toLowerCase().includes('m1') ||
              result.GPU.toLowerCase().includes('m2') ||
              result.GPU.toLowerCase().includes('m3'))) {
            result.arch = 'arm64';
            result.CPU = 'Apple Silicon';
          }
        } catch (e) {
          console.error("Error in GPU detection:", e);
        }

        // Try to get network info if cache is empty or expired
        if (!cache.IP || Date.now() - cache.lastUpdated > cache.expirationTime) {
          // Get network info in background
          getNetworkInfo().catch(e => console.error("Error getting network info:", e));
        }

        resolve(result);
      } catch (e) {
        console.error("Error in platform detection:", e);
        resolve({});
      }
    });
  };

  // Function to detect GPU using WebGL
  async function detectGPU() {
    try {
      // Create a hidden canvas element
      const canvas = document.createElement('canvas');
      canvas.style.display = 'none';
      document.body.appendChild(canvas);

      // Try to get WebGL context
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) {
        document.body.removeChild(canvas);
        return 'No WebGL support';
      }

      // Try to get renderer info
      let gpuInfo = '';
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

        gpuInfo = renderer || vendor || '';
      } else {
        gpuInfo = 'GPU info not available';
      }

      // Clean up
      document.body.removeChild(canvas);

      return gpuInfo;
    } catch (e) {
      console.error("Error detecting GPU:", e);
      return 'Error detecting GPU';
    }
  }

  // Improved fetch with timeout and error handling
  const fetchWithTimeout = (url, timeout = 2000) => {
    return new Promise((resolve) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        resolve({ 
          success: false, 
          url, 
          error: 'timeout',
          message: `Request to ${url} timed out after ${timeout}ms`
        });
      }, timeout);

      fetch(url, { signal: controller.signal })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          clearTimeout(timeoutId);
          resolve({ success: true, data, url });
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          resolve({ 
            success: false, 
            url, 
            error: error.name === 'AbortError' ? 'timeout' : 'fetch_error',
            message: error.message
          });
        });
    });
  };

  // Comprehensive function to get all network information at once
  function getNetworkInfo(forceRefresh = false) {
    return new Promise(async (resolve) => {
      // Check cache first
      const now = Date.now();
      if (!forceRefresh && cache.IP && (now - cache.lastUpdated < cache.expirationTime)) {
        resolve({
          IP: cache.IP,
          Ips: cache.Ips,
          country: cache.country
        });
        return;
      }

      // Services in order of preference
      const services = [
        'https://ipinfo.io/json',
        'https://ipwhois.app/json/',
        'https://api.ipify.org?format=json'
      ];

      // Try each service until one works
      for (const url of services) {
        try {
          const result = await fetchWithTimeout(url);
          if (result.success) {
            const data = result.data;
            
            // Extract information based on the service
            if (url.includes('ipinfo.io')) {
              cache.IP = data.ip || '';
              cache.Ips = data.org || '';
              cache.country = data.country || '';
              cache.lastUpdated = now;
              
              resolve({
                IP: cache.IP,
                Ips: cache.Ips,
                country: cache.country
              });
              return;
            } else if (url.includes('ipwhois.app')) {
              cache.IP = data.ip || '';
              cache.Ips = data.isp || data.connection?.isp || '';
              cache.country = data.country_code || '';
              cache.lastUpdated = now;
              
              resolve({
                IP: cache.IP,
                Ips: cache.Ips,
                country: cache.country
              });
              return;
            } else if (url.includes('ipify.org')) {
              cache.IP = data.ip || '';
              // No ISP or country info from ipify
              cache.lastUpdated = now;
              
              // If we only have IP, try to get more info
              if (cache.IP && !cache.country) {
                try {
                  const countryResult = await fetchWithTimeout(`https://api.country.is/ip/${cache.IP}`);
                  if (countryResult.success) {
                    cache.country = countryResult.data.country || '';
                  }
                } catch (e) {
                  console.error("Error getting country info:", e);
                }
              }
              
              resolve({
                IP: cache.IP,
                Ips: cache.Ips,
                country: cache.country
              });
              return;
            }
          }
        } catch (e) {
          console.error(`Error with service ${url}:`, e);
        }
      }
      
      // If all services failed, return whatever we have in cache
      resolve({
        IP: cache.IP,
        Ips: cache.Ips,
        country: cache.country
      });
    });
  }

  // Function to get IP address
  function getIP(race = true, forceRefresh = false) {
    return new Promise(async (resolve) => {
      // Check cache first
      if (!forceRefresh && cache.IP && (Date.now() - cache.lastUpdated < cache.expirationTime)) {
        resolve(cache.IP);
        return;
      }

      // If we're already getting network info, just return the IP
      if (race) {
        // Get all network info (which includes IP)
        const networkInfo = await getNetworkInfo(forceRefresh);
        resolve(networkInfo.IP);
      } else {
        // Array of IP detection services
        const ipServices = [
          'https://api.ipify.org?format=json',
          'https://ipinfo.io/json',
          'https://api.db-ip.com/v2/free/self',
        ];

        // Function to extract IP from response based on service
        const extractIP = (data, service) => {
          if (!data) return null;
          
          let ip = null;
          if (service.includes('ipify')) {
            ip = data.ip;
          } else if (service.includes('ipinfo')) {
            ip = data.ip;
            cache.Ips = data.org || '';
            cache.country = data.country || '';
          } else if (service.includes('db-ip')) {
            ip = data.ipAddress;
          }
          
          if (ip) {
            cache.IP = ip;
            cache.lastUpdated = Date.now();
          }
          
          return ip;
        };

        // Sequential approach - try each service until one works
        for (const url of ipServices) {
          const result = await fetchWithTimeout(url);
          if (result.success) {
            const ip = extractIP(result.data, url);
            if (ip) {
              resolve(ip);
              return;
            }
          }
        }
        
        // If all services failed, return whatever we have in cache
        resolve(cache.IP);
      }
    });
  }

  // Function to get ISP information
  function getIps(forceRefresh = false) {
    return new Promise(async (resolve) => {
      // Check cache first
      if (!forceRefresh && cache.Ips && (Date.now() - cache.lastUpdated < cache.expirationTime)) {
        resolve(cache.Ips);
        return;
      }

      // Get all network info (which includes ISP)
      const networkInfo = await getNetworkInfo(forceRefresh);
      resolve(networkInfo.Ips);
    });
  }

  // Function to get country information
  function getCountry(forceRefresh = false) {
    return new Promise(async (resolve) => {
      // Check cache first
      if (!forceRefresh && cache.country && (Date.now() - cache.lastUpdated < cache.expirationTime)) {
        resolve(cache.country);
        return;
      }

      // Get all network info (which includes country)
      const networkInfo = await getNetworkInfo(forceRefresh);
      resolve(networkInfo.country);
    });
  }

  // Function to get geolocation
  function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        () => resolve(null),
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  }

  // Function to get network connection info
  function getConnection() {
    return new Promise((resolve) => {
      try {
        const connection = navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection;

        if (!connection) {
          resolve(null);
          return;
        }

        resolve({
          type: connection.type || 'unknown',
          effectiveType: connection.effectiveType || 'unknown',
          downlinkMax: connection.downlinkMax || 0,
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        });
      } catch (e) {
        console.error("Error getting connection info:", e);
        resolve(null);
      }
    });
  }

  // Function to get screen information
  function getScreen() {
    return new Promise((resolve) => {
      try {
        resolve({
          width: window.screen.width,
          height: window.screen.height,
          availWidth: window.screen.availWidth,
          availHeight: window.screen.availHeight,
          colorDepth: window.screen.colorDepth,
          pixelDepth: window.screen.pixelDepth,
          orientation: window.screen.orientation ?
            window.screen.orientation.type :
            window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
          devicePixelRatio: window.devicePixelRatio || 1
        });
      } catch (e) {
        console.error("Error getting screen info:", e);
        resolve(null);
      }
    });
  }

  /*--------------------------------------------------------------------------*/
  // Platform.js core functionality (simplified)

  function parse(ua) {
    ua = ua || navigator.userAgent;

    // Initialize variables
    let os = null;
    let name = '';
    let version = '';
    let product = '';
    let manufacturer = '';

    // Detect browser name and version
    if (/Chrome/.test(ua) && !/Edge|Edg|OPR|Opera/.test(ua)) {
      name = 'Chrome';
      version = /Chrome\/([\d.]+)/.exec(ua)?.[1] || '';
    } else if (/Firefox/.test(ua) && !/Seamonkey/.test(ua)) {
      name = 'Firefox';
      version = /Firefox\/([\d.]+)/.exec(ua)?.[1] || '';
    } else if (/Safari/.test(ua) && !/Chrome|Edge|Edg|OPR|Opera/.test(ua)) {
      name = 'Safari';
      version = /Version\/([\d.]+)/.exec(ua)?.[1] || '';
    } else if (/Edge|Edg/.test(ua)) {
      name = 'Edge';
      version = /Edge?\/([\d.]+)/.exec(ua)?.[1] || '';
    } else if (/Opera|OPR/.test(ua)) {
      name = 'Opera';
      version = (/OPR\/([\d.]+)/.exec(ua) || /Opera\/([\d.]+)/.exec(ua))?.[1] || '';
    } else if (/MSIE|Trident/.test(ua)) {
      name = 'IE';
      version = /MSIE ([\d.]+)/.exec(ua)?.[1] || /rv:([\d.]+)/.exec(ua)?.[1] || '';
    }

    // Detect OS
    if (/Windows/.test(ua)) {
      let winVersion = '';
      if (/Windows NT 10/.test(ua)) winVersion = '10';
      else if (/Windows NT 6.3/.test(ua)) winVersion = '8.1';
      else if (/Windows NT 6.2/.test(ua)) winVersion = '8';
      else if (/Windows NT 6.1/.test(ua)) winVersion = '7';
      else if (/Windows NT 6.0/.test(ua)) winVersion = 'Vista';
      else if (/Windows NT 5.1/.test(ua)) winVersion = 'XP';

      os = {
        family: 'Windows' + (winVersion ? ' ' + winVersion : ''),
        version: winVersion,
        architecture: /WOW64|Win64|x64/.test(ua) ? 64 : 32,
        toString: function () { return this.family; }
      };
    } else if (/Mac OS X/.test(ua)) {
      const macVersion = /Mac OS X ([\d_.]+)/.exec(ua)?.[1]?.replace(/_/g, '.') || '';
      os = {
        family: 'Mac OS X' + (macVersion ? ' ' + macVersion : ''),
        version: macVersion,
        architecture: /x86_64|Intel/.test(ua) ? 64 : 32,
        toString: function () { return this.family; }
      };
    } else if (/Android/.test(ua)) {
      const androidVersion = /Android ([\d.]+)/.exec(ua)?.[1] || '';
      os = {
        family: 'Android' + (androidVersion ? ' ' + androidVersion : ''),
        version: androidVersion,
        architecture: /x86_64|amd64/.test(ua) ? 64 : 32,
        toString: function () { return this.family; }
      };
    } else if (/iPhone|iPad|iPod/.test(ua)) {
      const iosVersion = /OS ([\d_]+)/.exec(ua)?.[1]?.replace(/_/g, '.') || '';
      os = {
        family: 'iOS' + (iosVersion ? ' ' + iosVersion : ''),
        version: iosVersion,
        architecture: 64,
        toString: function () { return this.family; }
      };
    } else if (/Linux/.test(ua)) {
      os = {
        family: 'Linux',
        version: '',
        architecture: /x86_64|amd64/.test(ua) ? 64 : 32,
        toString: function () { return this.family; }
      };
    }

    // Detect product
    if (/iPhone/.test(ua)) {
      product = 'iPhone';
      manufacturer = 'Apple';
    } else if (/iPad/.test(ua)) {
      product = 'iPad';
      manufacturer = 'Apple';
    } else if (/iPod/.test(ua)) {
      product = 'iPod';
      manufacturer = 'Apple';
    } else if (/Android/.test(ua)) {
      const deviceMatch = /Android[^;]+;\s([^;]+)/.exec(ua);
      if (deviceMatch) {
        product = deviceMatch[1].trim();

        // Try to detect manufacturer from product
        const commonManufacturers = ['Samsung', 'LG', 'Motorola', 'HTC', 'Huawei', 'Xiaomi', 'OnePlus', 'Google', 'Sony'];
        for (const mfr of commonManufacturers) {
          if (product.includes(mfr)) {
            manufacturer = mfr;
            break;
          }
        }
      }
    }

    return {
      name,
      version,
      product,
      manufacturer,
      os,
      layout: /Gecko\//.test(ua) ? 'Gecko' :
        /AppleWebKit\//.test(ua) ? 'WebKit' :
          /Trident\//.test(ua) ? 'Trident' :
            /Presto\//.test(ua) ? 'Presto' : ''
    };
  }

})(window, document);