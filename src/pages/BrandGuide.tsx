import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ChevronLeft, Copy, Check } from 'lucide-react';

interface BrandGuideProps {
  onBack: () => void;
}

export const BrandGuide = ({ onBack }: BrandGuideProps) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const colors = [
    { name: 'Cosmic Void', value: '#050a14', class: 'bg-[#050a14]' },
    { name: 'Nebula Blue', value: '#1e3a8a', class: 'bg-blue-900' },
    { name: 'Divine Amber', value: '#f59e0b', class: 'bg-amber-500' },
    { name: 'Starlight White', value: '#ffffff', class: 'bg-white' },
    { name: 'Glass Border', value: 'rgba(255,255,255,0.1)', class: 'bg-white/10' },
  ];

  const fonts = [
    { name: 'Rozha One', type: 'Display / Headings', sample: 'जैन जिनवाणी', class: 'font-rozha' },
    { name: 'Gotu', type: 'UI / Body', sample: 'नमस्ते संसार', class: 'font-gotu' },
    { name: 'Tiro Devanagari Hindi', type: 'Long Reading', sample: 'अहिंसा परमो धर्मः', class: 'font-tiro' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto pt-10 page-bottom-clearance px-6 flex flex-col h-full text-slate-200">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-4xl font-rozha text-white">Brand Guidelines</h1>
          <p className="text-blue-100/60 text-sm font-gotu">Design System & Visual Identity</p>
        </div>
      </motion.div>

      <div className="space-y-12 overflow-y-auto pb-20 custom-scrollbar pr-2">

        {/* Color Palette */}
        <section>
          <h2 className="text-2xl font-rozha text-amber-200 mb-6 border-b border-white/10 pb-2">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colors.map((color) => (
              <GlassCard
                key={color.name}
                tilt={{ maxTilt: 8, glareMaxOpacity: 0.15, glareColor: 'white' }}
                className="p-4 flex flex-col gap-3 group"
              >
                <div className={`h-24 rounded-lg shadow-inner ${color.class} border border-white/5 relative`}>
                  <button
                    onClick={() => copyToClipboard(color.value)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                  >
                    {copied === color.value ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6 text-white" />}
                  </button>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{color.name}</div>
                  <div className="text-xs text-white/50 font-mono">{color.value}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-rozha text-amber-200 mb-6 border-b border-white/10 pb-2">Typography</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {fonts.map((font) => (
              <GlassCard
                key={font.name}
                tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'gold' }}
                className="p-6"
              >
                <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-2">{font.type}</div>
                <div className="text-3xl text-white mb-4 leading-tight">
                  <span className={font.class}>{font.name}</span>
                </div>
                <div className={`text-xl text-blue-100/80 border-t border-white/10 pt-4 ${font.class}`}>
                  {font.sample}
                </div>
                <div className="mt-2 text-xs text-white/30 font-mono">font-family: '{font.name}'</div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* UI Components */}
        <section>
          <h2 className="text-2xl font-rozha text-amber-200 mb-6 border-b border-white/10 pb-2">UI Components</h2>
          <div className="grid md:grid-cols-2 gap-8">

            {/* Cards */}
            <div className="space-y-4">
              <h3 className="text-white font-bold mb-2">Glass Cards</h3>
              <GlassCard
                tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'subtle' }}
                className="p-6"
              >
                <h4 className="text-xl text-white font-rozha mb-2">Standard Glass Card</h4>
                <p className="text-blue-100/70 text-sm">
                  Used for main content containers. Features a backdrop blur, subtle white border, and a gradient background.
                </p>
              </GlassCard>
              <GlassCard
                tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'amber' }}
                className="p-6 bg-amber-500/10 border-amber-500/30"
              >
                <h4 className="text-xl text-white font-rozha mb-2">Highlight Card</h4>
                <p className="text-blue-100/70 text-sm">
                  Used for featured content or active states. Uses amber tints.
                </p>
              </GlassCard>
            </div>

            {/* Buttons & Interactive */}
            <div className="space-y-6">
              <h3 className="text-white font-bold mb-2">Interactive Elements</h3>

              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-gotu border border-white/10 transition-all">
                  Secondary Button
                </button>
                <button className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-gotu shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
                  Primary Action
                </button>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                  <Copy className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <Check className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Iconography */}
        <section>
          <h2 className="text-2xl font-rozha text-amber-200 mb-6 border-b border-white/10 pb-2">Iconography & Vibes</h2>
          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            className="p-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 relative">
                {/* Abstract representation of the cosmic/jain theme */}
                <div className="absolute inset-0 border-2 border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 border-2 border-amber-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-blue-100/80 leading-relaxed font-gotu">
                  The visual identity combines <strong>ancient spirituality</strong> with <strong>cosmic vastness</strong>.
                  We use thin, elegant strokes for icons (Lucide React) and avoid heavy fills unless emphasizing a primary action.
                  The "Frosted Glass" aesthetic represents the ethereal nature of the soul (Atma) - transparent yet distinct.
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

      </div>
    </div>
  );
};
