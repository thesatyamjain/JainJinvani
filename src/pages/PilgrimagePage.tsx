import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ChevronLeft, MapPin, Navigation, Star, Image as ImageIcon, Info } from 'lucide-react';
import { useModalBackHandler } from '../lib';


interface PilgrimagePageProps {
  onBack: () => void;
}

const pilgrimageData = [
  {
    id: 'shikharji',
    name: 'Shikharji',
    nameHindi: 'शिखरजी',
    location: 'झारखंड',
    state: 'Jharkhand',
    significance: 'सबसे पवित्र तीर्थ स्थल, 20 तीर्थंकरों ने यहां मोक्ष प्राप्त किया',
    peaks: '24 पर्वत शिखर',
    bestTime: 'अक्टूबर से मार्च',
    category: 'सिद्ध क्षेत्र',
    emoji: '⛰️',
    description: 'शिखरजी (पारसनाथ पर्वत) जैन धर्म का सर्वाधिक पवित्र तीर्थ है। यहां 20 तीर्थंकरों सहित असंख्य मुनियों ने मोक्ष प्राप्त किया। पैदल यात्रा करते हुए 24 पर्वत शिखरों के दर्शन होते हैं।',
    howToReach: 'निकटतम रेलवे स्टेशन: मधुबन (8 km), निकटतम हवाई अड्डा: रांची (150 km)'
  },
  {
    id: 'palitana',
    name: 'Palitana',
    nameHindi: 'पालिताना (शत्रुंजय)',
    location: 'गुजरात',
    state: 'Gujarat',
    significance: 'सर्वाधिक मंदिरों वाला पर्वत - 900+ मंदिर',
    peaks: '863 मंदिर',
    bestTime: 'नवंबर से फरवरी',
    category: 'सिद्ध क्षेत्र',
    emoji: '🏛️',
    description: 'शत्रुंजय पर्वत पर स्थित पालिताना में 863 से अधिक जैन मंदिर हैं। यह प्रथम तीर्थंकर ऋषभदेव से जुड़ा पवित्र स्थान है। 3500+ सीढ़ियां चढ़कर मंदिरों तक पहुंचा जाता है।',
    howToReach: 'निकटतम रेलवे स्टेशन: पालिताना (3 km), निकटतम हवाई अड्डा: भावनगर (50 km)'
  },
  {
    id: 'girnar',
    name: 'Girnar',
    nameHindi: 'गिरनार',
    location: 'गुजरात',
    state: 'Gujarat',
    significance: '22वें तीर्थंकर नेमिनाथ की मोक्ष स्थली',
    peaks: '10,000 सीढ़ियां',
    bestTime: 'अक्टूबर से मार्च',
    category: 'सिद्ध क्षेत्र',
    emoji: '🗻',
    description: 'गिरनार पर्वत पर नेमिनाथ भगवान ने मोक्ष प्राप्त किया। यहां 10,000 से अधिक सीढ़ियां चढ़कर पहुंचा जाता है। यह एक प्राचीन और अत्यंत पवित्र तीर्थ है।',
    howToReach: 'निकटतम रेलवे स्टेशन: जूनागढ़ (5 km), निकटतम हवाई अड्डा: राजकोट (100 km)'
  },
  {
    id: 'pavapuri',
    name: 'Pawapuri',
    nameHindi: 'पावापुरी',
    location: 'बिहार',
    state: 'Bihar',
    significance: 'भगवान महावीर की मोक्ष स्थली',
    peaks: 'जलमंदिर',
    bestTime: 'सितंबर से मार्च',
    category: 'सिद्ध क्षेत्र',
    emoji: '🕉️',
    description: 'पावापुरी में भगवान महावीर ने 72 वर्ष की आयु में निर्वाण प्राप्त किया। यहां का जलमंदिर विश्व प्रसिद्ध है जो एक सरोवर के बीच में स्थित है।',
    howToReach: 'निकटतम रेलवे स्टेशन: राजगीर (8 km), निकटतम हवाई अड्डा: पटना (90 km)'
  },
  {
    id: 'ranakpur',
    name: 'Ranakpur',
    nameHindi: 'रणकपुर',
    location: 'राजस्थान',
    state: 'Rajasthan',
    significance: 'प्रथम तीर्थंकर ऋषभदेव का अद्भुत मंदिर',
    peaks: '1444 स्तंभ',
    bestTime: 'अक्टूबर से मार्च',
    category: 'अतिशय क्षेत्र',
    emoji: '🏰',
    description: 'रणकपुर का मंदिर अपनी वास्तुकला के लिए विश्व प्रसिद्ध है। यहां 1444 स्तंभ हैं और प्रत्येक स्तंभ की नक्काशी अद्वितीय है। यह ऋषभदेव को समर्पित है।',
    howToReach: 'निकटतम रेलवे स्टेशन: फालना (40 km), निकटतम हवाई अड्डा: उदयपुर (90 km)'
  },
  {
    id: 'kundalpur',
    name: 'Kundalpur',
    nameHindi: 'कुंडलपुर',
    location: 'मध्य प्रदेश',
    state: 'Madhya Pradesh',
    significance: 'भगवान महावीर की जन्मस्थली',
    peaks: 'जन्म कल्याणक',
    bestTime: 'पूरे वर्ष',
    category: 'अतिशय क्षेत्र',
    emoji: '🙏',
    description: 'कुंडलपुर में भगवान महावीर का जन्म हुआ था। यहां एक विशाल मंदिर परिसर और 63 फीट ऊंची महावीर की प्रतिमा स्थापित है।',
    howToReach: 'निकटतम रेलवे स्टेशन: दमोह (8 km), निकटतम हवाई अड्डा: जबलपुर (120 km)'
  }
];

export const PilgrimagePage = ({ onBack }: PilgrimagePageProps) => {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  // Close place details modal on mobile back navigation
  useModalBackHandler(!!selectedPlace, () => setSelectedPlace(null), 'pilgrimage-detail');


  const filteredPlaces = filter === 'all'
    ? pilgrimageData
    : pilgrimageData.filter(p => p.category === filter);

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 pb-32 px-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-center group mb-6 cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs mb-3">
            <MapPin className="w-3 h-3" />
            <span className="uppercase tracking-widest text-sm font-bold font-cinzel">Pilgrimage</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-rozha text-white mb-3">
            तीर्थ यात्रा
          </h1>
          <p className="text-blue-100/60 font-gotu text-lg">
            पवित्र जैन तीर्थ स्थल
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-all ${filter === 'all'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 text-blue-100 hover:bg-white/10'
              }`}
          >
            सभी
          </button>
          <button
            onClick={() => setFilter('सिद्ध क्षेत्र')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-all ${filter === 'सिद्ध क्षेत्र'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 text-blue-100 hover:bg-white/10'
              }`}
          >
            सिद्ध क्षेत्र
          </button>
          <button
            onClick={() => setFilter('अतिशय क्षेत्र')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-all ${filter === 'अतिशय क्षेत्र'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 text-blue-100 hover:bg-white/10'
              }`}
          >
            अतिशय क्षेत्र
          </button>
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place, idx) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard
              className="p-6 hover:bg-white/10 cursor-pointer transition-all group h-full"
              onClick={() => setSelectedPlace(place)}
            >
              <div className="text-5xl mb-4">{place.emoji}</div>
              <h3 className="text-xl font-rozha text-white mb-2 group-hover:text-amber-300 transition-colors">
                {place.nameHindi}
              </h3>
              <p className="text-sm text-blue-100/60 font-gotu mb-3">{place.name}</p>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-300">{place.location}</span>
              </div>
              <p className="text-sm text-blue-100/70 font-gotu mb-3 line-clamp-2">
                {place.significance}
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-blue-200 text-xs">
                {place.category}
              </span>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedPlace(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl z-10 my-8"
          >
            <GlassCard className="p-8 border-white/20 bg-[#0b162c] shadow-2xl">
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="text-6xl mb-4">{selectedPlace.emoji}</div>

              <h2 className="text-3xl font-rozha text-white mb-2">
                {selectedPlace.nameHindi}
              </h2>
              <p className="text-blue-100/60 font-gotu mb-4">{selectedPlace.name}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm">
                  {selectedPlace.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedPlace.location}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs text-amber-300 uppercase mb-1">महत्व</div>
                  <p className="text-blue-100/80 font-gotu">{selectedPlace.significance}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-300 uppercase mb-1">विवरण</div>
                  <p className="text-blue-100/80 font-gotu leading-relaxed">
                    {selectedPlace.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs text-amber-300 uppercase mb-1">कैसे पहुंचें</div>
                  <p className="text-blue-100/80 font-gotu text-sm">
                    {selectedPlace.howToReach}
                  </p>
                </div>

                <div>
                  <div className="text-xs text-amber-300 uppercase mb-1">यात्रा का उत्तम समय</div>
                  <p className="text-blue-100/80 font-gotu">{selectedPlace.bestTime}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <button className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-gotu text-sm transition-all">
                  📍 नक्शा देखें
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-gotu text-sm transition-all">
                  📷 तस्वीरें
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};
