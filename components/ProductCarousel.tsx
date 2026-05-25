'use client'

import { useState } from 'react'

export default function ProductCarousel({ images = [], altText = 'Artwork Image' }: { images: string[], altText?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-gray-100 overflow-hidden shadow-2xl flex items-center justify-center font-black uppercase text-xs tracking-widest text-gray-400">
        Image Unavailable
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image Viewer */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden shadow-2xl group">
        <img
          key={currentIndex} // forces fade animation on change if desired via CSS
          src={images[currentIndex]}
          alt={altText}
          className="w-full h-full object-cover animate-fade-in"
        />

        {images.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-black hover:text-white flex items-center justify-center text-black font-black shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              ←
            </button>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-black hover:text-white flex items-center justify-center text-black font-black shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation Strip */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 aspect-square flex-shrink-0 border-4 transition-all duration-300 shadow-sm ${
                currentIndex === idx 
                  ? 'border-black opacity-100 scale-105' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Mockup ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
