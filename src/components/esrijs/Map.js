import './Map.scss';
import addMapPropsToGlobal from './addMapPropsToGlobal';
import propTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';

const Map = ({ onClick, setView, view, webMapId, children, zoomToExtent, initialExtent }) => {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (!mapDiv.current || view) {
      return;
    }
    console.log('map init');

    const map = new WebMap({ portalItem: { id: webMapId } });
    const mapView = new MapView({
      extent: initialExtent,
      container: mapDiv.current,
      map,
      ui: {
        components: ['zoom'],
      },
      constraints: {
        snapToZoom: true,
      },
    });

    if (window.Cypress) {
      addMapPropsToGlobal(mapView);
    }

    mapView.on('click', onClick);

    setView(mapView);
  }, [initialExtent, onClick, setView, view, webMapId]);

  useEffect(() => {
    if (!zoomToExtent || !view) return;

    view.goTo(zoomToExtent);
  }, [zoomToExtent, view]);

  return (
    <div className="map-container" ref={mapDiv}>
      {children}
    </div>
  );
};
Map.propTypes = {
  onClick: propTypes.func.isRequired,
  setView: propTypes.func.isRequired,
  view: propTypes.instanceOf(MapView),
  webMapId: propTypes.string,
  zoomToExtent: propTypes.object,
  initialExtent: propTypes.object,
};

export default Map;
