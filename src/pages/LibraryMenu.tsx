import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  BookOpen,
  Globe,
  Hourglass,
  Landmark,
  Scroll,
  FileText,
  ChevronRight,
  Download,
  ExternalLink,
  Sparkles,
  Search,
  Layers,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface LibraryMenuProps {
  onNavigate: (page: string, params?: any) => void;
}

interface AnuyogaDef {
  id: string;
  subCategoryKey: string;
  titleHindi: string;
  subtitle: string;
  description: string;
  color: string;
  border: string;
  accent: string;
  badge: string;
  keyTexts: string[];
}

const anuyogaPillars: AnuyogaDef[] = [
  {
    id: 'prathamanuyoga',
    subCategoryKey: 'prathamanuyoga',
    titleHindi: 'प्रथमानुयोग',
    subtitle: '६३ शलाका पुरुष चरित्र व इतिहास',
    description:
      'तीर्थंकर, चक्रवर्ती, बलभद्र, नारायण एवं महापुरुषों के पवित्र जीवन चरित्र, कर्मों के फल एवं धर्म की विजय का ऐतिहासिक दिग्दर्शन।',
    color: 'from-amber-500/20 via-amber-900/10 to-transparent',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    accent: 'text-amber-300',
    badge: 'इतिहास व चरित्र',
    keyTexts: ['आदिपुराण', 'उत्तरपुराण', 'पद्मपुराण (रामायण)', 'हरिवंशपुराण (महाभारत)', 'पार्श्वनाथ चरित'],
  },
  {
    id: 'karnanuyoga',
    subCategoryKey: 'karnanuyoga',
    titleHindi: 'करणानुयोग',
    subtitle: 'कर्म सिद्धांत एवं त्रिलोक संरचना',
    description:
      'आत्मा के १४ गुणस्थान, १४ जीवसमास, ८ मूल कर्म व १४८ प्रकृतियाँ, तथा तीन लोक एवं द्वीप-समुद्रों का गहन गणितीय निरूपण।',
    color: 'from-blue-500/20 via-indigo-900/10 to-transparent',
    border: 'border-blue-500/30 hover:border-blue-400/60',
    accent: 'text-blue-300',
    badge: 'कर्म व ब्रह्मांड विज्ञान',
    keyTexts: ['षट्खण्डागम (धवला)', 'कषायपाहुड़', 'गोम्मटसार (जीव-कर्म)', 'त्रिलोकसार', 'लब्धिसार'],
  },
  {
    id: 'charananuyoga',
    subCategoryKey: 'charananuyoga',
    titleHindi: 'चरणानुयोग',
    subtitle: 'मुनि एवं श्रावक आचार संहिता',
    description:
      'दिगम्बर मुनिराजों के २८ मूलगुण, तपश्चर्या, एवं श्रावकों के दैनिक अष्टमूल गुण, १२ व्रत व ११ प्रतिमाओं का संपूर्ण सदाचार शास्त्र।',
    color: 'from-emerald-500/20 via-teal-900/10 to-transparent',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    accent: 'text-emerald-300',
    badge: 'संयम व सदाचार',
    keyTexts: ['मूलाचार', 'रत्नकरण्ड श्रावकाचार', 'पुरुषार्थसिद्धयुपाय', 'सागार धर्मामृत', 'भगवती आराधना'],
  },
  {
    id: 'dravyanuyoga',
    subCategoryKey: 'dravyanuyoga',
    titleHindi: 'द्रव्यानुयोग',
    subtitle: 'परम अध्यात्म एवं आत्म-साक्षात्कार',
    description:
      'षट्द्रव्य, सप्त तत्त्व, शुद्ध ज्ञायक आत्मा, भेद-विज्ञान, स्याद्वाद और सम्यग्दर्शन की प्राप्ति का साक्षात् मोक्षमार्ग दर्शन।',
    color: 'from-purple-500/20 via-violet-900/10 to-transparent',
    border: 'border-purple-500/30 hover:border-purple-400/60',
    accent: 'text-purple-300',
    badge: 'अध्यात्म व तत्त्वज्ञान',
    keyTexts: ['समयसार', 'प्रवचनसार', 'तत्त्वार्थ सूत्र', 'मोक्षमार्ग प्रकाशक', 'छह ढाला', 'समयसार नाटक'],
  },
];

interface PdfResource {
  id: string;
  title: string;
  author: string;
  anuyoga: string;
  pages: string;
  description: string;
  readGranthId?: string;
  downloadUrl?: string;
}

const verifiedPdfArchive: PdfResource[] = [
  {
    id: 'samaysar-pdf',
    title: 'श्री समयसार (आत्मख्याति टीका सहित)',
    author: 'आचार्य कुन्दकुन्द देव / आचार्य अमृतचन्द्र',
    anuyoga: 'द्रव्यानुयोग',
    pages: '४१५ गाथाएं',
    description: 'जैन अध्यात्म का सर्वोपरि मुकुटमणि ग्रंथराज, अमृतचंद्र सूरि कृत संस्कृत आत्मख्याति टीका व हिंदी पद्यानुवाद।',
    readGranthId: 'samaysar',
  },
  {
    id: 'tattvartha-pdf',
    title: 'तत्त्वार्थ सूत्र (सर्वार्थसिद्धि टीका सहित)',
    author: 'आचार्य उमास्वामी / आचार्य पूज्यपाद',
    anuyoga: 'द्रव्यानुयोग',
    pages: '३५७ सूत्र (१० अध्याय)',
    description: 'जैन दर्शन का प्रथम एवं सर्वमान्य संस्कृत सूत्र ग्रंथ एवं उसकी प्राचीनतम सर्वांगपूर्ण संस्कृत सर्वार्थसिद्धि टीका।',
    readGranthId: 'tattvartha-sutra',
  },
  {
    id: 'chhah-dhala-pdf',
    title: 'छह ढाला (सटीक भावार्थ)',
    author: 'कविवर पं. दौलतराम जी',
    anuyoga: 'द्रव्यानुयोग / चरण',
    pages: '६ ढाला (९५ पद्य)',
    description: 'जैन धर्म की लघु गीता - चारों गतियों के दुःखों से लेकर सिद्ध पद तक का संपूर्ण मोक्षमार्ग।',
    readGranthId: 'chhah-dhala',
  },
  {
    id: 'moksha-marg-pdf',
    title: 'मोक्षमार्ग प्रकाशक',
    author: 'पं. प्रवर टोडरमल जी (जयपुर)',
    anuyoga: 'द्रव्यानुयोग',
    pages: '९ अधिकार (विशद ग्रंथ)',
    description: 'तार्किक शैली में अज्ञान, विपरीत मान्यताओं एवं मिथ्यात्व का निरसन कर सम्यक् मोक्षमार्ग का उद्घाटन।',
    readGranthId: 'moksha-marg-prakashak',
  },
  {
    id: 'ratnakarand-pdf',
    title: 'रत्नकरण्ड श्रावकाचार',
    author: 'आचार्य समन्तभद्र स्वामी',
    anuyoga: 'चरणानुयोग',
    pages: '१५० श्लोक',
    description: 'श्रावक धर्म का आदि एवं प्रामाणिक ग्रंथ - सम्यग्दर्शन, अष्ट अंग, १२ व्रत एवं संलेखना विधान।',
    readGranthId: 'ratnakarand-shravakachar',
  },
  {
    id: 'shatkhandagama-pdf',
    title: 'मूल षट्खण्डागम (धवला टीका सार)',
    author: 'आचार्य पुष्पदंत - भूतबलि / वीरसेनाचार्य',
    anuyoga: 'करणानुयोग',
    pages: '६ खण्ड (६००० सूत्र)',
    description: 'दिगम्बर जैन परंपरा का सर्वप्राचीन प्रथम मूल सिद्धांत आगम, वीरसेनाचार्य कृत धवला टीका सहित।',
    readGranthId: 'shatkhandagama',
  },
  {
    id: 'dravya-sangrah-pdf',
    title: 'द्रव्य संग्रह (ब्रह्मदेव टीका)',
    author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती',
    anuyoga: 'द्रव्यानुयोग',
    pages: '५८ गाथाएं',
    description: 'षट्द्रव्य, पंचास्तिकाय, नवपदार्थ एवं मोक्ष के साधनभूत ध्यान का प्राकृत पद्य संग्रह।',
    readGranthId: 'dravya-sangrah',
  },
  {
    id: 'purushartha-pdf',
    title: 'पुरुषार्थ सिद्ध्युपाय',
    author: 'आचार्य अमृतचन्द्र सूरि',
    anuyoga: 'चरणानुयोग',
    pages: '२२६ श्लोक',
    description: 'अहिंसा धर्म की सूक्ष्म व्याख्या एवं सम्यक् पुरुषार्थ द्वारा मुक्ति प्राप्ति का मार्ग।',
    readGranthId: 'purushartha-siddhipaya',
  },
  {
    id: 'padma-puran-pdf',
    title: 'पद्म पुराण (जैन रामायण)',
    author: 'आचार्य रविषेण',
    anuyoga: 'प्रथमानुयोग',
    pages: '१२३ पर्व (महाकाव्य)',
    description: 'भगवान रामचन्द्र जी (बलभद्र) एवं लक्ष्मण (नारायण) का आगमानुकूल प्रामाणिक जीवन चरित्र।',
    readGranthId: 'padma-puran',
  },
  {
    id: 'gommatasara-pdf',
    title: 'श्री गोम्मटसार (जीवकाण्ड व कर्मकाण्ड)',
    author: 'आचार्य नेमिचन्द्र सिद्धांत चक्रवर्ती',
    anuyoga: 'करणानुयोग',
    pages: '१७००+ गाथाएं',
    description: 'चामुंडराय की प्रेरणा से विरचित आत्मा के अनंत भेदों एवं कर्म की १४८ प्रकृतियों का वैज्ञानिक ज्ञान।',
    readGranthId: 'gommatasara-jiva-kanda',
  },
  {
    id: 'mulachar-pdf',
    title: 'मूलाचार (मुनि आचार संहिता)',
    author: 'आचार्य वट्टकेर',
    anuyoga: 'चरणानुयोग',
    pages: '१२४३ गाथाएं',
    description: 'दिगम्बर मुनिराजों के २८ मूलगुण, १२ तप, १० धर्म एवं चर्या का प्राचीनतम आधार ग्रंथ।',
    readGranthId: 'mulachar',
  },
  {
    id: 'samaysar-natak-pdf',
    title: 'समयसार नाटक',
    author: 'कविवर बनारसीदास जी',
    anuyoga: 'द्रव्यानुयोग',
    pages: '७२७ छंद',
    description: 'समयसार एवं आत्मख्याति कलशों का ब्रजभाषा में भावपूर्ण, काव्यात्मक एवं अमर पद्यानुवाद।',
    readGranthId: 'samaysar-natak',
  },
];

const exploratorySections = [
  {
    id: 'tattva',
    label: 'तत्त्व ज्ञान',
    sub: 'प्रयोजनभूत ७ तत्त्व व ६ द्रव्य',
    icon: BookOpen,
    desc: 'जीव, अजीव, आस्रव, बंध, संवर, निर्जरा एवं मोक्ष तत्त्व का आध्यात्मिक रहस्य।',
    color: 'from-amber-500/20 to-amber-800/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
  },
  {
    id: 'bhugol',
    label: 'जैन भूगोल',
    sub: 'त्रिलोक रचना व नक्शा',
    icon: Globe,
    desc: 'ऊर्ध्व, मध्य और अधो लोक, जम्बूद्वीप एवं सुमेरु पर्वत की अकृत्रिम रचना।',
    color: 'from-blue-500/20 to-indigo-800/10',
    border: 'border-blue-500/30',
    accent: 'text-blue-300',
  },
  {
    id: 'itihas',
    label: 'जैन इतिहास',
    sub: '६३ शलाका महापुरुष',
    icon: Hourglass,
    desc: '२४ तीर्थंकर, १२ चक्रवर्ती, ९ बलभद्र, ९ नारायण एवं ९ प्रतिनारायण का पावन इतिहास।',
    color: 'from-purple-500/20 to-indigo-800/10',
    border: 'border-purple-500/30',
    accent: 'text-purple-300',
  },
  {
    id: 'parva',
    label: 'पर्व व उत्सव',
    sub: 'दशलक्षण व अष्टान्हिका',
    icon: Landmark,
    desc: 'दशलक्षण महापर्व, अष्टान्हिका, महावीर जयंती, दीपावली एवं क्षमावाणी पर्व।',
    color: 'from-rose-500/20 to-pink-800/10',
    border: 'border-rose-500/30',
    accent: 'text-rose-300',
  },
  {
    id: 'agamas',
    label: 'मूल आगम परिचय',
    sub: 'द्वादशांग जिनवाणी',
    icon: FileText,
    desc: 'भगवान महावीर की दिव्यध्वनि और गणधरों द्वारा गुंफित मूल आगम साहित्य।',
    color: 'from-teal-500/20 to-cyan-800/10',
    border: 'border-teal-500/30',
    accent: 'text-teal-300',
  },
  {
    id: 'vrat',
    label: '१०५ व्रत व उद्यापन',
    sub: 'पूजा, विधि व उद्यापन संग्रह',
    icon: Sparkles,
    desc: 'ब्रम्हचारी विनोद सागर शास्त्री संकलित १०५ व्रत, उद्यापन विधि एवं श्रावक सदाचार।',
    color: 'from-amber-500/25 to-yellow-600/15',
    border: 'border-amber-400/40',
    accent: 'text-amber-200',
  },
];

export const LibraryMenu = ({ onNavigate }: LibraryMenuProps) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredPdfs = verifiedPdfArchive.filter(
    (pdf) =>
      !filterQuery.trim() ||
      pdf.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      pdf.author.toLowerCase().includes(filterQuery.toLowerCase()) ||
      pdf.anuyoga.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto pt-8 sm:pt-12 md:pt-16 page-bottom-clearance px-3.5 sm:px-6">
      {/* Header Banner - Compact on Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 sm:mb-6 md:mb-10 relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-0 sm:min-h-[170px] md:h-80 flex items-end p-3.5 sm:p-6 md:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.7)] border border-amber-500/30 group"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1745895255289-0410ef510cd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwaW5kaWFuJTIwbGlicrFyeSUyMHNjcmlwdHVyZXMlMjBib29rc3xlbnwxfHx8fDE3Njg5NjcwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-40 sm:opacity-50"
            alt="Digambar Jain Granthalaya"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[10px] sm:text-xs mb-1.5 sm:mb-3 backdrop-blur-md">
            <Scroll className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            <span className="uppercase tracking-[0.16em] sm:tracking-[0.2em] font-cinzel font-bold">Digambar Jain Mahagranthalaya</span>
          </div>
          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-notoserif font-bold text-white mb-1 sm:mb-2 leading-tight">
            दिगम्बर जिनवाणी महा-ग्रंथालय
          </h1>
          <p className="text-slate-200/90 max-w-2xl font-gotu text-xs sm:text-sm md:text-base leading-relaxed mb-2.5 sm:mb-4 hidden sm:block">
            चारों अनुयोग (प्रथमानुयोग, करणानुयोग, चरणानुयोग, द्रव्यानुयोग), प्राचीन मूल आगम, आचार्य परंपरा एवं प्रामाणिक ई-पुस्तकालय का संपूर्ण डिजिटल महा-संग्रह।
          </p>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-amber-300/90 font-gotu font-medium">
            <span className="bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-white/10">४ अनुयोग</span>
            <span className="bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/10">३९+ मूल शास्त्र</span>
            <span className="bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/10">प्रामाणिक ई-बुक्स</span>
            <span className="hidden sm:inline-block bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">१००% दिगम्बर आम्नाय</span>
          </div>
        </div>
      </motion.div>

      {/* Section 1: The Four Pillars (चार अनुयोग) */}
      <div className="mb-8 sm:mb-12 md:mb-14">
        <div className="flex items-center justify-between mb-2.5 sm:mb-5 md:mb-6">
          <div>
            <div className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 font-cinzel mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>The Four Pillars</span>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-notoserif font-bold text-white flex items-center gap-2 leading-tight">
              <span>चार अनुयोग</span>
              <span className="text-xs uppercase tracking-wider font-cinzel text-amber-400/80 font-normal hidden sm:inline">(The Four Anuyogas)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/80 font-gotu mt-0.5 hidden sm:block">
              किसी भी अनुयोग पर क्लिक करके उसके संपूर्ण शास्त्रों की सूची एवं विस्तृत अध्ययन देखें
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => onNavigate('category', { id: 'granthas', source: 'library' })}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-amber-300 hover:text-amber-200 font-gotu font-medium sm:font-bold bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border border-amber-500/30 cursor-pointer transition-[background-color,border-color,color]"
          >
            <span>सभी ३९ शास्त्र</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {anuyogaPillars.map((pillar, idx) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              onClick={() =>
                onNavigate('category', {
                  id: 'granthas',
                  subCategory: pillar.subCategoryKey,
                  source: 'library',
                })
              }
              className="h-full"
            >
              <GlassCard
                variant="gilded"
                tilt
                className={`h-full p-3.5 sm:p-5 md:p-6 flex flex-col justify-between cursor-pointer group transition-all duration-300 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${pillar.color} border ${pillar.border}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300/80 bg-white/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 font-gotu truncate max-w-[100px] sm:max-w-none">
                      {pillar.badge}
                    </span>
                    <span className="text-[10px] sm:text-xs font-cinzel font-bold text-amber-400 shrink-0">
                      स्तंभ ०{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors mb-0.5 sm:mb-1 leading-snug">
                    {pillar.titleHindi}
                  </h3>
                  <p className="text-[10px] sm:text-xs font-bold text-amber-400/90 uppercase tracking-wider mb-1.5 sm:mb-2 font-gotu line-clamp-1">
                    {pillar.subtitle}
                  </p>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-300/85 leading-relaxed font-gotu mb-2.5 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                    {pillar.description}
                  </p>

                  <div className="mb-3 sm:mb-4">
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2 font-gotu">
                      प्रमुख शास्त्र:
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {pillar.keyTexts.map((txt, textIdx) => (
                        <span
                          key={txt}
                          className={`text-[9px] sm:text-[11px] bg-black/40 text-amber-200/90 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg border border-amber-500/20 font-gotu truncate max-w-full ${
                            textIdx >= 2 ? 'hidden sm:inline-block' : ''
                          }`}
                        >
                          {txt}
                        </span>
                      ))}
                      {pillar.keyTexts.length > 2 && (
                        <span className="sm:hidden text-[9px] bg-white/5 text-amber-300/80 px-1.5 py-0.5 rounded-md border border-white/10 font-gotu">
                          +{pillar.keyTexts.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between text-[11px] sm:text-xs text-amber-300 font-gotu font-bold">
                  <span>
                    <span className="sm:hidden">ग्रंथ देखें</span>
                    <span className="hidden sm:inline">{pillar.titleHindi} के ग्रंथ खोलें</span>
                  </span>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 group-hover:translate-x-1 transition-all shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section 2: Canonical Roots Spotlight (मूल षट्खण्डागम व कषायपाहुड़) */}
      <div className="mb-14">
        <GlassCard
          variant="sacred"
          tilt={{ maxTilt: 5, scale: 1.008, glareColor: 'gold' }}
          className="p-6 sm:p-8 rounded-3xl border-amber-500/40 relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-amber-950/30"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 font-cinzel mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digambar Canonical Root Scriptures</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white mb-2">
              दिगम्बर आम्नाय के मूल आधार ग्रंथ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/90 font-gotu max-w-3xl leading-relaxed mb-6">
              भगवान महावीर की दिव्यध्वनि गौतम गणधर से लेकर धरसेनाचार्य तक गुरु-शिष्य परंपरा में अक्षुण्ण रही। धरसेनाचार्य के आदेश से आचार्य पुष्पदंत एवं भूतबलि ने <strong>षट्खण्डागम</strong> और आचार्य गुणधर ने <strong>कषायपाहुड़</strong> लिपिबद्ध किए, जो दिगम्बर परंपरा के अनादि स्तंभ हैं।
            </p>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <motion.div
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => onNavigate('viewer', { id: 'shatkhandagama' })}
                className="p-3.5 sm:p-5 rounded-2xl bg-white/5 border border-amber-500/20 hover:border-amber-400/50 cursor-pointer group flex flex-col justify-between transition-[background-color,border-color]"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] sm:text-xs font-bold text-amber-400 font-gotu bg-amber-500/10 px-2 py-0.5 rounded truncate">
                      प्रथम मूल आगम
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  <h3 className="text-sm sm:text-lg md:text-xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2">
                    षट्खण्डागम (Shatkhandagama)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-gotu mt-1 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    आचार्य पुष्पदंत व भूतबलि विरचित ६ खण्ड एवं वीरसेनाचार्य कृत धवला टीका।
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => onNavigate('viewer', { id: 'kashayaprabhrita' })}
                className="p-3.5 sm:p-5 rounded-2xl bg-white/5 border border-amber-500/20 hover:border-amber-400/50 cursor-pointer group flex flex-col justify-between transition-[background-color,border-color]"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] sm:text-xs font-bold text-amber-400 font-gotu bg-amber-500/10 px-2 py-0.5 rounded truncate">
                      द्वितीय मूल आगम
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                  <h3 className="text-sm sm:text-lg md:text-xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2">
                    कषायपाहुड़ (Kashayaprabhrita)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-gotu mt-1 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    आचार्य गुणधर विरचित २३३ गाथाएं एवं जिनसेन-वीरसेन कृत जयधवला महाटीका।
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Section 3: Verified E-Book / PDF Library Archive */}
      <div className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 font-cinzel mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Digital E-Library & Grantha Archive</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white">
              प्रामाणिक ई-पुस्तकालय (Grantha Archive)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/80 font-gotu mt-0.5">
              दिगम्बर आम्नाय के प्रमुख शास्त्र जिन्हें आप सीधे इन-ऐप पढ़ सकते हैं
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="शास्त्र या आचार्य खोजें..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-white/15 focus:border-amber-400 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none transition-colors font-gotu"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {filteredPdfs.map((pdf) => (
            <GlassCard
              key={pdf.id}
              variant="gilded"
              tilt
              className="p-3 sm:p-4 md:p-5 rounded-2xl flex flex-col justify-between hover:border-amber-400/50 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 px-1.5 sm:px-2 py-0.5 rounded border border-amber-500/25 font-gotu truncate max-w-[85px] sm:max-w-none">
                    {pdf.anuyoga}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-gotu font-medium shrink-0">
                    {pdf.pages}
                  </span>
                </div>

                <h3 className="text-xs sm:text-base md:text-lg font-notoserif font-bold text-white mb-0.5 sm:mb-1 line-clamp-2 leading-snug">
                  {pdf.title}
                </h3>
                <p className="text-[10px] sm:text-xs font-medium text-amber-400/90 font-gotu mb-1 sm:mb-2 line-clamp-1">
                  {pdf.author}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-300/80 font-gotu leading-relaxed line-clamp-2 mb-2 sm:mb-4">
                  {pdf.description}
                </p>
              </div>

              <div className="pt-2 sm:pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                {pdf.readGranthId ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    onClick={() => onNavigate('viewer', { id: pdf.readGranthId })}
                    className="w-full flex items-center justify-center gap-1 text-[11px] sm:text-xs font-gotu font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 py-1.5 sm:py-2 rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>
                      <span className="sm:hidden">पढ़ें</span>
                      <span className="hidden sm:inline">इन-ऐप शास्त्र पढ़ें</span>
                    </span>
                  </motion.button>
                ) : null}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Section 4: Exploratory & Topical Sections */}
      <div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400 font-cinzel mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Spiritual Knowledge Domains</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-notoserif font-bold text-white">
            स्वाध्याय एवं दर्शन अनुभाग
          </h2>
          <p className="text-xs sm:text-sm text-slate-300/80 font-gotu mt-0.5">
            तत्त्वज्ञान, जैन भूगोल, तीर्थंकर इतिहास एवं पर्व व्यवस्था
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {exploratorySections.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              onClick={() => onNavigate('category', { id: item.id, source: 'library' })}
              className="h-full"
            >
              <GlassCard
                variant="gilded"
                tilt
                className="h-full p-4 sm:p-5 flex flex-col justify-between cursor-pointer group transition-all duration-300 rounded-2xl"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center ${item.accent} group-hover:scale-110 transition-transform shadow-inner shrink-0`}
                    >
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors mb-0.5 break-words">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-amber-400/90 font-bold mb-1.5 font-gotu break-words line-clamp-1">
                    {item.sub}
                  </p>
                  <p className="text-xs text-slate-300/80 leading-relaxed font-gotu break-words line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-amber-300/90 font-gotu font-semibold">
                  <span>सूची देखें</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryMenu;