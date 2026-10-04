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
  Calendar,
  Send,
  GitBranch,
  Settings,
  RotateCcw,
} from 'lucide-react';
import { GOOGLE_SHEET_WEBHOOK_URL } from '../components/features/FeedbackModal';
import { ContentCmsTab } from '../components/admin/ContentCmsTab';
import { FeedbackTab } from '../components/admin/FeedbackTab';
import { AnnouncementTab } from '../components/admin/AnnouncementTab';
import { AdminGuideTab } from '../components/admin/AdminGuideTab';


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

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout
const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes auto-logout

// Complete Google Apps Script Two-Way Sync Template
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * जैन जिनवाणी — Google Apps Script द्वि-मार्गी सिंक (Two-Way Sync Web App)
 * 1. doGet(e)      : वेबसाइट/एडमिन पैनल को शुद्ध डेटा प्रदान करता है।
 * 2. doPost(e)     : नया सुझाव जोड़ना, स्थिति (Status) बदलना, व प्रविष्टि डिलीट करना।
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var data = [];
  
  // पहली पंक्ति हेडर होती है (row 0), डेटा row 1 (शीट पंक्ति 2) से शुरू होता है
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var timestamp = row[0] ? String(row[0]) : '';
    var type = row[1] ? String(row[1]) : 'सामान्य सुझाव';
    var scriptureName = row[2] ? String(row[2]) : '';
    var details = row[3] ? String(row[3]) : '';
    var email = row[4] ? String(row[4]) : '';
    var status = row[5] ? String(row[5]) : 'प्राप्त हुआ';
    
    // केवल वही पंक्तियाँ लें जिनमें विवरण या ग्रंथ का नाम मौजूद हो (खाली घोस्ट पंक्तियों को छोड़ें)
    if (details.trim() !== '' || scriptureName.trim() !== '') {
      data.push({
        id: i + 1, // Google Sheet की वास्तविक पंक्ति संख्या (Row Number)
        timestamp: timestamp,
        type: type,
        scriptureName: scriptureName,
        details: details,
        status: status
      });
    }
  }
  
  // नए सुझाव सबसे ऊपर दिखें (Reverse Order)
  return ContentService.createTextOutput(JSON.stringify(data.reverse()))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    
    // सुनिश्चित करें कि हेडर पंक्ति मौजूद है
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "दिनांक व समय (Timestamp)",
        "सुझाव का प्रकार (Type)",
        "पाठ / ग्रंथ का नाम (Scripture)",
        "अशुद्धि / सुझाव का विवरण (Details)",
        "ईमेल (Email)",
        "स्थिति (Status)"
      ]);
    }
    
    // 1. स्थिति अद्यतन (Update Status Action)
    if (data.action === 'updateStatus' && data.rowId) {
      var targetRow = Number(data.rowId);
      var totalRows = sheet.getLastRow();
      
      if (targetRow >= 2 && targetRow <= totalRows) {
        sheet.getRange(targetRow, 6).setValue(data.newStatus || 'प्राप्त हुआ');
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          action: "updateStatus",
          rowId: targetRow,
          newStatus: data.newStatus
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // बैकअप: टाइमस्टैम्प से खोजकर स्थिति अपडेट करें
      var allRows = sheet.getDataRange().getValues();
      for (var r = 1; r < allRows.length; r++) {
        if (data.timestamp && String(allRows[r][0]) === String(data.timestamp)) {
          sheet.getRange(r + 1, 6).setValue(data.newStatus);
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            action: "updateStatus",
            matchedRow: r + 1
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // 2. प्रविष्टि हटाना (Delete Row Action)
    if (data.action === 'delete' && data.rowId) {
      var delRow = Number(data.rowId);
      var maxRows = sheet.getLastRow();
      
      if (delRow >= 2 && delRow <= maxRows) {
        sheet.deleteRow(delRow);
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          action: "delete",
          deletedRow: delRow
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // बैकअप: टाइमस्टैम्प से खोजकर हटाएं
      var rowsToCheck = sheet.getDataRange().getValues();
      for (var d = 1; d < rowsToCheck.length; d++) {
        if (data.timestamp && String(rowsToCheck[d][0]) === String(data.timestamp)) {
          sheet.deleteRow(d + 1);
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            action: "delete",
            matchedRow: d + 1
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // 3. खाली पंक्तियाँ साफ़ करना (Cleanup Ghost Rows Action)
    if (data.action === 'cleanup') {
      var currentRows = sheet.getDataRange().getValues();
      var deletedCount = 0;
      for (var c = currentRows.length - 1; c >= 1; c--) {
        var rowContent = currentRows[c];
        var sName = rowContent[2] ? String(rowContent[2]).trim() : '';
        var dText = rowContent[3] ? String(rowContent[3]).trim() : '';
        if (sName === '' && dText === '') {
          sheet.deleteRow(c + 1);
          deletedCount++;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "cleanup",
        deletedCount: deletedCount
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 4. नया सुझाव जोड़ना (Default Submission from Website)
    if (!data.details && !data.scriptureName) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ignored_empty",
        message: "No details or scripture name provided"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.type || 'सामान्य सुझाव',
      data.scriptureName || '',
      data.details || '',
      data.email || '',
      'प्राप्त हुआ'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

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
  // Authentication state with dynamic session expiration
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const isAuth = Number((sessionStorage.getItem('jinvani_admin_token') || '').split('.')[0]) > Date.now();
      const authTime = Number(sessionStorage.getItem('jinvani_admin_auth_time') || 0);
      const savedTimeoutMin = Number(localStorage.getItem('jinvani_session_timeout_min') || 60);
      if (isAuth && Date.now() - authTime < savedTimeoutMin * 60 * 1000) {
        return true;
      }
      sessionStorage.removeItem('jinvani_admin_token');
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
  const [adminTab, setAdminTab] = useState<'feedback' | 'announcement' | 'content' | 'settings' | 'guide'>('feedback');

  // Settings Tab State
  const [activeSettingCategory, setActiveSettingCategory] = useState<'security' | 'display' | 'sheet' | 'data' | 'git'>('security');

  const [sessionTimeoutMin, setSessionTimeoutMin] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jinvani_session_timeout_min');
      if (saved) return Number(saved);
    }
    return 60;
  });

  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jinvani_auto_refresh_sec');
      if (saved) return Number(saved);
    }
    return 0; // 0 = disabled
  });

  // Live session remaining seconds countdown
  const [sessionRemainingSec, setSessionRemainingSec] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const authTime = Number(sessionStorage.getItem('jinvani_admin_auth_time') || 0);
      const savedTimeoutMin = Number(localStorage.getItem('jinvani_session_timeout_min') || 60);
      if (authTime > 0) {
        const elapsedSec = Math.floor((Date.now() - authTime) / 1000);
        return Math.max(0, savedTimeoutMin * 60 - elapsedSec);
      }
      return savedTimeoutMin * 60;
    }
    return 60 * 60;
  });

  // Live auto-refresh countdown
  const [autoRefreshCountdownSec, setAutoRefreshCountdownSec] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jinvani_auto_refresh_sec');
      if (saved) return Number(saved);
    }
    return 0;
  });

  // Format seconds to MM:SS or HH:MM:SS
  const formatSessionTime = (seconds: number): string => {
    if (seconds <= 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const [customWebhookUrl, setCustomWebhookUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jinvani_custom_webhook_url') || '';
    }
    return '';
  });

  const [customSheetUrl, setCustomSheetUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jinvani_custom_sheet_url') || '';
    }
    return '';
  });

  const activeWebhookUrl = customWebhookUrl.trim() || GOOGLE_SHEET_WEBHOOK_URL;
  const activeSheetUrl = customSheetUrl.trim() || 'https://docs.google.com/spreadsheets/';

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
  const [announcementType, setAnnouncementType] = useState<'permanent' | 'scheduled' | 'time_frame'>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).type || 'permanent' : 'permanent';
    } catch {
      return 'permanent';
    }
  });
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).text || '' : 'पर्युषण महापर्व के पावन अवसर पर 10 दिवसीय विशेष स्वाध्याय एवं शांतिधारा विधान उपलब्ध है।';
    } catch {
      return 'पर्युषण महापर्व के पावन अवसर पर 10 दिवसीय विशेष स्वाध्याय एवं शांतिधारा विधान उपलब्ध है।';
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
  const [announcementStartDate, setAnnouncementStartDate] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).startDate || '' : '';
    } catch {
      return '';
    }
  });
  const [announcementEndDate, setAnnouncementEndDate] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).endDate || '' : '';
    } catch {
      return '';
    }
  });
  const [isPublishingAnnouncement, setIsPublishingAnnouncement] = useState(false);

  const handleSaveAnnouncement = () => {
    const data = {
      active: announcementActive,
      type: announcementType,
      text: announcementText.trim(),
      badge: announcementBadge.trim(),
      link: announcementLink.trim(),
      startDate: announcementStartDate,
      endDate: announcementEndDate,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('jinvani_admin_announcement', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));
      showToast(announcementActive ? 'स्थानीय घोषणा वेबसाइट पर लाइव कर दी गई!' : 'घोषणा सहेज दी गई (निष्क्रिय)।');
    } catch {
      showToast('घोषणा सहेजने में त्रुटि हुई।');
    }
  };

  const handlePublishGlobalAnnouncement = async () => {
    setIsPublishingAnnouncement(true);
    const data = {
      active: announcementActive,
      type: announcementType,
      text: announcementText.trim(),
      badge: announcementBadge.trim(),
      link: announcementLink.trim(),
      startDate: announcementStartDate,
      endDate: announcementEndDate,
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Save locally for instant preview
      localStorage.setItem('jinvani_admin_announcement', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));

      // 2. Publish to Cloudflare Edge API
      const authHash = sessionStorage.getItem('jinvani_admin_token') || '';
      const res = await fetch('/api/announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authHash}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast('सार्वजनिक घोषणा विश्वभर के सभी श्रद्धालुओं के लिए लाइव पब्लिश हो गई!');
      } else {
        showToast('स्थानीय रूप से सहेजा गया! (एज सर्वर से सम्पर्क नहीं हो सका)');
      }
    } catch {
      showToast('स्थानीय रूप से सहेजा गया! (एज सर्वर ऑफ़लाइन)');
    } finally {
      setIsPublishingAnnouncement(false);
    }
  };

  const handleDownloadAnnouncementJSON = () => {
    const data = {
      active: announcementActive,
      type: announcementType,
      badge: announcementBadge.trim(),
      text: announcementText.trim(),
      link: announcementLink.trim(),
      startDate: announcementStartDate,
      endDate: announcementEndDate,
      updatedAt: new Date().toISOString(),
    };
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'announcement.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('announcement.json डाउनलोड हो गया! इसे public/ फ़ोल्डर में रखकर Push करें।');
    } catch {
      showToast('डाउनलोड में त्रुटि हुई।');
    }
  };

  const handleClearAnnouncement = () => {
    try {
      localStorage.removeItem('jinvani_admin_announcement');
      setAnnouncementActive(false);
      setAnnouncementText('');
      setAnnouncementStartDate('');
      setAnnouncementEndDate('');
      window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));
      showToast('सार्वजनिक घोषणा हटा दी गई।');
    } catch {}
  };

  // GitHub Repository Connection State (Saved in LocalStorage)
  const [githubRepo, setGithubRepo] = useState<string>(() => {
    return localStorage.getItem('jinvani_git_repo') || '';
  });
  const [githubBranch, setGithubBranch] = useState<string>(() => {
    return localStorage.getItem('jinvani_git_branch') || 'main';
  });
  const [githubToken, setGithubToken] = useState<string>(() => {
    return localStorage.getItem('jinvani_git_token') || '';
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [isCommittingGit, setIsCommittingGit] = useState(false);

  // Test GitHub Connection
  const handleTestConnection = async () => {
    if (!githubRepo.trim()) {
      showToast('कृपया रिपॉजिटरी नाम (उदा. username/repo) दर्ज करें।');
      return;
    }
    setIsTestingConnection(true);
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };
      if (githubToken.trim()) {
        headers['Authorization'] = `Bearer ${githubToken.trim()}`;
      }
      const res = await fetch(`https://api.github.com/repos/${githubRepo.trim()}`, { headers });
      if (res.ok) {
        setConnectionStatus('connected');
        localStorage.setItem('jinvani_git_repo', githubRepo.trim());
        localStorage.setItem('jinvani_git_branch', githubBranch.trim() || 'main');
        if (githubToken.trim()) {
          localStorage.setItem('jinvani_git_token', githubToken.trim());
        }
        showToast('GitHub रिपॉजिटरी से सफलतापूर्वक संपर्क स्थापित हुआ!');
      } else {
        setConnectionStatus('error');
        showToast('रिपॉजिटरी नहीं मिली या टोकन अमान्य है।');
      }
    } catch {
      setConnectionStatus('error');
      showToast('GitHub API से संपर्क नहीं हो सका।');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Direct GitHub Commit via API
  const handleCommitToGitHub = async () => {
    if (!githubRepo.trim() || !githubToken.trim()) {
      showToast('सीधे GitHub पर कमिट हेतु "सेटिंग्स" -> "गिटहब कनेक्शन" में Repository और Token दर्ज करें, अथवा "JSON डाउनलोड" का उपयोग करें।');
      setAdminTab('settings');
      setActiveSettingCategory('git');
      return;
    }

    setIsCommittingGit(true);
    const payload = {
      active: announcementActive,
      type: announcementType,
      badge: announcementBadge.trim(),
      text: announcementText.trim(),
      link: announcementLink.trim(),
      startDate: announcementStartDate,
      endDate: announcementEndDate,
      updatedAt: new Date().toISOString(),
    };

    try {
      const filePath = 'public/announcement.json';
      const fileUrl = `https://api.github.com/repos/${githubRepo.trim()}/contents/${filePath}?ref=${githubBranch.trim()}`;
      const getRes = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      let sha: string | undefined;
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      const jsonContent = JSON.stringify(payload, null, 2);
      const utf8Bytes = new TextEncoder().encode(jsonContent);
      let binary = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      const base64Content = btoa(binary);

      const putRes = await fetch(`https://api.github.com/repos/${githubRepo.trim()}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update live announcement: ${payload.badge} [skip ci]`,
          content: base64Content,
          branch: githubBranch.trim(),
          ...(sha ? { sha } : {}),
        }),
      });

      if (putRes.ok) {
        localStorage.setItem('jinvani_admin_announcement', JSON.stringify(payload));
        window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));
        showToast('🎉 GitHub पर कमिट सफलतापूर्वक हो गया! Cloudflare ~45s में साइट लाइव कर देगा।');
      } else {
        const errJson = await putRes.json().catch(() => ({}));
        showToast(`GitHub कमिट विफल: ${errJson.message || putRes.statusText}`);
      }
    } catch (err: any) {
      showToast(`कमिट त्रुटि: ${err?.message || 'अज्ञात त्रुटि'}`);
    } finally {
      setIsCommittingGit(false);
    }
  };


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
      const res = await fetch(activeWebhookUrl, { method: 'GET' });
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
        deletedItems: localStorage.getItem('jinvani_deleted_items')
          ? JSON.parse(localStorage.getItem('jinvani_deleted_items')!)
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
        if (parsed.deletedItems) {
          localStorage.setItem('jinvani_deleted_items', JSON.stringify(parsed.deletedItems));
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
    if (window.confirm('क्या आप सभी स्थानीय स्थिति ओवरराइड्स एवं हटाई गई प्रविष्टियाँ रीसेट करना चाहते हैं?')) {
      localStorage.removeItem('jinvani_status_overrides');
      localStorage.removeItem('jinvani_deleted_items');
      showToast('सभी स्थिति ओवरराइड्स एवं हटाई गई प्रविष्टियाँ रीसेट कर दी गईं।');
      fetchData();
    }
  };



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

  // Manual session reset & extend helper
  const handleExtendSession = (extraMinutes?: number) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('jinvani_admin_auth_time', String(Date.now()));
    }
    const mins = extraMinutes || sessionTimeoutMin;
    setSessionRemainingSec(mins * 60);
    showToast(`सत्र समय ${mins} मिनट के लिए नवीनीकृत किया गया।`);
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

  // Session Inactivity Monitoring with 1-second live countdown ticker
  useEffect(() => {
    if (!isAuthenticated) return;
    const timeoutSec = sessionTimeoutMin * 60;

    const checkAndTick = () => {
      const authTime = Number(sessionStorage.getItem('jinvani_admin_auth_time') || 0);
      if (!authTime) {
        sessionStorage.setItem('jinvani_admin_auth_time', String(Date.now()));
        setSessionRemainingSec(timeoutSec);
        return;
      }
      const elapsedSec = Math.floor((Date.now() - authTime) / 1000);
      const remaining = Math.max(0, timeoutSec - elapsedSec);
      setSessionRemainingSec(remaining);

      if (remaining <= 0) {
        handleLogout('सत्र समाप्त हो गया (Session Expired)। सुरक्षा कारणों से पुनः लॉगिन करें।');
      }
    };

    checkAndTick();
    const sessionTimer = setInterval(checkAndTick, 1000);

    let lastActivityRecord = 0;
    const onUserActivity = () => {
      const now = Date.now();
      // Record user activity at most once every 5 seconds to prevent excessive state writes
      if (now - lastActivityRecord > 5000) {
        lastActivityRecord = now;
        if (sessionStorage.getItem('jinvani_admin_token')) {
          sessionStorage.setItem('jinvani_admin_auth_time', String(now));
        }
      }
    };

    window.addEventListener('click', onUserActivity);
    window.addEventListener('keydown', onUserActivity);

    return () => {
      clearInterval(sessionTimer);
      window.removeEventListener('click', onUserActivity);
      window.removeEventListener('keydown', onUserActivity);
    };
  }, [isAuthenticated, sessionTimeoutMin]);

  // Auto-refresh Feedback Entries with 1-second live ticking countdown
  useEffect(() => {
    if (!isAuthenticated || autoRefreshSec <= 0) {
      setAutoRefreshCountdownSec(0);
      return;
    }

    setAutoRefreshCountdownSec(autoRefreshSec);
    let nextRefreshTime = Date.now() + autoRefreshSec * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((nextRefreshTime - now) / 1000));
      setAutoRefreshCountdownSec(remaining);

      if (remaining <= 0) {
        fetchData(false);
        nextRefreshTime = Date.now() + autoRefreshSec * 1000;
        setAutoRefreshCountdownSec(autoRefreshSec);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefreshSec]);

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

  // All verification happens server-side (POST /api/auth). The server returns an HMAC-signed
  // session token; no password hash, TOTP secret or recovery code exists in this bundle.
  const authCall = async (body: object, token?: string): Promise<{ status: number; data: any }> => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    return { status: res.status, data: await res.json().catch(() => ({})) };
  };

  const handleDirectLogin = (token: string, totp: boolean, msg = 'सफलतापूर्वक एडमिन पोर्टल में प्रवेश हुआ!') => {
    localStorage.removeItem('jinvani_admin_attempts');
    localStorage.removeItem('jinvani_admin_lockout_until');
    sessionStorage.setItem('jinvani_admin_token', token);
    sessionStorage.setItem('jinvani_admin_auth_time', String(Date.now()));
    setSessionRemainingSec(sessionTimeoutMin * 60);
    setIs2FAEnabled(totp);
    setIsAuthenticated(true);
    setLoginStep('password');
    setPassword('');
    setOtpInput('');
    setLoginError('');
    showToast(msg);
  };

  // Step 1: password -> token, or "needOtp" when the server has 2FA configured
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

    setIsLoggingIn(true);
    try {
      const { status, data } = await authCall({ password });
      if (data.ok && data.token) {
        handleDirectLogin(data.token, Boolean(data.totp));
      } else if (data.needOtp) {
        setIs2FAEnabled(true);
        setLoginStep('totp');
        setOtpInput('');
        setIsUsingRecovery(false);
      } else if (status === 429 || status >= 500) {
        setLoginError(data.error || 'सर्वर त्रुटि। कृपया पुनः प्रयास करें।');
      } else {
        handleFailedAttempt();
      }
    } catch {
      setLoginError('सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Step 2: OTP / recovery code, sent together with the password and verified server-side
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
      const { status, data } = await authCall({ password, otp: cleanInput });
      if (data.ok && data.token) {
        handleDirectLogin(
          data.token,
          true,
          isUsingRecovery ? 'आपातकालीन रिकवरी कोड द्वारा प्रवेश सफल!' : '2FA सत्यापन सफल! डैशबोर्ड में स्वागत है।'
        );
      } else if (status === 429 || status >= 500) {
        setLoginError(data.error || 'सर्वर त्रुटि। कृपया पुनः प्रयास करें।');
      } else {
        handleFailedAttempt();
        setLoginError(isUsingRecovery ? 'अमान्य आपातकालीन रिकवरी कोड!' : 'अमान्य OTP कोड! कृपया Google Authenticator में वर्तमान 6-अंकों का कोड देखें।');
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

  // Test OTP in the security dialog (needs a live session; server checks the code)
  const handleTestOtp = async () => {
    const token = sessionStorage.getItem('jinvani_admin_token') || '';
    if (!testOtpInput.trim() || !token) return;
    try {
      const { data } = await authCall({ otp: testOtpInput.trim() }, token);
      setTestOtpResult(Boolean(data.ok));
    } catch {
      setTestOtpResult(false);
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
    sessionStorage.removeItem('jinvani_admin_token');
    sessionStorage.removeItem('jinvani_admin_auth_time');
    setIsAuthenticated(false);
    setPassword('');
    if (msg) setLoginError(msg);
  };

  // Change password: the password is a Cloudflare secret, so this only verifies the current one
  // against the server and hands back the new hash to paste into ADMIN_PASSWORD_HASH.
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassModalError('');

    if (!currentPass) {
      setPassModalError('वर्तमान पासवर्ड दर्ज करें।');
      return;
    }

    try {
      const { data } = await authCall({ password: currentPass });
      if (!data.ok && !data.needOtp) {
        setPassModalError('वर्तमान पासवर्ड गलत है!');
        return;
      }
    } catch {
      setPassModalError('सर्वर से संपर्क नहीं हो सका।');
      return;
    }

    if (newPass.length < 12) {
      setPassModalError('नया पासवर्ड कम से कम 12 अक्षरों का होना चाहिए।');
      return;
    }

    if (newPass !== confirmPass) {
      setPassModalError('नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।');
      return;
    }

    const newHash = await sha256Hex(newPass);
    try {
      await navigator.clipboard.writeText(newHash);
    } catch {}
    showToast('नया हैश कॉपी हो गया। इसे Cloudflare में ADMIN_PASSWORD_HASH के रूप में सेट कर पुनः डिप्लॉय करें।');
    setIsChangePassOpen(false);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  // Fetch entries from Google Apps Script Web App
  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
      if (autoRefreshSec > 0) setAutoRefreshCountdownSec(autoRefreshSec);
    } else {
      setIsLoading(true);
    }
    setFetchError(null);

    try {
      const res = await fetch(activeWebhookUrl);

      if (!res.ok) {
        throw new Error(`सर्वर से उत्तर नहीं मिला (${res.status})`);
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        // Filter out blank ghost entries (where both details and scriptureName are empty)
        const validData = data.filter(
          (item) => item && ((item.details && item.details.trim() !== '') || (item.scriptureName && item.scriptureName.trim() !== ''))
        );

        // Apply any locally saved status overrides and filter out deleted items
        try {
          const deletedStr = localStorage.getItem('jinvani_deleted_items');
          const deletedIds: Record<string, boolean> = deletedStr ? JSON.parse(deletedStr) : {};
          const activeData = validData.filter((item) => !deletedIds[String(item.id)]);

          const overridesStr = localStorage.getItem('jinvani_status_overrides');
          const overrides: Record<string, string> = overridesStr ? JSON.parse(overridesStr) : {};
          const merged = activeData.map((item) => {
            const overrideStatus = overrides[String(item.id)];
            return overrideStatus ? { ...item, status: overrideStatus } : item;
          });
          setItems(merged);
        } catch {
          setItems(validData);
        }
      } else {
        setItems([]);
      }
      setLastSyncTime(new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }));
      if (isManualRefresh) showToast('गूगल शीट से ताज़ा डेटा लोड हुआ!');
    } catch (err: any) {
      console.error('Admin dashboard failed to fetch from Google Sheet:', err);
      setFetchError('डेटा लोड करने में असमर्थ। कृपया इंटरनेट या वेबहुक URL जाँचें।');
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
      await fetch(activeWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateStatus',
          rowId: item.id,
          timestamp: item.timestamp,
          scriptureName: item.scriptureName,
          newStatus: newStatus,
        }),
      });
    } catch (err) {
      console.warn('Background sync to sheet failed, stored locally:', err);
    }
  };

  // Delete item handler
  const handleDeleteItem = async (item: AdminContributionItem) => {
    const confirmDelete = window.confirm(
      `क्या आप प्रविष्टि #${item.id} (${item.scriptureName || 'सुझाव'}) को हटाना चाहते हैं?\n\nयह प्रविष्टि डैशबोर्ड और गूगल शीट से हटा दी जाएगी।`
    );
    if (!confirmDelete) return;

    // 1. Remove from local UI state immediately
    setItems((prev) => prev.filter((it) => it.id !== item.id));

    // 2. Persist in deleted items list in localStorage
    try {
      const deletedStr = localStorage.getItem('jinvani_deleted_items');
      const deletedIds: Record<string, boolean> = deletedStr ? JSON.parse(deletedStr) : {};
      deletedIds[String(item.id)] = true;
      localStorage.setItem('jinvani_deleted_items', JSON.stringify(deletedIds));

      // Clean up any status override for this item
      const overridesStr = localStorage.getItem('jinvani_status_overrides');
      if (overridesStr) {
        const overrides: Record<string, string> = JSON.parse(overridesStr);
        delete overrides[String(item.id)];
        localStorage.setItem('jinvani_status_overrides', JSON.stringify(overrides));
      }
    } catch (err) {
      console.error('Failed to save deleted item to localStorage:', err);
    }

    showToast(`प्रविष्टि #${item.id} सफलतापूर्वक हटा दी गई!`);

    // 3. Attempt background delete in Google Sheet via Apps Script webhook
    try {
      await fetch(activeWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete',
          rowId: item.id,
          timestamp: item.timestamp,
          scriptureName: item.scriptureName,
        }),
      });
    } catch (err) {
      console.warn('Background sync delete to sheet failed, stored locally:', err);
    }
  };

  // State & handler for cleaning blank/ghost rows in Google Sheet
  const [isCleaningSheet, setIsCleaningSheet] = useState(false);
  const handleCleanupGhostRows = async () => {
    if (!window.confirm('क्या आप Google Sheet से सभी खाली (Ghost) पंक्तियाँ साफ़ करना चाहते हैं?')) return;
    setIsCleaningSheet(true);
    try {
      await fetch(activeWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'cleanup',
        }),
      });
      showToast('Google Sheet खाली पंक्तियाँ साफ़ करने का अनुरोध भेजा गया! 2 सेकंड में ताज़ा डेटा लोड होगा...');
      setTimeout(() => fetchData(true), 2500);
    } catch {
      showToast('सफ़ाई अनुरोध भेजने में त्रुटि हुई।');
    } finally {
      setIsCleaningSheet(false);
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
            tilt={{ maxTilt: 6, glareMaxOpacity: 0.14, glareColor: 'gold' }}
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
                      नया हैश बनाएँ व कॉपी करें
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
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100/90 font-gotu space-y-1.5">
                    <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Google Authenticator (2FA TOTP)</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      2FA अब सर्वर पर लागू है: <code className="text-amber-200">ADMIN_TOTP_SECRET</code> सेट होने पर हर लॉगिन में OTP या रिकवरी कोड अनिवार्य है। सीक्रेट व रिकवरी कोड ब्राउज़र में उपलब्ध नहीं हैं।
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

          {/* Live Session Inactivity Countdown Timer */}
          <button
            type="button"
            onClick={() => handleExtendSession()}
            title={`सत्र समाप्त होने में शेष समय (${formatSessionTime(sessionRemainingSec)})। क्लिक करके समय बढ़ाएं।`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] sm:text-xs font-gotu transition-all cursor-pointer active:scale-95 select-none ${
              sessionRemainingSec <= 120
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30 animate-pulse'
                : sessionRemainingSec <= 300
                ? 'bg-amber-500/15 border-amber-500/35 text-amber-300 hover:bg-amber-500/25'
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            {sessionRemainingSec <= 300 ? (
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden md:inline text-slate-400 font-medium">सत्र:</span>
            <span className="font-mono font-bold tracking-wide">
              {formatSessionTime(sessionRemainingSec)}
            </span>
            {sessionRemainingSec <= 120 && (
              <span className="text-[9px] bg-rose-500/30 text-rose-200 px-1 py-0.5 rounded font-sans ml-0.5">
                +15m
              </span>
            )}
          </button>

          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing || isLoading}
            title={autoRefreshSec > 0 ? `डेटा रीफ्रेश करें (अगला ऑटो-सिंक ${autoRefreshCountdownSec}s में)` : 'डेटा रीफ्रेश करें'}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-300 border border-white/10 transition-colors font-gotu text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">रीफ्रेश</span>
            {autoRefreshSec > 0 && (
              <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded ml-0.5" title="ऑटो-सिंक उलटी गिनती">
                {autoRefreshCountdownSec}s
              </span>
            )}
          </button>

          <a
            href={activeSheetUrl}
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
          { id: 'announcement', label: 'सार्वजनिक घोषणा', icon: Megaphone, badge: announcementActive ? 'LIVE' : undefined },
          { id: 'content', label: 'स्तोत्र व ग्रंथ संपादक', icon: BookOpen, badge: 'CMS' },
          { id: 'feedback', label: 'अशुद्धि व सुझाव', icon: CheckCircle2, badge: stats.total },
          { id: 'settings', label: 'सेटिंग्स', icon: Settings },
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
        <FeedbackTab showToast={showToast} />
      )}

      {/* TAB 2: सार्वजनिक उद्घोषणा (Site Announcement & Broadcast) */}
      {adminTab === 'announcement' && (
        <AnnouncementTab
          showToast={showToast}
          onNavigateToGitSettings={() => {
            setAdminTab('settings');
            setActiveSettingCategory('git');
          }}
        />
      )}

      {/* TAB 3: सामग्री एवं स्तोत्र संपादक (Content CMS) */}
      {adminTab === 'content' && (
        <ContentCmsTab showToast={showToast} />
      )}

      {/* TAB 4: प्रशासक सेटिंग्स व नियंत्रण केंद्र (Admin Control Settings) */}
      {adminTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl space-y-6 relative z-10"
        >
          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-semibold mb-2 backdrop-blur-md">
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-gotu">प्रशासक नियंत्रण एवं विन्यास • Admin Settings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white mb-2">
              प्रशासक सेटिंग्स व नियंत्रण केंद्र
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
              सुरक्षा, लेआउट, गूगल शीट कनेक्शन और स्थानीय डेटा बैकअप को सुव्यवस्थित रूप से प्रबंधित करें।
            </p>
          </div>

          {/* 5 Interactive Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {/* 1. सुरक्षा व क्रेडेंशियल्स */}
            <button
              type="button"
              onClick={() => setActiveSettingCategory('security')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeSettingCategory === 'security'
                  ? 'bg-gradient-to-b from-amber-500/25 to-amber-950/40 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 border-white/10 hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${activeSettingCategory === 'security' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-amber-500/15 text-amber-300'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-gotu px-2 py-0.5 rounded-full border ${
                  is2FAEnabled
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {is2FAEnabled ? '2FA सक्रिय' : '2FA बंद'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors">
                सुरक्षा व क्रेडेंशियल्स
              </h3>
              <p className="text-[11px] text-slate-400 font-gotu mt-1 leading-relaxed">
                पासवर्ड परिवर्तन, 2FA OTP प्रमाणीकरण एवं बायोमेट्रिक Passkey।
              </p>
              {activeSettingCategory === 'security' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
              )}
            </button>

            {/* 2. डैशबोर्ड व लेआउट */}
            <button
              type="button"
              onClick={() => setActiveSettingCategory('display')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeSettingCategory === 'display'
                  ? 'bg-gradient-to-b from-amber-500/25 to-amber-950/40 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 border-white/10 hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${activeSettingCategory === 'display' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-amber-500/15 text-amber-300'}`}>
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-gotu px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {columns} Col • {sessionTimeoutMin}m
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors">
                डैशबोर्ड व लेआउट
              </h3>
              <p className="text-[11px] text-slate-400 font-gotu mt-1 leading-relaxed">
                ग्रिड कॉलम संख्या, ऑटो-रिफ्रेश अंतराल एवं सत्र निष्क्रियता समय।
              </p>
              {activeSettingCategory === 'display' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
              )}
            </button>

            {/* 3. गूगल शीट व वेबहुक */}
            <button
              type="button"
              onClick={() => setActiveSettingCategory('sheet')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeSettingCategory === 'sheet'
                  ? 'bg-gradient-to-b from-amber-500/25 to-amber-950/40 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 border-white/10 hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${activeSettingCategory === 'sheet' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-amber-500/15 text-amber-300'}`}>
                  <Wifi className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-gotu px-2 py-0.5 rounded-full border ${
                  pingStatus === 'success'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {pingLatency ? `${pingLatency}ms` : customWebhookUrl ? 'कस्टम URL' : 'डिफ़ॉल्ट API'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors">
                गूगल शीट व वेबहुक
              </h3>
              <p className="text-[11px] text-slate-400 font-gotu mt-1 leading-relaxed">
                Apps Script वेबहुक URL विन्यास, स्प्रेडशीट लिंक एवं लेटेंसी पिंग।
              </p>
              {activeSettingCategory === 'sheet' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
              )}
            </button>

            {/* 4. डेटा बैकअप व शुद्धिकरण */}
            <button
              type="button"
              onClick={() => setActiveSettingCategory('data')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeSettingCategory === 'data'
                  ? 'bg-gradient-to-b from-amber-500/25 to-amber-950/40 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 border-white/10 hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${activeSettingCategory === 'data' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-amber-500/15 text-amber-300'}`}>
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-gotu px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {storageUsageKB} KB प्रयुक्त
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors">
                डेटा बैकअप व शुद्धिकरण
              </h3>
              <p className="text-[11px] text-slate-400 font-gotu mt-1 leading-relaxed">
                JSON डेटा बैकअप एक्सपोर्ट/इम्पोर्ट, ऐप कैश साफ़ एवं ओवरराइड्स रीसेट।
              </p>
              {activeSettingCategory === 'data' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
              )}
            </button>

            {/* 5. गिटहब कनेक्शन */}
            <button
              type="button"
              onClick={() => setActiveSettingCategory('git')}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeSettingCategory === 'git'
                  ? 'bg-gradient-to-b from-amber-500/25 to-amber-950/40 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] scale-[1.02]'
                  : 'bg-slate-900/60 hover:bg-slate-850/80 border-white/10 hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${activeSettingCategory === 'git' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-amber-500/15 text-amber-300'}`}>
                  <GitBranch className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-gotu px-2 py-0.5 rounded-full border ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {connectionStatus === 'connected' ? 'कनेक्टेड' : 'अनकनेक्टेड'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors">
                गिटहब कनेक्शन
              </h3>
              <p className="text-[11px] text-slate-400 font-gotu mt-1 leading-relaxed">
                Repository, PAT टोकन एवं Direct Web Commit विन्यास।
              </p>
              {activeSettingCategory === 'git' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
              )}
            </button>
          </div>

          {/* ACTIVE CATEGORY VIEW */}
          <AnimatePresence mode="wait">
            {activeSettingCategory === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="p-5 sm:p-7 border border-white/10 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-notoserif font-bold text-white">
                          सुरक्षा व क्रेडेंशियल सेटिंग्स (Security & Credentials)
                        </h3>
                        <p className="text-xs text-slate-400 font-gotu">
                          मास्टर पासवर्ड, 2-फ़ैक्टर TOTP ऑथेंटिकेटर एवं FIDO2 Passkey बायोमेट्रिक्स का प्रबंधन।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Section 1: पासवर्ड प्रबंधन */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm">
                            <KeyRound className="w-4 h-4 text-amber-400" />
                            <span>एडमिन पासवर्ड</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-gotu">
                            सर्वर सीक्रेट
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                          पासवर्ड Cloudflare के <code className="text-amber-200">ADMIN_PASSWORD_HASH</code> में रहता है। नया पासवर्ड सेट करने पर उसका हैश कॉपी होगा जिसे Cloudflare में अपडेट करें।
                        </p>
                      </div>

                      <div className="space-y-2 pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangePassOpen(true);
                            setPassModalError('');
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-gotu text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>नया पासवर्ड सेट करें</span>
                        </button>
                      </div>
                    </div>

                    {/* Section 2: 2-फ़ैक्टर प्रमाणीकरण */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm">
                            <ShieldAlert className="w-4 h-4 text-amber-400" />
                            <span>2FA प्रमाणीकरण</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-gotu ${
                            is2FAEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}>
                            {is2FAEnabled ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                          Google Authenticator / Authy द्वारा 6-अंकों का समय आधारित सुरक्षा कोड। पासवर्ड के बाद अतिरिक्त सुरक्षा परत।
                        </p>
                      </div>

                      <div className="space-y-2 pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIs2FAModalOpen(true);
                            setTestOtpInput('');
                            setTestOtpResult(null);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-gotu text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>2FA जाँच (OTP टेस्ट)</span>
                        </button>
                      </div>
                    </div>

                    {/* Section 3: Passkey बायोमेट्रिक */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm">
                            <Fingerprint className="w-4 h-4 text-amber-400" />
                            <span>Passkey बायोमेट्रिक</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-gotu ${
                            hasPasskey ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {hasPasskey ? 'पंजीकृत' : 'अपंजीकृत'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                          फ़िंगरप्रिंट, फ़ेस आईडी या Windows Hello द्वारा बिना पासवर्ड 1-टैप में अत्यंत तेज़ एवं सुरक्षित लॉगिन।
                        </p>
                        {hasPasskey && passkeyCreatedAt && (
                          <p className="text-[10px] text-slate-400 font-gotu mt-1">
                            पंजीकरण: {passkeyCreatedAt}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 pt-3">
                        {!hasPasskey ? (
                          <button
                            type="button"
                            onClick={handleRegisterPasskey}
                            disabled={isRegisteringPasskey}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-gotu text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                          >
                            <Fingerprint className="w-4 h-4" />
                            <span>{isRegisteringPasskey ? 'पंजीकरण हो रहा है...' : 'नई Passkey जोड़ें'}</span>
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={handleTestPasskey}
                              className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-gotu text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>बायोमेट्रिक टेस्ट करें</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleRemovePasskey}
                              className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-gotu text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Passkey हटाएं</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSettingCategory === 'display' && (
              <motion.div
                key="display"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="p-5 sm:p-7 border border-white/10 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                        <SlidersHorizontal className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-notoserif font-bold text-white">
                          डैशबोर्ड व लेआउट सेटिंग्स (Dashboard & Layout)
                        </h3>
                        <p className="text-xs text-slate-400 font-gotu">
                          ग्रिड कॉलम लेआउट, ऑटो-रिफ्रेश अंतराल एवं सत्र निष्क्रियता समय सीमा का विन्यास।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Section 1: डिफ़ॉल्ट ग्रिड कॉलम */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm mb-2">
                          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                          <span>डिफ़ॉल्ट ग्रिड कॉलम</span>
                        </div>
                        <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                          सुझाव एवं अशुद्धि तालिका में कार्ड्स को अपनी स्क्रीन के अनुसार 1, 2 या 3 कॉलम में व्यवस्थित करें।
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="grid grid-cols-3 gap-2">
                          {([1, 2, 3] as const).map((colNum) => (
                            <button
                              key={colNum}
                              type="button"
                              onClick={() => {
                                handleSetColumns(colNum);
                                showToast(`${colNum} कॉलम ग्रिड लेआउट सक्रिय किया गया।`);
                              }}
                              className={`py-2 px-2 rounded-xl text-xs font-gotu font-medium transition-all cursor-pointer text-center border ${
                                columns === colNum
                                  ? 'bg-amber-500/30 text-amber-200 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                              }`}
                            >
                              {colNum} कॉलम
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-amber-300/80 font-gotu pt-1">
                          वर्तमान: <b>{columns} कॉलम</b> ({columns === 1 ? 'विस्तृत दृश्य' : columns === 2 ? 'मानक दृश्य' : 'सघन दृश्य'})
                        </p>
                      </div>
                    </div>

                    {/* Section 2: सत्र निष्क्रियता समय */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm mb-2">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>सत्र समय सीमा (Session Timeout)</span>
                        </div>
                        <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                          यदि व्यवस्थापक इतनी देर तक निष्क्रिय रहता है, तो सुरक्षा के लिए स्वतः सुरक्षित लॉगआउट हो जाएगा।
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: '15 मिनट', val: 15 },
                            { label: '30 मिनट', val: 30 },
                            { label: '60 मिनट', val: 60 },
                            { label: '120 मिनट', val: 120 },
                          ].map((item) => (
                            <button
                              key={item.val}
                              type="button"
                              onClick={() => {
                                setSessionTimeoutMin(item.val);
                                localStorage.setItem('jinvani_session_timeout_min', String(item.val));
                                sessionStorage.setItem('jinvani_admin_auth_time', String(Date.now()));
                                setSessionRemainingSec(item.val * 60);
                                showToast(`सत्र निष्क्रियता समय ${item.label} सेट किया गया।`);
                              }}
                              className={`py-2 px-2 rounded-xl text-xs font-gotu font-medium transition-all cursor-pointer text-center border ${
                                sessionTimeoutMin === item.val
                                  ? 'bg-amber-500/30 text-amber-200 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>

                        {/* Live Session Countdown Status Widget */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-gotu mt-2">
                          <div className="flex items-center gap-2">
                            <Clock className={`w-3.5 h-3.5 ${sessionRemainingSec <= 300 ? 'text-rose-400' : 'text-emerald-400'}`} />
                            <span className="text-slate-400">सत्र शेष:</span>
                            <span className={`font-mono font-bold ${
                              sessionRemainingSec <= 120
                                ? 'text-rose-400 animate-pulse'
                                : sessionRemainingSec <= 300
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}>
                              {formatSessionTime(sessionRemainingSec)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleExtendSession()}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-gotu transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                            title="सत्र समय रीसेट करें"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>समय बढ़ाएं</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-emerald-300/80 font-gotu pt-1">
                          वर्तमान: <b>{sessionTimeoutMin} मिनट</b> के बाद स्वतः सुरक्षित लॉगआउट
                        </p>
                      </div>
                    </div>

                    {/* Section 3: ऑटो-रिफ्रेश अंतराल */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm mb-2">
                          <RefreshCw className="w-4 h-4 text-amber-400" />
                          <span>ऑटो-रिफ्रेश (Auto-Sync)</span>
                        </div>
                        <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                          Google Sheet से सुझाव व अशुद्धि प्रविष्टियों को पृष्ठभूमि में स्वतः ताज़ा करने का अंतराल।
                        </p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: 'बंद (मैनुअल)', val: 0 },
                            { label: '1 मिनट', val: 60 },
                            { label: '3 मिनट', val: 180 },
                            { label: '5 मिनट', val: 300 },
                          ].map((item) => (
                            <button
                              key={item.val}
                              type="button"
                              onClick={() => {
                                setAutoRefreshSec(item.val);
                                localStorage.setItem('jinvani_auto_refresh_sec', String(item.val));
                                setAutoRefreshCountdownSec(item.val);
                                showToast(`ऑटो-रिफ्रेश अंतराल: ${item.label}`);
                              }}
                              className={`py-2 px-2 rounded-xl text-xs font-gotu font-medium transition-all cursor-pointer text-center border ${
                                autoRefreshSec === item.val
                                  ? 'bg-amber-500/30 text-amber-200 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>

                        {/* Live Auto-Refresh Countdown Status Widget */}
                        {autoRefreshSec > 0 && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-gotu mt-2">
                            <div className="flex items-center gap-2">
                              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                              <span className="text-slate-400">अगला सिंक:</span>
                              <span className="font-mono font-bold text-amber-400">
                                {autoRefreshCountdownSec}s
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              प्रत्येक {autoRefreshSec / 60} मिनट
                            </span>
                          </div>
                        )}

                        <p className="text-[11px] text-amber-300/80 font-gotu pt-1">
                          वर्तमान: <b>{autoRefreshSec === 0 ? 'बंद (मैनुअल)' : `${autoRefreshSec / 60} मिनट में स्वतः सिंक`}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSettingCategory === 'sheet' && (
              <motion.div
                key="sheet"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="p-5 sm:p-7 border border-white/10 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                        <Wifi className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-notoserif font-bold text-white">
                          गूगल शीट व वेबहुक विन्यास (Google Sheet & Webhook API)
                        </h3>
                        <p className="text-xs text-slate-400 font-gotu">
                          Google Apps Script वेबहुक एंडपॉइंट, स्प्रेडशीट दृश्य लिंक एवं लाइव कनेक्शन लेटेंसी।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* 1. Apps Script Webhook URL */}
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm">
                          <Radio className="w-4 h-4 text-amber-400" />
                          <span>Google Apps Script Webhook URL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {pingStatus === 'success' && (
                            <span className="text-[11px] font-gotu px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>कनेक्टेड ({pingLatency}ms)</span>
                            </span>
                          )}
                          {pingStatus === 'failed' && (
                            <span className="text-[11px] font-gotu px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>कनेक्शन त्रुटि</span>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={handlePingGoogleSheet}
                            disabled={pingStatus === 'testing'}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-gotu text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                          >
                            <Activity className={`w-3.5 h-3.5 ${pingStatus === 'testing' ? 'animate-spin text-amber-400' : ''}`} />
                            <span>{pingStatus === 'testing' ? 'पिंग हो रहा है...' : 'लेटेंसी पिंग टेस्ट'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="url"
                          value={customWebhookUrl}
                          onChange={(e) => setCustomWebhookUrl(e.target.value)}
                          placeholder="https://script.google.com/macros/s/.../exec (खाली छोड़ने पर प्रोजेक्ट का डिफ़ॉल्ट URL प्रयुक्त होगा)"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-amber-400/70"
                        />
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                          <p className="text-[11px] text-slate-400 font-gotu truncate max-w-md">
                            सक्रिय एंडपॉइंट: <span className="font-mono text-amber-300/80">{activeWebhookUrl.slice(0, 50)}...</span>
                          </p>
                          <div className="flex items-center gap-2">
                            {customWebhookUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomWebhookUrl('');
                                  localStorage.removeItem('jinvani_custom_webhook_url');
                                  showToast('डिफ़ॉल्ट वेबहुक बहाल किया गया।');
                                  fetchData(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 font-gotu text-xs cursor-pointer transition-colors"
                              >
                                डिफ़ॉल्ट पर रीसेट
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                localStorage.setItem('jinvani_custom_webhook_url', customWebhookUrl.trim());
                                showToast('वेबहुक URL सहेज लिया गया!');
                                fetchData(true);
                              }}
                              className="px-4 py-1.5 rounded-lg bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 font-gotu text-xs font-semibold cursor-pointer transition-colors"
                            >
                              सहेजें (Save Webhook)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Google Sheet View Link */}
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm">
                          <Globe className="w-4 h-4 text-amber-400" />
                          <span>Google Sheet View URL (स्प्रेडशीट सीधा लिंक)</span>
                        </div>
                        <a
                          href={activeSheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-gotu text-xs cursor-pointer transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>नई विंडो में शीट खोलें</span>
                        </a>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="url"
                          value={customSheetUrl}
                          onChange={(e) => setCustomSheetUrl(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-amber-400/70"
                        />
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                          <p className="text-[11px] text-slate-400 font-gotu truncate max-w-md">
                            सक्रिय शीट लिंक: <span className="font-mono text-emerald-300/80">{activeSheetUrl.slice(0, 50)}...</span>
                          </p>
                          <div className="flex items-center gap-2">
                            {customSheetUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomSheetUrl('');
                                  localStorage.removeItem('jinvani_custom_sheet_url');
                                  showToast('डिफ़ॉल्ट शीट लिंक बहाल किया गया।');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 font-gotu text-xs cursor-pointer transition-colors"
                              >
                                डिफ़ॉल्ट पर रीसेट
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                localStorage.setItem('jinvani_custom_sheet_url', customSheetUrl.trim());
                                showToast('शीट लिंक सहेज लिया गया!');
                              }}
                              className="px-4 py-1.5 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/50 text-emerald-200 font-gotu text-xs font-semibold cursor-pointer transition-colors"
                            >
                              सहेजें (Save Sheet Link)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Google Sheet द्वि-मार्गी सिंक (Two-Way Sync) कोड व निर्देश */}
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm">
                          <FileCode className="w-4 h-4 text-amber-400" />
                          <span>Google Apps Script द्वि-मार्गी सिंक कोड (Two-Way Sync Script)</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={handleCleanupGhostRows}
                            disabled={isCleaningSheet}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-gotu text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                            title="शीट से सभी खाली पंक्तियाँ हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isCleaningSheet ? 'साफ़ हो रहा है...' : 'खाली पंक्तियाँ साफ़ करें'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => copyGuideText(GOOGLE_APPS_SCRIPT_TEMPLATE, 'apps_script_code', 'Apps Script कोड कॉपी हो गया!')}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-gotu text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {copiedKey === 'apps_script_code' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>कॉपी हुआ!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>पूर्ण कोड कॉपी करें</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 font-gotu leading-relaxed space-y-2">
                        <p className="font-semibold text-amber-300">
                          ⚠️ Google Sheet में डेटा सिंक क्यों नहीं हो रहा था?
                        </p>
                        <p>
                          वर्तमान में आपकी Google Apps Script में केवल नया सुझाव जोड़ने का कोड था। जब एडमिन पैनल से <b>स्थिति (Status) बदली जाती है</b> या <b>प्रविष्टि डिलीट की जाती है</b>, तो उस बदलाव को Google Sheet में लिखने के लिए Apps Script में 2-वे सिंक कोड होना अनिवार्य है।
                        </p>
                        <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-white/5">
                          <p className="font-semibold text-slate-200">🛠️ 1 मिनट में 2-वे सिंक कैसे सक्रिय करें:</p>
                          <p>1. अपनी Google Sheet खोलें &gt; मेनू में <b>Extensions &gt; Apps Script</b> पर क्लिक करें।</p>
                          <p>2. वहाँ मौजूद पुराने कोड को हटाकर ऊपर दिए गए <b>'पूर्ण कोड कॉपी करें'</b> बटन से कोड पेस्ट करें।</p>
                          <p>3. ऊपर <b>Save (💾)</b> दबाएँ &gt; <b>Deploy &gt; Manage deployments</b> (या New deployment) पर क्लिक करें।</p>
                          <p>4. <b>Who has access: Anyone</b> रखकर Deploy करें। इसके बाद हर स्थिति बदलाव व डिलीट सीधा आपकी Google Sheet में सिंक होगा!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSettingCategory === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="p-5 sm:p-7 border border-white/10 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-notoserif font-bold text-white">
                          डेटा बैकअप, रिस्टोर एवं शुद्धिकरण (Data & Cache Management)
                        </h3>
                        <p className="text-xs text-slate-400 font-gotu">
                          स्थानीय व्यवस्थापक स्थिति, घोषणाओं एवं कॉन्फ़िगरेशन का बैकअप एवं ऐप कैश शुद्धिकरण।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Section 1: JSON बैकअप एक्सपोर्ट व इम्पोर्ट */}
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-white/10 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-300 font-gotu font-semibold text-sm">
                            <Download className="w-4 h-4 text-amber-400" />
                            <span>डेटा बैकअप (JSON Export / Import)</span>
                          </div>
                          <span className="text-[10px] font-gotu px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            सुरक्षित ऑफ़लाइन
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                          अपनी सभी समीक्षा स्थिति ओवरराइड्स, सार्वजनिक घोषणा सेटिंग्स, एवं प्राथमिकताओं को एकल JSON फ़ाइल में बैकअप करें या किसी अन्य डिवाइस पर पुनर्स्थापित करें।
                        </p>

                        {/* Storage Bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px] font-gotu text-slate-400">
                            <span>ब्राउज़र लोकल स्टोरेज:</span>
                            <span className="text-amber-300 font-bold">{storageUsageKB} KB / ~5,120 KB</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-teal-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(2, (Number(storageUsageKB) / 5120) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                        <button
                          type="button"
                          onClick={handleExportBackup}
                          className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-gotu text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>JSON बैकअप डाउनलोड</span>
                        </button>

                        <label className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-gotu text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                          <Upload className="w-3.5 h-3.5 text-slate-400" />
                          <span>बैकअप इम्पोर्ट करें</span>
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportBackup}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Section 2: सिस्टम कैश एवं ओवरराइड्स शुद्धिकरण */}
                    <div className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-white/10 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-rose-300 font-gotu font-semibold text-sm">
                            <Trash2 className="w-4 h-4 text-rose-400" />
                            <span>कैश व स्थानीय शुद्धिकरण (Purge & Reset)</span>
                          </div>
                          <span className="text-[10px] font-gotu px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            सावधानीपूर्वक
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                          ब्राउज़र सर्विस वर्कर द्वारा कैश की गई फ़ाइलें साफ़ करें या केवल स्थानीय ओवरराइड्स को हटाकर गूगल शीट के मूल डेटा को पुनः सक्रिय करें।
                        </p>

                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 font-gotu space-y-1">
                          <p><b>ध्यान दें:</b> कैश साफ़ करने से गूगल शीट का मूल डेटा डिलीट नहीं होता। केवल इस ब्राउज़र की स्थानीय प्रतियां रीफ़्रेश होती हैं।</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                        <button
                          type="button"
                          onClick={handlePurgeCache}
                          className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-200 font-gotu text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                          <span>ऐप कैश साफ़ करें</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetOverrides}
                          className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-gotu text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ओवरराइड्स रीसेट करें</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSettingCategory === 'git' && (
              <motion.div
                key="git"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="p-5 sm:p-7 border border-white/10 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                        <GitBranch className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-notoserif font-bold text-white">
                          GitHub रिपॉजिटरी कनेक्शन सेटिंग्स (Direct Web Commit)
                        </h3>
                        <p className="text-xs text-slate-400 font-gotu">
                          वेबसाइट से सीधे 1-क्लिक में घोषणाओं को GitHub रिपॉजिटरी पर Commit & Push करें।
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-amber-400/30 text-[11px] font-gotu">
                      <span className={connectionStatus === 'connected' ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
                        {connectionStatus === 'connected' ? '🟢 कनेक्टेड' : '⚪ अनकनेक्टेड (लोकल/Desktop मोड)'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-white/10 space-y-4">
                    <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                      वेबसाइट से सीधे 1-क्लिक में <code>public/announcement.json</code> को GitHub पर Commit & Push करने हेतु अपनी रिपॉजिटरी का नाम और Personal Access Token दर्ज करें:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-200 font-gotu">
                          GitHub Repository (उदा. username/repo):
                        </label>
                        <input
                          type="text"
                          value={githubRepo}
                          onChange={(e) => setGithubRepo(e.target.value)}
                          placeholder="उदा. username/JainJinvani"
                          className="w-full bg-slate-900 border border-amber-500/25 rounded-xl p-2.5 text-xs text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-200 font-gotu">
                          ब्रांच नाम (Branch Name):
                        </label>
                        <input
                          type="text"
                          value={githubBranch}
                          onChange={(e) => setGithubBranch(e.target.value)}
                          placeholder="main"
                          className="w-full bg-slate-900 border border-amber-500/25 rounded-xl p-2.5 text-xs text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-amber-200 font-gotu flex items-center justify-between">
                        <span>GitHub Personal Access Token (PAT):</span>
                        <span className="text-[10px] text-slate-400">केवल आपके ब्राउज़र में सुरक्षित रहता है</span>
                      </label>
                      <input
                        type="password"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="w-full bg-slate-900 border border-amber-500/25 rounded-xl p-2.5 text-xs text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTestingConnection}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
                      >
                        {isTestingConnection ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{isTestingConnection ? 'जाँच रहे हैं...' : 'सहेजें एवं कनेक्शन टेस्ट करें'}</span>
                      </button>

                      {githubToken && (
                        <button
                          type="button"
                          onClick={() => {
                            setGithubToken('');
                            localStorage.removeItem('jinvani_git_token');
                            setConnectionStatus('idle');
                            showToast('GitHub टोकन हटा दिया गया।');
                          }}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-300 border border-white/10 text-xs font-gotu transition-colors cursor-pointer"
                        >
                          टोकन हटाएं
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* TAB 5: प्रशासक मार्गदर्शिका एवं सुरक्षा संदर्भ (Admin Guide & Security Manual) */}
      {adminTab === 'guide' && (
        <AdminGuideTab
          hasPasskey={hasPasskey}
          is2FAEnabled={is2FAEnabled}
          onOpenSecurityModal={() => {
            setIs2FAModalOpen(true);
            setTestOtpInput('');
            setTestOtpResult(null);
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};
