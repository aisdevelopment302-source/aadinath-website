/**
 * User Agent Parser Utility
 * Extracts browser, OS, and device information from user agent strings
 */

export interface ParsedUserAgent {
  browser: string; // e.g., "Chrome 120"
  os: string; // e.g., "Windows 11"
  deviceType: 'mobile' | 'tablet' | 'desktop';
  rawUserAgent: string;
}

/**
 * Parse user agent string and extract browser, OS, and device info
 * @param userAgent - Full user agent string
 * @returns Parsed user agent information
 */
export function parseUserAgent(userAgent: string): ParsedUserAgent {
  if (!userAgent) {
    return {
      browser: 'Unknown',
      os: 'Unknown',
      deviceType: 'desktop',
      rawUserAgent: userAgent || '',
    };
  }

  const ua = userAgent.toLowerCase();
  
  // Detect Browser
  let browser = 'Unknown';
  let browserVersion = '';

  if (ua.includes('edge/') || ua.includes('edg/')) {
    const match = ua.match(/edg[e]?\/([\d.]+)/);
    browserVersion = match ? match[1] : '';
    browser = `Edge ${browserVersion}`;
  } else if (ua.includes('chrome/') && !ua.includes('chromium')) {
    const match = ua.match(/chrome\/([\d.]+)/);
    browserVersion = match ? match[1].split('.')[0] : '';
    browser = `Chrome ${browserVersion}`;
  } else if (ua.includes('safari/') && !ua.includes('chrome')) {
    const match = ua.match(/version\/([\d.]+)/);
    browserVersion = match ? match[1].split('.')[0] : '';
    browser = `Safari ${browserVersion}`;
  } else if (ua.includes('firefox/')) {
    const match = ua.match(/firefox\/([\d.]+)/);
    browserVersion = match ? match[1].split('.')[0] : '';
    browser = `Firefox ${browserVersion}`;
  } else if (ua.includes('trident/') || ua.includes('msie ')) {
    const match = ua.match(/(?:msie |rv:)([\d.]+)/);
    browserVersion = match ? match[1].split('.')[0] : '';
    browser = `IE ${browserVersion}`;
  } else if (ua.includes('opera/') || ua.includes('opr/')) {
    const match = ua.match(/(?:opera|opr)\/([\d.]+)/);
    browserVersion = match ? match[1].split('.')[0] : '';
    browser = `Opera ${browserVersion}`;
  }

  // Detect OS
  let os = 'Unknown';

  if (ua.includes('windows nt 10.0')) {
    os = 'Windows 10';
  } else if (ua.includes('windows nt 6.3')) {
    os = 'Windows 8.1';
  } else if (ua.includes('windows nt 6.2')) {
    os = 'Windows 8';
  } else if (ua.includes('windows nt 6.1')) {
    os = 'Windows 7';
  } else if (ua.includes('windows nt 6.0')) {
    os = 'Windows Vista';
  } else if (ua.includes('windows nt 5.1') || ua.includes('windows nt 5.2')) {
    os = 'Windows XP';
  } else if (ua.includes('windows')) {
    // Windows 11+ detection
    if (ua.includes('windows nt') && ua.match(/windows nt ([\d.]+)/)) {
      const version = ua.match(/windows nt ([\d.]+)/);
      const versionNum = version ? parseFloat(version[1]) : 0;
      if (versionNum >= 10) {
        os = 'Windows 11+';
      } else {
        os = 'Windows';
      }
    }
  } else if (ua.includes('mac os x')) {
    const match = ua.match(/mac os x ([\d_]+)/);
    if (match) {
      const version = match[1].replace(/_/g, '.');
      os = `macOS ${version}`;
    } else {
      os = 'macOS';
    }
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    const match = ua.match(/os ([\d_]+)/);
    if (match) {
      const version = match[1].replace(/_/g, '.');
      os = `iOS ${version}`;
    } else {
      os = 'iOS';
    }
  } else if (ua.includes('android')) {
    const match = ua.match(/android ([\d.]+)/);
    if (match) {
      os = `Android ${match[1]}`;
    } else {
      os = 'Android';
    }
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('x11')) {
    os = 'Unix';
  }

  // Detect Device Type
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  const mobileKeywords = [
    'mobile',
    'android',
    'iphone',
    'ipod',
    'windows phone',
    'blackberry',
    'nokia',
  ];
  
  const tabletKeywords = [
    'ipad',
    'tablet',
    'playbook',
    'kindle',
    'nexus 7',
    'nexus 10',
  ];

  if (mobileKeywords.some(keyword => ua.includes(keyword))) {
    deviceType = 'mobile';
  } else if (tabletKeywords.some(keyword => ua.includes(keyword))) {
    deviceType = 'tablet';
  }

  return {
    browser,
    os,
    deviceType,
    rawUserAgent: userAgent,
  };
}

/**
 * Get simplified user agent string for display in table
 * @param userAgent - Full user agent string
 * @returns Simplified string like "Chrome/Windows" or "Safari/macOS"
 */
export function getSimplifiedUserAgent(userAgent: string): string {
  const parsed = parseUserAgent(userAgent);
  const browserName = parsed.browser.split(' ')[0]; // Get first word (e.g., "Chrome" from "Chrome 120")
  const osName = parsed.os.split(' ')[0]; // Get first word (e.g., "Windows" from "Windows 11")
  return `${browserName}/${osName}`;
}
