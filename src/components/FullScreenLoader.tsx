"use client";

import React from 'react';
import loaderGif from '../img/loader.gif';

interface FullScreenLoaderProps {
  isLoading: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <img 
        src={loaderGif} 
        alt="Loading..." 
        style={{ 
          width: '100px', // Set a fixed size for the GIF
          height: '100px',
          objectFit: 'contain', // Ensure the GIF scales properly within its bounds
        }} 
      />
    </div>
  );
};

export default FullScreenLoader;