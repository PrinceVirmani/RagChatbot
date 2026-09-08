import React from 'react'

const AuthDecorations = () => {
  return (
    <>
        {/* Horizontal Gray Lines (Top & Bottom) - Desktop only */}
        <div className="hidden sm:block fixed top-[60px] left-0 right-0 h-[1px] bg-gray-200 z-0" />
        <div className="hidden sm:block fixed bottom-[80px] left-0 right-0 h-[1px] bg-gray-200 z-0" />

        {/* Vertical Green Gradients (Left & Right) */}
        <div className="hidden md:block fixed left-[calc(50%-225px-96px)] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#1DAF61] to-transparent opacity-50 z-0" />
        <div className="hidden md:block fixed right-[calc(50%-225px-96px)] top-0 bottom-0 w-[1px] bg-gradient-to-t from-[#1DAF61] to-transparent opacity-50 z-0" />

        {/* Intersection Dots */}
        {/* Top-Left */}
        <div className="hidden md:block fixed top-[60px] left-[calc(50%-225px-96px)] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white z-10" />
        {/* Top-Right */}
        <div className="hidden md:block fixed top-[60px] right-[calc(50%-225px-96px)] w-2 h-2 translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white z-10" />
        {/* Bottom-Left */}
        <div className="hidden md:block fixed bottom-[80px] left-[calc(50%-225px-96px)] w-2 h-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-gray-200 bg-white z-10" />
        {/* Bottom-Right */}
        <div className="hidden md:block fixed bottom-[80px] right-[calc(50%-225px-96px)] w-2 h-2 translate-x-1/2 translate-y-1/2 rounded-full border border-gray-200 bg-white z-10" />
    </>
  )
}

export default AuthDecorations
