import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@arcgis/core/assets/esri/themes/light/main.css';
import { applyPolyfills, defineCustomElements } from '@esri/calcite-components/dist/loader';
import '@esri/calcite-components/dist/calcite/calcite.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
applyPolyfills().then(() => defineCustomElements());
