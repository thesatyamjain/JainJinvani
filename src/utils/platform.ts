/**
 * Unified Platform & Execution Environment Detector for Jain Jinvani
 * Distinguishes precisely between:
 *  1. 'website' - Regular browser tab (Chrome, Safari, Firefox, Edge)
 *  2. 'webapp'  - Installed PWA / WebAPK running in standalone display-mode
 *  3. 'app'     - Native mobile app wrapper (APK / Samsung Galaxy Store / TWA / WebView)
 */

export type AppPlatform = 'website' | 'webapp' | 'app';

/**
 * Check if running inside the native Android/Samsung APK wrapper
 */
export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    (window as any).JinvaniNative !== undefined ||
    (window as any).AndroidBridge !== undefined ||
    navigator.userAgent.includes('JainJinvaniApp') ||
    document.referrer.includes('android-app://com.jainjinvani')
  );
}

/**
 * Check if running as an installed PWA / WebAPK in standalone window
 */
export function isPwaWebApp(): boolean {
  if (typeof window === 'undefined') return false;
  // If native app wrapper, that takes precedence over generic standalone
  if (isNativeApp()) return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if running inside a standard web browser tab
 */
export function isWebsite(): boolean {
  return !isNativeApp() && !isPwaWebApp();
}

/**
 * Get current platform mode
 */
export function getAppPlatform(): AppPlatform {
  if (isNativeApp()) return 'app';
  if (isPwaWebApp()) return 'webapp';
  return 'website';
}

/**
 * Device Operating System detection
 */
export function getDeviceOs(): 'ios' | 'android' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'ios';
  }
  if (/Android/i.test(ua)) {
    return 'android';
  }
  if (/Win|Mac|Linux/i.test(navigator.platform)) {
    return 'desktop';
  }
  return 'unknown';
}
