"use client";
import React, { memo } from 'react';

const Card = memo(function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass p-5 shadow-lg backdrop-blur-xs rounded-xl">
      {children}
    </div>
  );
});

export default Card;
