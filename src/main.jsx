import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import App from './app';
import { CONFIG } from './config-global';
import store from './store';
import queryClient from './lib/queryClient';
import './locales/i18n';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <BrowserRouter basename={CONFIG.site.basePath}>
              <Suspense>
                <App />
              </Suspense>
            </BrowserRouter>
          </HelmetProvider>

          {/* React Hot Toast */}
          <Toaster position="top-right" reverseOrder={false} gutter={8} />
        </QueryClientProvider>
      </Provider>
    </LocalizationProvider>
  </StrictMode>
);
