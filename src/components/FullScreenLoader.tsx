import React, { JSX } from 'react';
import loaderGif from '../../src/img/loader.gif'; // Import the GIF

export default function LoadingIndicator(): JSX.Element {
  return (
    <div
      className="loading-indicator"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px', // Consistent dimensions for the container
        height: '100px',
      }}
    >
      <img src={loaderGif} alt="Loading..." style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}