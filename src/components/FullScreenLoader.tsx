import React from 'react';
import LoadingIndicator from '@common/LoadingIndicator';

interface FullScreenLoaderProps {
  isLoading: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isLoading }) => {
  console.log('FullScreenLoader rendering, isLoading:', isLoading); // Debugging log
  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999 // Ensure it's on top of other content
      }}
    >
      <LoadingIndicator />
    </div>
  );
};

export default FullScreenLoader;