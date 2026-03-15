"use client";

import React from "react";

export const Piggy404SVG = ({ className = "w-full max-w-sm mx-auto" }: { className?: string }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="w-full relative flex items-center justify-center p-4">
        <img 
          src="/piggy-404.svg" 
          alt="Alcancía 404" 
          className="w-full h-auto object-contain"
          draggable="false"
        />
      </div>
    </div>
  );
};
