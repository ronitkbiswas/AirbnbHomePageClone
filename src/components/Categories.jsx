import React, { useRef, useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data';

export default function Categories({ selectedCategory, onSelect }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(checkScroll, 500);
  };

  return (
    <div className="fixed top-[80px] w-full bg-white z-40 border-b-[1px] border-airbnb-border h-[80px] md:h-[98px] flex items-center shadow-sm md:shadow-none">
      <div className="w-full px-6 md:px-12 relative flex items-center gap-4">
        
        {/* Scrollable Area */}
        <div className="relative flex-1 overflow-hidden group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 hidden md:flex items-center">
              <button 
                onClick={() => scroll('left')}
                className="p-1.5 rounded-full border border-airbnb-border bg-white hover:shadow-airbnb transition hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={16} strokeWidth={3} />
              </button>
            </div>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 hidden md:flex items-center justify-end">
              <button 
                onClick={() => scroll('right')}
                className="p-1.5 rounded-full border border-airbnb-border bg-white hover:shadow-airbnb transition hover:scale-105 active:scale-95"
              >
                <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>
          )}

          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex flex-row items-center gap-8 overflow-x-auto no-scrollbar py-2"
          >
            {CATEGORIES.map((item) => {
              const Icon = Icons[item.icon];
              return (
                <div 
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`flex flex-col items-center justify-center gap-2 cursor-pointer min-w-fit transition-all duration-300 border-b-2 py-3 md:py-4
                    ${selectedCategory === item.id 
                      ? 'border-airbnb-dark text-airbnb-dark opacity-100 scale-105' 
                      : 'border-transparent text-airbnb-muted opacity-60 hover:opacity-100 hover:border-airbnb-border'}
                  `}
                >
                  <Icon size={24} strokeWidth={selectedCategory === item.id ? 2.5 : 2} />
                  <span className={`text-[12px] font-medium tracking-tight whitespace-nowrap ${selectedCategory === item.id ? 'font-bold' : ''}`}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters Button */}
        <button className="hidden md:flex items-center gap-2 border border-airbnb-border rounded-xl px-4 py-3 h-12 hover:border-airbnb-dark hover:bg-neutral-50 transition font-semibold text-xs min-w-fit">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}
