import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'nprogress/nprogress.css';
import App from 'src/App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';
import store from './store';
import { I18nextProvider } from 'react-i18next';
import i18n from './Intel/i18n';
import GlobalErrorBoundary from './components/GLobalError/GLobalError';

ReactDOM.render(
  <Provider store={store}>
    {/* Wrap your entire app with GlobalErrorBoundary */}
    
    <GlobalErrorBoundary>
      <HelmetProvider>
        <SidebarProvider>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </BrowserRouter>
        </SidebarProvider>
      </HelmetProvider>
    </GlobalErrorBoundary>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
