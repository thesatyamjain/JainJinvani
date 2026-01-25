import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ArrowLeft, MapPin, Book, Sparkles, Heart } from 'lucide-react';
import { addFavorite, removeFavorite, isFavorite } from '../lib';
import { getContentById } from '../lib/bridge';

interface TirthankarProfileProps {
  tirthankarId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const TirthankarProfile = ({ tirthankarId, onBack, onNavigate }: TirthankarProfileProps) => {
  const [favorite, setFavorite] = React.useState(isFavorite(`tirthankar-${tirthankarId}`));

  // Fetch data dynamically
  const data = getContentById(tirthankarId);

  // Helper to extract data from HTML string
  const extract = (html: string, regex: RegExp, defaultVal = 'N/A') => {
    const match = html?.match(regex);
    return match ? match[1] : defaultVal;
  };

  // If data is missing (should not happen if ID is correct), fallback gracefully
  if (!data) {
    return <div className="text-white text-center pt-20">Data not found for {tirthankarId}</div>;
  }

  // Parse details from the HTML content in history_data.js
  const html = data.content || '';
  const nameHindi = extract(html, /<h2>(.*?)<\/h2>/, data.title);
  const symbolEmoji = extract(html, /class="tirthankara-symbol">(.*?)<\/span>/, '🕉️');
  const symbolName = extract(html, /<strong>Symbol.*?<\/strong><span>(.*?)<\/span>/, 'Unknown');
  const color = extract(html, /<strong>Color<\/strong><span>(.*?)<\/span>/, 'Golden');
  const father = extract(html, /<strong>Father<\/strong><span>(.*?)<\/span>/, 'King');
  const mother = extract(html, /<strong>Mother<\/strong><span>(.*?)<\/span>/, 'Queen');
  const birthPlace = extract(html, /<strong>Birthplace<\/strong><span>(.*?)<\/span>/, 'Ayodhya');
  const nirvanaPlace = extract(html, /<strong>Nirvana<\/strong><span>(.*?)<\/span>/, 'Sammed Shikhar');

  // Extract first Hindi bio paragraph if available, else first English paragraph
  // Look for the "Jivan Parichay" section or just the first paragraph
  const bioMatch = html.match(/<h3.*?जीवन परिचय<\/h3><p.*?>(.*?)<\/p>/);
  const englishBioMatch = html.match(/<h3>Life.*?<\/h3><p>(.*?)<\/p>/);
  const description = bioMatch ? bioMatch[1] : (englishBioMatch ? englishBioMatch[1] : 'Description unavailable.');

  // Generate generic mantra based on name
  const mainName = data.title.replace('Lord ', '').replace('Bhagwan ', '').split(' ')[0];
  const mantra = `ॐ ह्रीं श्री ${mainName} जिनेन्द्राय नमः`;

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavorite(`tirthankar-${tirthankarId}`);
      setFavorite(false);
    } else {
      addFavorite({
        id: `tirthankar-${tirthankarId}`,
        title: nameHindi,
        type: 'tirthankar'
      });
      setFavorite(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 pb-32 px-6">
      {/* Header */}
      <div className="mb-8 relative">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 flex items-center gap-2 text-blue-200 hover:text-white transition-colors group z-10"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-gotu hidden md:inline">वापस जाएं</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-12 md:mt-0"
        >
          <div className="text-8xl mb-6 filter drop-shadow-lg animate-float">{symbolEmoji}</div>
          <h1 className="text-5xl md:text-7xl font-rozha text-white mb-4 leading-tight text-shadow-lg">
            {nameHindi}
          </h1>
          <p className="text-blue-100/60 font-gotu text-xl mb-6 tracking-wide">
            {data.title}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-bold uppercase tracking-wider">
              Tirthankara
            </span>
            <button
              onClick={handleFavoriteToggle}
              className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm flex items-center gap-2 transition-all hover:border-rose-400/50"
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              {favorite ? 'पसंदीदा में' : 'पसंदीदा'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-8 h-full border-t-4 border-t-amber-500/50">
            <h2 className="text-2xl font-rozha text-amber-200 mb-6 flex items-center gap-3">
              <Book className="w-6 h-6 text-amber-500" />
              परिचय
            </h2>
            <div className="space-y-4 text-blue-100/80 font-gotu text-lg">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-blue-200/50">चिह्न (Symbol)</span>
                <span className="text-white font-medium">{symbolName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-blue-200/50">वर्ण (Color)</span>
                <span className="text-white font-medium">{color}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-blue-200/50">श्रेणी</span>
                <span className="text-white font-medium">तीर्थंकर</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Family & Places */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-8 h-full border-t-4 border-t-blue-500/50">
            <h2 className="text-2xl font-rozha text-blue-200 mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-500" />
              पारिवारिक विवरण
            </h2>
            <div className="space-y-4 text-blue-100/80 font-gotu text-lg">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-blue-200/50">पिता</span>
                <span className="text-white font-medium">{father}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-blue-200/50">माता</span>
                <span className="text-white font-medium">{mother}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-blue-200/50">जन्म स्थान</span>
                <span className="text-white font-medium">{birthPlace}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-blue-200/50">निर्वाण स्थान</span>
                <span className="text-white font-medium">{nirvanaPlace}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <GlassCard className="p-8 md:p-10 bg-gradient-to-br from-white/5 to-transparent">
          <h2 className="text-2xl font-rozha text-amber-200 mb-6">जीवन परिचय</h2>
          <p className="text-blue-100/90 font-gotu leading-loose text-xl text-justify">
            {description}
          </p>
        </GlassCard>
      </motion.div>

      {/* Mantras */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
          <h2 className="text-2xl font-rozha text-amber-200 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> मूल मंत्र
          </h2>
          <div className="p-6 rounded-xl bg-black/20 border border-amber-500/20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            <p className="text-white font-tiro text-2xl md:text-3xl relative z-10">{mantra}</p>
          </div>
        </GlassCard>
      </motion.div>

    </div>
  );
};
