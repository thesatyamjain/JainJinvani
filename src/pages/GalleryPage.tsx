import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryPageProps {
  onBack: () => void;
}

const galleryCategories = [
  {
    id: 'tirthankars',
    name: 'तीर्थंकर',
    nameEn: 'Tirthankars',
    icon: '🙏',
    count: 24,
    images: [
      { id: 1, title: 'भगवान ऋषभदेव', location: 'पालिताना', placeholder: '🐂' },
      { id: 2, title: 'भगवान महावीर', location: 'कुंडलपुर', placeholder: '🦁' },
      { id: 3, title: 'भगवान पार्श्वनाथ', location: 'शिखरजी', placeholder: '🐍' },
      { id: 4, title: 'भगवान नेमिनाथ', location: 'गिरनार', placeholder: '🐚' }
    ]
  },
  {
    id: 'temples',
    name: 'मंदिर',
    nameEn: 'Temples',
    icon: '🏛️',
    count: 15,
    images: [
      { id: 1, title: 'दिलवाड़ा मंदिर', location: 'माउंट आबू', placeholder: '🏰' },
      { id: 2, title: 'रणकपुर मंदिर', location: 'राजस्थान', placeholder: '🕌' },
      { id: 3, title: 'पालिताना मंदिर', location: 'गुजरात', placeholder: '⛰️' },
      { id: 4, title: 'सोनागिरि', location: 'मध्य प्रदेश', placeholder: '🏔️' }
    ]
  },
  {
    id: 'tirthas',
    name: 'तीर्थ स्थल',
    nameEn: 'Pilgrimage Sites',
    icon: '⛰️',
    count: 12,
    images: [
      { id: 1, title: 'शिखरजी', location: 'झारखंड', placeholder: '⛰️' },
      { id: 2, title: 'पावापुरी', location: 'बिहार', placeholder: '🕉️' },
      { id: 3, title: 'कुंडलपुर', location: 'मध्य प्रदेश', placeholder: '🙏' },
      { id: 4, title: 'गिरनार', location: 'गुजरात', placeholder: '🗻' }
    ]
  },
  {
    id: 'art',
    name: 'कला',
    nameEn: 'Art & Symbols',
    icon: '🎨',
    count: 20,
    images: [
      { id: 1, title: 'स्वस्तिक', location: 'पवित्र चिन्ह', placeholder: '卍' },
      { id: 2, title: 'अष्टमंगल', location: '८ शुभ चिन्ह', placeholder: '🪷' },
      { id: 3, title: 'नवकार मंत्र', location: 'कैलीग्राफी', placeholder: 'ॐ' },
      { id: 4, title: 'सिद्धचक्र', location: 'यंत्र', placeholder: '☸️' }
    ]
  },
  {
    id: 'manuscripts',
    name: 'प्राचीन ग्रंथ',
    nameEn: 'Ancient Manuscripts',
    icon: '📜',
    count: 8,
    images: [
      { id: 1, title: 'कल्पसूत्र', location: 'पाण्डुलिपि', placeholder: '📖' },
      { id: 2, title: 'तत्वार्थ सूत्र', location: 'हस्तलिखित', placeholder: '📚' },
      { id: 3, title: 'भक्तामर स्तोत्र', location: 'पुराना संस्करण', placeholder: '📜' },
      { id: 4, title: 'आगम ग्रंथ', location: 'संरक्षित', placeholder: '📃' }
    ]
  },
  {
    id: 'events',
    name: 'पर्व और उत्सव',
    nameEn: 'Festivals & Events',
    icon: '🎊',
    count: 10,
    images: [
      { id: 1, title: 'महावीर जयंती', location: 'उत्सव', placeholder: '🎉' },
      { id: 2, title: 'पर्युषण पर्व', location: 'साधना', placeholder: '🙏' },
      { id: 3, title: 'दीपावली', location: 'मोक्ष दिवस', placeholder: '🪔' },
      { id: 4, title: 'ज्ञान पंचमी', location: 'शास्त्र पूजन', placeholder: '📚' }
    ]
  }
];

export const GalleryPage = ({ onBack }: GalleryPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (image: any, category: any, index: number) => {
    setSelectedImage(image);
    setSelectedCategory(category);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (selectedCategory && currentIndex < selectedCategory.images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedImage(selectedCategory.images[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedImage(selectedCategory.images[prevIndex]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 pb-32 px-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-gotu">वापस जाएं</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-200 text-xs mb-3">
            <ImageIcon className="w-3 h-3" />
            <span className="uppercase tracking-widest text-sm font-bold font-cinzel">Gallery</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-rozha text-white mb-3">
            चित्र दीर्घा
          </h1>
          <p className="text-blue-100/60 font-gotu text-lg">
            जैन धर्म की दृश्य यात्रा
          </p>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {galleryCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="p-6 hover:bg-white/10 cursor-pointer transition-all group">
              <div className="text-5xl mb-4 text-center">{category.icon}</div>
              <h3 className="text-xl font-rozha text-white mb-1 text-center group-hover:text-amber-300 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-blue-100/60 font-gotu text-center mb-4">{category.nameEn}</p>
              
              {/* Image Grid Preview */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {category.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => handleImageClick(img, category, i)}
                    className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center text-3xl border border-white/10"
                  >
                    {img.placeholder}
                  </div>
                ))}
              </div>

              <div className="text-center text-xs text-blue-100/50 font-gotu">
                {category.count} चित्र
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for Future Integration */}
      <GlassCard className="p-8 text-center">
        <ImageIcon className="w-16 h-16 text-blue-200/30 mx-auto mb-4" />
        <h3 className="text-xl font-rozha text-white mb-2">
          जल्द आ रहा है
        </h3>
        <p className="text-blue-100/60 font-gotu">
          हम जल्द ही सैकड़ों उच्च गुणवत्ता वाली तस्वीरें जोड़ेंगे
        </p>
      </GlassCard>

      {/* Image Viewer Modal */}
      {selectedImage && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {currentIndex < selectedCategory.images.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl"
          >
            <div className="aspect-video rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mb-4 text-8xl">
              {selectedImage.placeholder}
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-rozha text-white mb-1">
                {selectedImage.title}
              </h3>
              <p className="text-blue-100/60 font-gotu">
                {selectedImage.location}
              </p>
              <p className="text-sm text-blue-100/40 font-gotu mt-2">
                {currentIndex + 1} / {selectedCategory.images.length}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
