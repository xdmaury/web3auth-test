import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Web3AuthProvider } from './components/features/Web3authProvider';
import { BrowserRouter } from 'react-router-dom';
import Base from './routes/base';

const root = ReactDOM.createRoot(document.getElementById('app-root')!);

root.render(
  <React.StrictMode>
    <Web3AuthProvider>
      <BrowserRouter>
        <Base />
      </BrowserRouter>
    </Web3AuthProvider>
  </React.StrictMode>
);


