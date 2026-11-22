import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Search, Filter, User } from 'lucide-react';
import { GlassCard } from '../components/layout/GlassCard';
import { matchSearchQuery } from '../utils/searchHelper';

interface MuniProfilesPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

interface MuniProfile {
  id: string;
  name: string;
  hindiName: string;
  title: string;
  sect: 'Digambar' | 'Shwetambar' | 'All';
  description: string;
  born?: string;
  samadhi?: string;
  image?: string;
}

const muniDatabase: MuniProfile[] = [
  {
    id: 'vidyasagar',
    name: 'Acharya Vidyasagar Ji',
    hindiName: 'आचार्य श्री विद्यासागर जी',
    title: 'Acharya',
    sect: 'Digambar',
    description: 'संत शिरोमणि, मूकमाटी महाकाव्य के रचयिता और कठोर तपस्वी। गौ-सेवा और हथकरघा प्रोत्साहन के प्रणेता।',
    born: '1946',
    samadhi: '2024',
    image: 'https://images.unsplash.com/photo-1601435428134-9f73cd76dcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWluJTIwbW9uayUyMHdhbGtpbmd8ZW58MXx8fHwxNzY5MDg1NjkwfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'shantisagar',
    name: 'Acharya Shantisagar Ji',
    hindiName: 'आचार्य श्री शांतिसागर जी',
    title: 'Pratham Acharya',
    sect: 'Digambar',
    description: '२०वीं सदी के प्रथम दिगम्बर आचार्य। चारित्र चक्रवर्ती जिन्होंने लुप्त प्राय: मुनि परंपरा को पुनर्जीवित किया।',
    born: '1872',
    samadhi: '1955'
  },
  {
    id: 'mahapragya',
    name: 'Acharya Mahapragya Ji',
    hindiName: 'आचार्य श्री महाप्रज्ञ जी',
    title: 'Acharya',
    sect: 'Shwetambar',
    description: 'प्रेक्षाध्यान के प्रणेता और जीवन विज्ञान के संस्थापक। अहिंसा यात्रा के माध्यम से विश्व शांति का संदेश दिया।',
    born: '1920',
    samadhi: '2010'
  },
  {
    id: 'tarunsagar',
    name: 'Muni Tarun Sagar Ji',
    hindiName: 'मुनि श्री तरुण सागर जी',
    title: 'Muni',
    sect: 'Digambar',
    description: 'क्रांतिकारी राष्ट्रसंत, अपने "कड़वे प्रवचन" के लिए प्रसिद्ध। उन्होंने धर्म को रूढ़िवादिता से निकालकर जीवन जीने की कला बनाया।',
    born: '1967',
    samadhi: '2018'
  },
  {
    id: 'sudhasagar',
    name: 'Muni Sudhasagar Ji',
    hindiName: 'मुनि श्री सुधासागर जी',
    title: 'Muni',
    sect: 'Digambar',
    description: 'आचार्य विद्यासागर जी के सुयोग्य शिष्य। प्राचीन तीर्थों के जीर्णोद्धार और शंका-समाधान के लिए विख्यात।',
    born: '1966'
  },
  {
    id: 'gyansagar',
    name: 'Acharya Gyansagar Ji',
    hindiName: 'आचार्य श्री ज्ञानसागर जी',
    title: 'Acharya',
    sect: 'Digambar',
    description: 'आचार्य विद्यासागर जी के गुरु। संस्कृत के प्रकांड विद्वान और अनेक महाकाव्यों के रचयिता।',
    born: '1891',
    samadhi: '1973'
  },
  {
    id: 'chandanamati',
    name: 'Aryika Chandanamati Mataji',
    hindiName: 'आर्यिका श्री चंदनामती माताजी',
    title: 'Aryika',
    sect: 'Digambar',
    description: 'हस्तिनापुर में जम्बूद्वीप रचना की प्रेरणाश्रोत। जैन साहित्य की विदुषी साध्वी।',
    born: '1934'
  },
  {
    id: 'vimaladitya',
    name: 'Acharya Vimaladitya Ji',
    hindiName: 'आचार्य श्री विमलादित्य जी',
    title: 'Acharya',
    sect: 'Digambar',
    description: 'दक्षिण भारत में जैन धर्म प्रभावना के सशक्त हस्ताक्षर।',
    born: 'Unknown'
  }
];

export const MuniProfilesPage = ({ onBack }: MuniProfilesPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSect, setFilterSect] = useState<'All' | 'Digambar' | 'Shwetambar'>('All');

  const filteredMunis = muniDatabase.filter((muni) => {
    const matchesSearch = matchSearchQuery(
      {
        id: muni.id,
        title: `${muni.hindiName} ${muni.name}`,
        description: muni.description,
        category: muni.sect,
        badge: muni.title,
      },
      searchTerm
    );
    const matchesFilter = filterSect === 'All' || muni.sect === filterSect;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 page-bottom-clearance px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-slate-900/80 hover:bg-amber-500/25 border border-white/15 hover:border-amber-400/50 transition-colors flex items-center justify-center group cursor-pointer shadow-md shrink-0"
            title="वापस जाएं"
          >
            <ChevronLeft className="w-6 h-6 text-slate-200 group-hover:text-amber-200" />
          </motion.button>

          <div>
            <h1 className="text-3xl font-rozha text-white drop-shadow-[0_2px_15px_rgba(245,158,11,0.2)] pt-1.5 pb-0.5 leading-[1.35]">
              पुण्य चरित्र
            </h1>
            <p className="text-slate-200 font-gotu text-sm font-medium mt-0.5">
              संत शिरोमणि एवं मुनि वृन्द
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative group w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300 group-focus-within:text-amber-200 transition-colors" />
            <input
              type="text"
              placeholder="मुनि नाम या विवरण खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-slate-900/80 border border-white/20 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:bg-slate-900 focus:border-amber-400/60 transition-all font-gotu shadow-inner"
            />
          </div>

          {/* Filter */}
          <div className="flex bg-slate-900/80 rounded-full p-1 border border-white/15 shadow-sm">
            {(['All', 'Digambar', 'Shwetambar'] as const).map((sect) => (
              <motion.button
                key={sect}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilterSect(sect)}
                className={`px-4 py-1.5 rounded-full text-xs font-gotu font-bold transition-[background-color,border-color,color] cursor-pointer ${
                  filterSect === sect
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-sm'
                    : 'text-slate-300 hover:text-white border border-transparent'
                }`}
              >
                {sect === 'All' ? 'सभी परंपरा' : sect === 'Digambar' ? 'दिगम्बर' : 'श्वेताम्बर'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {filteredMunis.map((muni, idx) => (
          <motion.div
            key={muni.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard
              tilt={{ maxTilt: 9, glareMaxOpacity: 0.15, glareColor: 'gold' }}
              className="group h-full flex flex-col bg-slate-900/85 hover:bg-slate-850 border border-white/10 hover:border-amber-500/40 rounded-2xl transition-all duration-300 overflow-hidden shadow-lg"
            >
              {/* Image Area */}
              <div className="relative h-48 w-full bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden">
                {muni.image ? (
                  <img
                    src={muni.image}
                    alt={muni.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <User className="w-16 h-16 text-amber-300/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-[11px] uppercase tracking-wider text-amber-200 font-bold font-mono shadow-sm">
                    {muni.title}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-rozha text-white group-hover:text-amber-200 transition-colors mb-1">
                  {muni.hindiName}
                </h3>
                <p className="text-xs text-amber-300/90 font-cinzel uppercase tracking-wider font-bold mb-3">
                  {muni.name}
                </p>

                <p className="text-sm text-slate-200 font-gotu leading-relaxed line-clamp-3 mb-4 flex-1">
                  {muni.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-300 font-medium pt-3.5 border-t border-white/10 mt-auto">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-amber-200">
                    {muni.sect === 'Digambar' ? 'दिगम्बर' : muni.sect === 'Shwetambar' ? 'श्वेताम्बर' : muni.sect}
                  </span>
                  {(muni.born || muni.samadhi) && (
                    <span className="font-mono text-slate-300">
                      {muni.born ? muni.born : '?'} - {muni.samadhi ? muni.samadhi : 'वर्तमान'}
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filteredMunis.length === 0 && (
        <div className="text-center py-20 text-slate-300 font-gotu">
          <Filter className="w-12 h-12 mx-auto mb-4 text-amber-400/60" />
          <p className="text-base text-slate-200 font-medium">खोज मापदंड के अनुसार कोई मुनि प्रोफाइल नहीं मिला</p>
          <p className="text-xs text-slate-400 mt-1">कृपया कोई अन्य नाम या परंपरा चुनकर देखें</p>
        </div>
      )}
    </div>
  );
};
