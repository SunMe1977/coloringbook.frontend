import { JSX } from 'react/jsx-runtime';

export default function LoadingIndicator(): JSX.Element {
  return (
    <div
      className="loading-indicator"
      style={{ display: 'block', textAlign: 'center', marginTop: '30px' }}
    >
      Loading ...
      <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <g>

    <circle cx="50" cy="50" r="20" stroke="#555" stroke-width="10" fill="none" />
    <g transform="rotate(0 50 50)">
      <animateTransform 
        attributeName="transform" 
        type="rotate" 
        from="0 50 50" 
        to="360 50 50" 
        dur="2s" 
        repeatCount="indefinite" />
      <circle cx="50" cy="20" r="5" fill="#555" />
      <circle cx="80" cy="50" r="5" fill="#555" />
      <circle cx="50" cy="80" r="5" fill="#555" />
      <circle cx="20" cy="50" r="5" fill="#555" />
    </g>
    <g>
      <polygon points="70,30 72,35 70,40 68,35" fill="#777">
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0 70 35" 
          to="360 70 35" 
          dur="4s" 
          repeatCount="indefinite" />
      </polygon>
      <polygon points="75,25 77,30 75,35 73,30" fill="#999">
        <animateTransform 
          attributeName="transform" 
          type="rotate" 
          from="0 75 30" 
          to="360 75 30" 
          dur="4s" 
          repeatCount="indefinite" />
      </polygon>
    </g>
  </g>
</svg>

    </div>
  );
}