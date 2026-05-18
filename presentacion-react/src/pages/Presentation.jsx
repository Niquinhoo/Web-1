import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TitleSlide from '../slides/TitleSlide';
import STP1Slide from '../slides/STP1Slide';
import STP2Slide from '../slides/STP2Slide';
import STP3Slide from '../slides/STP3Slide';
import EvolutionSlide from '../slides/EvolutionSlide';
import CodeEvolutionSlide from '../slides/CodeEvolutionSlide';

const slides = [
  TitleSlide,
  STP1Slide,
  STP2Slide,
  STP3Slide,
  EvolutionSlide,
  CodeEvolutionSlide
];

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="w-screen h-screen relative bg-background text-textMain overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/[0.04] blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full bg-secondary/[0.04] blur-[120px]"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full h-full flex flex-col justify-center p-8 md:p-12 lg:p-16 max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          <CurrentSlideComponent key={currentSlide} />
        </AnimatePresence>
      </main>

      {/* Controls */}
      <div className="absolute bottom-6 right-8 z-50 flex items-center gap-4">
        <span className="text-textMuted text-sm font-mono mr-4">
          {currentSlide + 1} / {slides.length}
        </span>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 rounded-full bg-white hover:bg-gray-100 border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3 rounded-full bg-white hover:bg-gray-100 border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
