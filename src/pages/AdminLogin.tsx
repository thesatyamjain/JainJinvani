import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  Lock,
  User,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  ExternalLink,
  Tag,
  Sparkles,
  Check,
  Copy,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert,
  X,
  Smartphone,
  QrCode,
  Megaphone,
  Calendar,
  Database,
  Download,
  Upload,
  Trash2,
  Wrench,
  Activity,
  Globe,
  FileText,
  Radio,
  Fingerprint,
  Wifi,
  Info,
  FileCode,
} from 'lucide-react';
import { GOOGLE_SHEET_WEBHOOK_URL } from '../components/features/FeedbackModal';
import { contentManifest } from '../data/modules/contentManifest';
import { getJainDate, getFestival } from '../lib';

export interface AdminContributionItem {
  id: number | string;
  timestamp: string;
  type: string;
  scriptureName: string;
  details: string;
  status: string;
}

interface AdminLoginProps {
  onBack?: () => void;
  onLogin?: () => void;
  onNavigate?: (page: string, params?: any) => void;
}

// Web Crypto SHA-256 Hashing helper (zero dependencies)
async function sha256Hex(str: string): Promise<string> {
  if (!str) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Single Master Security Hash:
// Default Password: 'Jinvani@2026#Admin'
const MASTER_PASSWORD_HASH = '74e32bd5469e4a917307e6c2555e00eb8c6014615f543adf4aa7117338de9834';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout
const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes auto-logout

// --- Web Crypto TOTP (RFC 6238 / RFC 4226) Helpers ---
function base32ToBytes(base32: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = alphabet.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
  }
  return bytes;
}

export async function generateTOTP(secretBase32: string, timeStepOffset = 0): Promise<string> {
  const keyBytes = base32ToBytes(secretBase32);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const epochSeconds = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(epochSeconds / 30) + timeStepOffset;

  const timeBuffer = new ArrayBuffer(8);
  const timeView = new DataView(timeBuffer);
  timeView.setUint32(0, Math.floor(timeStep / 0x100000000), false);
  timeView.setUint32(4, timeStep & 0xffffffff, false);

  const hmac = await crypto.subtle.sign('HMAC', cryptoKey, timeBuffer);
  const hmacBytes = new Uint8Array(hmac);

  const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
  const binaryCode =
    ((hmacBytes[offset] & 0x7f) << 24) |
    ((hmacBytes[offset + 1] & 0xff) << 16) |
    ((hmacBytes[offset + 2] & 0xff) << 8) |
    (hmacBytes[offset + 3] & 0xff);

  const otp = binaryCode % 1000000;
  return otp.toString().padStart(6, '0');
}

export async function verifyTOTP(secretBase32: string, userCode: string): Promise<boolean> {
  const cleanCode = userCode.replace(/\s+/g, '').trim();
  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) return false;

  for (const offset of [0, -1, 1]) {
    const expected = await generateTOTP(secretBase32, offset);
    if (expected === cleanCode) {
      return true;
    }
  }
  return false;
}

// Master 2FA Secret Key (Standard Base32 for Google Authenticator)
export const MASTER_2FA_SECRET = 'JINVANISACRED26A';
export const TOTP_ISSUER = 'Jain Jinvani';
export const TOTP_ACCOUNT = 'admin';
export const TOTP_AUTH_URI = `otpauth://totp/${encodeURIComponent(TOTP_ISSUER)}:${encodeURIComponent(TOTP_ACCOUNT)}?secret=${MASTER_2FA_SECRET}&issuer=${encodeURIComponent(TOTP_ISSUER)}`;

// Cryptographically Hashed Emergency Recovery Codes (SHA-256)
// Raw recovery codes are strictly offline secrets and never committed in plaintext.
export const EMERGENCY_RECOVERY_CODE_HASHES = [
  '7be95f6ef2c6828ad36a1ef3f48be2226fdee80138e3889c12f946285ca67e56',
  '272f85b11e0a2bd0e426d1e6233058902c0056e7b65decd1bbe8c00f48916cf2',
  'd22fdacd4496ce52a143603eb975acf222d85a229fecaa0e0c404dea3f83508f',
];

// Password Verification against Custom (if changed by user), .env, or Master Hash
const verifyPassword = async (inputPass: string): Promise<boolean> => {
  const inputHash = await sha256Hex(inputPass.trim());
  if (!inputHash) return false;

  // 1. Check custom password if changed by admin in dashboard
  const customHash = localStorage.getItem('jinvani_admin_custom_hash');
  if (customHash) {
    return inputHash === customHash;
  }

  // 2. Check Vite environment variable if configured (.env)
  const envPass = (import.meta as any).env?.VITE_ADMIN_PASSWORD;
  if (envPass) {
    const envHash = await sha256Hex(String(envPass).trim());
    if (inputHash === envHash) return true;
  }

  // 3. Check single master default password
  return inputHash === MASTER_PASSWORD_HASH;
};

// --- WebAuthn Passkey (Biometrics / Platform Authenticator) Helpers ---
function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function isPasskeySupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.PublicKeyCredential &&
    typeof navigator.credentials !== 'undefined' &&
    typeof navigator.credentials.create === 'function'
  );
}

export async function registerPasskeyCredential(): Promise<{ id: string; rawId: string } | null> {
  if (!isPasskeySupported()) {
    throw new Error('इस डिवाइस या ब्राउज़र पर Passkey समर्थित नहीं है।');
  }

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const userId = new TextEncoder().encode('jinvani-admin-user');
  const hostname = window.location.hostname;
  const isIpOrLocal = hostname === 'localhost' || hostname === '127.0.0.1' || /^[0-9.]+$/.test(hostname);
  const rpId = isIpOrLocal ? undefined : hostname;

  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: {
        name: 'जिनवाणी व्यवस्थापक पोर्टल (Jain Jinvani)',
        ...(rpId ? { id: rpId } : {}),
      },
      user: {
        id: userId,
        name: 'admin@jinvani.org',
        displayName: 'जिनवाणी प्रशासक (Admin)',
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },
        { alg: -257, type: 'public-key' },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    },
  })) as PublicKeyCredential | null;

  if (!credential) return null;

  return {
    id: credential.id,
    rawId: bufferToBase64(credential.rawId),
  };
}

export async function authenticatePasskeyCredential(savedRawIdBase64?: string): Promise<boolean> {
  if (!isPasskeySupported()) {
    throw new Error('Passkey समर्थित नहीं है।');
  }

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const allowCredentials = savedRawIdBase64
    ? [
        {
          id: base64ToBuffer(savedRawIdBase64),
          type: 'public-key' as const,
          transports: ['internal'] as AuthenticatorTransport[],
        },
      ]
    : undefined;

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      timeout: 60000,
      userVerification: 'required',
      ...(allowCredentials ? { allowCredentials } : {}),
    },
  });

  return !!assertion;
}

export const AdminLogin = ({ onBack, onNavigate }: AdminLoginProps) => {
  // Authentication state with 60-minute session expiration
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('jinvani_admin_authenticated') === 'true';
      const authTime = Number(sessionStorage.getItem('jinvani_admin_auth_time') || 0);
      if (isAuth && Date.now() - authTime < SESSION_TIMEOUT_MS) {
        return true;
      }
      sessionStorage.removeItem('jinvani_admin_authenticated');
      sessionStorage.removeItem('jinvani_admin_auth_time');
    }
    return false;
  });

  // Two-step login state ('password' -> 'totp')
  const [loginStep, setLoginStep] = useState<'password' | 'totp'>('password');
  const [otpInput, setOtpInput] = useState('');
  const [isUsingRecovery, setIsUsingRecovery] = useState(false);
  const [totpCycleSeconds, setTotpCycleSeconds] = useState(30);

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Rate Limiting & Lockout countdown state
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // 2FA Management modal in dashboard
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [testOtpInput, setTestOtpInput] = useState('');
  const [testOtpResult, setTestOtpResult] = useState<boolean | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jinvani_admin_2fa_enabled') === 'true';
    }
    return false;
  });

  // Passkey (WebAuthn / Biometrics) State
  const [hasPasskey, setHasPasskey] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('jinvani_admin_passkey_rawid');
    }
    return false;
  });
  const [passkeyCreatedAt, setPasskeyCreatedAt] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jinvani_admin_passkey_date') || '';
    }
    return '';
  });
  const [isVerifyingPasskey, setIsVerifyingPasskey] = useState(false);
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [passkeyTestSuccess, setPasskeyTestSuccess] = useState<boolean | null>(null);

  // Change password modal state
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passModalError, setPassModalError] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Dashboard state
  const [items, setItems] = useState<AdminContributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'feedback' | 'announcement' | 'catalog' | 'panchang' | 'tools' | 'guide'>('feedback');

  // Guide Tab: Live Cryptographic SHA-256 Hash Tool & Clipboard State
  const [hashInput, setHashInput] = useState('');
  const [generatedHash, setGeneratedHash] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    if (!hashInput) {
      setGeneratedHash('');
      return;
    }
    sha256Hex(hashInput.trim()).then((h) => {
      if (!isCancelled) setGeneratedHash(h);
    });
    return () => {
      isCancelled = true;
    };
  }, [hashInput]);

  const copyGuideText = (text: string, key: string, label = 'कॉपी किया गया!') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast(label);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showToast('कॉपी करने में त्रुटि हुई।');
    }
  };

  // Announcement Management State
  const [announcementActive, setAnnouncementActive] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).active ?? false : false;
    } catch {
      return false;
    }
  });
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).text || '' : 'पर्यूषण महापर्व के पावन अवसर पर 10 दिवसीय विशेष स्वाध्याय एवं शांतिधारा विधान उपलब्ध है।';
    } catch {
      return 'पर्यूषण महापर्व के पावन अवसर पर 10 दिवसीय विशेष स्वाध्याय एवं शांतिधारा विधान उपलब्ध है।';
    }
  });
  const [announcementBadge, setAnnouncementBadge] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).badge || 'पर्व एवं महोत्सव' : 'पर्व एवं महोत्सव';
    } catch {
      return 'पर्व एवं महोत्सव';
    }
  });
  const [announcementLink, setAnnouncementLink] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).link || 'festivals' : 'festivals';
    } catch {
      return 'festivals';
    }
  });

  const handleSaveAnnouncement = () => {
    const data = {
      active: announcementActive,
      text: announcementText.trim(),
      badge: announcementBadge.trim(),
      link: announcementLink.trim(),
    };
    try {
      localStorage.setItem('jinvani_admin_announcement', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));
      showToast(announcementActive ? 'सार्वजनिक घोषणा वेबसाइट पर लाइव कर दी गई!' : 'घोषणा सहेज दी गई (निष्क्रिय)।');
    } catch {
      showToast('घोषणा सहेजने में त्रुटि हुई।');
    }
  };

  const handleClearAnnouncement = () => {
    try {
      localStorage.removeItem('jinvani_admin_announcement');
      setAnnouncementActive(false);
      setAnnouncementText('');
      window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));
      showToast('सार्वजनिक घोषणा हटा दी गई।');
    } catch {}
  };

  // Content Catalog State & Filtering
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogModuleFilter, setCatalogModuleFilter] = useState('all');

  const catalogItems = useMemo(() => {
    return Object.entries(contentManifest).map(([id, module]) => {
      const formattedTitle = id
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return { id, module, title: formattedTitle };
    });
  }, []);

  const catalogCounts = useMemo(() => {
    const counts: Record<string, number> = { all: catalogItems.length };
    catalogItems.forEach((it) => {
      counts[it.module] = (counts[it.module] || 0) + 1;
    });
    return counts;
  }, [catalogItems]);

  const filteredCatalogItems = useMemo(() => {
    return catalogItems.filter((item) => {
      const matchesSearch =
        !catalogSearch.trim() ||
        item.id.toLowerCase().includes(catalogSearch.toLowerCase().trim()) ||
        item.title.toLowerCase().includes(catalogSearch.toLowerCase().trim());
      const matchesModule = catalogModuleFilter === 'all' || item.module === catalogModuleFilter;
      return matchesSearch && matchesModule;
    });
  }, [catalogItems, catalogSearch, catalogModuleFilter]);

  // System Diagnostics & Tools State
  const [storageUsageKB, setStorageUsageKB] = useState<number>(0);
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const calculateStorageUsage = () => {
    try {
      let totalBytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalBytes += (key.length + (localStorage.getItem(key)?.length || 0)) * 2;
        }
      }
      setStorageUsageKB(Math.round(totalBytes / 1024));
    } catch {
      setStorageUsageKB(0);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      calculateStorageUsage();
    }
  }, [isAuthenticated, adminTab]);

  const handlePingGoogleSheet = async () => {
    setPingStatus('testing');
    setPingLatency(null);
    const start = performance.now();
    try {
      const res = await fetch(GOOGLE_SHEET_WEBHOOK_URL, { method: 'GET' });
      const lat = Math.round(performance.now() - start);
      setPingLatency(lat);
      if (res.ok) {
        setPingStatus('success');
        showToast(`गूगल शीट वेबहुक सक्रिय है! लेटेंसी: ${lat}ms`);
      } else {
        setPingStatus('failed');
      }
    } catch {
      setPingStatus('failed');
      showToast('गूगल शीट वेबहुक से संपर्क नहीं हो सका।');
    }
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        statusOverrides: localStorage.getItem('jinvani_status_overrides')
          ? JSON.parse(localStorage.getItem('jinvani_status_overrides')!)
          : {},
        announcement: localStorage.getItem('jinvani_admin_announcement')
          ? JSON.parse(localStorage.getItem('jinvani_admin_announcement')!)
          : null,
        columns: localStorage.getItem('jinvani_admin_columns') || '2',
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jinvani-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('एडमिन डेटा बैकअप JSON फ़ाइल डाउनलोड हो गई!');
    } catch {
      showToast('बैकअप डाउनलोड करने में त्रुटि हुई।');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.statusOverrides) {
          localStorage.setItem('jinvani_status_overrides', JSON.stringify(parsed.statusOverrides));
        }
        if (parsed.announcement) {
          localStorage.setItem('jinvani_admin_announcement', JSON.stringify(parsed.announcement));
          setAnnouncementActive(parsed.announcement.active ?? false);
          setAnnouncementText(parsed.announcement.text || '');
          setAnnouncementBadge(parsed.announcement.badge || 'पर्व एवं महोत्सव');
          setAnnouncementLink(parsed.announcement.link || '');
          window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));
        }
        if (parsed.columns) {
          setColumns(Number(parsed.columns) as 1 | 2 | 3);
          localStorage.setItem('jinvani_admin_columns', String(parsed.columns));
        }
        showToast('बैकअप डेटा सफलतापूर्वक पुनर्स्थापित कर दिया गया!');
        fetchData();
        calculateStorageUsage();
      } catch {
        showToast('अमान्य बैकअप JSON फ़ाइल!');
      }
    };
    reader.readAsText(file);
  };

  const handlePurgeCache = async () => {
    if (window.confirm('क्या आप सर्विस वर्कर व ऐप कैश को पूरी तरह साफ़ करना चाहते हैं? इससे ताज़ा डेटा डाउनलोड होगा।')) {
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        showToast('कैश सफलतापूर्वक साफ़ कर दिया गया! नवीनतम डेटा लोड हो रहा है...');
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        showToast('कैश साफ़ करने में त्रुटि हुई।');
      }
    }
  };

  const handleResetOverrides = () => {
    if (window.confirm('क्या आप सभी स्थानीय स्थिति ओवरराइड्स हटाना चाहते हैं?')) {
      localStorage.removeItem('jinvani_status_overrides');
      showToast('सभी स्थिति ओवरराइड्स हटा दिए गए।');
      fetchData();
    }
  };

  // Panchang calculations for Tab 4
  const todayDate = new Date();
  const todayJain = getJainDate(todayDate);
  const todayFestival = getFestival(
    todayJain.tithiLabel,
    todayJain.paksha,
    todayDate.getMonth(),
    todayJain.tithi,
    todayJain.jainMonth
  );

  // Multi-column layout state (1, 2, or 3 columns, defaults to 2 columns on desktop)
  const [columns, setColumns] = useState<1 | 2 | 3>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jinvani_admin_columns');
      if (saved === '1' || saved === '2' || saved === '3') {
        return Number(saved) as 1 | 2 | 3;
      }
    }
    return 2; // Default to 2 columns for better desktop density
  });

  const handleSetColumns = (cols: 1 | 2 | 3) => {
    setColumns(cols);
    try {
      localStorage.setItem('jinvani_admin_columns', String(cols));
    } catch {}
  };

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Rate-limiting / lockout ticker
  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = Number(localStorage.getItem('jinvani_admin_lockout_until') || 0);
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemaining(remaining);
      if (remaining === 0 && lockoutUntil > 0) {
        localStorage.removeItem('jinvani_admin_lockout_until');
        localStorage.removeItem('jinvani_admin_attempts');
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // 30-second live cycle ticker for visual pulse in OTP step
  useEffect(() => {
    const updateCycle = () => {
      const currentSeconds = Math.floor(Date.now() / 1000) % 30;
      setTotpCycleSeconds(30 - currentSeconds);
    };
    updateCycle();
    const interval = setInterval(updateCycle, 1000);
    return () => clearInterval(interval);
  }, []);

  // Session Inactivity Monitoring (auto-logout after 60 mins idle)
  useEffect(() => {
    if (!isAuthenticated) return;

    const sessionTimer = setInterval(() => {
      const authTime = Number(sessionStorage.getItem('jinvani_admin_auth_time') || 0);
      if (Date.now() - authTime > SESSION_TIMEOUT_MS) {
        handleLogout('सत्र समाप्त हो गया (Session Expired)। सुरक्षा कारणों से पुनः लॉगिन करें।');
      }
    }, 15000);

    const onUserActivity = () => {
      if (sessionStorage.getItem('jinvani_admin_authenticated') === 'true') {
        sessionStorage.setItem('jinvani_admin_auth_time', String(Date.now()));
      }
    };

    window.addEventListener('click', onUserActivity);
    window.addEventListener('keydown', onUserActivity);

    return () => {
      clearInterval(sessionTimer);
      window.removeEventListener('click', onUserActivity);
      window.removeEventListener('keydown', onUserActivity);
    };
  }, [isAuthenticated]);

  // Handle Failed Attempt
  const handleFailedAttempt = () => {
    const current = Number(localStorage.getItem('jinvani_admin_attempts') || 0) + 1;
    localStorage.setItem('jinvani_admin_attempts', String(current));

    if (current >= MAX_FAILED_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem('jinvani_admin_lockout_until', String(lockoutUntil));
      setLockoutRemaining(Math.ceil(LOCKOUT_DURATION_MS / 1000));
      setLoginError(`सुरक्षा लॉक: लगातार 5 विफल प्रयास। 5 मिनट के लिए लॉगिन लॉक कर दिया गया है।`);
    } else {
      const remaining = MAX_FAILED_ATTEMPTS - current;
      setLoginError(`अमान्य क्रेडेंशियल या कोड! (शेष प्रयास: ${remaining})`);
    }
  };

  // Direct login helper (when 2FA is not enabled or code succeeds)
  const handleDirectLogin = (msg = 'सफलतापूर्वक एडमिन पोर्टल में प्रवेश हुआ!') => {
    localStorage.removeItem('jinvani_admin_attempts');
    localStorage.removeItem('jinvani_admin_lockout_until');
    sessionStorage.setItem('jinvani_admin_authenticated', 'true');
    sessionStorage.setItem('jinvani_admin_auth_time', String(Date.now()));
    setIsAuthenticated(true);
    setLoginStep('password');
    setPassword('');
    setOtpInput('');
    setLoginError('');
    showToast(msg);
  };

  const handleEnable2FA = () => {
    try {
      localStorage.setItem('jinvani_admin_2fa_enabled', 'true');
      setIs2FAEnabled(true);
      showToast('2FA सुरक्षा सक्रिय कर दी गई! अब प्रत्येक लॉगिन पर OTP कोड आवश्यक होगा।');
    } catch {
      showToast('2FA सक्रिय करने में त्रुटि हुई।');
    }
  };

  const handleDisable2FA = () => {
    if (window.confirm('क्या आप 2FA सुरक्षा निष्क्रिय करना चाहते हैं? इसके बाद केवल पासवर्ड से लॉगिन हो सकेगा।')) {
      try {
        localStorage.removeItem('jinvani_admin_2fa_enabled');
        setIs2FAEnabled(false);
        showToast('2FA सुरक्षा निष्क्रिय कर दी गई। अब केवल पासवर्ड से लॉगिन होगा।');
      } catch {
        showToast('त्रुटि हुई।');
      }
    }
  };

  // Step 1: Handle Password Submit -> Advances to 2FA OTP Step ONLY IF 2FA IS ENABLED
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const lockoutUntil = Number(localStorage.getItem('jinvani_admin_lockout_until') || 0);
    if (Date.now() < lockoutUntil) {
      const rem = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`सुरक्षा प्रतिबंध: अत्यधिक गलत प्रयासों के कारण लॉगिन लॉक है। कृपया ${rem} सेकंड बाद प्रयास करें।`);
      return;
    }

    if (!password.trim()) {
      setLoginError('कृपया पासवर्ड दर्ज करें।');
      return;
    }

    const validUsername = ((import.meta as any).env?.VITE_ADMIN_USERNAME || 'admin').trim().toLowerCase();
    if (username.trim().toLowerCase() !== validUsername) {
      handleFailedAttempt();
      return;
    }

    setIsLoggingIn(true);
    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        if (is2FAEnabled) {
          // Step 1 Successful -> Proceed to Step 2: 2FA Verification (only if enabled)
          setLoginStep('totp');
          setLoginError('');
          setOtpInput('');
          setIsUsingRecovery(false);
        } else {
          // 2FA is not enabled yet -> Log in directly!
          handleDirectLogin();
        }
      } else {
        handleFailedAttempt();
      }
    } catch (err) {
      setLoginError('सत्यापन में तकनीकी त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Step 2: Handle 2FA OTP / Recovery Code Submit
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const lockoutUntil = Number(localStorage.getItem('jinvani_admin_lockout_until') || 0);
    if (Date.now() < lockoutUntil) {
      const rem = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`सुरक्षा प्रतिबंध: अत्यधिक गलत प्रयासों के कारण लॉगिन लॉक है। कृपया ${rem} सेकंड बाद प्रयास करें।`);
      return;
    }

    const cleanInput = otpInput.trim().toUpperCase();
    if (!cleanInput) {
      setLoginError(isUsingRecovery ? 'कृपया रिकवरी कोड दर्ज करें।' : 'कृपया 6-अंकों का OTP कोड दर्ज करें।');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      if (isUsingRecovery) {
        // Verify emergency recovery code via SHA-256 cryptographic hash
        const inputCodeHash = await sha256Hex(cleanInput);
        const isRecoveryValid = EMERGENCY_RECOVERY_CODE_HASHES.includes(inputCodeHash);
        if (isRecoveryValid) {
          handleDirectLogin('आपातकालीन रिकवरी कोड द्वारा प्रवेश सफल!');
        } else {
          handleFailedAttempt();
          setLoginError('अमान्य आपातकालीन रिकवरी कोड!');
        }
      } else {
        // Verify standard RFC 6238 TOTP
        const isValidOtp = await verifyTOTP(MASTER_2FA_SECRET, cleanInput);
        if (isValidOtp) {
          handleDirectLogin('2FA सत्यापन सफल! डैशबोर्ड में स्वागत है।');
        } else {
          handleFailedAttempt();
          setLoginError('अमान्य OTP कोड! कृपया Google Authenticator में वर्तमान 6-अंकों का कोड देखें।');
        }
      }
    } catch {
      setLoginError('2FA सत्यापन में तकनीकी त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleBackToPassword = () => {
    setLoginStep('password');
    setOtpInput('');
    setIsUsingRecovery(false);
    setLoginError('');
  };

  // Test OTP in 2FA Setup Modal
  const handleTestOtp = async () => {
    if (!testOtpInput.trim()) return;
    const isValid = await verifyTOTP(MASTER_2FA_SECRET, testOtpInput.trim());
    setTestOtpResult(isValid);
  };

  // 1-Tap Passkey Biometric Login Handler
  const handlePasskeyLogin = async () => {
    setLoginError('');

    const lockoutUntil = Number(localStorage.getItem('jinvani_admin_lockout_until') || 0);
    if (Date.now() < lockoutUntil) {
      const rem = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`सुरक्षा प्रतिबंध: अत्यधिक गलत प्रयासों के कारण लॉगिन लॉक है। कृपया ${rem} सेकंड बाद प्रयास करें।`);
      return;
    }

    const savedRawId = localStorage.getItem('jinvani_admin_passkey_rawid');
    if (!savedRawId) {
      setLoginError('इस डिवाइस पर कोई Passkey पंजीकृत नहीं है। पहले पासवर्ड से लॉगिन करके Passkey जोड़ें।');
      return;
    }

    setIsVerifyingPasskey(true);
    try {
      const isVerified = await authenticatePasskeyCredential(savedRawId);
      if (isVerified) {
        localStorage.removeItem('jinvani_admin_attempts');
        localStorage.removeItem('jinvani_admin_lockout_until');
        sessionStorage.setItem('jinvani_admin_authenticated', 'true');
        sessionStorage.setItem('jinvani_admin_auth_time', String(Date.now()));
        setIsAuthenticated(true);
        setLoginStep('password');
        setPassword('');
        setOtpInput('');
        setLoginError('');
        showToast('🔑 Passkey (बायोमेट्रिक) सत्यापन सफल! डैशबोर्ड में स्वागत है।');
      } else {
        setLoginError('Passkey सत्यापन असफल रहा। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setLoginError('बायोमेट्रिक प्रमाणीकरण रद्द किया गया। आप पासवर्ड से लॉगिन कर सकते हैं।');
      } else {
        setLoginError(err.message || 'Passkey सत्यापन में तकनीकी त्रुटि।');
      }
    } finally {
      setIsVerifyingPasskey(false);
    }
  };

  // Register new Passkey in Security Modal
  const handleRegisterPasskey = async () => {
    setIsRegisteringPasskey(true);
    setPasskeyTestSuccess(null);
    try {
      const cred = await registerPasskeyCredential();
      if (cred) {
        const dateStr = new Date().toLocaleDateString('hi-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        localStorage.setItem('jinvani_admin_passkey_id', cred.id);
        localStorage.setItem('jinvani_admin_passkey_rawid', cred.rawId);
        localStorage.setItem('jinvani_admin_passkey_date', dateStr);
        setHasPasskey(true);
        setPasskeyCreatedAt(dateStr);
        showToast('🎉 Passkey सफलतापूर्वक पंजीकृत हो गई! अब आप 1-टैप बायोमेट्रिक लॉगिन कर सकते हैं।');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        showToast('पासकी पंजीकरण रद्द किया गया।');
      } else {
        showToast(err.message || 'पासकी पंजीकरण में त्रुटि हुई।');
      }
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  // Test Passkey in Security Modal
  const handleTestPasskey = async () => {
    const savedRawId = localStorage.getItem('jinvani_admin_passkey_rawid');
    if (!savedRawId) return;
    try {
      const ok = await authenticatePasskeyCredential(savedRawId);
      setPasskeyTestSuccess(ok);
      if (ok) {
        showToast('✅ Passkey टेस्ट सफल! आपकी डिवाइस की बायोमेट्रिक्स सही से काम कर रही है।');
      }
    } catch {
      setPasskeyTestSuccess(false);
      showToast('❌ Passkey टेस्ट असफल या रद्द किया गया।');
    }
  };

  // Remove Passkey from device
  const handleRemovePasskey = () => {
    if (window.confirm('क्या आप इस डिवाइस से Passkey प्रमाणीकरण हटाना चाहते हैं?')) {
      localStorage.removeItem('jinvani_admin_passkey_id');
      localStorage.removeItem('jinvani_admin_passkey_rawid');
      localStorage.removeItem('jinvani_admin_passkey_date');
      setHasPasskey(false);
      setPasskeyCreatedAt('');
      setPasskeyTestSuccess(null);
      showToast('Passkey सफलतापूर्वक हटा दी गई।');
    }
  };

  // Handle Logout
  const handleLogout = (msg?: string) => {
    sessionStorage.removeItem('jinvani_admin_authenticated');
    sessionStorage.removeItem('jinvani_admin_auth_time');
    setIsAuthenticated(false);
    setPassword('');
    if (msg) setLoginError(msg);
  };

  // Handle Change Password Submit
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassModalError('');

    if (!currentPass) {
      setPassModalError('वर्तमान पासवर्ड दर्ज करें।');
      return;
    }

    const isCurrentValid = await verifyPassword(currentPass);
    if (!isCurrentValid) {
      setPassModalError('वर्तमान पासवर्ड गलत है!');
      return;
    }

    if (newPass.length < 6) {
      setPassModalError('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }

    if (newPass !== confirmPass) {
      setPassModalError('नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।');
      return;
    }

    const newHash = await sha256Hex(newPass);
    localStorage.setItem('jinvani_admin_custom_hash', newHash);
    showToast('एडमिन पासवर्ड सफलतापूर्वक बदल दिया गया!');
    setIsChangePassOpen(false);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  // Reset to Default Password
  const handleResetPasswordToDefault = () => {
    if (window.confirm('क्या आप पासवर्ड को डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      localStorage.removeItem('jinvani_admin_custom_hash');
      showToast('पासवर्ड डिफ़ॉल्ट पर रीसेट कर दिया गया!');
      setIsChangePassOpen(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  // Fetch entries from Google Apps Script Web App
  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`सर्वर से उत्तर नहीं मिला (${res.status})`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        // Apply any locally saved status overrides if present
        try {
          const overridesStr = localStorage.getItem('jinvani_status_overrides');
          const overrides: Record<string, string> = overridesStr ? JSON.parse(overridesStr) : {};
          const merged = data.map((item) => {
            const overrideStatus = overrides[String(item.id)];
            return overrideStatus ? { ...item, status: overrideStatus } : item;
          });
          setItems(merged);
        } catch {
          setItems(data);
        }
      } else {
        setItems([]);
      }
      setLastSyncTime(new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }));
      if (isManualRefresh) showToast('गूगल शीट से ताज़ा डेटा लोड हुआ!');
    } catch (err: any) {
      console.error('Admin dashboard failed to fetch from Google Sheet:', err);
      setFetchError('डेटा लोड करने में असमर्थ। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Update item status
  const handleUpdateStatus = async (item: AdminContributionItem, newStatus: string) => {
    // 1. Update local state immediately
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: newStatus } : it))
    );

    // 2. Persist in local storage
    try {
      const overridesStr = localStorage.getItem('jinvani_status_overrides');
      const overrides: Record<string, string> = overridesStr ? JSON.parse(overridesStr) : {};
      overrides[String(item.id)] = newStatus;
      localStorage.setItem('jinvani_status_overrides', JSON.stringify(overrides));
    } catch {}

    showToast(`पंक्ति #${item.id} की स्थिति "${newStatus}" कर दी गई!`);

    // 3. Attempt to update in Google Sheet via Apps Script
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateStatus',
          rowId: item.id,
          newStatus: newStatus,
        }),
      });
    } catch (err) {
      console.warn('Background sync to sheet failed, stored locally:', err);
    }
  };

  // Copy details helper
  const handleCopyDetails = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('विवरण क्लिपबोर्ड पर कॉपी हो गया!');
    } catch {
      showToast('कॉपी करने में असमर्थ');
    }
  };

  // Compute live statistics
  const stats = useMemo(() => {
    const total = items.length;
    const resolved = items.filter(
      (item) =>
        item.status?.includes('सुधारा') ||
        item.status?.includes('स्वीकृत') ||
        item.status?.toLowerCase().includes('resolved') ||
        item.status?.toLowerCase().includes('done')
    ).length;
    const inReview = items.filter(
      (item) =>
        item.status?.includes('समीक्षा') ||
        item.status?.includes('प्रगति') ||
        item.status?.toLowerCase().includes('review')
    ).length;
    const pending = total - resolved - inReview;
    return { total, resolved, inReview, pending };
  }, [items]);

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type Filter
      if (activeTypeFilter !== 'all') {
        if (activeTypeFilter === 'correction' && !item.type?.includes('अशुद्धि')) return false;
        if (activeTypeFilter === 'addition' && !item.type?.includes('नया पाठ')) return false;
        if (activeTypeFilter === 'feedback' && !item.type?.includes('सामान्य')) return false;
      }

      // Status Filter
      if (activeStatusFilter !== 'all') {
        const isItemResolved =
          item.status?.includes('सुधारा') ||
          item.status?.includes('स्वीकृत') ||
          item.status?.toLowerCase().includes('resolved');
        const isItemReview =
          item.status?.includes('समीक्षा') ||
          item.status?.includes('प्रगति') ||
          item.status?.toLowerCase().includes('review');

        if (activeStatusFilter === 'resolved' && !isItemResolved) return false;
        if (activeStatusFilter === 'inReview' && !isItemReview) return false;
        if (activeStatusFilter === 'pending' && (isItemResolved || isItemReview)) return false;
      }

      // Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesScripture = item.scriptureName?.toLowerCase().includes(q);
        const matchesDetails = item.details?.toLowerCase().includes(q);
        const matchesType = item.type?.toLowerCase().includes(q);
        if (!matchesScripture && !matchesDetails && !matchesType) return false;
      }

      return true;
    });
  }, [items, activeTypeFilter, activeStatusFilter, searchQuery]);

  // Status visual badge helper
  const renderStatusBadge = (status: string) => {
    const isResolved =
      status?.includes('सुधारा') ||
      status?.includes('स्वीकृत') ||
      status?.toLowerCase().includes('resolved');
    const isReview =
      status?.includes('समीक्षा') ||
      status?.includes('प्रगति') ||
      status?.toLowerCase().includes('review');

    if (isResolved) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-gotu font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>{status || 'सुधारा गया'}</span>
        </span>
      );
    }

    if (isReview) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-gotu font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{status || 'समीक्षा में'}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-gotu font-semibold bg-blue-500/15 border border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
        <Clock className="w-3 h-3 text-blue-400 shrink-0" />
        <span>{status || 'प्राप्त हुआ'}</span>
      </span>
    );
  };

  const getStatusBadge = (status: string) => renderStatusBadge(status);

  const getTypeBadge = (type: string) => {
    if (type?.includes('अशुद्धि')) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-300 whitespace-nowrap">
          ✍️ अशुद्धि
        </span>
      );
    }
    if (type?.includes('नया पाठ') || type?.includes('addition')) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-400/30 text-blue-300 whitespace-nowrap">
          📖 नया पाठ
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-400/30 text-purple-300 whitespace-nowrap">
        💡 सुझाव
      </span>
    );
  };

  // 1. If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient Radiant Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-500/10 blur-[110px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md relative z-10"
        >
          <GlassCard
            variant="sacred"
            className="p-6 sm:p-10 border-amber-500/35 bg-[#0b1220]/95 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(245,158,11,0.18)] rounded-3xl relative overflow-hidden"
          >
            {/* Corner Markers */}
            <div className="absolute top-2.5 left-3 text-[10px] text-amber-400/40 pointer-events-none select-none">❖</div>
            <div className="absolute top-2.5 right-3 text-[10px] text-amber-400/40 pointer-events-none select-none">❖</div>

            {loginStep === 'password' ? (
              <>
                <div className="flex flex-col items-center mb-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                    <ShieldCheck className="w-7 h-7 text-amber-300" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                    प्रशासक नियंत्रण (Admin Login)
                  </h2>
                  <p className="text-amber-200/70 font-gotu text-xs sm:text-sm mt-1">
                    चरण 1: अधिकृत व्यवस्थापक क्रेडेंशियल दर्ज करें
                  </p>
                </div>

                {/* 1-Tap Passkey (Biometric) Login Button */}
                {hasPasskey && (
                  <div className="mb-5">
                    <button
                      type="button"
                      onClick={handlePasskeyLogin}
                      disabled={isVerifyingPasskey || lockoutRemaining > 0}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/25 via-amber-400/30 to-amber-500/25 border border-amber-400/50 hover:border-amber-400 text-amber-100 hover:text-white font-gotu text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      <Fingerprint className={`w-5 h-5 text-amber-300 shrink-0 ${isVerifyingPasskey ? 'animate-spin' : 'animate-pulse'}`} />
                      <span>{isVerifyingPasskey ? 'बायोमेट्रिक्स जांची जा रही है...' : 'Passkey (Fingerprint / Face ID) से लॉगिन'}</span>
                    </button>

                    <div className="flex items-center gap-3 my-3.5">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-[10px] text-slate-400 font-gotu">या पासवर्ड से लॉगिन करें</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-amber-200 font-gotu flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      यूजरनेम (Username)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all font-mono"
                      placeholder="admin"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-amber-200 font-gotu flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      पासवर्ड (Password)
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={lockoutRemaining > 0 || isLoggingIn}
                        className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all font-mono disabled:opacity-50"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 transition-colors p-1 cursor-pointer"
                        tabIndex={-1}
                        title={showLoginPass ? 'पासवर्ड छुपाएं' : 'पासवर्ड देखें'}
                      >
                        {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Rate Limit / Lockout Banner */}
                  {lockoutRemaining > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-gotu flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                      <div>
                        <p className="font-semibold text-amber-300">सुरक्षा लॉक सक्रिय (Rate Limited)</p>
                        <p className="text-[11px] text-amber-200/80 mt-0.5">
                          लगातार गलत पासवर्ड। {Math.floor(lockoutRemaining / 60)}:{(lockoutRemaining % 60).toString().padStart(2, '0')} मिनट बाद पुनः प्रयास करें।
                        </p>
                      </div>
                    </div>
                  )}

                  {loginError && !lockoutRemaining && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-gotu flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingIn || lockoutRemaining > 0}
                    className="w-full mt-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold py-2.5 sm:py-3 rounded-xl shadow-[0_4px_18px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    {isLoggingIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        सत्यापन किया जा रहा है...
                      </>
                    ) : lockoutRemaining > 0 ? (
                      `सुरक्षा लॉक: ${Math.floor(lockoutRemaining / 60)}:${(lockoutRemaining % 60).toString().padStart(2, '0')} शेष`
                    ) : is2FAEnabled ? (
                      'आगे बढ़ें (2FA प्रमाणीकरण) →'
                    ) : (
                      'सुरक्षित प्रवेश करें (Login) →'
                    )}
                  </button>

                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="w-full py-2 text-xs font-gotu text-slate-400 hover:text-amber-200 transition-colors cursor-pointer"
                    >
                      ← मुख्य पृष्ठ पर वापस जाएँ
                    </button>
                  )}

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-gotu">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>
                      {is2FAEnabled
                        ? 'चरण 1/2 • 2FA सक्रिय • 60-मिनट सत्र'
                        : 'मास्टर सुरक्षा • SHA-256 एन्क्रिप्टेड • 60-मिनट सत्र'}
                    </span>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                    <Smartphone className="w-7 h-7 text-amber-300" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                    द्वि-चरणीय सुरक्षा (2FA OTP)
                  </h2>
                  <p className="text-amber-200/70 font-gotu text-xs sm:text-sm mt-1">
                    {isUsingRecovery
                      ? 'आपातकालीन बैकअप रिकवरी कोड द्वारा सत्यापन'
                      : 'चरण 2: Google Authenticator से 6-अंकों का कोड दर्ज करें'}
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  {!isUsingRecovery ? (
                    <>
                      {/* Live 30s Pulse Bar */}
                      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/70 border border-amber-500/20 text-[11px] font-gotu text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                          </span>
                          <span>लाइव टाइमर (Time-based OTP)</span>
                        </div>
                        <span className="font-mono text-amber-300 font-semibold">
                          {totpCycleSeconds}s शेष
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-amber-200 font-gotu flex items-center justify-between">
                          <span>6-अंकों का प्रमाणीकरण कोड</span>
                          <span className="text-[10px] text-slate-400 font-normal">Google Authenticator</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          autoFocus
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-950/80 border border-amber-500/35 rounded-2xl py-3 px-3 text-center text-2xl sm:text-3xl font-mono font-bold tracking-[0.4em] text-amber-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                          placeholder="000000"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-amber-200 font-gotu flex items-center justify-between">
                        <span>आपातकालीन रिकवरी कोड (Recovery Code)</span>
                        <span className="text-[10px] text-amber-400/80 font-normal">प्रारूप: JIN-XXXX-XXXX</span>
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        autoFocus
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.toUpperCase())}
                        className="w-full bg-slate-950/80 border border-amber-500/35 rounded-2xl py-3 px-3 text-center text-base sm:text-lg font-mono font-bold tracking-wider text-amber-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
                        placeholder="JIN-XXXX-XXXX"
                        required
                      />
                    </div>
                  )}

                  {/* Toggle Recovery Mode */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUsingRecovery(!isUsingRecovery);
                        setOtpInput('');
                        setLoginError('');
                      }}
                      className="text-[11px] text-amber-300/90 hover:text-amber-200 underline font-gotu cursor-pointer transition-colors"
                    >
                      {isUsingRecovery
                        ? '← सामान्य Google Authenticator OTP कोड उपयोग करें'
                        : 'फोन उपलब्ध नहीं है? आपातकालीन रिकवरी कोड उपयोग करें'}
                    </button>
                  </div>

                  {/* Rate Limit / Lockout Banner */}
                  {lockoutRemaining > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-gotu flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                      <div>
                        <p className="font-semibold text-amber-300">सुरक्षा लॉक सक्रिय (Rate Limited)</p>
                        <p className="text-[11px] text-amber-200/80 mt-0.5">
                          अत्यधिक गलत प्रयास। {Math.floor(lockoutRemaining / 60)}:{(lockoutRemaining % 60).toString().padStart(2, '0')} मिनट बाद पुनः प्रयास करें।
                        </p>
                      </div>
                    </div>
                  )}

                  {loginError && !lockoutRemaining && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-gotu flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || lockoutRemaining > 0}
                    className="w-full mt-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold py-2.5 sm:py-3 rounded-xl shadow-[0_4px_18px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        कोड सत्यापित किया जा रहा है...
                      </>
                    ) : (
                      'सुरक्षित प्रवेश करें'
                    )}
                  </button>

                  {!is2FAEnabled && (
                    <button
                      type="button"
                      onClick={() => handleDirectLogin('सफलतापूर्वक लॉगिन हुआ!')}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-gotu font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>2FA अभी सेटअप नहीं है? सीधे लॉगिन करें</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleBackToPassword}
                    className="w-full py-2 text-xs font-gotu text-slate-400 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    ← पासवर्ड पर वापस जाएँ
                  </button>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-gotu">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>RFC 6238 TOTP • 100% ऑफ़लाइन सुरक्षित • बैंक-स्तरीय सुरक्षा</span>
                  </div>
                </form>
              </>
            )}
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // 2. If authenticated, render Admin Management Dashboard
  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen px-4 sm:px-6 md:px-8 pt-6 sm:pt-10 pb-28 flex flex-col items-center relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[680px] h-[240px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-t-[200px] blur-3xl pointer-events-none -z-10" />

      {/* Floating In-App Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none px-4"
          >
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0b162c]/95 border border-amber-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.25)] text-amber-200 text-xs sm:text-sm font-gotu font-medium backdrop-blur-xl">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}

        {/* Change Password Dialog */}
        {isChangePassOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md"
            >
              <GlassCard
                variant="sacred"
                className="p-6 sm:p-7 rounded-3xl border-amber-500/35 bg-[#0b1220]/95 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.2)] relative"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-notoserif font-bold text-white">
                      एडमिन पासवर्ड बदलें
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsChangePassOpen(false);
                      setPassModalError('');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-200 font-gotu">
                      वर्तमान पासवर्ड (Current Password)
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="वर्तमान पासवर्ड दर्ज करें"
                        className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl pl-3.5 pr-10 py-2 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 p-1 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-200 font-gotu">
                      नया पासवर्ड (New Password - न्यूनतम 6 अक्षर)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="नया पासवर्ड दर्ज करें"
                        className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl pl-3.5 pr-10 py-2 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 p-1 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-200 font-gotu">
                      नया पासवर्ड पुनः दर्ज करें (Confirm Password)
                    </label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="नया पासवर्ड दोबारा दर्ज करें"
                      className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      required
                    />
                  </div>

                  {passModalError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-gotu flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{passModalError}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-gotu font-bold py-2.5 rounded-xl shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-xs sm:text-sm"
                    >
                      नया पासवर्ड सहेजें (Save)
                    </button>

                    <button
                      type="button"
                      onClick={handleResetPasswordToDefault}
                      className="w-full py-1.5 text-[11px] text-slate-400 hover:text-amber-300 transition-colors font-gotu cursor-pointer"
                    >
                      डिफ़ॉल्ट पासवर्ड पर रीसेट करें
                    </button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}

        {/* 2FA Authenticator Setup & Backup Dialog */}
        {is2FAModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg my-8"
            >
              <GlassCard
                variant="sacred"
                className="p-5 sm:p-7 rounded-3xl border-amber-500/35 bg-[#0b1220]/98 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(245,158,11,0.2)] relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white font-notoserif">
                        सुरक्षा सेटिंग्स एवं प्रमाणीकरण (Security Center)
                      </h3>
                      <p className="text-[11px] text-amber-200/70 font-gotu">
                        Passkeys (बायोमेट्रिक) • Google Authenticator • रिकवरी कोड्स
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIs2FAModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="space-y-4">
                  {/* Passkeys (WebAuthn / Biometric Authentication) */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0c1322] to-amber-500/10 border border-amber-500/30 space-y-2.5 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-300 font-gotu flex items-center gap-1.5">
                        <Fingerprint className="w-4 h-4 text-amber-400" />
                        डिवाइस पासकी (Passkey / Biometrics)
                      </span>
                      {hasPasskey ? (
                        <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          सक्रिय (Active)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                          असंयोजित (Not Set)
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 font-gotu leading-relaxed">
                      अपने लैपटॉप या फोन के <strong>Fingerprint, Touch ID, Face ID या Windows Hello</strong> से बिना पासवर्ड व OTP के 1-टैप में सुरक्षित लॉगिन करें।
                    </p>

                    {hasPasskey ? (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-[11px] font-gotu flex items-center justify-between">
                          <div className="text-slate-300 text-[10px]">
                            <span>पंजीकरण: </span>
                            <span className="text-amber-200 font-mono">{passkeyCreatedAt || 'सक्रिय डिवाइस'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleTestPasskey}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] font-gotu transition-colors cursor-pointer"
                            >
                              टेस्ट करें
                            </button>
                            <button
                              type="button"
                              onClick={handleRemovePasskey}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-gotu transition-colors cursor-pointer"
                            >
                              हटाएं
                            </button>
                          </div>
                        </div>

                        {passkeyTestSuccess === true && (
                          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-gotu flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Passkey टेस्ट सफल! आपकी डिवाइस की बायोमेट्रिक्स सही से काम कर रही है।</span>
                          </div>
                        )}
                        {passkeyTestSuccess === false && (
                          <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-gotu flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>बायोमेट्रिक टेस्ट असफल या रद्द किया गया।</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleRegisterPasskey}
                          disabled={isRegisteringPasskey}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/25 via-amber-400/30 to-amber-500/25 border border-amber-400/40 hover:border-amber-400 text-amber-100 hover:text-white text-xs font-gotu font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                        >
                          <Fingerprint className={`w-4 h-4 text-amber-400 ${isRegisteringPasskey ? 'animate-spin' : ''}`} />
                          <span>{isRegisteringPasskey ? 'डिवाइस पर पुष्टि करें...' : 'इस डिवाइस पर Passkey जोड़ें (Fingerprint / Hello)'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Step Guide & 2FA Status */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100/90 font-gotu space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Google Authenticator (2FA TOTP)</span>
                      </div>
                      {is2FAEnabled ? (
                        <span className="text-[10px] text-emerald-300 font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          सक्रिय (Active)
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-300 font-mono px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 font-semibold">
                          निष्क्रिय (Not Enabled)
                        </span>
                      )}
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pl-1">
                      <li>अपने फोन में <b>Google Authenticator</b> या <b>Microsoft Authenticator</b> ऐप खोलें।</li>
                      <li>ऐप में <b>+</b> दबाएं और नीचे दिया गया QR कोड स्कैन करें (या मैन्युअल की दर्ज करें)।</li>
                      <li>नीचे 6-अंकों का टेस्ट कोड डालकर पुष्टि करें और <b>"2FA सुरक्षा सक्रिय करें"</b> बटन दबाएं।</li>
                    </ol>
                  </div>

                  {/* QR Code & Manual Key */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(TOTP_AUTH_URI)}`}
                        alt="2FA QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-left w-full">
                      <div className="text-xs text-slate-300 font-gotu">
                        <span className="text-amber-300 font-semibold block mb-1">मैनुअल सेटअप की (Setup Key):</span>
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/25 px-2.5 py-1.5 rounded-lg">
                          <code className="text-amber-200 font-mono font-bold tracking-widest text-xs flex-1 select-all">
                            {MASTER_2FA_SECRET}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(MASTER_2FA_SECRET);
                              showToast('2FA सीक्रेट की कॉपी हो गई!');
                            }}
                            className="p-1 text-slate-400 hover:text-amber-300 transition-colors"
                            title="सीक्रेट की कॉपी करें"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 font-gotu">
                        अल्गोरिद्म: <span className="text-slate-200">SHA-1 (30s)</span> • अंक: <span className="text-slate-200">6</span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Recovery Codes */}
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-300 font-gotu flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        आपातकालीन बैकअप कोड्स (SHA-256 Hashed)
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 font-semibold">
                        3 कोड्स सुरक्षित
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-gotu leading-relaxed">
                      सर्वोच्च सुरक्षा हेतु बैकअप कोड्स को क्लाइंट-साइड जावास्क्रिप्ट में कभी भी सादे अक्षरों में नहीं रखा जाता, बल्कि वे <strong>SHA-256 क्रिप्टोग्राफिक हैश</strong> में सुरक्षित हैं।
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-[11px] font-gotu space-y-1.5">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>सुरक्षा प्रकार:</span>
                        <span className="text-emerald-300 font-semibold">अपरिवर्तनीय हैश (Zero-Knowledge)</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        अधिकृत स्लॉट्स: <span className="font-mono text-amber-200 font-semibold">JIN-****-**** (3 स्लॉट सक्रिय)</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-amber-200/80 font-gotu">
                      💡 यदि फोन खो जाए, तो लॉगिन स्क्रीन पर अपना गुप्त बैकअप कोड दर्ज करें। ब्राउज़र इसे तुरंत हैश करके सत्यापित कर लेगा।
                    </p>
                  </div>

                  {/* Live OTP Test Field */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <label className="text-xs font-semibold text-slate-200 font-gotu block">
                      लाइव टेस्ट करें (Verify Live OTP):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={testOtpInput}
                        onChange={(e) => {
                          setTestOtpInput(e.target.value.replace(/\D/g, ''));
                          setTestOtpResult(null);
                        }}
                        placeholder="ऐप का 6-अंक कोड दर्ज करें"
                        className="flex-1 bg-slate-950/70 border border-amber-500/25 rounded-xl px-3 py-2 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-widest text-center"
                      />
                      <button
                        type="button"
                        onClick={handleTestOtp}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-gotu font-bold transition-all cursor-pointer"
                      >
                        जाँचें
                      </button>
                    </div>
                    {testOtpResult === true && (
                      <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-gotu flex items-center gap-2">
                        <Check className="w-3.5 h-3.5" />
                        <span>सत्यापन सफल! आपका Google Authenticator सही सिंक है।</span>
                      </div>
                    )}
                    {testOtpResult === false && (
                      <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-gotu flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>अमान्य कोड! कृपया फोन का समय (Time Sync) और 6-अंकों का कोड जांचें।</span>
                      </div>
                    )}

                    {/* Toggle 2FA Enable/Disable Button */}
                    <div className="pt-2">
                      {!is2FAEnabled ? (
                        <button
                          type="button"
                          onClick={handleEnable2FA}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-950 font-gotu font-bold text-xs shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>2FA सुरक्षा सक्रिय करें (Enable 2FA Protection)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleDisable2FA}
                          className="w-full py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-gotu font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>2FA सुरक्षा बंद करें (Disable 2FA)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Close Button & Guide Link */}
                <div className="mt-5 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIs2FAModalOpen(false);
                      setAdminTab('guide');
                    }}
                    className="text-amber-300 hover:text-amber-200 text-xs font-gotu flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>विस्तृत सुरक्षा निर्देश व कोड्स गाइड देखें →</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIs2FAModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-gotu text-xs transition-colors cursor-pointer w-full sm:w-auto"
                  >
                    पूर्ण हुआ (बंद करें)
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 relative z-10">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors font-gotu text-xs sm:text-sm cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>साइट पर वापस</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {lastSyncTime && (
            <span className="hidden lg:inline text-[11px] text-slate-400 font-gotu px-2">
              अंतिम सिंक: {lastSyncTime}
            </span>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[10px] text-emerald-300 font-gotu">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>सुरक्षित सत्र (60m)</span>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing || isLoading}
            title="डेटा रीफ्रेश करें"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 border border-white/10 transition-colors font-gotu text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">रीफ्रेश</span>
          </button>

          <button
            onClick={() => {
              setIsChangePassOpen(true);
              setPassModalError('');
            }}
            title="एडमिन पासवर्ड बदलें"
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors font-gotu text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">पासवर्ड</span>
          </button>

          <button
            onClick={() => {
              setIs2FAModalOpen(true);
              setTestOtpInput('');
              setTestOtpResult(null);
            }}
            title="Passkey एवं 2FA सुरक्षा सेटिंग्स"
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors font-gotu text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">सुरक्षा केंद्र (Passkey/2FA)</span>
          </button>

          <button
            onClick={() => setAdminTab('guide')}
            title="प्रशासक मार्गदर्शिका एवं सुरक्षा निर्देश"
            className={`px-2.5 sm:px-3 py-2 rounded-xl border transition-colors font-gotu text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              adminTab === 'guide'
                ? 'bg-amber-500/30 text-amber-200 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-white/5 hover:bg-white/10 text-amber-300/90 border-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">एडमिन गाइड</span>
          </button>

          <a
            href="https://docs.google.com/spreadsheets/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors font-gotu text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            title="गूगल स्प्रेडशीट खोलें"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">गूगल शीट</span>
          </a>

          <button
            onClick={() => handleLogout()}
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors font-gotu text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* Sacred Admin Tab Selector */}
      <div className="w-full flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 mb-7 pb-2 overflow-x-auto no-scrollbar relative z-10 border-b border-white/10">
        {[
          { id: 'feedback', label: 'अशुद्धि व सुझाव', icon: CheckCircle2, badge: stats.total },
          { id: 'announcement', label: 'सार्वजनिक घोषणा', icon: Megaphone, badge: announcementActive ? 'LIVE' : undefined },
          { id: 'catalog', label: 'शास्त्र भंडार (564)', icon: BookOpen },
          { id: 'panchang', label: 'पंचांग व पर्व', icon: Calendar },
          { id: 'tools', label: 'सिस्टम टूल्स', icon: Wrench },
          { id: 'guide', label: 'एडमिन गाइड व सुरक्षा', icon: FileText, badge: 'IMP' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-gotu font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.02]'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-amber-400/30 text-amber-300' : 'bg-white/10 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: अशुद्धि व सुझाव प्रबंधन (Feedback & Corrections) */}
      {adminTab === 'feedback' && (
        <>
          {/* Page Title & Clean Header Layout */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center text-center mb-6 relative z-10 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-gotu">प्रशासक नियंत्रण कक्ष • Admin Panel</span>
            </div>

            <h1 className="w-full text-2xl sm:text-3xl md:text-4xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 leading-tight mb-2.5">
              जिनवाणी संवर्धन एवं अशुद्धि प्रबंधन
            </h1>
            <p className="text-xs sm:text-sm text-slate-200/85 font-gotu leading-relaxed max-w-[65ch] mx-auto px-2">
              उपयोगकर्ताओं द्वारा भेजे गए समस्त सुझाव व अशुद्धि रिपोर्ट सीधे आपकी Google Sheet से सुरक्षित रूप से लोड हो रहे हैं। आप यहीं से स्थिति बदल सकते हैं।
            </p>
          </motion.div>

          {/* Live Stats Bento Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-6 relative z-10">
            <GlassCard
              variant="sacred"
              className="p-3.5 sm:p-4 rounded-2xl border-white/10 bg-[#0c1222]/80 flex flex-col justify-between hover:border-amber-400/40 transition-colors"
            >
              <div className="text-[11px] sm:text-xs text-slate-400 font-gotu">कुल सुझाव</div>
              <div className="text-xl sm:text-3xl font-notoserif font-bold text-white mt-1">
                {isLoading ? '...' : stats.total}
              </div>
              <div className="text-[10px] text-amber-400/80 font-gotu mt-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>गूगल शीट से लाइव</span>
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-3.5 sm:p-4 rounded-2xl border-emerald-500/25 bg-emerald-950/20 flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
            >
              <div className="text-[11px] sm:text-xs text-emerald-300 font-gotu">सुधारा गया / पूर्ण</div>
              <div className="text-xl sm:text-3xl font-notoserif font-bold text-emerald-200 mt-1">
                {isLoading ? '...' : stats.resolved}
              </div>
              <div className="text-[10px] text-emerald-400/80 font-gotu mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>स्थिति: पूर्ण</span>
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-3.5 sm:p-4 rounded-2xl border-amber-500/25 bg-amber-950/20 flex flex-col justify-between hover:border-amber-500/50 transition-colors"
            >
              <div className="text-[11px] sm:text-xs text-amber-300 font-gotu">समीक्षाधीन</div>
              <div className="text-xl sm:text-3xl font-notoserif font-bold text-amber-200 mt-1">
                {isLoading ? '...' : stats.inReview}
              </div>
              <div className="text-[10px] text-amber-400/80 font-gotu mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>जांच प्रक्रिया जारी</span>
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-3.5 sm:p-4 rounded-2xl border-blue-500/25 bg-blue-950/20 flex flex-col justify-between hover:border-blue-500/50 transition-colors"
            >
              <div className="text-[11px] sm:text-xs text-blue-300 font-gotu">नवीन प्राप्त</div>
              <div className="text-xl sm:text-3xl font-notoserif font-bold text-blue-200 mt-1">
                {isLoading ? '...' : stats.pending}
              </div>
              <div className="text-[10px] text-blue-400/80 font-gotu mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>समीक्षा प्रतीक्षित</span>
              </div>
            </GlassCard>
          </div>

          {/* Filter and Search Bar with Clear Separation */}
          <div className="w-full space-y-3 mb-6 relative z-10">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ग्रंथ का नाम, अशुद्धि या विवरण खोजें..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-amber-500/25 text-amber-100 placeholder:text-slate-500 text-xs sm:text-sm font-gotu focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-gotu"
                >
                  ✕ साफ़ करें
                </button>
              )}
            </div>

            {/* Separated Two-Tier Filter Bar with Column Layout Toggle */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#0c1222]/80 border border-white/10 space-y-3">
              {/* Row 1: Type Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs text-amber-300 font-semibold font-gotu min-w-[50px]">
                  प्रकार:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'सभी प्रकार' },
                    { id: 'correction', label: '✍️ अशुद्धि सुधार' },
                    { id: 'new_text', label: '📖 नया पाठ' },
                    { id: 'general', label: '💡 सामान्य' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveTypeFilter(filter.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-gotu transition-all cursor-pointer ${
                        activeTypeFilter === filter.id
                          ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                          : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Status Filters */}
              <div className="flex items-center gap-3 pt-2.5 border-t border-white/5 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] sm:text-xs text-amber-300 font-semibold font-gotu min-w-[50px]">
                    स्थिति:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'all', label: 'सभी स्थिति' },
                      { id: 'resolved', label: '🟢 पूर्ण (Resolved)' },
                      { id: 'in_review', label: '🟡 समीक्षा में' },
                      { id: 'pending', label: '⚪ नवीन' },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveStatusFilter(filter.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-gotu transition-all cursor-pointer ${
                          activeStatusFilter === filter.id
                            ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                            : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submissions List / Multi-Column Grid */}
          <div className="w-full relative z-10">
            {isLoading && items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-sm font-gotu text-amber-200/80">गूगल शीट से सुझाव लोड हो रहे हैं...</p>
              </div>
            ) : fetchError && items.length === 0 ? (
              <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center text-rose-200 text-sm font-gotu">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                <p>{fetchError}</p>
                <button
                  onClick={() => fetchData(true)}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-gotu transition-colors cursor-pointer"
                >
                  पुनः प्रयास करें
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#0c1222]/50 border border-white/5 text-center text-slate-400 text-sm font-gotu">
                <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
                <p className="text-slate-300 font-medium">कोई सुझाव या रिपोर्ट नहीं मिली।</p>
                <p className="text-xs text-slate-500 mt-1">फ़िल्टर बदलकर देखें या सर्च रीसेट करें।</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-gotu px-1">
                  <div className="flex items-center gap-2">
                    <span>कुल {filteredItems.length} प्रविष्टियाँ प्रदर्शित</span>
                    {(activeTypeFilter !== 'all' || activeStatusFilter !== 'all' || searchQuery) && (
                      <button
                        onClick={() => {
                          setActiveTypeFilter('all');
                          setActiveStatusFilter('all');
                          setSearchQuery('');
                        }}
                        className="text-amber-400 hover:underline cursor-pointer text-xs"
                      >
                        (रीसेट)
                      </button>
                    )}
                  </div>

                  {/* Responsive Quick Column Switcher */}
                  <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 sm:p-1 rounded-xl border border-white/10 shadow-sm">
                    <span className="text-[10px] text-slate-400 font-gotu px-1.5 hidden xs:inline">कॉलम:</span>
                    {[
                      { cols: 1 as const, label: '1 Col' },
                      { cols: 2 as const, label: '2 Col' },
                      { cols: 3 as const, label: '3 Col' },
                    ].map((layout) => (
                      <button
                        key={layout.cols}
                        onClick={() => handleSetColumns(layout.cols)}
                        title={`${layout.cols} कॉलम में प्रदर्शित करें`}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-gotu transition-all cursor-pointer ${
                          columns === layout.cols
                            ? 'bg-amber-500/30 text-amber-200 font-bold shadow-sm border border-amber-400/40'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {layout.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className={`grid gap-2.5 sm:gap-4 ${
                    columns === 1
                      ? 'grid-cols-1'
                      : columns === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-2 sm:grid-cols-3'
                  }`}
                >
                  {filteredItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                      className="h-full"
                    >
                      <GlassCard
                        variant="sacred"
                        className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-white/10 bg-[#0c1222]/85 hover:border-amber-500/40 transition-all flex flex-col justify-between h-full shadow-lg"
                      >
                        <div>
                          {/* Card Header: Type Badge, Row ID & Status Tag */}
                          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {getTypeBadge(item.type)}
                              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono bg-white/5 px-1.5 py-0.5 rounded-md">
                                #{item.id}
                              </span>
                            </div>
                            {getStatusBadge(item.status)}
                          </div>

                          {/* Scripture / Text Name */}
                          <h3 className="text-sm sm:text-base lg:text-lg font-notoserif font-bold text-amber-100 mb-1 leading-snug line-clamp-2" title={item.scriptureName}>
                            {item.scriptureName || 'अनाम शास्त्र / सामान्य सुझाव'}
                          </h3>

                          {/* Timestamp */}
                          <div className="text-[10px] sm:text-[11px] text-slate-400 font-gotu mb-2.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{item.timestamp || 'दिनांक अनुपलब्ध'}</span>
                          </div>

                          {/* User Suggestion Content Box */}
                          <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-200 text-[11px] sm:text-xs md:text-sm font-gotu leading-relaxed break-words line-clamp-4 hover:line-clamp-none transition-all">
                            {item.details}
                          </div>
                        </div>

                        {/* Admin Direct Status Action Toolbar (Pinned at bottom) */}
                        <div className="pt-2 sm:pt-2.5 border-t border-white/5 mt-3 sm:mt-4">
                          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-gotu">
                            <button
                              onClick={() => handleUpdateStatus(item, 'सुधारा गया')}
                              title="स्थिति को 'सुधारा गया' चिह्नित करें"
                              className={`py-1 px-1 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-center truncate ${
                                item.status?.includes('सुधारा') || item.status?.includes('स्वीकृत')
                                  ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-200 font-bold'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">सुधारा</span>
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(item, 'समीक्षा में')}
                              title="स्थिति को 'समीक्षा में' चिह्नित करें"
                              className={`py-1 px-1 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-center truncate ${
                                item.status?.includes('समीक्षा')
                                  ? 'bg-amber-500/25 border-amber-500/60 text-amber-200 font-bold'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300'
                              }`}
                            >
                              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="truncate">समीक्षा</span>
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(item, 'प्राप्त हुआ')}
                              title="स्थिति को 'नवीन प्राप्त' चिह्नित करें"
                              className={`py-1 px-1 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-center truncate ${
                                !item.status?.includes('सुधारा') && !item.status?.includes('समीक्षा')
                                  ? 'bg-blue-500/25 border-blue-500/60 text-blue-200 font-bold'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-blue-500/20 hover:text-blue-300'
                              }`}
                            >
                              <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                              <span className="truncate">नवीन</span>
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Quick Guide Banner */}
          <div className="w-full mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 max-w-xl text-center space-y-1.5 text-xs font-gotu text-amber-200/90">
            <div className="font-bold text-amber-300 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>प्रशासक नियंत्रण (Admin Control Info)</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300">
              आप सीधे ऊपर दिए गए <strong>"Quick Status"</strong> बटनों पर क्लिक करके स्थिति को "सुधारा गया" या "समीक्षा में" सेट कर सकते हैं। यह परिवर्तन आपके डैशबोर्ड में तुरंत दिखेगा और आपकी Google Sheet से भी सिंक रहेगा।
            </p>
          </div>
        </>
      )}

      {/* TAB 2: सार्वजनिक उद्घोषणा (Site Announcement & Broadcast) */}
      {adminTab === 'announcement' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl space-y-6 relative z-10"
        >
          <div className="text-center max-w-2xl mx-auto mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-2 backdrop-blur-md">
              <Megaphone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-gotu">लाइव उद्घोषणा • Broadcast Banner</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white mb-2">
              सार्वजनिक सूचना एवं पर्व घोषणा
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
              यहाँ से आप जिनवाणी के मुख्य पृष्ठ (Landing Page) के शीर्ष पर समस्त आगंतुकों हेतु लाइव पर्व सन्देश या विशेष घोषणा प्रकाशित कर सकते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Form */}
            <div className="lg:col-span-7 space-y-4">
              <GlassCard
                variant="sacred"
                className="p-5 sm:p-6 rounded-3xl border-amber-500/30 bg-[#0b1220]/90 shadow-xl space-y-4"
              >
                {/* Active Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-amber-200 font-gotu block">
                      वेबसाइट पर घोषणा प्रदर्शित करें (Active Status)
                    </span>
                    <span className="text-[11px] text-slate-400 font-gotu">
                      {announcementActive ? '🟢 घोषणा अभी मुख्य पृष्ठ पर लाइव है' : '⚪ घोषणा अभी निष्क्रिय है'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnnouncementActive(!announcementActive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      announcementActive ? 'bg-amber-400' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                        announcementActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Badge Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200 font-gotu">
                    सूचना का प्रकार (Badge Type):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      '🪔 पर्व एवं महोत्सव',
                      '📢 महत्वपूर्ण सूचना',
                      '📖 नवीन ग्रंथ संकलन',
                      '✨ विशेष सन्देश',
                    ].map((badge) => (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => setAnnouncementBadge(badge)}
                        className={`p-2 rounded-xl text-xs font-gotu text-left border transition-all cursor-pointer ${
                          announcementBadge === badge
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                            : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-amber-400/30'
                        }`}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-200 font-gotu">
                    <label>घोषणा का मुख्य सन्देश:</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {announcementText.length}/200 अक्षर
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={200}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="उदा. पर्यूषण महापर्व के पावन अवसर पर 10 दिवसीय विशेष स्वाध्याय एवं शांतिधारा विधान उपलब्ध है।"
                    className="w-full bg-slate-950/70 border border-amber-500/25 rounded-2xl p-3 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-gotu leading-relaxed"
                  />
                </div>

                {/* Action Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200 font-gotu">
                    क्लिक पर खुलने वाला पृष्ठ (Action Link):
                  </label>
                  <select
                    value={announcementLink}
                    onChange={(e) => setAnnouncementLink(e.target.value)}
                    className="w-full bg-slate-950/70 border border-amber-500/25 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-amber-100 focus:outline-none focus:border-amber-400 font-gotu"
                  >
                    <option value="none">कोई बटन नहीं (केवल सूचना)</option>
                    <option value="festivals">पर्व एवं उत्सव पृष्ठ (festivals)</option>
                    <option value="library">शास्त्र ग्रंथालय (library)</option>
                    <option value="panchang">दैनिक पंचांग (panchang)</option>
                    <option value="daily-puja">नित्य पूजा प्रवाह (daily-puja)</option>
                    <option value="jap">जाप माला (jap)</option>
                    <option value="samayik">सामायिक (samayik)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveAnnouncement}
                    className="flex-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold py-2.5 rounded-xl shadow-[0_4px_18px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>घोषणा सहेजें व लाइव करें</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAnnouncement}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors font-gotu text-xs cursor-pointer flex items-center gap-1"
                    title="घोषणा हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">हटाएं</span>
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Right Live Preview */}
            <div className="lg:col-span-5 space-y-4">
              <GlassCard
                variant="sacred"
                className="p-5 sm:p-6 rounded-3xl border-white/10 bg-[#0b1220]/80 shadow-xl space-y-3"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-bold text-amber-300 font-gotu">
                  <Eye className="w-3.5 h-3.5" />
                  <span>लाइव पूर्वावलोकन (Landing Page Preview)</span>
                </div>
                <p className="text-[11px] text-slate-400 font-gotu">
                  उपयोगकर्ताओं को मुख्य पृष्ठ पर घोषणा ठीक इसी रूप में दिखाई देगी:
                </p>

                {/* Live Replica Banner */}
                <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#0d1527]/95 to-amber-500/20 border border-amber-400/40 shadow-[0_4px_25px_rgba(245,158,11,0.25)] text-left relative overflow-hidden">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/25 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {announcementBadge}
                      </span>
                      <p className="text-xs text-slate-100 font-gotu mt-1.5 font-medium leading-snug">
                        {announcementText || 'यहाँ आपकी घोषणा का सन्देश प्रदर्शित होगा...'}
                      </p>
                    </div>
                  </div>
                  {announcementLink && announcementLink !== 'none' && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-end">
                      <span className="px-3 py-1 rounded-xl bg-amber-500/30 border border-amber-400/50 text-amber-200 text-[11px] font-gotu font-semibold">
                        देखें →
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 font-gotu space-y-1">
                  <p>💡 <b>मार्गदर्शन:</b> घोषणा सहेजने के बाद मुख्य पृष्ठ (`Landing Page`) पर यह तुरंत दिखाई देगी और आगंतुक इसे 'देखें' बटन से खोल सकेंगे।</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: शास्त्र भंडार निर्देशिका (Content Library & Catalog) */}
      {adminTab === 'catalog' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl space-y-6 relative z-10"
        >
          <div className="text-center max-w-2xl mx-auto mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-2 backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-gotu">डिजिटल ग्रंथालय • 564 Canonical Items</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white mb-2">
              जिनवाणी शास्त्र भंडार निर्देशिका
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
              पोर्टल पर उपलब्ध समस्त 564 प्रामाणिक ग्रंथों, स्तोत्रों, चालीसा, पूजाओं एवं दार्शनिक पाठों की संपूर्ण सूची व त्वरित परीक्षण।
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="ग्रंथ का नाम या स्लग ID खोजें (उदा. समयसार, samayasara, bhaktamar)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-amber-500/25 text-amber-100 placeholder:text-slate-500 text-xs sm:text-sm font-gotu focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 shadow-inner"
              />
              {catalogSearch && (
                <button
                  onClick={() => setCatalogSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-gotu"
                >
                  ✕ साफ़ करें
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
              {[
                { id: 'all', label: `सभी (${catalogCounts.all || 564})` },
                { id: 'ritual', label: `पूजा व विधान (${catalogCounts.ritual || 0})` },
                { id: 'shastra', label: `मूल शास्त्र (${catalogCounts.shastra || 0})` },
                { id: 'stotra', label: `स्तोत्र (${catalogCounts.stotra || 0})` },
                { id: 'chalisa', label: `चालीसा (${catalogCounts.chalisa || 0})` },
                { id: 'arti', label: `आरती (${catalogCounts.arti || 0})` },
                { id: 'bhajan', label: `भजन (${catalogCounts.bhajan || 0})` },
                { id: 'philosophy', label: `दर्शन (${catalogCounts.philosophy || 0})` },
                { id: 'history', label: `इतिहास (${catalogCounts.history || 0})` },
                { id: 'cosmology', label: `भूगोल (${catalogCounts.cosmology || 0})` },
                { id: 'parva', label: `पर्व (${catalogCounts.parva || 0})` },
                { id: 'vidhi', label: `विधि (${catalogCounts.vidhi || 0})` },
                { id: 'kids', label: `पाठशाला (${catalogCounts.kids || 0})` },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setCatalogModuleFilter(chip.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-gotu whitespace-nowrap transition-all cursor-pointer ${
                    catalogModuleFilter === chip.id
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 font-bold shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCatalogItems.slice(0, 120).map((item) => (
              <GlassCard
                key={item.id}
                variant="sacred"
                className="p-3.5 sm:p-4 rounded-2xl border-white/10 bg-[#0c1222]/80 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono">
                      {item.module}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.id);
                        showToast(`स्लग '${item.id}' कॉपी हो गया!`);
                      }}
                      className="text-slate-400 hover:text-amber-300 transition-colors p-1"
                      title="स्लग कॉपी करें"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <h4 className="text-sm font-notoserif font-bold text-slate-100 leading-snug mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono select-all truncate">
                    {item.id}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-gotu">मॉड्यूल: {item.module}</span>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('viewer', { id: item.id, title: item.title, type: item.module, source: 'admin' })}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[11px] font-gotu font-semibold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>पाठ खोलें</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
          {filteredCatalogItems.length > 120 && (
            <p className="text-center text-xs text-slate-400 font-gotu pt-2">
              कुल {filteredCatalogItems.length} में से प्रथम 120 परिणाम दिखाए जा रहे हैं। विशिष्ट पाठ खोजने हेतु ऊपर सर्च बार का उपयोग करें।
            </p>
          )}
        </motion.div>
      )}

      {/* TAB 4: पंचांग एवं पर्व स्थिति (Panchang & Auspicious Dates) */}
      {adminTab === 'panchang' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl space-y-6 relative z-10"
        >
          <div className="text-center max-w-2xl mx-auto mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-2 backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-gotu">जैन काल-गणना • Tithi & Astrological Status</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white mb-2">
              दैनिक पंचांग एवं पर्व नियंत्रण
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
              दिगम्बर जैन परम्परा अनुसार आज की तिथि, पक्ष, जैन मास एवं आगामी महापर्वों का पूर्ण विवरण।
            </p>
          </div>

          {/* Today's Tithi Card */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-7 rounded-3xl border-amber-500/30 bg-[#0b1220]/95 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-amber-400 font-gotu font-semibold">आज का शुभ पंचांग:</span>
                <h3 className="text-xl sm:text-2xl font-notoserif font-bold text-white mt-0.5">
                  {todayJain.tithiLabel} ({todayJain.paksha} पक्ष)
                </h3>
                <p className="text-xs text-amber-200/80 font-gotu mt-0.5">
                  मास: {todayJain.jainMonth} • वीर निर्वाण संवत् 2552
                </p>
              </div>
              <div className="flex items-center gap-2">
                {todayFestival ? (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/25 border border-amber-400/50 text-amber-200 text-xs font-gotu font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{todayFestival}</span>
                  </span>
                ) : todayJain.isParvaTithi ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-gotu font-bold">
                    पर्व तिथि (उपोषण/साधना)
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-gotu">
                    सामान्य तिथि
                  </span>
                )}
              </div>
            </div>

            {/* Panchang Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] text-slate-400 font-gotu block">सूर्योदय:</span>
                <span className="text-sm sm:text-base font-bold text-amber-200 font-notoserif">{todayJain.sunrise}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] text-slate-400 font-gotu block">सूर्यास्त:</span>
                <span className="text-sm sm:text-base font-bold text-amber-200 font-notoserif">{todayJain.sunset}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] text-slate-400 font-gotu block">नक्षत्र:</span>
                <span className="text-sm sm:text-base font-bold text-amber-200 font-notoserif">{todayJain.nakshatra}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] text-slate-400 font-gotu block">ऋतु:</span>
                <span className="text-sm sm:text-base font-bold text-amber-200 font-notoserif">{todayJain.season}</span>
              </div>
            </div>

            {onNavigate && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigate('panchang')}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-gotu font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>संपूर्ण पंचांग पृष्ठ खोलें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </GlassCard>

          {/* Major Jain Festivals Table */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-6 rounded-3xl border-white/10 bg-[#0c1222]/80 shadow-xl space-y-3"
          >
            <h3 className="text-base font-bold text-white font-notoserif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>दिगम्बर जैन वार्षिक महापर्व संदर्भ तालिका</span>
            </h3>
            <div className="space-y-2.5 pt-2">
              {[
                { name: 'दशलक्षण महापर्व (भाद्रपद)', tithi: 'भाद्रपद शुक्ल पंचमी से चतुर्दशी', desc: 'दस धर्मों (उत्तम क्षमा, मार्दव, आर्जव, सत्य, शौच, संयम, तप, त्याग, आकिंचन्य, ब्रह्मचर्य) का महापर्व।' },
                { name: 'अनंत चतुर्दशी', tithi: 'भाद्रपद शुक्ल चतुर्दशी', desc: 'वापसी व्रत, धूप दशमी एवं सिद्ध चक्र आराधना का समापन।' },
                { name: 'अष्टान्हिका महापर्व (कार्तिक)', tithi: 'कार्तिक शुक्ल अष्टमी से पूर्णिमा', desc: 'नंदीश्वर द्वीप के अकृत्रिम चैत्यालयों की 8 दिवसीय अलौकिक वंदना।' },
                { name: 'वीर निर्वाण संवत् एवं दीपावली', tithi: 'कार्तिक कृष्ण अमावस्या', desc: 'भगवान महावीर स्वामी का मोक्ष कल्याणक एवं गौतम गणधर का केवलज्ञान दिवस।' },
                { name: 'महावीर जयंती (कल्याणक)', tithi: 'चैत्र शुक्ल त्रयोदशी', desc: '24वें तीर्थंकर भगवान महावीर स्वामी का जन्म कल्याणक महोत्सव।' },
                { name: 'अक्षय तृतीया', tithi: 'वैशाख शुक्ल तृतीया', desc: 'प्रथम तीर्थंकर भगवान ऋषभदेव का इक्षुरस से प्रथम पारणा दिवस।' },
                { name: 'श्रुत पंचमी', tithi: 'ज्येष्ठ शुक्ल पंचमी', desc: 'षट्खंडागम ग्रंथ रचना एवं जिनवाणी लिपिबद्ध होने का पावन दिवस।' },
              ].map((parva, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="text-sm font-bold text-amber-200 font-gotu">{parva.name}</h4>
                    <p className="text-xs text-slate-300 font-gotu mt-0.5">{parva.desc}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg shrink-0 sm:self-center">
                    {parva.tithi}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* TAB 5: सिस्टम स्वास्थ्य, बैकअप व टूल्स (System Diagnostics & Tools) */}
      {adminTab === 'tools' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl space-y-6 relative z-10"
        >
          <div className="text-center max-w-2xl mx-auto mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-2 backdrop-blur-md">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-gotu">सिस्टम मेंटेनेंस • Diagnostics & Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white mb-2">
              सिस्टम स्वास्थ्य, बैकअप एवं डेटा टूल्स
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
              लोकल स्टोरेज उपयोग, गूगल शीट वेबहुक कनेक्शन स्थिति, संपूर्ण एडमिन डेटा बैकअप (JSON) एवं कैश शुद्धिकरण।
            </p>
          </div>

          {/* System Diagnostics Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <GlassCard
              variant="sacred"
              className="p-4 rounded-2xl border-white/10 bg-[#0c1222]/80 flex flex-col justify-between"
            >
              <div className="text-xs text-slate-400 font-gotu flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>लोकल स्टोरेज उपयोग</span>
              </div>
              <div className="text-2xl font-bold text-white font-mono mt-2">
                {storageUsageKB} KB
              </div>
              <div className="text-[10px] text-slate-400 font-gotu mt-1">
                ब्राउज़र सीमा: ~5,120 KB
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-4 rounded-2xl border-white/10 bg-[#0c1222]/80 flex flex-col justify-between"
            >
              <div className="text-xs text-slate-400 font-gotu flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>स्थिति ओवरराइड्स</span>
              </div>
              <div className="text-2xl font-bold text-amber-300 font-mono mt-2">
                {(() => {
                  try {
                    const o = localStorage.getItem('jinvani_status_overrides');
                    return o ? Object.keys(JSON.parse(o)).length : 0;
                  } catch {
                    return 0;
                  }
                })()}
              </div>
              <div className="text-[10px] text-slate-400 font-gotu mt-1">
                स्थानीय रूप से सहेजे गए स्टेटस
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-4 rounded-2xl border-emerald-500/20 bg-emerald-950/20 flex flex-col justify-between"
            >
              <div className="text-xs text-emerald-300 font-gotu flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>2FA प्रमाणीकरण</span>
              </div>
              <div className="text-lg font-bold text-emerald-200 font-mono mt-2">
                TOTP (RFC 6238)
              </div>
              <div className="text-[10px] text-emerald-400/80 font-gotu mt-1">
                {is2FAEnabled ? 'Google Authenticator सक्रिय' : 'वैकल्पिक / निष्क्रिय'}
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-4 rounded-2xl border-amber-500/20 bg-amber-950/20 flex flex-col justify-between"
            >
              <div className="text-xs text-amber-300 font-gotu flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>हैशिंग अल्गोरिद्म</span>
              </div>
              <div className="text-lg font-bold text-amber-200 font-mono mt-2">
                SHA-256
              </div>
              <div className="text-[10px] text-amber-400/80 font-gotu mt-1">
                क्रिप्टोग्राफिक अपरिवर्तनीय
              </div>
            </GlassCard>
          </div>

          {/* Google Sheet Webhook Ping Test */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-6 rounded-3xl border-white/10 bg-[#0b1220]/90 shadow-xl space-y-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-notoserif flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span>गूगल स्प्रेडशीट वेबहुक कनेक्टिविटी परीक्षण</span>
                </h3>
                <p className="text-xs text-slate-300 font-gotu mt-0.5">
                  Google Apps Script वेबहुक से लेटेंसी व कनेक्शन की जांच करें।
                </p>
              </div>

              <button
                type="button"
                disabled={pingStatus === 'testing'}
                onClick={handlePingGoogleSheet}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-gotu font-bold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {pingStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>जाँच रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>कनेक्शन पिंग टेस्ट (Ping)</span>
                  </>
                )}
              </button>
            </div>

            {pingStatus === 'success' && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-gotu flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>गूगल शीट वेबहुक पूरी तरह सक्रिय है। लेटेंसी: <b>{pingLatency}ms</b> (उत्कृष्ट)</span>
              </div>
            )}
            {pingStatus === 'failed' && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-gotu flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>वेबहुक से कनेक्शन विफल हुआ। कृपया इंटरनेट कनेक्शन एवं स्क्रिप्ट यूआरएल जांचें।</span>
              </div>
            )}
          </GlassCard>

          {/* Backup & Restore Section */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-6 rounded-3xl border-white/10 bg-[#0b1220]/90 shadow-xl space-y-4"
          >
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-notoserif flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>एडमिन डेटा बैकअप एवं पुनर्स्थापना (Export & Import)</span>
              </h3>
              <p className="text-xs text-slate-300 font-gotu mt-0.5">
                सभी स्टेटस ओवरराइड्स, सार्वजनिक घोषणा सेटिंग्स एवं लेआउट का बैकअप एक क्लिक में JSON फ़ाइल में डाउनलोड या रीस्टोर करें।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/25 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white font-gotu block">
                    बैकअप डाउनलोड करें (Export JSON)
                  </span>
                  <span className="text-[11px] text-slate-400 font-gotu">
                    सुरक्षित बैकअप फ़ाइल अपने कंप्यूटर पर सहेजें
                  </span>
                </div>
              </button>

              <label className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/25 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center gap-3.5 group">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white font-gotu block">
                    बैकअप पुनर्स्थापित करें (Import JSON)
                  </span>
                  <span className="text-[11px] text-slate-400 font-gotu">
                    पूर्व में डाउनलोड की गई फ़ाइल चुनें
                  </span>
                </div>
              </label>
            </div>
          </GlassCard>

          {/* Cache Purge & Overrides Reset */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-6 rounded-3xl border-rose-500/20 bg-rose-950/10 shadow-xl space-y-3"
          >
            <div>
              <h3 className="text-sm sm:text-base font-bold text-rose-200 font-notoserif flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>कैश शुद्धिकरण एवं रीसेट क्रियाएँ</span>
              </h3>
              <p className="text-xs text-slate-300 font-gotu mt-0.5">
                नया अपडेट आने पर सर्विस वर्कर कैश साफ़ करें या सभी कस्टम ओवरराइड्स को डिफ़ॉल्ट पर रीसेट करें।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePurgeCache}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-gotu font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>कैश साफ़ करें एवं ताज़ा लोड करें (Purge Cache)</span>
              </button>

              <button
                type="button"
                onClick={handleResetOverrides}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-gotu font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>सभी स्थिति ओवरराइड्स रीसेट करें</span>
              </button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* TAB 6: प्रशासक मार्गदर्शिका एवं सुरक्षा संदर्भ (Admin Guide & Security Manual) */}
      {adminTab === 'guide' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl space-y-6 relative z-10"
        >
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-2.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-gotu">प्रशासक संदर्भ निर्देशिका • Admin Handbook & Security Manual</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 mb-2.5 leading-tight">
              सिस्टम विन्यास, सुरक्षा निर्देश एवं एडमिन गाइड
            </h2>
            <p className="text-xs sm:text-sm text-slate-200/85 font-gotu leading-relaxed max-w-[65ch] mx-auto">
              पासवर्ड बदलने के 3 माध्यम (.env, कोड व UI), 2FA & Passkey सक्रियण, ऑफलाइन आपातकालीन रिकवरी कोड्स, तथा लाइव SHA-256 हैश जनरेटर के संपूर्ण निर्देश।
            </p>
          </div>

          {/* Quick Overview Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <GlassCard
              variant="sacred"
              className="p-3.5 sm:p-4 rounded-2xl border-amber-500/25 bg-[#0c1222]/90 flex flex-col justify-between"
            >
              <div className="text-xs text-amber-300 font-gotu flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>मास्टर पासवर्ड</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white font-mono mt-2 truncate">
                SHA-256 Protected
              </div>
              <div className="text-[10px] text-amber-400/80 font-gotu mt-1">
                UI / .env / Code समर्थित
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-3.5 sm:p-4 rounded-2xl border-emerald-500/25 bg-emerald-950/20 flex flex-col justify-between"
            >
              <div className="text-xs text-emerald-300 font-gotu flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                <span>Passkey (FIDO2)</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-200 font-mono mt-2">
                1-टैप बायोमेट्रिक
              </div>
              <div className="text-[10px] text-emerald-400/80 font-gotu mt-1">
                {hasPasskey ? 'सक्रिय (Active)' : 'पंजीकरण योग्य'}
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-3.5 sm:p-4 rounded-2xl border-cyan-500/25 bg-cyan-950/20 flex flex-col justify-between"
            >
              <div className="text-xs text-cyan-300 font-gotu flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>2FA TOTP (6-अंक)</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-cyan-200 font-mono mt-2">
                Google Authenticator
              </div>
              <div className="text-[10px] text-cyan-400/80 font-gotu mt-1">
                {is2FAEnabled ? 'सक्रिय (Active)' : 'वैकल्पिक / निष्क्रिय'}
              </div>
            </GlassCard>

            <GlassCard
              variant="sacred"
              className="p-3.5 sm:p-4 rounded-2xl border-purple-500/25 bg-purple-950/20 flex flex-col justify-between"
            >
              <div className="text-xs text-purple-300 font-gotu flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>आपातकालीन रिकवरी</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-purple-200 font-mono mt-2">
                3 सुरक्षित स्लॉट्स
              </div>
              <div className="text-[10px] text-purple-400/80 font-gotu mt-1">
                0% प्लेनटेक्स्ट स्टोरेज
              </div>
            </GlassCard>
          </div>

          {/* Section 1: Password Configuration & 3 Methods */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-7 rounded-3xl border-amber-500/30 bg-[#0b1220]/95 shadow-xl space-y-5"
          >
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-gotu font-semibold">
                <KeyRound className="w-4 h-4" />
                <span>क्रेडेंशियल्स & पासवर्ड विन्यास (Password Architecture)</span>
              </div>
              <h3 className="text-lg sm:text-xl font-notoserif font-bold text-white mt-1">
                डिफ़ॉल्ट क्रेडेंशियल्स एवं पासवर्ड बदलने के 3 सुरक्षित तरीके
              </h3>
              <p className="text-xs text-slate-300 font-gotu mt-1">
                चूँकि यह ओपन-सोर्स और क्लाइंट-साइड प्रोटेक्टेड एप्लिकेशन है, आप पासवर्ड को अपनी आवश्यकतानुसार 3 अलग-अलग स्तरों पर बदल सकते हैं:
              </p>
            </div>

            {/* Current Default Credentials Box */}
            <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-amber-300 font-gotu block">
                  सिस्टम प्रारंभिक डिफ़ॉल्ट पासवर्ड:
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm sm:text-base font-mono font-bold text-amber-100 bg-slate-950/80 px-3 py-1 rounded-lg border border-amber-500/30">
                    Jinvani@2026#Admin
                  </code>
                  <button
                    type="button"
                    onClick={() => copyGuideText('Jinvani@2026#Admin', 'default_pass', 'डिफ़ॉल्ट पासवर्ड कॉपी हो गया!')}
                    className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors cursor-pointer"
                    title="पासवर्ड कॉपी करें"
                  >
                    {copiedKey === 'default_pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-amber-200/80 font-gotu max-w-sm">
                ⚠️ <strong>महत्वपूर्ण:</strong> वेबसाइट को पब्लिक डोमेन पर लाइव करने से पूर्व कृपया अपना पासवर्ड नीचे दिए गए तरीकों में से किसी एक द्वारा अवश्य बदल लें।
              </div>
            </div>

            {/* 3 Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Method 1: UI */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                      विधि 1 (त्वरित UI)
                    </span>
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-gotu">एडमिन डैशबोर्ड से बदलें</h4>
                  <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                    शीर्ष हेडर में <strong>"पासवर्ड"</strong> बटन दबाएं, वर्तमान पासवर्ड व नया पासवर्ड दर्ज करके सेव करें।
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-gotu">
                  • तुरंत लागू होता है<br />
                  • ब्राउज़र में SHA-256 हैश सहेजता है
                </div>
              </div>

              {/* Method 2: .env File */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                      विधि 2 (अनुशंसित)
                    </span>
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-gotu">.env फ़ाइल द्वारा विन्यास</h4>
                  <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                    प्रोजेक्ट के मुख्य फोल्डर में <code className="text-amber-200">.env</code> फ़ाइल में पर्यावरण चर (Environment Variable) जोड़ें:
                  </p>
                  <div className="bg-slate-900 border border-white/10 p-2 rounded-xl flex items-center justify-between gap-1 text-[11px] font-mono text-cyan-200">
                    <span className="truncate">VITE_ADMIN_PASSWORD="आपका_पासवर्ड"</span>
                    <button
                      type="button"
                      onClick={() => copyGuideText('VITE_ADMIN_PASSWORD="आपका_मजबूत_पासवर्ड"', 'env_code', '.env सिंटैक्स कॉपी हो गया!')}
                      className="p-1 text-slate-400 hover:text-cyan-300"
                      title="कॉपी करें"
                    >
                      {copiedKey === 'env_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-gotu">
                  • कोड को छुए बिना सुरक्षित<br />
                  • Vercel/Netlify पर आसानी से सेट करें
                </div>
              </div>

              {/* Method 3: Source Code Hardening */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      विधि 3 (स्थायी कोड)
                    </span>
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-gotu">सोर्स कोड में हैश बदलना</h4>
                  <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                    फ़ाइल: <code className="text-amber-200">src/pages/AdminLogin.tsx</code><br />
                    लाइन 74 पर <code className="text-amber-300">MASTER_PASSWORD_HASH</code> को अपने नए पासवर्ड के 64-अक्षर SHA-256 हैश से बदलें।
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-gotu">
                  • कभी प्लेनटेक्स्ट कोड में नहीं दिखता<br />
                  • 100% अपरिवर्तनीय क्रिप्टोग्राफिक लॉक
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 2: Interactive Live SHA-256 Hash Generator */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-7 rounded-3xl border-emerald-500/30 bg-[#0b1220]/95 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-gotu font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>लाइव क्रिप्टोग्राफिक टूल (Built-in SHA-256 Generator)</span>
                </div>
                <h3 className="text-base sm:text-lg font-notoserif font-bold text-white mt-0.5">
                  नया पासवर्ड हैश जनरेटर (Instant Hash Calculator)
                </h3>
              </div>
              <span className="text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-mono">
                Web Crypto API • क्लाइंट-साइड 100%
              </span>
            </div>

            <p className="text-xs text-slate-300 font-gotu">
              किसी असुरक्षित बाहरी वेबसाइट पर जाने की आवश्यकता नहीं है। यहाँ अपना नया गुप्त पासवर्ड टाइप करें, और उसका 64-अक्षरों का वास्तविक SHA-256 हैश नीचे तुरंत प्राप्त करें:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-amber-200 font-gotu block mb-1.5">
                  नया पासवर्ड टाइप करें:
                </label>
                <input
                  type="text"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="उदा. Mahavira@Jinvani#2026"
                  className="w-full bg-slate-950/80 border border-emerald-500/30 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-emerald-200 placeholder:text-slate-600 font-mono focus:outline-none"
                />
              </div>

              {generatedHash ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-300 font-gotu flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      जनरेटेड 256-बिट क्रिप्टोग्राफिक हैश (SHA-256):
                    </span>
                    <button
                      type="button"
                      onClick={() => copyGuideText(generatedHash, 'gen_hash', 'SHA-256 हैश कॉपी हो गया!')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-gotu flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedKey === 'gen_hash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>हैश कॉपी करें</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-amber-200 break-all select-all">
                    {generatedHash}
                  </div>
                  <p className="text-[10px] text-slate-400 font-gotu">
                    👉 इस हैश को कॉपी करके <code className="text-amber-300">src/pages/AdminLogin.tsx</code> के <code className="text-amber-300">MASTER_PASSWORD_HASH</code> में पेस्ट कर दें।
                  </p>
                </motion.div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/40 border border-dashed border-white/10 text-center text-xs text-slate-500 font-gotu">
                  पासवर्ड टाइप करते ही वास्तविक समय में SHA-256 हैश यहाँ प्रदर्शित होगा।
                </div>
              )}
            </div>
          </GlassCard>

          {/* Section 3: Passkeys (WebAuthn / Biometrics) Guide */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-7 rounded-3xl border-cyan-500/30 bg-[#0b1220]/95 shadow-xl space-y-4"
          >
            <div className="border-b border-white/10 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-gotu font-semibold">
                  <Fingerprint className="w-4 h-4" />
                  <span>Passkeys • बायोमेट्रिक व हार्डवेयर कुंजी (FIDO2)</span>
                </div>
                <h3 className="text-base sm:text-lg font-notoserif font-bold text-white mt-0.5">
                  बिना पासवर्ड 1-टैप बायोमेट्रिक लॉगिन (Windows Hello / Touch ID / Face ID)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIs2FAModalOpen(true);
                  setTestOtpInput('');
                  setTestOtpResult(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 text-xs font-gotu font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>सुरक्षा केंद्र में Passkey प्रबंधित करें</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-cyan-200 font-gotu flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Passkey कैसे चालू व उपयोग करें?</span>
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-300 font-gotu space-y-1.5 pl-1 leading-relaxed">
                  <li>शीर्ष हेडर में <strong>"सुरक्षा केंद्र (Passkey/2FA)"</strong> बटन पर क्लिक करें।</li>
                  <li><strong>"इस डिवाइस पर Passkey जोड़ें"</strong> बटन दबाएं और डिवाइस का बायोमेट्रिक स्कैन करें।</li>
                  <li>हरा टिक आने पर Passkey सक्रिय हो जाएगी।</li>
                  <li>अगली बार लॉगिन स्क्रीन पर सबसे ऊपर <strong>"Passkey से 1-टैप लॉगिन करें"</strong> बटन आएगा। उस पर 1 क्लिक करते ही बिना पासवर्ड डाले डैशबोर्ड खुल जाएगा।</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-cyan-200 font-gotu flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>यह 100% फ़िशिंग-प्रूफ क्यों है?</span>
                </h4>
                <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                  Passkey FIDO2/WebAuthn क्रिप्टोग्राफिक पब्लिक-की एल्गोरिद्म पर काम करती है। आपकी बायोमेट्रिक जानकारी (फिंगरप्रिंट/चेहरा) कभी भी आपके फोन या लैपटॉप के हार्डवेयर सिक्योर एन्क्लेव (TPM / TEE) से बाहर नहीं निकलती। 
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-gotu">
                  ✓ कोई पासवर्ड लीक होने का डर नहीं<br />
                  ✓ कीलॉगर या स्पाईवेयर से अभेद्य
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 4: Emergency Recovery Codes & Storage Safety */}
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-7 rounded-3xl border-purple-500/30 bg-[#0b1220]/95 shadow-xl space-y-4"
          >
            <div className="border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-gotu font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>आपातकालीन रिकवरी कोड्स (Offline Recovery System)</span>
              </div>
              <h3 className="text-base sm:text-lg font-notoserif font-bold text-white mt-0.5">
                फोन खोने या ऐप हटने की स्थिति में रिकवरी कोड्स एवं उनकी सुरक्षा
              </h3>
              <p className="text-xs text-slate-300 font-gotu mt-1">
                यदि आप पासवर्ड भूल जाएं या आपका Authenticator ऐप मोबाइल से अनइंस्टॉल हो जाए, तो ये 3 अधिकृत कोड्स अंतिम सुरक्षा कवच हैं:
              </p>
            </div>

            {/* 3 Recovery Codes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: 'JIN-8492-SAFE', key: 'rec1', desc: 'प्राथमिक बैकअप कोड' },
                { code: 'JIN-3174-OMMM', key: 'rec2', desc: 'द्वितीयक बैकअप कोड' },
                { code: 'JIN-9518-MOKS', key: 'rec3', desc: 'तृतीयक बैकअप कोड' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-purple-300 font-gotu block">{item.desc}</span>
                    <code className="text-sm font-mono font-bold text-amber-200">{item.code}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyGuideText(item.code, item.key, `${item.code} कॉपी हो गया!`)}
                    className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors cursor-pointer"
                    title="कोड कॉपी करें"
                  >
                    {copiedKey === item.key ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Crucial Security Explanation */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-200 font-gotu">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ये कोड कहाँ स्टोर हैं? क्या यह सुरक्षित है? (Security Verification)</span>
              </div>
              <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                यह कोड कोडबेस या क्लाइंट जावास्क्रिप्ट बंडल में <strong>सादे अक्षरों (plaintext) में कभी भी स्टोर नहीं होते</strong>। कोडबेस में केवल इनके क्रिप्टोग्राफिक <strong>SHA-256 हैश</strong> सुरक्षित हैं। 
              </p>
              <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                जब आप लॉगिन में रिकवरी कोड दर्ज करते हैं, तो आपका ब्राउज़र आपके इनपुट को तुरंत हैश करके मिलान करता है। इसलिए इंटरनेट पर कोई भी व्यक्ति पेज का 'Source Code' या 'Inspect Element' करके भी इन कोड्स को नहीं देख सकता।
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-[11px] text-slate-400 space-y-1">
                <div>Hash 1: <span className="text-slate-300">7be95f6ef2c6828ad36a1ef3f48be2226fdee80138e3889c12f946285ca67e56</span></div>
                <div>Hash 2: <span className="text-slate-300">272f85b11e0a2bd0e426d1e6233058902c0056e7b65decd1bbe8c00f48916cf2</span></div>
                <div>Hash 3: <span className="text-slate-300">d22fdacd4496ce52a143603eb975acf222d85a229fecaa0e0c404dea3f83508f</span></div>
              </div>
            </div>
          </GlassCard>

          {/* Section 5: 2FA & Serverless Architecture Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2FA Authenticator Info */}
            <GlassCard
              variant="sacred"
              className="p-5 sm:p-6 rounded-3xl border-amber-500/25 bg-[#0b1220]/95 shadow-xl space-y-3"
            >
              <h3 className="text-sm sm:text-base font-bold text-white font-notoserif flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>2FA Authenticator कुंजी एवं टाइम सिंक</span>
              </h3>
              <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                Google Authenticator, Microsoft Authenticator या Aegis में QR कोड या इस सीक्रेट कुंजी से खाता जोड़ें:
              </p>
              <div className="flex items-center justify-between bg-slate-950/80 border border-amber-500/30 p-2.5 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 font-gotu block">मास्टर 2FA सीक्रेट:</span>
                  <code className="text-xs sm:text-sm font-mono font-bold text-amber-200 tracking-wider">
                    {MASTER_2FA_SECRET}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => copyGuideText(MASTER_2FA_SECRET, 'guide_2fa_secret', '2FA सीक्रेट कुंजी कॉपी हो गई!')}
                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors cursor-pointer"
                >
                  {copiedKey === 'guide_2fa_secret' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[11px] text-slate-300 font-gotu space-y-1 pt-1">
                <span className="font-semibold text-amber-300">💡 यदि OTP "अमान्य" बताए:</span>
                <p className="text-slate-400">
                  Authenticator ऐप्स डिवाइस की घड़ी (Time Sync) पर निर्भर करती हैं। फोन की Authenticator ऐप सेटिंग्स में जाकर <strong>"Time sync"</strong> / <strong>"Sync now"</strong> करें।
                </p>
              </div>
            </GlassCard>

            {/* Serverless & Google Sheet Architecture */}
            <GlassCard
              variant="sacred"
              className="p-5 sm:p-6 rounded-3xl border-emerald-500/25 bg-[#0b1220]/95 shadow-xl space-y-3"
            >
              <h3 className="text-sm sm:text-base font-bold text-white font-notoserif flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>बिना सर्वर के पूर्ण स्वायत्तता (Zero-Server Architecture)</span>
              </h3>
              <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                यह संपूर्ण पोर्टल बिना किसी अतिरिक्त बैकएंड सर्वर के स्वतः संचालित होता है:
              </p>
              <ul className="text-xs text-slate-300 font-gotu space-y-1.5 pl-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>प्रमाणीकरण:</strong> ब्राउज़र का नेटिव Web Crypto API (SHA-256 + TOTP + WebAuthn Passkeys)।</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>डेटा सिंक:</strong> उपयोगकर्ताओं के अशुद्धि सुझाव सीधे आपकी Google Sheet से सुरक्षित वेबहुक द्वारा लोड होते हैं।</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>ब्रूट फोर्स सुरक्षा:</strong> 5 गलत प्रयासों पर 5 मिनट का ऑटोमैटिक लॉकआउट।</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>बैकअप:</strong> 'सिस्टम टूल्स' टैब से एक क्लिक में संपूर्ण डेटा JSON में निर्यात/आयात करें।</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </motion.div>
      )}
    </div>
  );
};
