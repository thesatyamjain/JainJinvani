import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, BookOpen, User, Users, Feather, Droplets, Scroll, Sun, Moon, Eye, Hand } from 'lucide-react';
import { GlassCard } from '../components/layout/GlassCard';
import { AhimsaHandSymbol, OmSymbol } from '../components/features/JainSymbols';

interface AsceticsPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

const moolGunas = [
  {
    category: "५ महाव्रत (5 Great Vows)",
    items: [
      { name: "अहिंसा महाव्रत", desc: "पूर्ण अहिंसा का पालन", icon: Hand },
      { name: "सत्य महाव्रत", desc: "पूर्ण सत्य वचन", icon: BookOpen },
      { name: "अचौर्य महाव्रत", desc: "बिना दी हुई वस्तु न लेना", icon: Moon },
      { name: "ब्रह्मचर्य महाव्रत", desc: "पूर्ण ब्रह्मचर्य पालन", icon: Sun },
      { name: "अपरिग्रह महाव्रत", desc: "समस्त परिग्रह का त्याग", icon: Feather },
    ]
  },
  {
    category: "५ समिति (5 Careful Activities)",
    items: [
      { name: "ईर्या समिति", desc: "देखकर चलना (4 हाथ आगे)", icon: Eye },
      { name: "भाषा समिति", desc: "हित-मित-प्रिय वचन", icon: BookOpen },
      { name: "एषणा समिति", desc: "शुद्ध आहार ग्रहण", icon: Droplets },
      { name: "आदान-निक्षेपण", desc: "वस्तु उठाने-रखने में सावधानी", icon: Hand },
      { name: "प्रतिष्ठापन", desc: "मल-मूत्र त्याग में सावधानी", icon: Feather },
    ]
  },
  {
    category: "६ आवश्यक (6 Essential Duties)",
    items: [
      { name: "सामायिक", desc: "समता भाव धारण करना", icon: OmSymbol },
      { name: "स्तुति", desc: "२४ तीर्थंकरों की स्तुति", icon: Scroll },
      { name: "वंदना", desc: "आचार्य/सिद्धों को नमन", icon: User },
      { name: "प्रतिक्रमण", desc: "दोषों का शोधन", icon: RotateCcwIcon },
      { name: "प्रत्याख्यान", desc: "त्याग/नियम लेना", icon: Hand },
      { name: "कायोत्सर्ग", desc: "देह के ममत्व का त्याग", icon: User },
    ]
  }
];

// Helper icon component since we used a custom one in the list
function RotateCcwIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>;
}

export const AsceticsPage = ({ onBack, onNavigate }: AsceticsPageProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 pb-32 px-6">
      {/* Header */}
      <div className="mb-10 relative">
        <button
          onClick={onBack}
          className="absolute left-0 top-1 w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-center group z-10 cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
        </button>

        <div className="text-center w-full">
          <div className="inline-flex items-center gap-2 mb-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest">
            <Feather className="w-4 h-4" />
            <span>Guru Parampara</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-rozha text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-4 pt-2 pb-1 leading-[1.35]">
            जैन साधु परंपरा
          </h1>
          <p className="text-blue-100/60 font-gotu max-w-2xl mx-auto text-lg mb-6">
            मोक्ष मार्ग के पथिक: निर्ग्रन्थ मुनिराज
          </p>

          <button
            onClick={() => onNavigate('muni-profiles')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-amber-500/20 text-white border border-white/10 hover:border-amber-500/50 transition-all font-gotu text-sm"
          >
            <Users className="w-4 h-4" />
            <span>प्रमुख आचार्य एवं मुनि परिचय</span>
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-[400px] rounded-3xl overflow-hidden relative mb-12 group"
      >
        <img
          src="https://images.unsplash.com/photo-1619616030121-fc704e016e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjb2NrJTIwZmVhdGhlciUyMGJyb29tJTIwamFpbnxlbnwxfHx8fDE3NjkwODUxODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Pichhi"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/60 to-transparent flex flex-col justify-end p-8 md:p-12">
          <h2 className="text-3xl md:text-5xl font-rozha text-amber-200 mb-4">२८ मूलगुण</h2>
          <p className="text-blue-100/80 font-gotu text-lg max-w-3xl leading-relaxed">
            दिगम्बर जैन मुनि २८ मूलगुणों का निरतिचार पालन करते हैं। ये गुण उनके जीवन का आधार हैं।
            इनमें ५ महाव्रत, ५ समिति, ५ इन्द्रिय विजय, ६ आवश्यक और ७ शेष गुण सम्मिलित हैं।
          </p>
        </div>
      </motion.div>

      {/* Hierarchy Section (Parameshthi) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          {
            title: "आचार्य",
            sub: "Acharya",
            desc: "संघ के नायक, जो स्वयं आचरण करते हैं और शिष्यों से कराते हैं। ३६ गुणों के धारक।",
            icon: Users,
            color: "text-amber-400"
          },
          {
            title: "उपाध्याय",
            sub: "Upadhyaya",
            desc: "संघ में शिक्षा प्रदान करने वाले गुरु। ११ अंग और १४ पूर्व के ज्ञाता (२५ गुण)।",
            icon: BookOpen,
            color: "text-blue-400"
          },
          {
            title: "साधु",
            sub: "Sadhu",
            desc: "आत्म-साधना में लीन मुनिराज। २८ मूलगुणों के धारक।",
            icon: User,
            color: "text-emerald-400"
          }
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-6 h-full border-t-4 border-t-white/20 hover:bg-white/10 transition-colors">
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-rozha text-white mb-1">{item.title}</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 block">{item.sub}</span>
              <p className="text-blue-100/70 font-gotu">{item.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Mool Gunas Tabs */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-1/3 flex flex-col gap-3">
          {moolGunas.map((section, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`p-4 rounded-xl text-left transition-all border ${activeTab === idx
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              <h3 className="font-bold text-lg font-gotu">{section.category}</h3>
            </button>
          ))}
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 mt-4">
            <h4 className="font-bold text-blue-200 mb-2 font-gotu">दिगम्बर वेष</h4>
            <p className="text-sm text-blue-100/60 leading-relaxed">
              यथाजात रूप (नग्नत्व), पिच्छी (मयूर पंख), और कमंडलु - ये तीन मुनि के बाह्य चिह्न हैं।
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3">
          <GlassCard className="p-6 min-h-[400px]">
            <h3 className="text-2xl font-rozha text-white mb-6 pb-4 border-b border-white/10">
              {moolGunas[activeTab].category}
            </h3>
            <div className="grid gap-4">
              {moolGunas[activeTab].items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-amber-200/50 group-hover:text-amber-200 transition-colors shrink-0">
                    {React.isValidElement(item.icon) ? item.icon : <item.icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg font-gotu">{item.name}</h4>
                    <p className="text-sm text-blue-100/60">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
