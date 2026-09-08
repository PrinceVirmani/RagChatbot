import React from 'react'

const Footer = () => {
  return (
    <>
      {/* Mobile Footer - sticky at bottom with white bg and top border */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#EBEBEB] py-4 z-10">
        <p className="text-xs text-[#A3A3A3] text-center whitespace-nowrap">
          All rights reserved © 2025 EMB Global
        </p>
      </div>

      {/* Desktop Footer - floating */}
      <div className="hidden sm:block fixed bottom-8 left-1/2 -translate-x-1/2 text-xs text-[#A3A3A3] whitespace-nowrap">
        All rights reserved © 2025 EMB Global
      </div>
    </>
  )
}

export default Footer
