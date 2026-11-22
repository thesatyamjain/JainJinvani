import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Sparkles, BookOpen, Check, Copy } from 'lucide-react';
import { GlassCard } from '../layout/GlassCard';
import { TiltCard } from '../layout/TiltCard';

interface JainQuote {
  verse: string;
  meaning: string;
  source: string;
  author: string;
}

const JAIN_QUOTES: JainQuote[] = [
  {
    verse: 'परस्परोपग्रहो जीवानाम्।',
    meaning: 'समस्त जीव एक-दूसरे के उपकारक हैं। सभी प्राणी परस्पर सहयोग और सद्भाव से जीवन यापन करें।',
    source: 'तत्त्वार्थ सूत्र (अध्याय ५, सूत्र २१)',
    author: 'आचार्य उमास्वामी',
  },
  {
    verse: 'जे त्रिभुवन में जीव अनंत, सुख चाहें दुख तें भयवंत।\nतातैं दुखहारी सुखकार, कहैं सीख गुरु करुणा धार॥',
    meaning: 'तीनों लोकों में जितने भी अनंत जीव हैं, सब सुख चाहते हैं और दुःख से डरते हैं। अतः करुणावान गुरु वही शिक्षा देते हैं जो दुःख हरने वाली और सच्चा सुख देने वाली हो।',
    source: 'छहढाला (प्रथम ढाल, छंद १)',
    author: 'पंडित दौलतराम जी',
  },
  {
    verse: 'अहंकार का भाव न रक्खूँ, नहीं किसी पर क्रोध करूँ।\nदेख दूसरों की बढ़ती को, कभी न ईर्ष्या भाव धरूँ॥',
    meaning: 'मन में कभी अहंकार न आए, किसी पर क्रोध न करूँ। दूसरों की उन्नति और वैभव देखकर चित्त में कभी ईर्ष्या न उपजे, यही सच्ची समता है।',
    source: 'मेरी भावना (पद्य ३)',
    author: 'पंडित जुगलकिशोर जी ‘युगल’',
  },
  {
    verse: 'नमः समयसाराय स्वानुभूत्या चकासते।\nचित्स्वभावाय भावाय सर्वभावांतरच्छिदे॥',
    meaning: 'जो स्वानुभूति से प्रकाशित हैं, चित्स्वभाव रूप हैं और समस्त पर-भावों का उच्छेद करने वाले हैं, उन शुद्ध आत्म-स्वरूप समयसार को नमन हो।',
    source: 'समयसार कलश (मंगलाचरण, श्लोक १)',
    author: 'आचार्य अमृतचंद्र देव',
  },
  {
    verse: 'सम्यग्दर्शनज्ञानचारित्राणि मोक्षमार्गः।',
    meaning: 'सम्यग्दर्शन, सम्यग्ज्ञान और सम्यकचारित्र — इन तीनों की एकरूपता ही पूर्ण मुक्ति (मोक्ष) का सच्चा मार्ग है।',
    source: 'तत्त्वार्थ सूत्र (अध्याय १, सूत्र १)',
    author: 'आचार्य उमास्वामी',
  },
  {
    verse: 'आतम को हित है सुख, सो सुख आकुलता बिन कहिये।\nआकुलता शिवमाहिं न तातैं, शिव मग लाग्यो चहिये॥',
    meaning: 'आत्मा का सच्चा हित वास्तविक सुख में है, और सच्चा सुख आकुलता (व्याकुलता) रहित होने में है। मोक्ष में कोई आकुलता नहीं है, इसलिए मोक्षमार्ग में लगना ही श्रेष्ठ कर्तव्य है।',
    source: 'छहढाला (द्वितीय ढाल, छंद ७)',
    author: 'पंडित दौलतराम जी',
  },
  {
    verse: 'न मे मृत्युः कुतो भीतिः, न मे व्याधिः कुतो व्यथा।\nनाहं बालो न वृद्धोऽहं, न चैवैते मम क्वचित्॥',
    meaning: 'मेरी मृत्यु नहीं होती, फिर डर कैसा? मुझ चैतन्य को कोई व्याधि नहीं, फिर व्यथा कैसी? मैं न बालक हूँ, न वृद्ध; ये सब शरीर की अवस्थाएं हैं, मेरी नहीं।',
    source: 'समाधिमरण पाठ (ईशोपनिषद्)',
    author: 'आचार्य पूज्यपाद',
  },
  {
    verse: 'राजा राणा छत्रपति, हाथिन के असवार।\nमरना सब को एक दिन, अपनी अपनी बार॥',
    meaning: 'संसार में कोई राजा हो या महाप्रतापी सम्राट, सबको एक दिन अपनी बारी आने पर यह नश्वर देह छोड़नी पड़ती है। अतः धर्म और आत्म-कल्याण ही शाश्वत शरण है।',
    source: 'बारह भावना (अनित्य भावना)',
    author: 'पारंपरिक जैन स्वाध्याय',
  },
  {
    verse: 'सदृष्टिज्ञानवृत्तानि धर्मं धर्मेश्वरा विदुः।\nयदीय प्रत्यनीकानि भवन्ति भवपद्धतिः॥',
    meaning: 'सम्यग्दर्शन, सम्यग्ज्ञान और सम्यक्चारित्र ही धर्म है — ऐसा तीर्थंकर भगवान ने कहा है। इसके विपरीत जो भाव हैं, वे संसार भ्रमण का कारण हैं।',
    source: 'रत्नकरण्ड श्रावकाचार (श्लोक ३)',
    author: 'आचार्य समंतभद्र',
  },
  {
    verse: 'अप्पा चेव परं दव्वं, अप्पा मे सासयं पदं।\nअप्पा णाणमओ णिच्चं, अप्पा दंसणसंजुदो॥',
    meaning: 'मेरी आत्मा ही परम द्रव्य है, आत्मा ही शाश्वत पद है। आत्मा ज्ञानमय, नित्य और सम्यग्दर्शन से संयुक्त है।',
    source: 'नियमसार (गाथा १७६)',
    author: 'आचार्य कुन्दकुन्द देव',
  },
];

export const DailyQuoteCard = () => {
  const [copied, setCopied] = useState(false);

  // Deterministically select today's quote based on day-of-year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const quote = JAIN_QUOTES[dayOfYear % JAIN_QUOTES.length];

  const handleShare = async () => {
    const formattedDate = now.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const shareText = `🌸 *दैनिक जिनवाणी अमृत वचन* 🌸\n\n« *${quote.verse}* »\n\n📖 *भावार्थ:* ${quote.meaning}\n\n📜 *स्रोत:* ${quote.source}\n✍️ *रचनाकार:* ${quote.author}\n📅 *दिनांक:* ${formattedDate}\n\nजिनेन्द्र भगवान की अमृतवाणी, ४५०+ ग्रंथ व नित्य साधना हेतु पधारें:\nhttps://jainjinvani.pages.dev/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'दैनिक जिनवाणी अमृत वचन',
          text: shareText,
        });
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="w-full max-w-4xl mb-4 sm:mb-6"
    >
      <GlassCard
        variant="subtle"
        tilt={{ maxTilt: 6, scale: 1.01, glareColor: 'gold', glareMaxOpacity: 0.15 }}
        className="daily-quote-card relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-amber-500/35 dark:border-amber-400/25 shadow-md overflow-hidden bg-amber-50/40 dark:bg-[#0b1325]/85 backdrop-blur-xl"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-amber-900/15 dark:border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-500/25 border border-amber-500/40 flex items-center justify-center text-amber-900 dark:text-amber-300 shrink-0 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-amber-200 tracking-wide truncate">
              दैनिक जिनवाणी अमृत वचन
            </h3>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={handleShare}
            className="quote-share-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-gotu font-bold transition-all cursor-pointer shadow-sm hover:shadow-md shrink-0 select-none border border-emerald-600/70 dark:border-emerald-400/40 active:scale-95"
            title="WhatsApp या मित्रों के साथ साझा करें"
            aria-label="दैनिक जिनवाणी अमृत वचन साझा करें"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold">कॉपी हुआ!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-white" />
                <span className="text-white font-bold">साझा करें</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Shloka / Verse */}
        <div className="text-center my-3.5 px-2">
          <p className="quote-verse text-sm sm:text-base md:text-lg font-notoserif font-bold text-[#1C1917] dark:text-amber-50 leading-relaxed whitespace-pre-line tracking-wide drop-shadow-xs dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            « {quote.verse} »
          </p>
        </div>

        {/* Meaning / Bhavarth */}
        <p className="quote-meaning text-xs sm:text-sm font-gotu text-[#262320] dark:text-slate-100 leading-relaxed text-center px-1 mb-3.5 font-medium">
          {quote.meaning}
        </p>

        {/* Source & Author Attribution */}
        <div className="quote-attribution flex items-center justify-center gap-2 pt-2.5 border-t border-amber-900/15 dark:border-white/10 text-[11px] sm:text-xs font-gotu text-[#713F12] dark:text-amber-300 font-semibold tracking-wide">
          <BookOpen className="w-3.5 h-3.5 text-[#713F12] dark:text-amber-300 shrink-0" />
          <span>{quote.source} • {quote.author}</span>
        </div>
      </GlassCard>
    </motion.div>
  );
};
