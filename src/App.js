import './App.scss';
import { ErrorBoundary } from 'react-error-boundary';
import { Sherlock, LocatorSuggestProvider } from '@agrc/sherlock';
import * as React from 'react';
import AOIModal from './components/AOIModal';
import config from './config';
import Extent from '@arcgis/core/geometry/Extent';
import Graphic from '@arcgis/core/Graphic';
import Map from './components/esrijs/Map';
import persistMapExtent from './components/esrijs/persistMapExtent';
import Sidebar from './components/Sidebar';
import { useImmerReducer } from 'use-immer';

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

const defaultFilter = {
  transType: {
    cable: true,
    dsl: true,
    fiber: true,
    fixed: true,
    mobile: false,
  },
  speed: {
    up: null,
    down: null,
  },
};

function filterReducer(draft, action) {
  switch (action.type) {
    case 'transType':
      if (action.meta === 'wireline') {
        draft.transType.cable = action.payload;
        draft.transType.dsl = action.payload;
        draft.transType.fiber = action.payload;
      } else {
        draft.transType[action.meta] = action.payload;
      }
      break;

    case 'speed':
      draft.speed[action.meta] = action.payload;
      break;

    case 'reset':
      return defaultFilter;

    default:
      throw Error(`unrecognized action type: ${action.type}`);
  }
}

const filterKey = 'broadband:filter';
const filterVersion = 1; // bump this any time the filter object shape changes
function getInitialFilter() {
  try {
    const localStorageItem = localStorage.getItem(filterKey);
    if (localStorageItem) {
      const storedFilter = JSON.parse(localStorageItem);

      return storedFilter?.version === filterVersion ? storedFilter : defaultFilter;
    }
  } catch (error) {
    console.error(error);

    return defaultFilter;
  }

  return defaultFilter;
}

export default function App() {
  console.log('App render');
  const onMapClick = React.useCallback((event) => {
    console.log('onMapClick', event);
  }, []);
  const [mapView, setMapView] = React.useState(null);
  const initialExtent = persistMapExtent(mapView);
  const [zoomToExtent, setZoomToExtent] = React.useState(null);
  const [filter, dispatchFilter] = useImmerReducer(filterReducer, getInitialFilter());

  React.useEffect(() => {
    localStorage.setItem(filterKey, JSON.stringify({ ...filter, version: filterVersion }));
  }, [filter]);

  return (
    <div className="app">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Sidebar filter={filter} dispatchFilter={dispatchFilter} />
        <div className="main-content">
          {initialExtent || zoomToExtent ? (
            <Map
              onClick={onMapClick}
              setView={setMapView}
              view={mapView}
              webMapId={process.env.REACT_APP_WEB_MAP_ID}
              initialExtent={initialExtent || zoomToExtent}
              zoomToExtent={zoomToExtent}
              filter={filter}
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
        </div>
      </ErrorBoundary>
    </div>
  );
}
