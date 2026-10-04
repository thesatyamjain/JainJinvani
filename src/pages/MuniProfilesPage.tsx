import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Search, Filter, User } from 'lucide-react';
import { GlassCard } from '../components/layout/GlassCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
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
    image: 'https://images.unsplash.com/photo-1601435428134-9f73cd76dcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWluJTIwbW9uayUyMHdhbGtpbmd8ZW58MXx8fHwxNzY5MDg1NjkwfDA&ixlib=rb-4.1.0&q=80&w=1080' // Generic placeholder used as specific images are not available in stock
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
    <div className="w-full max-w-6xl mx-auto pt-20 page-bottom-clearance px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-colors flex items-center justify-center group cursor-pointer shadow-md shrink-0"
            title="वापस जाएं"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
          </motion.button>

          <div>
            <h1 className="text-3xl font-rozha text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-orange-200 pt-1.5 pb-0.5 leading-[1.35]">
              पुण्य चरित्र
            </h1>
            <p className="text-blue-100/60 font-gotu text-sm mt-1">
              संत शिरोमणि एवं मुनि वृन्द
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/50 group-focus-within:text-blue-200 transition-colors" />
            <input
              type="text"
              placeholder="खोजें (Search)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            {['All', 'Digambar', 'Shwetambar'].map((sect) => (
              <motion.button
                key={sect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterSect(sect as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-[background-color,color] cursor-pointer ${filterSect === sect
                    ? 'bg-amber-500/20 text-amber-200'
                    : 'text-white/50 hover:text-white'
                  }`}
              >
                {sect}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMunis.map((muni, idx) => (
          <motion.div
            key={muni.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard
              tilt={{ maxTilt: 9, glareMaxOpacity: 0.15, glareColor: 'gold' }}
              className="group h-full flex flex-col hover:bg-white/10 transition-all duration-300 border-white/5 hover:border-amber-500/30 overflow-hidden"
            >
              {/* Image Area */}
              <div className="relative h-48 w-full bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
                {muni.image ? (
                  <img
                    src={muni.image}
                    alt={muni.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5">
                    <User className="w-16 h-16 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider text-amber-200 font-bold">
                    {muni.title}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-rozha text-white group-hover:text-amber-200 transition-colors mb-1">
                  {muni.hindiName}
                </h3>
                <p className="text-xs text-blue-100/50 uppercase tracking-wider font-bold mb-3">
                  {muni.name}
                </p>

                <p className="text-sm text-blue-100/70 font-gotu leading-relaxed line-clamp-3 mb-4 flex-1">
                  {muni.description}
                </p>

                <div className="flex items-center justify-between text-xs text-white/30 pt-4 border-t border-white/5 mt-auto">
                  <span>{muni.sect}</span>
                  {(muni.born || muni.samadhi) && (
                    <span>
                      {muni.born ? muni.born : '?'} - {muni.samadhi ? muni.samadhi : 'Present'}
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filteredMunis.length === 0 && (
        <div className="text-center py-20 text-white/30">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No profiles found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
