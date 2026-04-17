import React from 'react';
import { Globe, DollarSign } from 'lucide-react';

export default function Footer() {
  const links = [
    ['Support', 'Help Centre', 'AirCover', 'Anti-discrimination', 'Disability support', 'Cancellation options', 'Report neighbourhood concern'],
    ['Hosting', 'Airbnb your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum', 'Hosting responsibly', 'Join a free Hosting class'],
    ['Airbnb', 'Newsroom', 'New features', 'Careers', 'Investors', 'Gift cards', 'Airbnb.org emergency stays']
  ];

  return (
    <footer className="bg-neutral-100 border-t-[1px] pt-12">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b">
          {links.map((column, i) => (
            <div key={i} className="flex flex-col gap-4">
              <h3 className="font-semibold text-sm">{column[0]}</h3>
              <div className="flex flex-col gap-3">
                {column.slice(1).map((link, j) => (
                  <a key={j} href="#" className="text-sm font-light text-neutral-600 hover:underline">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span>© 2026 Airbnb, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline">Sitemap</a>
            <span>·</span>
            <a href="#" className="hover:underline">Company details</a>
          </div>
          
          <div className="flex items-center gap-6 font-semibold">
            <div className="flex items-center gap-2 hover:underline cursor-pointer">
              <Globe size={18} />
              <span>English (IN)</span>
            </div>
            <div className="flex items-center gap-2 hover:underline cursor-pointer">
              <span>₹ INR</span>
            </div>
            <div className="hidden lg:flex items-center gap-4">
               <a href="#" className="hover:opacity-80 transition"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-4" alt="Google Play" referrerPolicy="no-referrer" /></a>
               <a href="#" className="hover:opacity-80 transition"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-4" alt="App Store" referrerPolicy="no-referrer" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
