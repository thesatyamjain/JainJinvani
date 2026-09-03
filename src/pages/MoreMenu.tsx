import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { Settings, Info, Heart, Mail, Shield, Share2, X, Volume2, Type, Bell, Star, Compass, Menu } from 'lucide-react';
import { getSettings, updateSettings, type UserSettings, useModalBackHandler } from '../lib';
import upiQrCode from '../assets/upi_qr_code_satyam5246.png';

interface MoreMenuProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MoreMenu = ({ onNavigate }: MoreMenuProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(getSettings());

  // Close modal on mobile back navigation
  useModalBackHandler(!!selectedId, () => setSelectedId(null), 'more-modal');

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings({ [key]: value });
  };

  const items = [
    {
      id: 'about',
      label: 'परिचय',
      icon: Info,
      desc: 'जैन जिनवाणी के बारे में',
      content: (
        <div className="space-y-4 text-blue-100/80 font-gotu">
          <p>
            <strong className="text-amber-300">जैन जिनवाणी</strong> एक आधुनिक डिजिटल प्रयास है जिसका उद्देश्य जैन धर्म के प्राचीन ज्ञान, दर्शन, स्तोत्र और साहित्य को जन-जन तक सुगमता से पहुँचाना है।
          </p>
          <p>
            यह डिजिटल मंच संपूर्ण प्रामाणिकता एवं आधुनिक तकनीक के साथ स्वाध्याय व नित्य साधना को सरल बनाने हेतु समर्पित है।
          </p>
          <div className="pt-4 pb-2 border-t border-white/10 mt-6">
            <p className="text-amber-300 font-medium text-sm">
              निर्माता:{' '}
              <a
                href="https://thesoftwareco.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 transition-colors font-semibold"
              >
                The Software Co
              </a>{' '}
              एवं <span className="text-amber-300 font-semibold">सत्यम जैन</span>
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'सेटिंग्स',
      icon: Settings,
      desc: 'फ़ॉन्ट व सूचना प्राथमिकताएं',
      content: (
        <div className="space-y-6">
          {/* Font Size */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-amber-400" />
              <span className="text-white font-gotu">फ़ॉन्ट साइज़</span>
            </div>
            <div className="flex gap-2">
              {(['small', 'medium', 'large', 'xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => handleSettingChange('fontSize', size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-gotu transition-colors ${settings.fontSize === size
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                >
                  {size === 'small' ? 'छोटा' : size === 'medium' ? 'मध्यम' : size === 'large' ? 'बड़ा' : 'बहुत बड़ा'}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="text-white font-gotu">पर्व एवं दैनिक सूचनाएं</span>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', !settings.notifications)}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.notifications ? 'bg-amber-500' : 'bg-white/10'
                }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.notifications ? 'left-7' : 'left-1'
                }`} />
            </button>
          </div>

          {/* Auto Play Audio */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-green-400" />
              <span className="text-white font-gotu">ऑटो प्ले ऑडियो</span>
            </div>
            <button
              onClick={() => handleSettingChange('autoPlay', !settings.autoPlay)}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.autoPlay ? 'bg-amber-500' : 'bg-white/10'
                }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.autoPlay ? 'left-7' : 'left-1'
                }`} />
            </button>
          </div>

          {/* Dark Mode - Always On */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 opacity-60">
            <span className="text-white font-gotu">डार्क मोड (आंखों के लिए सौम्य)</span>
            <div className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold font-gotu">सदा सक्रिय</div>
          </div>
        </div>
      )
    },
    {
      id: 'donate',
      label: 'सहयोग',
      icon: Heart,
      desc: 'जिनवाणी सेवा में सहयोग',
      content: (
        <div className="text-center space-y-5">
          <div className="w-52 sm:w-60 mx-auto bg-white rounded-2xl p-3.5 flex flex-col items-center justify-center shadow-[0_12px_36px_rgba(0,0,0,0.6)] border border-amber-400/30">
            <img
              src={upiQrCode}
              alt="UPI QR Code - Satyam Jain"
              className="w-full aspect-square object-contain rounded-xl"
            />
            <div className="mt-2.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-slate-800 text-xs font-mono font-bold select-all">
              satyam5246@upi
            </div>
          </div>
          <p className="text-blue-100/85 font-gotu text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
            इस धर्म प्रभावना व जिनवाणी डिजिटलीकरण के पावन कार्य में सहयोग हेतु किसी भी UPI ऐप (GPay, PhonePe, Paytm आदि) से स्कैन करें।
          </p>
        </div>
      )
    },
    { id: 'contact', label: 'संपर्क', icon: Mail, desc: 'सुझाव व प्रतिक्रिया भेजें' },
    {
      id: 'privacy',
      label: 'गोपनीयता',
      icon: Shield,
      desc: 'डेटा सुरक्षा एवं नीतियां',
      content: (
        <div className="space-y-4 text-blue-100/80 font-gotu text-sm leading-relaxed">
          <p>हम आपकी गोपनीयता का पूर्ण सम्मान करते हैं। यह एप्लिकेशन किसी भी प्रकार का व्यक्तिगत डेटा एकत्र नहीं करता है।</p>
          <p>आपकी पठन प्रगति, पसंदीदा पाठ व सेटिंग्स आपके डिवाइस पर सुरक्षित रूप से स्थानीय स्तर (Offline Local Storage) पर सहेजी जाती हैं।</p>
          <p className="text-xs opacity-50 mt-4 font-sans">संस्करण 2.0.0 • संपूर्ण ऑफ़लाइन समर्थन</p>
        </div>
      )
    },
    { id: 'share', label: 'साझा करें', icon: Share2, desc: 'मित्रों व परिजनों के साथ साझा करें' },
  ];

  const handleItemClick = async (item: any) => {
    if (item.id === 'share') {
      const shareData = {
        title: 'जैन जिनवाणी',
        text: 'जैन जिनवाणी - प्राचीन जैन ग्रंथ, पूजा, विधान, स्तोत्र एवं स्वाध्याय का संपूर्ण डिजिटल ज्ञानकोश।',
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // If Web Share API is not supported, show the URL in an alert
          alert(`इस लिंक को साझा करें:\n${window.location.href}`);
        }
      } catch (err: any) {
        // Only try clipboard if the error is not an AbortError (user cancelled)
        if (err.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(window.location.href);
            alert('लिंक क्लिपबोर्ड पर कॉपी हो गया है!');
          } catch (clipboardErr) {
            alert(`इस लिंक को साझा करें:\n${window.location.href}`);
          }
        }
      }
      return;
    }

    if (item.id === 'contact') {
      window.location.href = 'mailto:contact@jainjinvani.app';
      return;
    }

    setSelectedId(item.id);
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="w-full max-w-6xl mx-auto pt-14 md:pt-16 pb-36 px-4 md:px-6">
      {/* Header Banner - Premium Frosted Glass */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 md:mb-10 relative rounded-3xl overflow-hidden min-h-[190px] sm:min-h-[210px] md:h-64 flex items-end p-6 md:p-9 shadow-[0_16px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18)] border border-purple-500/30 bg-gradient-to-br from-purple-950/35 via-slate-900/60 to-[#071124]/80 backdrop-blur-3xl backdrop-saturate-[190%] group"
      >
        {/* Soft Ambient Glows & Specular Rim */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/15 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/15 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs mb-3 backdrop-blur-md">
            <Menu className="w-3.5 h-3.5 text-purple-300" />
            <span className="font-gotu font-medium">विविध सेवाएं व सेटिंग्स</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-notoserif font-bold text-white mb-2 leading-[1.25] pt-1 pb-1">
            अधिक
          </h1>
          <p className="text-slate-200/85 max-w-xl font-gotu text-sm md:text-base leading-relaxed">
            पसंदीदा संग्रह, अन्वेषण, ऐप सेटिंग्स एवं जिनवाणी सेवा से संबंधित संपूर्ण विकल्प।
          </p>
        </div>
      </motion.div>

      {/* Quick Actions - Favorites & Explore */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => onNavigate('favorites')}
          className="h-full"
        >
          <GlassCard className="p-4 sm:p-6 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 sm:gap-4 hover:bg-white/10 cursor-pointer transition-all group bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-400/20 relative overflow-hidden h-full justify-center sm:justify-start rounded-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform shrink-0 relative z-10">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-400" />
            </div>
            <div className="min-w-0 relative z-10">
              <h3 className="text-base sm:text-xl font-notoserif font-bold text-white break-words leading-tight">पसंदीदा</h3>
              <p className="text-xs sm:text-sm text-rose-100/70 font-gotu break-words mt-1 hidden sm:block">सहेजे गए स्तोत्र व पाठ</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          onClick={() => onNavigate('explore')}
          className="h-full"
        >
          <GlassCard className="p-4 sm:p-6 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 sm:gap-4 hover:bg-white/10 cursor-pointer transition-all group bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-400/20 relative overflow-hidden h-full justify-center sm:justify-start rounded-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shrink-0 relative z-10">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 relative z-10">
              <h3 className="text-base sm:text-xl font-notoserif font-bold text-white break-words leading-tight">अन्वेषण</h3>
              <p className="text-xs sm:text-sm text-purple-100/70 font-gotu break-words mt-1 hidden sm:block">तीर्थ, पर्व व विशेष सामग्री</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Grid of Other Options */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.04 }}
            onClick={() => handleItemClick(item)}
            className="h-full"
          >
            <GlassCard className="p-4 sm:p-6 flex flex-col items-center text-center gap-3 hover:bg-white/10 cursor-pointer transition-colors group h-full justify-center rounded-2xl">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-amber-200 group-hover:scale-110 transition-transform shrink-0 group-hover:bg-amber-500/20 border border-white/5 group-hover:border-amber-400/30">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div className="min-w-0 w-full">
                <h3 className="text-base sm:text-lg font-notoserif font-bold text-white break-words leading-tight">{item.label}</h3>
                <p className="text-xs sm:text-sm text-blue-100/60 font-gotu break-words mt-1 line-clamp-1">{item.desc}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>


      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg z-10"
            >
              <GlassCard className="p-6 sm:p-8 border-white/20 bg-[#0b162c] shadow-2xl relative overflow-hidden rounded-3xl">
                {/* Glow effect inside modal */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                      <selectedItem.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">{selectedItem.label}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-blue-50 relative z-10">
                  {selectedItem.content}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
