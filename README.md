# aki-info-detect

A lightweight JavaScript library for detecting device, browser, hardware, and network information in the browser.

[![npm version](https://img.shields.io/npm/v/aki-info-detect.svg)](https://www.npmjs.com/package/aki-info-detect)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/aki-info-detect)](https://bundlephobia.com/package/aki-info-detect)

## Introduction

**aki-info-detect** is a modern, lightweight JavaScript library designed to provide comprehensive device, browser, and system information detection for web applications. Built with performance and developer experience in mind, it leverages modern browser APIs including the Client Hints API for accurate hardware detection while maintaining a small footprint (~3.8 kB gzipped).

Whether you need to customize user experiences based on device capabilities, gather analytics data, or implement platform-specific features, aki-info-detect provides a unified, easy-to-use API that works seamlessly across all modern browsers.

### Why aki-info-detect?

- **🎯 Comprehensive Detection**: Get detailed information about browser, OS, CPU, GPU, RAM, network, battery, and more from a single library
- **⚡ Performance-First**: Minimal bundle size with tree-shakeable exports—import only what you need
- **🔮 Future-Proof**: Built on modern Web APIs with graceful fallbacks for older browsers
- **💪 Apple Silicon Ready**: Advanced detection for Apple M-series chips (M1, M2, M3, M4, and beyond)
- **🔒 Privacy-Conscious**: Implements caching for network requests to minimize external API calls
- **📦 Zero Dependencies**: No external runtime dependencies—just pure, optimized JavaScript
- **🎨 Developer-Friendly**: TypeScript declarations included, intuitive API design, comprehensive documentation

## Use Cases

### 1. **Adaptive User Interfaces**
Dynamically adjust your UI based on device capabilities and screen properties:
```javascript
const info = await akiInfoDetect();
if (info.isMobile) {
  // Load mobile-optimized components
  loadMobileUI();
} else if (info.RAM < 4) {
  // Use lightweight version for low-memory devices
  enableLowMemoryMode();
}
```

### 2. **Analytics & User Insights**
Gather detailed technical data to understand your user base:
```javascript
const info = await akiInfoDetect();
analytics.track('page_view', {
  browser: info.browser,
  os: info.os.string,
  device: info.isMobile ? 'mobile' : 'desktop',
  gpu: info.GPU,
  country: await info.getCountry()
});
```

### 3. **Feature Detection & Progressive Enhancement**
Enable or disable features based on browser capabilities:
```javascript
const info = await akiInfoDetect();
if (info.browser.includes('Chrome') && parseInt(info.browser.split(' ')[1]) >= 90) {
  // Enable features requiring Chrome 90+
  enableAdvancedFeatures();
}
```

### 4. **Platform-Specific Optimization**
Optimize content delivery based on hardware capabilities:
```javascript
const info = await akiInfoDetect();
if (info.CPU === 'Apple Silicon') {
  // Load optimized assets for Apple Silicon
  loadWebPImages();
} else if (info.GPU.includes('NVIDIA')) {
  // Enable GPU-accelerated features
  enableHardwareAcceleration();
}
```

### 5. **Targeted User Support**
Provide context-aware help and troubleshooting:
```javascript
const info = await akiInfoDetect();
if (info.browser.includes('Safari') && info.os.name === 'ios') {
  showMessage('For best experience on iOS Safari, please enable...');
}
```

### 6. **Network-Aware Loading**
Adapt content loading strategies based on connection quality:
```javascript
const info = await akiInfoDetect();
const conn = info.getConnection();
if (conn.type === '4g' && conn.downlink > 5) {
  // High-speed connection: load high-quality assets
  loadHDContent();
} else {
  // Optimize for slower connections
  loadCompressedContent();
}
```

## Comparison with Similar Libraries

| Feature | aki-info-detect | Platform.js | UA-Parser.js | Detect.js |
|---------|----------------|-------------|--------------|-----------|
| **Bundle Size (gzipped)** | ~3.8 kB | ~2.5 kB | ~9 kB | Varies |
| **Client Hints API** | ✅ Full Support | ❌ No | ❌ No | ❌ No |
| **GPU Detection** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Apple Silicon Detection** | ✅ Yes (M1-MX) | ❌ No | ❌ No | ❌ No |
| **Network Info (IP/ISP)** | ✅ Yes (cached) | ❌ No | ❌ No | ❌ No |
| **Battery Status** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Geolocation** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Tree-shakeable** | ✅ Yes | ⚠️ Partial | ⚠️ Partial | ⚠️ Partial |
| **TypeScript** | ✅ Full declarations | ⚠️ Community types | ✅ Yes | ❌ No |
| **Active Maintenance** | ✅ Yes | ⚠️ Sporadic | ✅ Yes | ❌ Archived |
| **Modern Build System** | ✅ Vite | ❌ Legacy | ✅ Webpack | ❌ Legacy |

### Key Differentiators

**vs. Platform.js**
- aki-info-detect is a modern evolution with Client Hints API support for more accurate detection
- Adds hardware detection (GPU, RAM) and network capabilities not available in Platform.js
- Built with modern tooling (Vite) for better tree-shaking and optimization

**vs. UA-Parser.js**
- Lighter bundle size while providing more comprehensive information
- Includes hardware and network detection beyond just user agent parsing
- Native async/await support with modern API design

**vs. Detect.js**
- Active maintenance (Detect.js is archived)
- Smaller, more focused API surface with better performance
- Modern Web API integration for enhanced detection capabilities

## Frequently Asked Questions (FAQ)

### General Questions

**Q: What browsers does aki-info-detect support?**  
A: All modern browsers with ES2020+ support: Chrome/Edge 89+, Firefox 88+, Safari 14+, Opera 76+. Client Hints features work best in Chromium-based browsers.

**Q: Does it work in Node.js or server-side environments?**  
A: No, aki-info-detect is specifically designed for browser environments. It relies on browser APIs like `navigator`, `screen`, and Web APIs that are not available in Node.js.

**Q: How accurate is the detection?**  
A: Very accurate for modern browsers that support Client Hints API. For browsers without Client Hints, it falls back to user agent parsing which is still reliable but less detailed. GPU and CPU detection is most accurate in Chromium-based browsers.

**Q: Is user agent string spoofing a concern?**  
A: While user agents can be spoofed, Client Hints API provides more reliable detection. For critical functionality, always combine with feature detection rather than relying solely on browser/platform detection.

### Privacy & Security

**Q: Does aki-info-detect collect or transmit user data?**  
A: No. The library only detects information locally in the browser. The optional network info feature (`getNetworkInfo()`) makes a request to a public IP API, but this is only triggered when you explicitly call that method.

**Q: What about user privacy?**  
A: aki-info-detect is privacy-conscious. Network requests are cached for 1 hour to minimize external API calls, and all detection happens client-side. No data is sent to our servers.

**Q: Is it GDPR compliant?**  
A: Detection of browser/device information is generally considered functional data necessary for website operation. However, always review your local regulations and privacy policies, especially when using geolocation or storing detected data.

### Technical Questions

**Q: Why do I need to configure server headers?**  
A: The Client Hints API requires the server to explicitly request detailed information via `Accept-CH` headers. Without these headers, browsers will only provide basic user agent data. This is a browser security feature designed to enhance user privacy.

**Q: Can I use it with React, Vue, or other frameworks?**  
A: Absolutely! aki-info-detect is framework-agnostic. See the React Hook and Vue Composable examples in the documentation for integration patterns.

**Q: How do I reduce bundle size further?**  
A: Use tree-shakeable imports to include only the functions you need:
```javascript
import { detectBrowser, detectOS } from 'aki-info-detect';
```

**Q: Does it support TypeScript?**  
A: Yes, full TypeScript declarations are included in the package.

**Q: How often is the network information cached?**  
A: Network info (IP, ISP, country) is cached for 1 hour by default. You can force a refresh by passing `true` to `getNetworkInfo(true)`.

### Troubleshooting

**Q: Why am I getting generic hardware info?**  
A: Make sure your server is configured to send the required `Accept-CH` headers. Without these headers, detailed Client Hints data won't be available.

**Q: Why is GPU detection returning "Unknown"?**  
A: GPU detection works best in Chromium browsers with Client Hints. Safari and Firefox have limited support. Also, some browsers may restrict this information for privacy reasons.

**Q: The library says "Unknown" for many fields. What's wrong?**  
A: Check browser console for errors, ensure you're using a supported browser version, and verify that your server is sending proper Client Hints headers (see Server Configuration section).

### Usage & Development

**Q: Can I contribute to the project?**  
A: Yes! Contributions are welcome. Please check the GitHub repository for contribution guidelines.

**Q: How do I report a bug or request a feature?**  
A: Open an issue on the [GitHub repository](https://github.com/lacvietanh/akiInfoDetect.js/issues) with details about the bug or feature request.

**Q: Is there a demo I can try?**  
A: Yes! Visit the [live demo](https://akiinfodetect-js.pages.dev/) to see the library in action.

## Features

- 🌐 **Browser Detection** — Name, version, rendering engine
- 💻 **OS Detection** — Windows, macOS, Linux, iOS, Android with version
- ⚙️ **Hardware Info** — CPU cores, RAM, GPU (with Apple Silicon detection)
- 🌍 **Network Info** — Public IP, ISP, country code (with caching)
- 📱 **Screen Info** — Resolution, pixel ratio, orientation
- 🔋 **Battery Status** — Charging state, level percentage
- 📍 **Geolocation** — Coordinates with user permission
- 🚀 **Modern APIs** — Uses Client Hints for deeper detection
- 📦 **Tree-shakeable** — Import only what you need
- 🎯 **Browser-only** — Optimized for browser environments

## Installation

### npm / yarn / pnpm

```bash
npm install aki-info-detect
```

### CDN

```html
<!-- ES Module -->
<script type="module">
  import akiInfoDetect from 'https://unpkg.com/aki-info-detect/dist/aki-info-detect.js';
  const info = await akiInfoDetect();
  console.log(info);
</script>

<!-- UMD (global variable) -->
<script src="https://unpkg.com/aki-info-detect/dist/aki-info-detect.umd.cjs"></script>
<script>
  akiInfoDetect().then(info => console.log(info));
</script>
```

---

## ⚠️ IMPORTANT: Server Headers Required

To enable **deep hardware detection** via [Client Hints API](https://developer.mozilla.org/en-US/docs/Web/API/User-Agent_Client_Hints_API), your server **must** send these HTTP headers:

```http
Accept-CH: Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List
```

### Example Configurations

<details>
<summary><strong>Express.js</strong></summary>

```javascript
app.use((req, res, next) => {
  res.setHeader('Accept-CH', 
    'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, ' +
    'Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List'
  );
  next();
});
```
</details>

<details>
<summary><strong>Nginx</strong></summary>

```nginx
add_header Accept-CH "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List";
```
</details>

<details>
<summary><strong>Vite</strong></summary>

```javascript
// vite.config.js
export default {
  server: {
    headers: {
      'Accept-CH': 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List'
    }
  }
};
```
</details>

<details>
<summary><strong>Vercel (vercel.json)</strong></summary>

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Accept-CH",
          "value": "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List"
        }
      ]
    }
  ]
}
```
</details>

<details>
<summary><strong>Netlify (_headers)</strong></summary>

```
/*
  Accept-CH: Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Model, Sec-CH-UA-Full-Version-List
```
</details>

---

## Quick Start

```javascript
import akiInfoDetect from 'aki-info-detect';

const info = await akiInfoDetect();

console.log(info.browser);    // "Chrome 120"
console.log(info.os.string);  // "macOS 14.2.0"
console.log(info.CPU);        // "Apple Silicon"
console.log(info.GPU);        // "Apple M2 Pro"
console.log(info.RAM);        // 16
console.log(info.isMobile);   // false
```

## API Reference

### `akiInfoDetect(forceNetworkRefresh?: boolean): Promise<AkiInfoResult>`

Main detection function. Returns a Promise with complete system information.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `forceNetworkRefresh` | `boolean` | `false` | Bypass network info cache |

### Result Object

```typescript
interface AkiInfoResult {
  // Basic
  browser: string;        // "Chrome 120", "Safari 17", "Firefox 121"
  product: string;        // "iPhone", "Galaxy S21", ""
  manufacturer: string;   // "Apple", "Samsung", ""
  isMobile: boolean;
  language: string;       // "en vi zh" (space-separated 2-char codes)

  // Hardware
  CPU: string;            // "Apple Silicon", "Intel", "AMD", "Unknown"
  CPUCore: number;        // 8, 10, 16, etc.
  arch: string;           // "arm64", "x86_64"
  RAM: number;            // GB (0 if unavailable)
  GPU: string;            // "Apple M2 Pro", "NVIDIA GeForce RTX 4090"

  // Battery
  battery: {
    isCharging: boolean;
    level: number;        // 0-100
    chargingTime: number;
    dischargingTime: number;
  };

  // OS
  os: {
    name: string;         // "win", "mac", "linux", "android", "ios"
    version: string;      // "11", "14.2.0", "14"
    string: string;       // "Windows 11", "macOS 14.2.0"
  };

  // Network (reactive getters - updated after fetch)
  network: {
    IP: string;
    ISP: string;
    country: string;      // ISO 3166-1 alpha-2 code
  };

  // Methods
  getIP(force?: boolean): Promise<string>;
  getISP(force?: boolean): Promise<string>;
  getCountry(force?: boolean): Promise<string>;
  getNetworkInfo(force?: boolean): Promise<NetworkInfo>;
  getLocation(options?: PositionOptions): Promise<GeolocationData | null>;
  getConnection(): ConnectionInfo | null;
  getScreen(): ScreenInfo;
}
```

### Individual Exports (Tree-shakeable)

```javascript
import { 
  getNetworkInfo, 
  getIP, 
  getScreen, 
  getBattery, 
  detectGPU 
} from 'aki-info-detect';

// Use only what you need
const screen = getScreen();
const gpu = detectGPU();
const network = await getNetworkInfo();
```

## Usage Examples

### Get Network Info

```javascript
const info = await akiInfoDetect();

// Network is fetched in background, access via methods:
const ip = await info.getIP();
const network = await info.getNetworkInfo();

console.log(network.IP);      // "203.113.xxx.xxx"
console.log(network.ISP);     // "Viettel Group"
console.log(network.country); // "VN"

// Force refresh (bypass 1-hour cache)
const fresh = await info.getNetworkInfo(true);
```

### Get Geolocation

```javascript
const info = await akiInfoDetect();
const location = await info.getLocation();

if (location) {
  console.log(`Lat: ${location.latitude}`);
  console.log(`Long: ${location.longitude}`);
  console.log(`Accuracy: ${location.accuracy}m`);
}
```

### Detect Apple Silicon

```javascript
const info = await akiInfoDetect();

// Future-proof: works with M1, M2, M3, M4... MX
if (info.CPU === 'Apple Silicon') {
  console.log(`Running on ${info.GPU}`); // "Apple M2 Pro"
}
```

### React Hook

```jsx
import { useState, useEffect } from 'react';
import akiInfoDetect from 'aki-info-detect';

function useSystemInfo() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    akiInfoDetect().then(setInfo);
  }, []);

  return info;
}

function App() {
  const info = useSystemInfo();
  
  if (!info) return <div>Loading...</div>;

  return (
    <div>
      <p>Browser: {info.browser}</p>
      <p>OS: {info.os.string}</p>
      <p>GPU: {info.GPU}</p>
    </div>
  );
}
```

### Vue 3 Composable

```javascript
import { ref, onMounted } from 'vue';
import akiInfoDetect from 'aki-info-detect';

export function useSystemInfo() {
  const info = ref(null);
  
  onMounted(async () => {
    info.value = await akiInfoDetect();
  });

  return { info };
}
```

## Development

```bash
# Install dependencies
npm install

# Start dev server (with Client Hints headers)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 89+ | Full Client Hints support |
| Edge | 89+ | Full Client Hints support |
| Opera | 75+ | Full Client Hints support |
| Firefox | 90+ | Limited Client Hints |
| Safari | 15+ | No Client Hints, fallback to UA |

## Changelog

### v2.0.0
- Complete rewrite with modular architecture
- Vite build system with ES/UMD outputs
- TypeScript declarations
- Client Hints API integration
- Future-proof Apple Silicon detection (M1→MX)
- Tree-shakeable exports
- 1-hour network info caching
- Removed SSR guards (browser-only library)

### v1.0.0
- Initial release

## License

MIT © [lacvietanh](https://github.com/lacvietanh)
