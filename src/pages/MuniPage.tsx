import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, BookOpen, User, Users, Feather, Droplets, Scroll, Sun, Moon, Eye, Hand } from 'lucide-react';
import { GlassCard } from '../components/layout/GlassCard';
import { AhimsaHandSymbol, OmSymbol } from '../components/features/JainSymbols';

export interface MuniPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}
export type AsceticsPageProps = MuniPageProps;

const moolGunas = [
  {
    category: "५ महाव्रत (5 Great Vows)",
    items: [
      { name: "अहिंसा महाव्रत", desc: "समस्त स्थावर व त्रस जीवों की मन, वचन, काय से हिंसा का सर्वथा त्याग।", icon: Hand },
      { name: "सत्य महाव्रत", desc: "राग-द्वेष, हास्य, भय व लोभ रहित हित, मित और प्रिय सत्य वचन बोलना।", icon: BookOpen },
      { name: "अचौर्य महाव्रत", desc: "बिना दी हुई किसी भी सूक्ष्म से सूक्ष्म वस्तु को न ग्रहण करना।", icon: Moon },
      { name: "ब्रह्मचर्य महाव्रत", desc: "मन, वचन, काय एवं स्वप्न में भी १८ प्रकार के शील व मैथुन का पूर्ण त्याग।", icon: Sun },
      { name: "अपरिग्रह महाव्रत", desc: "बाह्य (धन, धान्य, वस्त्र) एवं अंतरंग (क्रोध, मान, माया, लोभादि १४) परिग्रह का सर्वथा त्याग।", icon: Feather },
    ]
  },
  {
    category: "५ समिति (5 Careful Activities)",
    items: [
      { name: "ईर्या समिति", desc: "चार हाथ आगे की भूमि को जीवों से रहित देखकर सावधानीपूर्वक गमन करना।", icon: Eye },
      { name: "भाषा समिति", desc: "आगम सम्मत, प्राणी मात्र के हितकारी व मधुर वचनों का प्रयोग।", icon: BookOpen },
      { name: "एषणा समिति", desc: "४६ दोष एवं ३२ अंतराय टालकर श्रावक द्वारा शुद्ध नवधा भक्ति से दिया गया आहार ग्रहण करना।", icon: Droplets },
      { name: "आदान-निक्षेपण समिति", desc: "पिच्छी, कमंडलु एवं शास्त्र को देख-शोधकर अत्यंत कोमलता से उठाना व रखना।", icon: Hand },
      { name: "प्रतिष्ठापना (व्युत्सर्ग) समिति", desc: "जीव-रहित, एकांत एवं प्रासुक स्थान में मलमूत्रादि का विसर्जन करना।", icon: Feather },
    ]
  },
  {
    category: "५ इन्द्रिय निरोध (5 Sense Control)",
    items: [
      { name: "स्पर्शन इन्द्रिय जय", desc: "शीत, उष्ण, कोमल, कठोर, चिकना, रूखा आदि स्पर्शों में समता भाव रखना।", icon: Hand },
      { name: "रसना इन्द्रिय जय", desc: "मधुर, कड़वे, खट्टे, नमकीन आदि रसों में लोलुपता न कर केवल देह-यात्रा हेतु आहार लेना।", icon: Droplets },
      { name: "घ्राण इन्द्रिय जय", desc: "सुगंधित अथवा दुर्गंधित वस्तुओं के सानिध्य में राग-द्वेष न करना।", icon: Feather },
      { name: "चक्षु इन्द्रिय जय", desc: "सुंदर अथवा असुंदर रूप को देखकर राग अथवा घृणा न करना।", icon: Eye },
      { name: "श्रोत्र इन्द्रिय जय", desc: "प्रशंसा अथवा निंदा के वचनों को सुनकर हर्ष-विषाद से परे आत्म-स्थ रहना।", icon: BookOpen },
    ]
  },
  {
    category: "६ आवश्यक (6 Daily Duties)",
    items: [
      { name: "सामायिक", desc: "तीनों कालों में शत्रु-मित्र, सुख-दुःख में समता भाव धारण कर आत्म-ध्यान करना।", icon: OmSymbol },
      { name: "स्तुति (चतुर्विंशति स्तव)", desc: "२४ तीर्थंकर भगवान के परम वीतराग गुणों का कीर्तन व स्तवन करना।", icon: Scroll },
      { name: "वंदना", desc: "वर्तमान आचार्य, उपाध्याय एवं सर्व साधुओं को त्रिकाल भावपूर्वक नमन।", icon: User },
      { name: "प्रतिक्रमण", desc: "दिन-रात में प्रमादवश हुए सूक्ष्म दोषों व अतिचारों का विशुद्ध शोधन।", icon: RotateCcwIcon },
      { name: "प्रत्याख्यान", desc: "भविष्य में होने वाले पापों एवं आहार आदि का मर्यादापूर्वक त्याग।", icon: Hand },
      { name: "कायोत्सर्ग", desc: "देह के प्रति ममत्व का त्याग कर निश्चल प्रतिमा योग में ध्यान लगाना।", icon: User },
    ]
  },
  {
    category: "७ शेष गुण (7 Ascetic Observances)",
    items: [
      { name: "अस्नान", desc: "देह के प्रति राग न होने से एवं जलकायिक जीवों की रक्षा हेतु स्नान का त्याग।", icon: Droplets },
      { name: "अदंतधावन", desc: "दांतों को मंजन या लकड़ी से न मांजना, मात्र जल से मुख प्रक्षालन।", icon: Moon },
      { name: "भूमिशयन", desc: "चटाई, काष्ठ फलक अथवा प्रासुक भूमि पर एक करवट से शयन करना।", icon: Feather },
      { name: "नग्नत्व (अचेलकता)", desc: "जन्मजात बालक की भांति निर्ग्रन्थ, निष्परिग्रह वीतरागी दिगम्बर मुद्रा।", icon: Sun },
      { name: "केशलोंच", desc: "प्रति दो, तीन या चार माह में अपने हाथों से सिर एवं दाढ़ी-मूंछ के केशों को उखाड़ना।", icon: Feather },
      { name: "एकभुक्ति", desc: "२४ घंटे में केवल एक बार दिन के प्रकाश में प्रासुक जल व भोजन ग्रहण करना।", icon: Droplets },
      { name: "स्थितिभोजन", desc: "बैठकर नहीं, बल्कि दोनों पैरों पर समभाव से सीधे खड़े होकर पाणिपात्र (अंजलि) में आहार लेना।", icon: Hand },
    ]
  }
];

// Helper icon component since we used a custom one in the list
function RotateCcwIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
      <path d="M3 3v9h9" />
    </svg>
  );
}

export const MuniPage = ({ onBack, onNavigate }: MuniPageProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 page-bottom-clearance px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10 relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute left-0 top-1 w-12 h-12 rounded-2xl bg-slate-900/80 hover:bg-amber-500/25 border border-white/15 hover:border-amber-400/50 transition-colors flex items-center justify-center group z-10 cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-6 h-6 text-slate-200 group-hover:text-amber-200" />
        </motion.button>

        <div className="text-center w-full">
          <div className="inline-flex items-center gap-2 mb-2.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Feather className="w-4 h-4 text-amber-300" />
            <span>Guru Parampara</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-rozha text-white drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)] mb-3 pt-2 pb-1 leading-[1.35]">
            जैन साधु परंपरा
          </h1>
          <p className="text-slate-200 font-gotu font-medium max-w-2xl mx-auto text-base md:text-lg mb-6">
            मोक्ष मार्ग के पथिक: निर्ग्रन्थ मुनिराज
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('muni-profiles')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 hover:border-amber-300 transition-colors font-gotu text-sm font-semibold cursor-pointer shadow-sm"
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>प्रमुख आचार्य एवं मुनि परिचय</span>
          </motion.button>
        </div>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-[340px] md:h-[380px] rounded-3xl overflow-hidden relative mb-12 group border border-amber-500/30 shadow-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/25 via-blue-950/60 to-[#050a14] pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/80 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-gotu font-bold w-fit mb-3">
            <Sun className="w-3.5 h-3.5 text-amber-300" />
            <span>पंचम काल के साक्षात देव</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-rozha text-amber-200 mb-3 drop-shadow-sm">२८ मूलगुण</h2>
          <p className="text-slate-100 font-gotu text-base md:text-lg max-w-3xl leading-relaxed font-medium">
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
            sub: "Acharya (36 Guna)",
            desc: "संघ के नायक, जो स्वयं आचरण करते हैं और शिष्यों से कराते हैं। ३६ गुणों के धारक।",
            icon: Users,
            color: "text-amber-300",
            bgIcon: "bg-amber-500/20 border-amber-400/30"
          },
          {
            title: "उपाध्याय",
            sub: "Upadhyaya (25 Guna)",
            desc: "संघ में शिक्षा प्रदान करने वाले गुरु। ११ अंग और १४ पूर्व के ज्ञाता (२५ गुण)।",
            icon: BookOpen,
            color: "text-cyan-300",
            bgIcon: "bg-cyan-500/20 border-cyan-400/30"
          },
          {
            title: "साधु",
            sub: "Sadhu (28 Guna)",
            desc: "आत्म-साधना में लीन मुनिराज। २८ मूलगुणों के निरतिचार आराधक।",
            icon: User,
            color: "text-emerald-300",
            bgIcon: "bg-emerald-500/20 border-emerald-400/30"
          }
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard tilt className="p-6 h-full border-t-4 border-t-amber-400/60 bg-slate-900/80 hover:bg-slate-800/80 transition-colors border border-white/10 rounded-2xl shadow-lg">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${item.bgIcon} ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-rozha text-white mb-1">{item.title}</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300/90 font-mono mb-3 block">{item.sub}</span>
              <p className="text-slate-200 font-gotu text-sm leading-relaxed">{item.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Mool Gunas Tabs */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-1/3 flex flex-col gap-3">
          {moolGunas.map((section, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(idx)}
              className={`p-4 rounded-xl text-left transition-[background-color,border-color,color] border cursor-pointer ${
                activeTab === idx
                  ? 'bg-amber-500/25 border-amber-400/60 text-amber-200 shadow-md shadow-amber-500/10 font-bold'
                  : 'bg-slate-900/60 border-white/10 text-slate-200 hover:bg-slate-800/80 hover:text-white font-medium'
              }`}
            >
              <h3 className="text-base sm:text-lg font-gotu">{section.category}</h3>
            </motion.button>
          ))}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-blue-950/40 to-purple-950/20 border border-amber-400/30 mt-4 shadow-md">
            <h4 className="font-bold text-amber-200 mb-2 font-gotu flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-300" />
              <span>दिगम्बर वेष</span>
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-gotu">
              यथाजात रूप (नग्नत्व), पिच्छी (मयूर पंख), और कमंडलु - ये तीन मुनि के बाह्य चिह्न हैं।
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3">
          <GlassCard className="p-6 min-h-[400px] border border-amber-500/30 rounded-2xl bg-slate-900/85">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="text-2xl font-rozha text-white">
                {moolGunas[activeTab].category}
              </h3>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {moolGunas[activeTab].items.length} गुण
              </span>
            </div>
            <div className="grid gap-3.5">
              {moolGunas[activeTab].items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-amber-400/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                    {React.isValidElement(item.icon) ? item.icon : <item.icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base sm:text-lg font-gotu group-hover:text-amber-200 transition-colors">{item.name}</h4>
                    <p className="text-sm text-slate-200 font-gotu leading-relaxed mt-0.5">{item.desc}</p>
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

export const AsceticsPage = MuniPage;
