import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Header from './components/Header';
import Map from './components/esrijs/Map';

import './App.css';

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

export default function App() {
  const onMapClick = React.useCallback((event) => {
    console.log('onMapClick', event);
  }, []);
  const [mapView, setMapView] = React.useState(null);

  return (
    <div className="app">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Header title="Utah Residential Broadband" />
        <Map
          onClick={onMapClick}
          setView={setMapView}
          zoomToGraphic={null}
          view={mapView}
          webMapId={process.env.REACT_APP_WEB_MAP_ID}
        />
      </ErrorBoundary>
    </div>
  );
}
