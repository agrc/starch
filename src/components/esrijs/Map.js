import React, { useRef, useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import { once } from '@arcgis/core/core/watchUtils';
import addMapPropsToGlobal from './addMapPropsToGlobal';
import propTypes from 'prop-types';
import './Map.css';

const Map = ({ onClick, setView, zoomToGraphic, view, webMapId }) => {
  const mapDiv = useRef(null);
  const displayedZoomGraphic = useRef(null);

  useEffect(() => {
    if (!mapDiv.current) {
      return;
    }
    console.log('map init');

    const map = new WebMap({ portalItem: { id: webMapId } });
    const mapView = new MapView({
      container: mapDiv.current,
      map,
      ui: {
        components: ['zoom'],
      },
    });

    if (window.Cypress) {
      addMapPropsToGlobal(mapView);
    }

    mapView.on('click', onClick);

    setView(mapView);
  }, [onClick, setView, webMapId]);

  useEffect(() => {
    if (!zoomToGraphic?.graphic) {
      return;
    }

    if (!Array.isArray(zoomToGraphic.graphic)) {
      zoomToGraphic.graphic = [zoomToGraphic.graphic];
    }

    let zoom;
    if (!zoomToGraphic.zoom) {
      if (zoomToGraphic.graphic.every((graphic) => graphic.geometry.type === 'point')) {
        zoom = {
          target: zoomToGraphic.graphic,
          zoom: view.map.basemap.baseLayers.items[0].tileInfo.lods.length - 5,
        };
      } else {
        zoom = {
          target: zoomToGraphic.graphic,
        };
      }
    }

    if (displayedZoomGraphic.current) {
      view.graphics.removeMany(displayedZoomGraphic.current);
    }

    displayedZoomGraphic.current = zoom.target;

    view.graphics.addMany(zoom.target);

    view.goTo(zoom).then(() => {
      if (!zoom.preserve) {
        once(view, 'extent', () => {
          view.graphics.removeAll();
        });
      }
    });
  }, [zoomToGraphic, view]);

  return <div ref={mapDiv}></div>;
};
Map.propTypes = {
  onClick: propTypes.func.isRequired,
  setView: propTypes.func.isRequired,
  zoomToGraphic: propTypes.object,
  view: propTypes.instanceOf(MapView),
  webMapId: propTypes.string,
};

export default Map;
