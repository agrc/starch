import './App.scss';
import { ErrorBoundary } from 'react-error-boundary';
import { Sherlock, LocatorSuggestProvider } from '@agrc/sherlock';
import * as React from 'react';
import AOIModal from './components/AOIModal';
import config from './config';
import Extent from '@arcgis/core/geometry/Extent';
import Graphic from '@arcgis/core/Graphic';
import Header from './components/Header';
import Map from './components/esrijs/Map';
import persistMapExtent from './components/esrijs/persistMapExtent';

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

export default function App() {
  console.log('App render');
  const onMapClick = React.useCallback((event) => {
    console.log('onMapClick', event);
  }, []);
  const [mapView, setMapView] = React.useState(null);
  const initialExtent = persistMapExtent(mapView);
  const [zoomToExtent, setZoomToExtent] = React.useState(null);

  return (
    <div className="app">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Header title="Utah Residential Broadband" />
        {initialExtent || zoomToExtent ? (
          <Map
            onClick={onMapClick}
            setView={setMapView}
            view={mapView}
            webMapId={process.env.REACT_APP_WEB_MAP_ID}
            initialExtent={initialExtent || zoomToExtent}
            zoomToExtent={zoomToExtent}
          >
            {mapView ? (
              <Sherlock
                provider={new LocatorSuggestProvider(config.urls.masquerade, 3857)}
                onSherlockMatch={(matches) => setZoomToExtent(new Extent(matches[0].attributes.extent))}
                modules={{ Graphic }}
                position="top-right"
                mapView={mapView}
              />
            ) : null}
          </Map>
        ) : (
          <AOIModal setExtent={setZoomToExtent} />
        )}
      </ErrorBoundary>
    </div>
  );
}
