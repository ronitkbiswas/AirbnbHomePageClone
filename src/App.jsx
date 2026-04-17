/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import Categories from './components/Categories';
import ListingCard from './components/ListingCard';
import Footer from './components/Footer';
import { LISTINGS, CATEGORIES } from './data';
import { Map as MapIcon, Menu, Loader2, Search, Heart, UserCircle } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('amazing-pools');
  const [searchParams, setSearchParams] = useState({
    location: '',
    guests: 0,
    guestCounts: { adults: 0, children: 0, infants: 0 },
    checkIn: null,
    checkOut: null
  });
  
  // Infinite Scroll States
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollSentinelRef = useRef(null);

  const filteredListings = useMemo(() => {
    return LISTINGS.filter(listing => {
      const matchCategory = listing.category === selectedCategory;
      const matchLocation = searchParams.location 
        ? listing.title.toLowerCase().includes(searchParams.location.toLowerCase()) 
        : true;
      return matchCategory && matchLocation;
    });
  }, [selectedCategory, searchParams]);

  // Handle category change reset
  useEffect(() => {
    setVisibleCount(15);
  }, [selectedCategory, searchParams]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoadingMore && visibleCount < filteredListings.length) {
        setIsLoadingMore(true);
        // Simulate a slight delay for realism
        setTimeout(() => {
          setVisibleCount(prev => prev + 5);
          setIsLoadingMore(false);
        }, 1000);
      }
    }, { threshold: 1.0 });

    if (scrollSentinelRef.current) {
      observer.observe(scrollSentinelRef.current);
    }

    return () => {
      if (scrollSentinelRef.current) observer.unobserve(scrollSentinelRef.current);
    };
  }, [isLoadingMore, visibleCount, filteredListings.length]);

  const displayedListings = useMemo(() => {
    return filteredListings.slice(0, visibleCount);
  }, [filteredListings, visibleCount]);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] relative selection:bg-airbnb-red/10 selection:text-airbnb-red">
      {/* Hardcore Background Elements */}
      <div className="fixed inset-0 noise-overlay -z-10" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 pointer-events-none -z-10" />
      
      <Header onSearch={handleSearch} />
      
      <main className="pt-[80px]">
        <Categories 
          selectedCategory={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        <div className="pt-24 md:pt-28 pb-32 px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-x-6 gap-y-10">
            {displayedListings.length > 0 ? (
              displayedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <div className="col-span-full h-[50vh] flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-semibold mb-2">No listings found for this category</div>
                <div className="text-neutral-500">Try selecting another category or check back later.</div>
              </div>
            )}
          </div>

          {/* Infinite Scroll Sentinel */}
          <div ref={scrollSentinelRef} className="h-20 w-full flex items-center justify-center mt-8">
            {isLoadingMore && (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-airbnb-red" size={32} />
                <span className="text-sm font-medium text-neutral-500">
                  Loading more {CATEGORIES.find(c => c.id === selectedCategory)?.name.toLowerCase() || 'places'}...
                </span>
              </div>
            )}
            {!isLoadingMore && visibleCount < filteredListings.length && (
              <div className="h-10" /> 
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating Map Button */}
      <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-40">
        <button className="bg-airbnb-dark text-white flex items-center gap-2 py-3.5 px-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-semibold text-sm group">
          <span>Show map</span>
          <MapIcon size={18} className="group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Mobile Bottom Navigation Placeholder */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-[1px] border-neutral-100 px-8 pt-3 pb-6 z-50 flex justify-between items-center bg-white/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col items-center gap-1 text-airbnb-red group cursor-pointer">
          <Search size={24} />
          <span className="text-[10px] font-bold">Explore</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-600 transition cursor-pointer">
          <Heart size={24} />
          <span className="text-[10px] font-medium">Wishlists</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-600 transition cursor-pointer">
          <UserCircle size={24} />
          <span className="text-[10px] font-medium">Log in</span>
        </div>
      </div>
    </div>
  );
}

