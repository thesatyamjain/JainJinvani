import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Sparkles,
  Crown,
  Compass,
  X,
  Phone,
  Train,
  Plane,
  ExternalLink,
} from 'lucide-react';
import { useModalBackHandler } from '../lib';

interface PilgrimagePageProps {
  onBack: () => void;
}

interface KshetraDef {
  id: string;
  nameHindi: string;
  location: string;
  state: string;
  significance: string;
  category: 'सिद्ध क्षेत्र' | 'अतिशय क्षेत्र' | 'कल्याणक क्षेत्र';
  description: string;
  howToReach: string;
  railway: string;
  airport: string;
  mapQuery: string;
  dharamshala: string;
}

const pilgrimageData: KshetraDef[] = [
  {
    id: 'shikharji',
    nameHindi: 'श्री सम्मेद शिखरजी',
    location: 'पारसनाथ पर्वत, गिरिडीह',
    state: 'झारखंड',
    significance: '२० तीर्थंकरों एवं असंख्य मुनिराजों की पावन निर्वाण भूमि',
    category: 'सिद्ध क्षेत्र',
    description:
      'सम्मेद शिखरजी जैन धर्म का सर्वोच्च एवं सर्वाधिक पवित्र शाश्वत सिद्ध क्षेत्र है। यहाँ भगवान पार्श्वनाथ सहित २० तीर्थंकरों ने मोक्ष प्राप्त किया। वंदना मार्ग में २७ किलोमीटर की पावन परिक्रमा होती है।',
    howToReach: 'मधुबन तलहटी से पैदल अथवा डोली द्वारा पर्वत वंदना की जाती है।',
    railway: 'पारसनाथ रेलवे स्टेशन (PNME) - २२ किमी, नेताजी सुभाष चंद्र बोस जंक्शन गोमो - ३५ किमी',
    airport: 'काजी नजरुल इस्लाम हवाई अड्डा दुर्गापुर (१४० किमी) / रांची हवाई अड्डा (१६० किमी)',
    mapQuery: 'Shikharji+Madhuban+Jharkhand',
    dharamshala: 'मधुबन में श्वेतांबर व दिगंबर समाज की सैकड़ों आधुनिक धर्मशालाएं एवं भोजनशालाएं उपलब्ध हैं।',
  },
  {
    id: 'girnar',
    nameHindi: 'श्री गिरनार जी तीर्थ',
    location: 'जूनागढ़',
    state: 'गुजरात',
    significance: '२२वें तीर्थंकर भगवान नेमिनाथ की दीक्षा, केवलज्ञान एवं मोक्ष स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'गिरनार जी अत्यंत प्राचीन सिद्ध क्षेत्र है जहाँ भगवान नेमिनाथ ने कठोर तप कर ५वीं टोंक से निर्वाण प्राप्त किया। यहाँ लगभग १०,००० सीढ़ियों की पावन चढ़ाई है तथा आधुनिक रोपवे की सुविधा भी उपलब्ध है।',
    howToReach: 'जूनागढ़ शहर से भवनाथ तलहटी पहुँचकर सीढ़ियों अथवा रोपवे द्वारा वंदना की जाती है।',
    railway: 'जूनागढ़ जंक्शन (JND) - ६ किमी',
    airport: 'राजकोट अंतरराष्ट्रीय हवाई अड्डा (१०० किमी) / पोरबंदर (१०० किमी)',
    mapQuery: 'Girnar+Jain+Temple+Junagadh',
    dharamshala: 'भवनाथ तलहटी एवं जूनागढ़ नगर में दिगंबर-श्वेतांबर धर्मशालाएं एवं अन्नक्षेत्र उपलब्ध हैं।',
  },
  {
    id: 'pavapuri',
    nameHindi: 'श्री पावापुरी जी तीर्थ',
    location: 'नालंदा',
    state: 'बिहार',
    significance: '२४वें तीर्थंकर भगवान महावीर स्वामी की पावन निर्वाण स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'पावापुरी में भगवान महावीर ने कार्तिक कृष्ण अमावस्या (दीपावली) के दिन निर्वाण प्राप्त किया। यहाँ कमल-सरोवर के मध्य स्थित श्वेत संगमरमर का अलौकिक जलमंदिर विश्व-विख्यात है।',
    howToReach: 'पटना अथवा राजगीर से सड़क मार्ग द्वारा सुगमता से पहुँचा जा सकता है।',
    railway: 'पावापुरी रोड रेलवे स्टेशन (POE) - १० किमी / राजगीर स्टेशन - २० किमी',
    airport: 'जयप्रकाश नारायण अंतरराष्ट्रीय हवाई अड्डा, पटना (९० किमी) / गया हवाई अड्डा (९५ किमी)',
    mapQuery: 'Jal+Mandir+Pawapuri+Bihar',
    dharamshala: 'जलमंदिर एवं गाँव मंदिर के समीप अनेक भव्य धर्मशालाएं व भोजनशालाएं स्थित हैं।',
  },
  {
    id: 'champapuri',
    nameHindi: 'श्री चंपापुरी जी तीर्थ',
    location: 'भागलपुर',
    state: 'बिहार',
    significance: '१२वें तीर्थंकर भगवान वासुपूज्य स्वामी के पंचकल्याणक तीर्थ',
    category: 'सिद्ध क्षेत्र',
    description:
      'चंपापुरी तीर्थ १२वें तीर्थंकर भगवान वासुपूज्य स्वामी का गर्भ, जन्म, तप, केवलज्ञान एवं मोक्ष - पाँचों कल्याणकों से पवित्र महातीर्थ है।',
    howToReach: 'भागलपुर शहर से नाथनगर स्थित मंदिर परिसर हेतु ऑटो व ई-रिक्शा उपलब्ध हैं।',
    railway: 'भागलपुर जंक्शन (BGP) - ४ किमी / नाथनगर स्टेशन - १ किमी',
    airport: 'पटना हवाई अड्डा (२२० किमी) / देवघर हवाई अड्डा (१२० किमी)',
    mapQuery: 'Champapuri+Jain+Temple+Bhagalpur',
    dharamshala: 'दिगंबर एवं श्वेतांबर धर्मशाला नाथनगर में आवास व शुद्ध भोजन की उत्तम व्यवस्था है।',
  },
  {
    id: 'shravanabelagola',
    nameHindi: 'श्री श्रवणबेलगोला तीर्थ',
    location: 'हासन जिला',
    state: 'कर्नाटक',
    significance: 'भगवान गोम्मटेश्वर बाहुबली स्वामी की ५७ फीट उत्तुंग एकाश्म प्रतिमा',
    category: 'अतिशय क्षेत्र',
    description:
      'विंध्यगिरि पर्वत पर स्थित भगवान बाहुबली की ५७ फीट ऊँची एकाश्म प्रतिमा विश्व की अद्वितीय कलाकृति है। यहाँ प्रत्येक १२ वर्ष में विश्व-प्रसिद्ध महामस्तकाभिषेक आयोजित होता है।',
    howToReach: 'बेंगलुरु अथवा मैसूर से राष्ट्रीय राजमार्ग द्वारा सड़क व रेल मार्ग से सीधे जुड़ा है।',
    railway: 'श्रवणबेलगोला रेलवे स्टेशन (SBGA) - २ किमी',
    airport: 'केंपेगौड़ा अंतरराष्ट्रीय हवाई अड्डा, बेंगलुरु (१४५ किमी)',
    mapQuery: 'Shravanabelagola+Gommateshwara',
    dharamshala: 'क्षेत्रीय जैन मठ के अंतर्गत अनेक विशाल यात्री निवास एवं अन्नछत्र संचालित हैं।',
  },
  {
    id: 'mangi-tungi',
    nameHindi: 'श्री मांगीतुंगी जी तीर्थ',
    location: 'सटाणा, नासिक',
    state: 'महाराष्ट्र',
    significance: 'भगवान राम, सुग्रीव, गवय, गवाक्ष सहित ९९ करोड़ मुनियों की मोक्ष स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'मांगी एवं तुंगी दो पर्वतों की चोटियों पर अनेक प्राचीन दिगंबर जैन गुफाएं हैं। यहाँ पर्वत तलहटी में भगवान ऋषभदेव की १०८ फीट ऊँची भव्य एकाश्म प्रतिमा स्थापित है।',
    howToReach: 'नासिक अथवा मनमाड से सड़क मार्ग (सटाणा होते हुए) सुगम है।',
    railway: 'मनमाड जंक्शन (MMR) - ७५ किमी / नासिक रोड स्टेशन - १२० किमी',
    airport: 'नासिक हवाई अड्डा ओझर (१०० किमी) / मुंबई (२८० किमी)',
    mapQuery: 'Mangi+Tungi+Jain+Temple+Maharashtra',
    dharamshala: 'तलहटी में १०८ फीट अहिंसा प्रतिमा परिसर में सर्व-सुविधायुक्त धर्मशालाएं उपलब्ध हैं।',
  },
  {
    id: 'kundalpur',
    nameHindi: 'श्री कुंडलपुर महातीर्थ',
    location: 'पटेरा, दमोह',
    state: 'मध्य प्रदेश',
    significance: 'बड़े बाबा (भगवान ऋषभदेव) की अलौकिक पद्मासन प्रतिमा',
    category: 'अतिशय क्षेत्र',
    description:
      'कुंडलपुर में ६३ जिनालयों की पर्वतमाला है। यहाँ पूज्य आचार्य श्री विद्यासागर जी महाराज की प्रेरणा से भव्य अक्षरधाम शैली का सहस्राब्दी महामंदिर निर्मित हुआ है।',
    howToReach: 'दमोह जिला मुख्यालय से ३५ किमी की दूरी पर स्थित है।',
    railway: 'दमोह रेलवे स्टेशन (DMO) - ३५ किमी / सागर स्टेशन - ११० किमी',
    airport: 'जबलपुर हवाई अड्डा (१४० किमी) / खजुराहो हवाई अड्डा (१४५ किमी)',
    mapQuery: 'Kundalpur+Damoh+Madhya+Pradesh',
    dharamshala: 'कुंडलपुर तीर्थ क्षेत्र ट्रस्ट द्वारा सैकड़ों वातानुकूलित कमरे एवं निःशुल्क भोजनशालाएं संचालित हैं।',
  },
  {
    id: 'sonagir',
    nameHindi: 'श्री सोनागिरि जी तीर्थ',
    location: 'दतिया',
    state: 'मध्य प्रदेश',
    significance: 'नंग-अनंग कुमार सहित साढ़े पाँच करोड़ मुनिराजों की मोक्ष स्थली',
    category: 'सिद्ध क्षेत्र',
    description:
      'स्वर्णगिरि पर्वत पर स्थित ७७ दिगंबर जैन मंदिर दूर से ही श्वेत शिखरों के रूप में सुशोभित होते हैं। मुख्य मंदिर ५७वें नंबर का भगवान चंद्रप्रभ का है।',
    howToReach: 'ग्वालियर एवं झांसी के मध्य मुख्य रेल व राजमार्ग पर स्थित है।',
    railway: 'सोनागिर रेलवे स्टेशन (SOR) - ३ किमी / दतिया - १५ किमी / ग्वालियर - ६५ किमी',
    airport: 'ग्वालियर हवाई अड्डा (७० किमी)',
    mapQuery: 'Sonagir+Jain+Temple+Madhya+Pradesh',
    dharamshala: 'पर्वत तलहटी में अनेक प्राचीन व नवीन धर्मशालाएं एवं त्यागी वृत्ति भवन स्थित हैं।',
  },
  {
    id: 'tijara',
    nameHindi: 'श्री तिजारा जी अतिशय क्षेत्र',
    location: 'खैरथल-तिजारा',
    state: 'राजस्थान',
    significance: '८वें तीर्थंकर भगवान चंद्रप्रभ स्वामी की भूगर्भ से प्रगट चमत्कारी प्रतिमा',
    category: 'अतिशय क्षेत्र',
    description:
      'सन् १९५६ में भूगर्भ से प्रगट भगवान चंद्रप्रभ की श्वेत पद्मासन प्रतिमा का यह विश्व-प्रसिद्ध अतिशय क्षेत्र है जहाँ देश-विदेश से श्रद्धालु दर्शनार्थ आते हैं।',
    howToReach: 'दिल्ली (१०० किमी), गुरुग्राम (८० किमी) और अलवर (५५ किमी) से सीधे सड़क मार्ग द्वारा जुड़ा है।',
    railway: 'अलवर जंक्शन (AWR) - ५५ किमी / रेवाड़ी स्टेशन - ५० किमी',
    airport: 'इंदिरा गांधी अंतरराष्ट्रीय हवाई अड्डा, नई दिल्ली (९० किमी)',
    mapQuery: 'Tijara+Jain+Mandir+Rajasthan',
    dharamshala: 'अतिशय क्षेत्र परिसर में आधुनिक गेस्ट हाउस, एसी कमरे व शुद्ध भोजनालय उपलब्ध हैं।',
  },
  {
    id: 'palitana',
    nameHindi: 'श्री पालिताना (शत्रुंजय महातीर्थ)',
    location: 'भावनगर',
    state: 'गुजरात',
    significance: 'अनंत-अनंत मुनियों एवं प्रथम तीर्थंकर ऋषभदेव का पावन क्षेत्र',
    category: 'सिद्ध क्षेत्र',
    description:
      'शत्रुंजय पर्वत पर ८६० से अधिक नक्काशीदार संगमरमर के जिनालय स्थित हैं। यहाँ ३५०० से अधिक सीढ़ियाँ चढ़कर ऊपर टूकों की पावन वंदना की जाती है।',
    howToReach: 'भावनगर से सड़क अथवा रेल मार्ग द्वारा पालिताना तलहटी पहुँचा जा सकता है।',
    railway: 'पालिताना रेलवे स्टेशन (PIT) - २ किमी / भावनगर - ५० किमी',
    airport: 'भावनगर हवाई अड्डा (५५ किमी) / अहमदाबाद अंतरराष्ट्रीय हवाई अड्डा (२१५ किमी)',
    mapQuery: 'Palitana+Shatrunjaya+Gujarat',
    dharamshala: 'तलहटी में सैकड़ों विशाल धर्मशालाएं, आयंबिल भवन एवं भोजनशालाएं संचालित हैं।',
  },
];

export const PilgrimagePage = ({ onBack }: PilgrimagePageProps) => {
  const [selectedPlace, setSelectedPlace] = useState<KshetraDef | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useModalBackHandler(!!selectedPlace, () => setSelectedPlace(null), 'pilgrimage-detail');

  const filteredPlaces =
    filter === 'all'
      ? pilgrimageData
      : pilgrimageData.filter((p) => p.category === filter);

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 sm:pt-10 pb-36 px-4 sm:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-all backdrop-blur-xl shrink-0 group cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-amber-200" />
        </button>

        <div className="text-center flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-gotu mb-1">
            <MapPin className="w-3 h-3" />
            <span>सिद्ध एवं अतिशय क्षेत्र दिग्दर्शिका</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-300 truncate">
            जैन तीर्थ यात्रा गाइड
          </h1>
        </div>

        <div className="w-11 h-11" />
      </div>

      {/* Filter Tabs */}
      <div className="w-full flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'सर्व तीर्थ क्षेत्र' },
          { id: 'सिद्ध क्षेत्र', label: 'सिद्ध क्षेत्र (मोक्ष भूमि)' },
          { id: 'अतिशय क्षेत्र', label: 'अतिशय क्षेत्र' },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-gotu whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-white/10 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Pilgrimage Kshetra Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
        {filteredPlaces.map((place) => (
          <GlassCard
            key={place.id}
            variant="subtle"
            onClick={() => setSelectedPlace(place)}
            className="p-5 sm:p-6 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 active:scale-[0.99] duration-200 rounded-2xl border-white/10 hover:border-cyan-400/40 relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-gotu font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300">
                  {place.category}
                </span>
                <span className="text-xs text-slate-400 font-gotu flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {place.state}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-notoserif font-bold text-white group-hover:text-cyan-200 transition-colors mb-1.5">
                {place.nameHindi}
              </h3>
              <p className="text-xs text-cyan-300/90 font-gotu mb-2 font-medium">
                {place.significance}
              </p>
              <p className="text-xs text-slate-300/80 font-gotu leading-relaxed line-clamp-2">
                {place.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-cyan-300 font-gotu font-semibold">
              <span>यात्रा मार्ग व विवरण देखें</span>
              <Navigation className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Detailed Kshetra Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedPlace(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#071124] border border-cyan-400/35 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/25 text-cyan-300 text-xs font-gotu mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedPlace.location}, {selectedPlace.state}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white mb-2">
                {selectedPlace.nameHindi}
              </h2>

              <p className="text-xs sm:text-sm font-gotu text-cyan-300/90 font-medium mb-4">
                {selectedPlace.significance}
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-5">
                <p className="text-xs sm:text-sm font-gotu text-slate-200 leading-relaxed">
                  {selectedPlace.description}
                </p>
              </div>

              {/* Transportation Details */}
              <div className="space-y-3 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
                  <Train className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-notoserif font-bold text-cyan-200 mb-0.5">
                      निकटतम रेलवे स्टेशन
                    </h5>
                    <p className="text-xs text-slate-300 font-gotu">{selectedPlace.railway}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
                  <Plane className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-notoserif font-bold text-cyan-200 mb-0.5">
                      निकटतम हवाई अड्डा
                    </h5>
                    <p className="text-xs text-slate-300 font-gotu">{selectedPlace.airport}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-notoserif font-bold text-emerald-200 mb-0.5">
                      आवास व भोजनशाला व्यवस्था
                    </h5>
                    <p className="text-xs text-slate-300 font-gotu">{selectedPlace.dharamshala}</p>
                  </div>
                </div>
              </div>

              {/* Google Maps External Action Button */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-gotu font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <span>Google Maps पर लोकेशन व मार्ग देखें</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
