import React from 'react';

export default function LoadingIndicator(): JSX.Element {
  return (
    <div
      className="loading-indicator"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#2098f3"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="25; 20; 25; 30; 25"
            keyTimes="0; 0.25; 0.5; 0.75; 1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}