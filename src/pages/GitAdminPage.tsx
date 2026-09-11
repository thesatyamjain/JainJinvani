import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ContentCmsTab } from '../components/admin/ContentCmsTab';
import {
  Megaphone,
  BookOpen,
  Calendar,
  Clock,
  Send,
  Download,
  Trash2,
  Sparkles,
  Eye,
  Check,
  RefreshCw,
  ArrowLeft,
  Settings,
  GitBranch,
  Shield,
  ExternalLink,
  Info,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

interface GitAdminPageProps {
  onBack?: () => void;
  onNavigate?: (page: string, params?: any) => void;
}

export const GitAdminPage: React.FC<GitAdminPageProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'announcement' | 'content' | 'settings'>('announcement');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // GitHub Connection State (Stored in localStorage)
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

  // Announcement State
  const [announcementActive, setAnnouncementActive] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('jinvani_admin_announcement');
      return stored ? JSON.parse(stored).active ?? true : true;
    } catch {
      return true;
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
  const [isCommittingGit, setIsCommittingGit] = useState(false);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  // Save Announcement Locally
  const handleSaveLocalAnnouncement = () => {
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
      localStorage.setItem('jinvani_admin_announcement', JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));
      showToast('स्थानीय रूप से सहेज दिया गया! मुख्य पृष्ठ पर लाइव पूर्वावलोकन सक्रिय है।');
    } catch {
      showToast('सहेजने में त्रुटि हुई।');
    }
  };

  // Download Announcement JSON
  const handleDownloadAnnouncementJSON = () => {
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
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'announcement.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('announcement.json डाउनलोड हो गया! इसे public/ फ़ोल्डर में रखकर GitHub Desktop से Push करें।');
    } catch {
      showToast('डाउनलोड में त्रुटि हुई।');
    }
  };

  // Direct GitHub Commit via API
  const handleCommitToGitHub = async () => {
    if (!githubRepo.trim() || !githubToken.trim()) {
      showToast('सीधे GitHub पर कमिट हेतु सेटिंग्स में Repository और Token दर्ज करें, अथवा "JSON डाउनलोड" का उपयोग करें।');
      setActiveTab('settings');
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
      // 1. Get existing file sha
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

      // 2. Base64 encode unicode JSON
      const jsonContent = JSON.stringify(payload, null, 2);
      const utf8Bytes = new TextEncoder().encode(jsonContent);
      let binary = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      const base64Content = btoa(binary);

      // 3. PUT Commit to GitHub
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

  // Clear Announcement
  const handleClearAnnouncement = () => {
    localStorage.removeItem('jinvani_admin_announcement');
    setAnnouncementActive(false);
    setAnnouncementText('');
    setAnnouncementStartDate('');
    setAnnouncementEndDate('');
    window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));
    showToast('घोषणा हटा दी गई।');
  };

  // Status Indicator logic
  const liveStatus = useMemo(() => {
    if (!announcementActive || !announcementText.trim()) {
      return { label: '⚪ निष्क्रिय (Inactive)', badgeClass: 'bg-white/10 text-slate-400' };
    }
    const now = Date.now();
    if (announcementType === 'scheduled' && announcementStartDate) {
      const s = new Date(announcementStartDate).getTime();
      if (!isNaN(s) && now < s) {
        return { label: '⏰ आगामी (Scheduled)', badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-400/30' };
      }
    }
    if (announcementType === 'time_frame') {
      if (announcementStartDate) {
        const s = new Date(announcementStartDate).getTime();
        if (!isNaN(s) && now < s) {
          return { label: '⏰ आगामी (Scheduled)', badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-400/30' };
        }
      }
      if (announcementEndDate) {
        const e = new Date(announcementEndDate).getTime();
        if (!isNaN(e) && now > e) {
          return { label: '🔴 समाप्त (Auto-Expired)', badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-400/30' };
        }
      }
    }
    return { label: '🟢 सक्रिय (Live Now)', badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' };
  }, [announcementActive, announcementText, announcementType, announcementStartDate, announcementEndDate]);

  return (
    <div className="w-full max-w-6xl mx-auto pt-8 sm:pt-12 pb-24 sm:pb-28 px-4 sm:px-6 relative min-h-screen">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-amber-400/50 text-amber-100 text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl font-gotu text-center max-w-md">
          {toastMessage}
        </div>
      )}

      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
        <button
          onClick={() => {
            if (onBack) onBack();
            else if (onNavigate) onNavigate('landing');
            else window.location.hash = '#landing';
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 font-gotu text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य पृष्ठ पर लौटें</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-amber-400/30 text-[11px] font-gotu">
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 hidden sm:inline">गिट स्थिति:</span>
            <span className={connectionStatus === 'connected' ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
              {connectionStatus === 'connected' ? 'GitHub कनेक्टेड' : 'लोकल फ़ाइल मोड'}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="गिट सेटिंग्स"
          >
            <Settings className="w-4 h-4" />
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-200 border border-white/10 font-gotu text-xs transition-colors cursor-pointer"
              title="पासवर्ड आधारित मास्टर एडमिन पोर्टल"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">मास्टर एडमिन</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Hero */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 text-center max-w-2xl mx-auto relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-2 backdrop-blur-md">
          <GitBranch className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-gotu">गिट व्यवस्थापक पोर्टल • Git-Based Admin CMS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-notoserif font-bold text-white mb-2 leading-tight">
          जिनवाणी सामग्री एवं घोषणा प्रबंधन
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
          बिना किसी कोडिंग के सीधे वेबसाइट से धार्मिक स्तोत्र, आरतियां एवं समय-सीमा वाली सार्वजनिक घोषणाएं अपडेट करें।
        </p>
      </motion.div>

      {/* Tab Switcher */}
      <div className="w-full flex items-center justify-center gap-2 mb-7 border-b border-white/10 pb-3 relative z-10">
        {[
          { id: 'announcement', label: '📢 सार्वजनिक घोषणा', count: announcementActive ? 'LIVE' : undefined },
          { id: 'content', label: '📖 स्तोत्र व ग्रंथ संपादक', count: '450+' },
          { id: 'settings', label: '⚙️ गिट कनेक्शन सेटिंग्स' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-gotu font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-white/10 text-amber-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Announcement */}
      {activeTab === 'announcement' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10"
        >
          {/* Left Editor Card */}
          <div className="lg:col-span-7 space-y-4">
            <GlassCard variant="sacred" className="p-5 sm:p-6 rounded-3xl border-amber-500/30 bg-[#0b1220]/90 shadow-xl space-y-4">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-amber-200 font-gotu block">
                    वेबसाइट पर घोषणा प्रदर्शित करें (Active Status)
                  </span>
                  <span className="text-[11px] text-slate-400 font-gotu">
                    {announcementActive ? '🟢 घोषणा अभी होमपेज पर सक्रिय है' : '⚪ घोषणा अभी निष्क्रिय है'}
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

              {/* Schedule Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-200 font-gotu">
                  घोषणा का प्रकार (Schedule Type):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'permanent', label: '🌟 स्थायी', desc: 'हमेशा दिखेगी' },
                    { id: 'scheduled', label: '⏰ पूर्व-निर्धारित', desc: 'तय समय से शुरू' },
                    { id: 'time_frame', label: '⏳ समय-सीमा', desc: 'स्वतः गायब होगी' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAnnouncementType(t.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        announcementType === t.id
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                          : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-amber-400/30'
                      }`}
                    >
                      <span className="text-xs font-gotu block">{t.label}</span>
                      <span className="text-[10px] text-slate-400 block font-gotu mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Pickers */}
              {announcementType !== 'permanent' && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-amber-200 font-gotu flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>प्रारंभ तिथि व समय:</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={announcementStartDate}
                        onChange={(e) => setAnnouncementStartDate(e.target.value)}
                        className="w-full bg-slate-950/80 border border-amber-500/30 rounded-xl p-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    {announcementType === 'time_frame' && (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-200 font-gotu flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-rose-400" />
                          <span>समाप्ति तिथि व समय:</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={announcementEndDate}
                          onChange={(e) => setAnnouncementEndDate(e.target.value)}
                          className="w-full bg-slate-950/80 border border-amber-500/30 rounded-xl p-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    )}
                  </div>
                  {announcementType === 'time_frame' && (
                    <p className="text-[11px] text-amber-200/80 font-gotu leading-tight">
                      ✨ <b>स्मार्ट ऑटो-एक्सपायरी:</b> यह समय पूरा होते ही घोषणा वेबसाइट से खुद-ब-खुद दिखना बंद हो जाएगी। आपको याद रखकर हटाने की आवश्यकता नहीं।
                    </p>
                  )}
                </div>
              )}

              {/* Badge */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-200 font-gotu">सूचना का प्रकार (Badge):</label>
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
                  <span className="text-[10px] text-slate-400 font-mono">{announcementText.length}/200 अक्षर</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="उदा. पर्युषण महापर्व के पावन अवसर पर 10 दिवसीय विशेष स्वाध्याय एवं शांतिधारा विधान उपलब्ध है।"
                  className="w-full bg-slate-950/70 border border-amber-500/25 rounded-2xl p-3 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-gotu leading-relaxed"
                />
              </div>

              {/* Action Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-200 font-gotu">क्लिक पर खुलने वाला पृष्ठ (Action Link):</label>
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

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCommitToGitHub}
                    disabled={isCommittingGit}
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold py-2.5 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isCommittingGit ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isCommittingGit ? 'कमिट हो रहा है...' : '🚀 सीधे GitHub पर Commit & Push करें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadAnnouncementJSON}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-gotu text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="announcement.json डाउनलोड करें ताकि GitHub Desktop से Push कर सकें"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON डाउनलोड</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveLocalAnnouncement}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 border border-white/10 font-gotu text-xs cursor-pointer flex items-center gap-1"
                    title="स्थानीय सहेजें"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>लोकल टेस्ट</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAnnouncement}
                    className="px-3 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors font-gotu text-xs cursor-pointer flex items-center gap-1"
                    title="घोषणा हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 font-gotu">
                  💡 <b>सुझाव:</b> आप सीधे 'GitHub पर Commit & Push' दबा सकते हैं, या 'JSON डाउनलोड' करके अपने GitHub Desktop से भी 1-क्लिक में Push कर सकते हैं।
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Right Live Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard variant="sacred" className="p-5 sm:p-6 rounded-3xl border-white/10 bg-[#0b1220]/80 shadow-xl space-y-3 sticky top-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-bold text-amber-300 font-gotu">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>लाइव पूर्वावलोकन (Preview)</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-gotu ${liveStatus.badgeClass}`}>
                  {liveStatus.label}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-gotu">
                श्रद्धालुओं को होमपेज पर घोषणा ठीक इसी रूप में दिखाई देगी:
              </p>

              {/* Replica Banner */}
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
                <p>✨ <b>प्रकार:</b> {announcementType === 'permanent' ? 'स्थायी' : announcementType === 'scheduled' ? 'पूर्व-निर्धारित' : 'समय-सीमा युक्त'}</p>
                {announcementStartDate && <p>📅 <b>प्रारंभ:</b> {announcementStartDate.replace('T', ' ')}</p>}
                {announcementEndDate && <p>⌛ <b>समाप्ति:</b> {announcementEndDate.replace('T', ' ')}</p>}
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {/* TAB 2: Content CMS */}
      {activeTab === 'content' && (
        <ContentCmsTab showToast={showToast} />
      )}

      {/* TAB 3: Git Connection Settings */}
      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6 relative z-10"
        >
          <GlassCard variant="sacred" className="p-6 sm:p-7 rounded-3xl border-amber-500/30 bg-[#0b1220]/95 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-notoserif font-bold text-white">
                GitHub रिपॉजिटरी कनेक्शन सेटिंग्स
              </h3>
            </div>

            <p className="text-xs text-slate-300 font-gotu leading-relaxed">
              यहाँ अपना GitHub Repository नाम और पर्सनल एक्सेस टोकन (PAT) सेट करें ताकि आप सीधे इस वेब पेज से 1-क्लिक में Git Commit & Push कर सकें:
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-200 font-gotu">
                  GitHub Repository (उदा. username/jainjinvani):
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="उदा. satyam/JainJinvani"
                  className="w-full bg-slate-950/80 border border-amber-500/25 rounded-xl p-2.5 text-xs sm:text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-400"
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
                  className="w-full bg-slate-950/80 border border-amber-500/25 rounded-xl p-2.5 text-xs sm:text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-200 font-gotu">
                  GitHub Personal Access Token (PAT):
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-950/80 border border-amber-500/25 rounded-xl p-2.5 text-xs sm:text-sm text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                />
                <p className="text-[10px] text-slate-400 font-gotu mt-1">
                  🔒 यह टोकन आपके ब्राउज़र के एन्क्रिप्टेड लोकल स्टोरेज में सुरक्षित रहता है और कभी किसी बाहरी सर्वर पर नहीं भेजा जाता।
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="flex-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold py-2.5 rounded-xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                {isTestingConnection ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>कनेक्शन टेस्ट व सहेजें</span>
              </button>
            </div>

            {/* Guide on obtaining token */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs font-gotu text-slate-300">
              <span className="text-amber-300 font-bold block">📖 GitHub Token कैसे बनाएं (30 सेकंड):</span>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-400">
                <li>GitHub.com पर जाएं ➡️ Settings ➡️ Developer Settings ➡️ Personal Access Tokens (Classic)।</li>
                <li>'Generate new token' दबाएं और नाम दें (उदा. `jinvani-admin`)।</li>
                <li>Scope में <b>`repo`</b> (Full control of private/public repositories) पर टिक करें।</li>
                <li>टोकन कॉपी करके ऊपर दिए गए बॉक्स में पेस्ट कर दें।</li>
              </ol>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};
