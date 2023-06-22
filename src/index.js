import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <div className="sticky-footer">
    Powered by <a href="https://bountyloop.glide.page/" className="sticky-link" target="_blank" rel="noopener noreferrer">BountyLoop</a>
    </div>
  </React.StrictMode>
);


