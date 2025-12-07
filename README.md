# aki-info-detect

A lightweight JavaScript library for detecting device, browser, hardware, and network information in the browser.

[![npm version](https://img.shields.io/npm/v/aki-info-detect.svg)](https://www.npmjs.com/package/aki-info-detect)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/aki-info-detect)](https://bundlephobia.com/package/aki-info-detect)

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
