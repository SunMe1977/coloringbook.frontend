import { JSX } from 'react/jsx-runtime';

export default function LoadingIndicator(): JSX.Element {
  return (
    <div
      className="loading-indicator"
      style={{ display: 'block', textAlign: 'center', marginTop: '30px' }}
    >
      Loading ...
    </div>
  );
}