// Browser Fingerprinting for User Recognition
// Generates a unique identifier based on browser/device characteristics

export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  vendor: string;
  cookiesEnabled: boolean;
  doNotTrack: string | null;
}

export interface Fingerprint {
  hash: string;
  components: Record<string, any>;
  deviceInfo: DeviceInfo;
}

/**
 * Generate device fingerprint hash
 * Combines multiple browser/device characteristics
 */
export async function generateFingerprint(): Promise<Fingerprint> {
  const components: Record<string, any> = {};

  // User Agent
  components.userAgent = navigator.userAgent;

  // Screen Resolution
  components.screenResolution = `${screen.width}x${screen.height}`;
  components.colorDepth = screen.colorDepth;

  // Timezone
  components.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  components.timezoneOffset = new Date().getTimezoneOffset();

  // Language
  components.language = navigator.language;
  components.languages = navigator.languages?.join(',') || '';

  // Platform
  components.platform = navigator.platform;

  // Vendor
  components.vendor = navigator.vendor;

  // Cookies
  components.cookiesEnabled = navigator.cookieEnabled;

  // Do Not Track
  components.doNotTrack = navigator.doNotTrack || null;

  // Hardware Concurrency (CPU cores)
  components.hardwareConcurrency = navigator.hardwareConcurrency || 0;

  // Device Memory (if available)
  components.deviceMemory = (navigator as any).deviceMemory || null;

  // Canvas Fingerprint (unique rendering characteristics)
  components.canvas = await getCanvasFingerprint();

  // WebGL Fingerprint
  components.webgl = getWebGLFingerprint();

  // Audio Context Fingerprint
  components.audio = await getAudioFingerprint();

  // Fonts Detection (basic)
  components.fonts = detectFonts();

  // Touch Support
  components.touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Generate hash from all components
  const hash = await hashComponents(components);

  // Extract device info
  const deviceInfo = extractDeviceInfo();

  return {
    hash,
    components,
    deviceInfo
  };
}

/**
 * Canvas Fingerprinting
 * Different browsers/devices render canvas differently
 */
async function getCanvasFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    // Draw unique pattern
    canvas.width = 200;
    canvas.height = 50;

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);

    ctx.fillStyle = '#069';
    ctx.fillText('Biblical Man Hub', 2, 15);

    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Fingerprint Test', 4, 17);

    // Get image data
    const dataURL = canvas.toDataURL();

    // Hash it
    return simpleHash(dataURL);
  } catch (e) {
    return 'canvas-error';
  }
}

/**
 * WebGL Fingerprinting
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'no-webgl';

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return `${vendor}~${renderer}`;
  } catch (e) {
    return 'webgl-error';
  }
}

/**
 * Audio Context Fingerprinting
 */
async function getAudioFingerprint(): Promise<string> {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return 'no-audio';

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    const gainNode = context.createGain();
    const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

    gainNode.gain.value = 0; // Mute
    oscillator.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(0);

    return new Promise((resolve) => {
      scriptProcessor.onaudioprocess = function(event) {
        const output = event.outputBuffer.getChannelData(0);
        const hash = simpleHash(output.slice(0, 100).join(','));

        oscillator.stop();
        scriptProcessor.disconnect();
        gainNode.disconnect();
        analyser.disconnect();
        oscillator.disconnect();

        resolve(hash);
      };

      // Timeout fallback
      setTimeout(() => {
        oscillator.stop();
        resolve('audio-timeout');
      }, 1000);
    });
  } catch (e) {
    return 'audio-error';
  }
}

/**
 * Detect common fonts
 */
function detectFonts(): string {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New',
    'Georgia', 'Palatino', 'Garamond', 'Helvetica',
    'Comic Sans MS', 'Trebuchet MS', 'Impact'
  ];

  const detectedFonts: string[] = [];

  for (const font of testFonts) {
    if (isFontAvailable(font, baseFonts)) {
      detectedFonts.push(font);
    }
  }

  return detectedFonts.join(',');
}

function isFontAvailable(font: string, baseFonts: string[]): boolean {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  const text = 'mmmmmmmmmmlli';
  const baseWidths: Record<string, number> = {};

  // Measure base font widths
  for (const baseFont of baseFonts) {
    ctx.font = `72px ${baseFont}`;
    baseWidths[baseFont] = ctx.measureText(text).width;
  }

  // Test if custom font differs from base fonts
  for (const baseFont of baseFonts) {
    ctx.font = `72px '${font}', ${baseFont}`;
    const width = ctx.measureText(text).width;
    if (width !== baseWidths[baseFont]) {
      return true;
    }
  }

  return false;
}

/**
 * Extract device info from user agent
 */
function extractDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;

  // Browser detection
  let browser = 'Unknown';
  let browserVersion = '';

  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    browserVersion = ua.split('Edg/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Chrome/')) {
    browser = 'Chrome';
    browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    browserVersion = ua.split('Version/')[1]?.split(' ')[0] || '';
  }

  // OS detection
  let os = 'Unknown';
  let osVersion = '';

  if (ua.includes('Windows NT')) {
    os = 'Windows';
    const version = ua.split('Windows NT ')[1]?.split(';')[0];
    osVersion = version || '';
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS';
    osVersion = ua.split('Mac OS X ')[1]?.split(')')[0]?.replace(/_/g, '.') || '';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  } else if (ua.includes('Android')) {
    os = 'Android';
    osVersion = ua.split('Android ')[1]?.split(';')[0] || '';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    osVersion = ua.split('OS ')[1]?.split(' ')[0]?.replace(/_/g, '.') || '';
  }

  // Device type
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/mobile/i.test(ua) && !/tablet/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/i.test(ua)) {
    deviceType = 'tablet';
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    vendor: navigator.vendor,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || null
  };
}

/**
 * Hash all fingerprint components
 */
async function hashComponents(components: Record<string, any>): Promise<string> {
  const str = JSON.stringify(components);

  // Use SubtleCrypto if available (modern browsers)
  if (crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback to simple hash
      return simpleHash(str);
    }
  }

  return simpleHash(str);
}

/**
 * Simple hash function (fallback)
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Store fingerprint in localStorage for quick access
 */
export function storeFingerprintLocally(fingerprint: Fingerprint): void {
  try {
    localStorage.setItem('device_fingerprint', fingerprint.hash);
    localStorage.setItem('device_info', JSON.stringify(fingerprint.deviceInfo));
  } catch (e) {
    console.warn('Could not store fingerprint locally:', e);
  }
}

/**
 * Get locally stored fingerprint
 */
export function getStoredFingerprint(): string | null {
  try {
    return localStorage.getItem('device_fingerprint');
  } catch (e) {
    return null;
  }
}

/**
 * Get locally stored device info
 */
export function getStoredDeviceInfo(): DeviceInfo | null {
  try {
    const stored = localStorage.getItem('device_info');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}
