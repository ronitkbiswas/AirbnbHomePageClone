import React, { useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ListingCard({ listing }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const [isBooked, setIsBooked] = useState(false);

  const handleReserve = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setShowBooking(false);
    }, 2000);
  };

  return (
    <>
      <div 
        onClick={() => setShowBooking(true)}
        className="col-span-1 cursor-pointer group"
      >
        <div className="flex flex-col gap-3 w-full">
          <div className="aspect-[20/19] relative overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentImage}
                src={listing.images[currentImage]} 
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="object-cover h-full w-full transition duration-500"
                alt={listing.title}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {/* Overlay Buttons */}
            <div className="absolute top-3 right-3 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                className="relative hover:scale-110 transition active:scale-90 p-1"
              >
                <Heart 
                  size={24} 
                  strokeWidth={2.5}
                  className={`${isLiked ? 'fill-airbnb-red text-airbnb-red' : 'fill-black/30 text-white'}`} 
                />
              </button>
            </div>

            {listing.images.length > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <button 
                  onClick={prevImage}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow-airbnb text-airbnb-dark pointer-events-auto hover:scale-105 transition active:scale-95"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                </button>
                <button 
                  onClick={nextImage}
                  className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow-airbnb text-airbnb-dark pointer-events-auto hover:scale-105 transition active:scale-95"
                >
                  <ChevronRight size={16} strokeWidth={3} />
                </button>
              </div>
            )}

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
               {listing.images.map((_, i) => (
                 <div 
                   key={i} 
                   className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${currentImage === i ? 'bg-white scale-110' : 'bg-white/60'}`} 
                 />
               ))}
            </div>
          </div>

          <div className="flex flex-col gap-0.5 mt-0.5">
            <div className="flex justify-between items-start text-[15px]">
              <div className="font-semibold text-airbnb-dark truncate pr-4">{listing.title}</div>
              <div className="flex items-center gap-1 font-normal min-w-fit">
                <Star size={14} className="fill-airbnb-dark text-airbnb-dark" />
                <span>{listing.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="text-airbnb-muted font-normal text-[15px] leading-tight flex flex-col">
              <span className="truncate">{listing.description}</span>
              <span>{listing.date}</span>
            </div>

            <div className="flex flex-row items-center gap-1 mt-1.5">
              <span className="font-semibold text-[15px]">₹{listing.price.toLocaleString('en-IN')}</span>
              <span className="font-normal text-[15px]">night</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal Logic */}
      <AnimatePresence>
        {showBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBooking(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              {isBooked ? (
                <div className="p-12 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Star size={40} className="fill-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Reservation Confirmed!</h3>
                    <p className="text-neutral-500">You're all set for your stay at {listing.title}.</p>
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setShowBooking(false)}
                    className="absolute top-4 left-4 p-2 hover:bg-neutral-100 rounded-full transition z-10"
                  >
                    <X size={20} />
                  </button>

                  <div className="p-6 pt-16">
                    <div className="flex flex-col gap-4">
                      <h2 className="text-2xl font-bold leading-tight tracking-tight">Book {listing.title}</h2>
                      <div className="aspect-video rounded-xl overflow-hidden mb-2 shadow-inner bg-neutral-100">
                        <img src={listing.images[0]} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="flex justify-between items-center border-b pb-5">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold">₹{listing.price.toLocaleString('en-IN')} <span className="text-neutral-500 text-base font-normal">night</span></span>
                          <span className="text-xs text-neutral-500 underline decoration-neutral-300">Total includes all taxes and fees</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-50 rounded-lg border border-neutral-100">
                          <Star size={14} className="fill-airbnb-dark text-airbnb-dark" />
                          <span className="font-semibold text-sm">{listing.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 border border-neutral-300 rounded-xl overflow-hidden mt-2">
                        <div className="p-3 border-r border-b border-neutral-300">
                          <div className="text-[10px] uppercase font-bold text-airbnb-dark">Check-in</div>
                          <div className="text-sm font-light">Oct 22, 2026</div>
                        </div>
                        <div className="p-3 border-b border-neutral-300">
                          <div className="text-[10px] uppercase font-bold text-airbnb-dark">Checkout</div>
                          <div className="text-sm font-light">Oct 27, 2026</div>
                        </div>
                        <div className="p-3 col-span-2 hover:bg-neutral-50 transition cursor-pointer">
                          <div className="text-[10px] uppercase font-bold text-airbnb-dark">Guests</div>
                          <div className="text-sm font-light">1 guest</div>
                        </div>
                      </div>

                      <button 
                        onClick={handleReserve}
                        className="w-full btn-airbnb text-lg py-3.5 mt-4 shadow-lg shadow-airbnb-red/20"
                      >
                        Reserve
                      </button>

                      <div className="text-center text-sm text-neutral-500 font-light mt-1">
                        You won't be charged yet
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
