import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CronogramaProvider } from './context/CronogramaContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CronogramaProvider> {  }
      <App />
    </CronogramaProvider>
  </React.StrictMode>
);

reportWebVitals();
