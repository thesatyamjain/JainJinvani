import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { Settings, Info, Heart, Mail, Shield, Share2, X, Volume2, Type, Bell, Star, Compass } from 'lucide-react';
import { getSettings, updateSettings, type UserSettings } from '../lib';

interface MoreMenuProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MoreMenu = ({ onNavigate }: MoreMenuProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>(getSettings());

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings({ [key]: value });
  };

  const items = [
    {
      id: 'about',
      label: 'About',
      icon: Info,
      desc: 'About Jain Jinvani',
      content: (
        <div className="space-y-4 text-blue-100/80 font-gotu">
          <p>जैन जिनवाणी (Jain Jinvani) एक आधुनिक डिजिटल प्रयास है जिसका उद्देश्य जैन धर्म के प्राचीन ज्ञान, दर्शन और साहित्य को जन-जन तक पहुँचाना है।</p>
          <p>यह एप्लिकेशन शुद्ध React और Tailwind CSS का उपयोग करके बनाया गया है, जिसमें आधुनिक UI/UX सिद्धांतों का पालन किया गया है।</p>
          <div className="pt-4 pb-2 border-t border-white/10 mt-6">
            <p className="text-amber-300 font-medium">Developed by Satyam Jain</p>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      desc: 'Preferences',
      content: (
        <div className="space-y-6">
          {/* Font Size */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-amber-400" />
              <span className="text-white font-gotu">फ़ॉन्ट साइज़ (Font Size)</span>
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
              <span className="text-white font-gotu">सूचनाएं (Notifications)</span>
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
              <span className="text-white font-gotu">ऑटो प्ले (Auto Play)</span>
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
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
            <span className="text-white font-gotu">डार्क मोड (Dark Mode)</span>
            <div className="px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">Always On</div>
          </div>
        </div>
      )
    },
    {
      id: 'donate',
      label: 'Donate',
      icon: Heart,
      desc: 'Support us',
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-white rounded-xl p-2 flex items-center justify-center shadow-lg">
            <div className="w-full h-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">QR Code</div>
          </div>
          <p className="text-blue-100/80 font-gotu">
            इस धर्म प्रभावना के कार्य में सहयोग देने के लिए आप अपनी स्वेच्छा से दान कर सकते हैं।
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
            Support Now
          </button>
        </div>
      )
    },
    { id: 'contact', label: 'Contact', icon: Mail, desc: 'Get in touch' },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: Shield,
      desc: 'Data policy',
      content: (
        <div className="space-y-4 text-blue-100/80 font-gotu text-sm">
          <p>हम आपकी गोपनीयता का सम्मान करते हैं। यह एप्लिकेशन किसी भी प्रकार का व्यक्तिगत डेटा एकत्र नहीं करता है।</p>
          <p>सभी डेटा आपके डिवाइस पर स्थानीय रूप से सुरक्षित रहता है या सार्वजनिक स्रोतों से लोड किया जाता है।</p>
          <p className="text-xs opacity-50 mt-4">Version 1.0.0 • Build 2024.1</p>
        </div>
      )
    },
    { id: 'share', label: 'Share', icon: Share2, desc: 'Spread the word' },
  ];

  const handleItemClick = async (item: any) => {
    if (item.id === 'share') {
      const shareData = {
        title: 'Jain Jinvani',
        text: 'Check out Jain Jinvani - An immersive Jain encyclopedia.',
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // If Web Share API is not supported, show the URL in an alert
          alert(`Share this link:\n${window.location.href}`);
        }
      } catch (err: any) {
        // Only try clipboard if the error is not an AbortError (user cancelled)
        if (err.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          } catch (clipboardErr) {
            // If clipboard fails, just show the URL
            alert(`Share this link:\n${window.location.href}`);
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
    <div className="w-full max-w-4xl mx-auto pt-20 pb-32 px-6 relative">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-rozha text-white mb-10 text-center"
      >
        अधिक (More)
      </motion.h1>

      {/* Quick Actions - Favorites & Explore */}
      <div className="grid grid-cols-2 gap-3 md:gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => onNavigate('favorites')}
          className="h-full"
        >
          <GlassCard className="p-4 md:p-6 flex flex-col items-center text-center md:flex-row md:text-left md:items-center gap-3 md:gap-4 hover:bg-white/10 cursor-pointer transition-all group bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-400/20 relative overflow-hidden h-full justify-center md:justify-start">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform shrink-0 relative z-10">
              <Star className="w-5 h-5 md:w-6 md:h-6 fill-rose-400" />
            </div>
            <div className="min-w-0 relative z-10">
              <h3 className="text-base md:text-xl font-rozha text-white break-words leading-tight">पसंदीदा</h3>
              <p className="text-[10px] md:text-sm text-rose-100/60 font-gotu break-words mt-1 hidden md:block">Your saved content</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          onClick={() => onNavigate('explore')}
          className="h-full"
        >
          <GlassCard className="p-4 md:p-6 flex flex-col items-center text-center md:flex-row md:text-left md:items-center gap-3 md:gap-4 hover:bg-white/10 cursor-pointer transition-all group bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-400/20 relative overflow-hidden h-full justify-center md:justify-start">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shrink-0 relative z-10">
              <Compass className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0 relative z-10">
              <h3 className="text-base md:text-xl font-rozha text-white break-words leading-tight">अन्वेषण</h3>
              <p className="text-[10px] md:text-sm text-purple-100/60 font-gotu break-words mt-1 hidden md:block">Discover features</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            onClick={() => handleItemClick(item)}
            className="h-full"
          >
            <GlassCard className="p-4 md:p-6 flex flex-col items-center text-center gap-3 hover:bg-white/10 cursor-pointer transition-colors group h-full justify-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center text-blue-200 group-hover:scale-110 transition-transform shrink-0 group-hover:bg-white/10">
                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0 w-full">
                <h3 className="text-sm md:text-xl font-rozha text-white break-words leading-tight">{item.label}</h3>
                <p className="text-[10px] md:text-sm text-blue-100/50 font-gotu break-words mt-1 line-clamp-1">{item.desc}</p>
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
              <GlassCard className="p-8 border-white/20 bg-[#0b162c] shadow-2xl relative overflow-hidden">
                {/* Glow effect inside modal */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-amber-400">
                      <selectedItem.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-rozha text-white">{selectedItem.label}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
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