import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../layout/GlassCard';
import {
  Megaphone,
  Calendar,
  Clock,
  Sparkles,
  GitBranch,
  Download,
  RefreshCw,
  Send,
  Trash2,
  Eye,
} from 'lucide-react';

interface AnnouncementTabProps {
  showToast: (msg: string) => void;
  onNavigateToGitSettings?: () => void;
}

export const AnnouncementTab: React.FC<AnnouncementTabProps> = ({
  showToast,
  onNavigateToGitSettings,
}) => {
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
  const [isCommittingGit, setIsCommittingGit] = useState(false);

  const getAnnouncementData = () => ({
    active: announcementActive,
    type: announcementType,
    badge: announcementBadge.trim(),
    text: announcementText.trim(),
    link: announcementLink.trim(),
    startDate: announcementStartDate,
    endDate: announcementEndDate,
    updatedAt: new Date().toISOString(),
  });

  const handlePublishGlobalAnnouncement = async () => {
    setIsPublishingAnnouncement(true);
    const data = getAnnouncementData();

    try {
      localStorage.setItem('jinvani_admin_announcement', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('jinvani_announcement_updated'));

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
    const data = getAnnouncementData();
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
    } catch {
      showToast('घोषणा हटाने में त्रुटि हुई।');
    }
  };

  const handleCommitToGitHub = async () => {
    const githubRepo = localStorage.getItem('jinvani_git_repo') || '';
    const githubBranch = localStorage.getItem('jinvani_git_branch') || 'main';
    const githubToken = localStorage.getItem('jinvani_git_token') || '';

    if (!githubRepo.trim() || !githubToken.trim()) {
      showToast('सीधे GitHub पर कमिट हेतु "सेटिंग्स" -> "गिटहब कनेक्शन" में Repository और Token दर्ज करें, अथवा "JSON डाउनलोड" का उपयोग करें।');
      onNavigateToGitSettings?.();
      return;
    }

    setIsCommittingGit(true);
    const payload = getAnnouncementData();

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

  return (
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
                  {announcementActive ? '🟢 घोषणा अभी मुख्य पृष्ठ पर सक्रिय है' : '⚪ घोषणा अभी निष्क्रिय है'}
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

            {/* Announcement Type Selector */}
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

            {/* Date & Time Pickers for Scheduled and Time-Frame */}
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
                    ✨ <b>स्मार्ट ऑटो-एक्सपायरी:</b> यह समय पूरा होते ही घोषणा वेबसाइट से खुद-ब-खुद दिखना बंद हो जाएगी। आपको मैन्युअली हटाने की आवश्यकता नहीं होगी।
                  </p>
                )}
              </div>
            )}

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
                placeholder="उदा. पर्युषण महापर्व के पावन अवसर पर 10 दिवसीय विशेष स्वाध्याय एवं शांतिधारा विधान उपलब्ध है।"
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

            {/* Actions Grid */}
            <div className="pt-2 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCommitToGitHub}
                  disabled={isCommittingGit}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-200 border border-amber-500/40 font-gotu font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                  title="GitHub API द्वारा सीधे main ब्रांच पर Commit & Push करें"
                >
                  <GitBranch className={`w-3.5 h-3.5 text-amber-400 ${isCommittingGit ? 'animate-spin' : ''}`} />
                  <span>{isCommittingGit ? 'कमिट हो रहा है...' : '🚀 सीधे GitHub पर Push'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadAnnouncementJSON}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-gotu text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="announcement.json डाउनलोड करें ताकि GitHub Desktop से Push कर सकें"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>JSON डाउनलोड (Desktop)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublishGlobalAnnouncement}
                  disabled={isPublishingAnnouncement}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 font-gotu text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Cloudflare Edge API पर लाइव पब्लिश करें"
                >
                  {isPublishingAnnouncement ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{isPublishingAnnouncement ? 'पब्लिशिंग...' : 'Edge API'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAnnouncement}
                  className="px-3 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-colors font-gotu text-xs cursor-pointer flex items-center gap-1"
                  title="घोषणा हटाएं"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">हटाएं</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 font-gotu">
                💡 <b>गिट सिंक:</b> आप <b>"सीधे GitHub पर Push"</b> से 1-क्लिक में वेब से ही कमिट कर सकते हैं, या <b>"JSON डाउनलोड"</b> करके GitHub Desktop से <code>public/announcement.json</code> को Push कर सकते हैं!
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Right Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard
            variant="sacred"
            className="p-5 sm:p-6 rounded-3xl border-white/10 bg-[#0b1220]/80 shadow-xl space-y-3 sticky top-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-bold text-amber-300 font-gotu">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                <span>लाइव पूर्वावलोकन (Preview)</span>
              </div>
              {(() => {
                if (!announcementActive || !announcementText.trim()) {
                  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-400 font-gotu">⚪ निष्क्रिय</span>;
                }
                const now = Date.now();
                if (announcementType === 'scheduled' && announcementStartDate) {
                  const s = new Date(announcementStartDate).getTime();
                  if (!isNaN(s) && now < s) {
                    return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-gotu">⏰ आगामी</span>;
                  }
                }
                if (announcementType === 'time_frame') {
                  if (announcementStartDate) {
                    const s = new Date(announcementStartDate).getTime();
                    if (!isNaN(s) && now < s) {
                      return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-gotu">⏰ आगामी</span>;
                    }
                  }
                  if (announcementEndDate) {
                    const e = new Date(announcementEndDate).getTime();
                    if (!isNaN(e) && now > e) {
                      return <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 font-gotu">🔴 समाप्त (Expired)</span>;
                    }
                  }
                }
                return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-gotu">🟢 सक्रिय (Live)</span>;
              })()}
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
              <p>✨ <b>घोषणा प्रकार:</b> {announcementType === 'permanent' ? 'स्थायी (हमेशा दिखेगी)' : announcementType === 'scheduled' ? 'पूर्व-निर्धारित (तय समय से शुरू)' : 'समय-सीमा युक्त (समाप्ति समय पर स्वतः गायब)'}</p>
              {announcementStartDate && <p>📅 <b>प्रारंभ:</b> {announcementStartDate.replace('T', ' ')}</p>}
              {announcementEndDate && <p>⌛ <b>समाप्ति:</b> {announcementEndDate.replace('T', ' ')}</p>}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
};
