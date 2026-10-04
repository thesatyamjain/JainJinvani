import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../layout/GlassCard';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  FileCode,
  Check,
  Copy,
  Sparkles,
  KeyRound,
  Fingerprint,
  QrCode,
  ShieldAlert,
  Globe,
} from 'lucide-react';

// Web Crypto SHA-256 Hashing helper
async function sha256Hex(str: string): Promise<string> {
  if (!str) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface AdminGuideTabProps {
  hasPasskey: boolean;
  is2FAEnabled: boolean;
  onOpenSecurityModal: () => void;
  showToast: (msg: string) => void;
}

export const AdminGuideTab: React.FC<AdminGuideTabProps> = ({
  hasPasskey,
  is2FAEnabled,
  onOpenSecurityModal,
  showToast,
}) => {
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

  return (
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
              सिस्टम में कोई डिफ़ॉल्ट पासवर्ड नहीं है।
            </span>
            <p className="text-[11px] text-slate-300 font-gotu mt-1 max-w-sm">
              पासवर्ड केवल Cloudflare के <code className="text-amber-200">ADMIN_PASSWORD_HASH</code> सीक्रेट में रहता है; यह सेट न होने पर एडमिन लॉगिन बंद रहता है।
            </p>
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
                <strong>"सेटिंग्स"</strong> टैब में <strong>"सुरक्षा व क्रेडेंशियल्स"</strong> में जाकर <strong>"नया पासवर्ड सेट करें"</strong> दबाएं; वर्तमान व नया पासवर्ड (कम से कम 12 अक्षर) दर्ज करने पर नया SHA-256 हैश कॉपी होगा।
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-gotu">
              • हैश को Cloudflare में सेट करके पुनः डिप्लॉय करें<br />
              • ब्राउज़र में कुछ सहेजा नहीं जाता
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
              <h4 className="text-sm font-bold text-white font-gotu">Cloudflare सर्वर सीक्रेट्स</h4>
              <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                Cloudflare Pages → Settings → Variables में ये <strong>Secret</strong> जोड़ें (<code className="text-amber-200">VITE_</code> उपसर्ग कभी नहीं — वह ब्राउज़र में दिखता है):
              </p>
              <div className="bg-slate-900 border border-white/10 p-2 rounded-xl flex items-center justify-between gap-1 text-[11px] font-mono text-cyan-200">
                <span className="truncate">ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET</span>
                <button
                  type="button"
                  onClick={() => copyGuideText('ADMIN_PASSWORD_HASH=\nADMIN_SESSION_SECRET=\nADMIN_TOTP_SECRET=\nADMIN_RECOVERY_HASHES=', 'env_code', 'वेरिएबल नाम कॉपी हो गए!')}
                  className="p-1 text-slate-400 hover:text-cyan-300"
                  title="कॉपी करें"
                >
                  {copiedKey === 'env_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-gotu">
              • पासवर्ड जाँच केवल सर्वर पर होती है<br />
              • बदलाव के बाद पुनः डिप्लॉय करें
            </div>
          </div>

          {/* Method 3: 2FA & recovery */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  विधि 3 (2FA)
                </span>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white font-gotu">2FA एवं रिकवरी कोड</h4>
              <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                <code className="text-amber-300">ADMIN_TOTP_SECRET</code> सेट करते ही 2FA अनिवार्य हो जाता है। रिकवरी कोड्स के SHA-256 हैश अल्पविराम से अलग करके <code className="text-amber-300">ADMIN_RECOVERY_HASHES</code> में रखें।
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-gotu">
              • उपयोग किए गए रिकवरी कोड का हैश हटा दें<br />
              • सीक्रेट कभी Git में न रखें
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
                👉 इस हैश को Cloudflare Pages में <code className="text-amber-300">ADMIN_PASSWORD_HASH</code> (Secret) के रूप में सेट करें और पुनः डिप्लॉय करें।
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
            onClick={onOpenSecurityModal}
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

        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/25 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-200 font-gotu">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>रिकवरी कोड कहाँ रखें?</span>
          </div>
          <p className="text-xs text-slate-300 font-gotu leading-relaxed">
            रिकवरी कोड अब कोडबेस या ब्राउज़र में कहीं नहीं हैं। 3-4 यादृच्छिक कोड स्वयं बनाएँ और उन्हें ऑफ़लाइन (पासवर्ड मैनेजर या कागज़) में रखें। ऊपर के हैश जनरेटर से हर कोड का SHA-256 हैश निकालें (कोड <strong>बड़े अक्षरों</strong> में लिखें) और हैश अल्पविराम से अलग करके Cloudflare के <code className="text-amber-200">ADMIN_RECOVERY_HASHES</code> में रखें।
          </p>
          <p className="text-xs text-slate-300 font-gotu leading-relaxed">
            उपयोग किए गए कोड का हैश तुरंत हटा दें; सर्वर कोड को एक बार उपयोग के बाद स्वतः रद्द नहीं करता।
          </p>
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
            2FA सीक्रेट अब केवल सर्वर पर रहता है। कोई भी Base32 सीक्रेट बनाएँ (उदा. <code className="text-amber-200">openssl rand -base64 20 | base32</code>), उसे Authenticator ऐप में जोड़ें, और Cloudflare Pages में <code className="text-amber-200">ADMIN_TOTP_SECRET</code> (Secret) के रूप में सेट करें।
          </p>
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
              <span><strong>प्रमाणीकरण:</strong> सर्वर-साइड HMAC-SHA256 टोकन + Web Crypto API।</span>
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
              <span><strong>बैकअप:</strong> 'सेटिंग्स' टैब के <strong>'डेटा बैकअप व शुद्धिकरण'</strong> से एक क्लिक में संपूर्ण डेटा JSON में निर्यात/आयात करें।</span>
            </li>
          </ul>
        </GlassCard>
      </div>
    </motion.div>
  );
};
