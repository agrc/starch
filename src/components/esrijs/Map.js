import './Map.scss';
import addMapPropsToGlobal from './addMapPropsToGlobal';
import propTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Legend from '@arcgis/core/widgets/Legend';

const Map = ({ onClick, setView, view, webMapId, children, zoomToExtent, initialExtent, filter }) => {
  const mapDiv = useRef(null);
  const wirelineLayers = useRef([]);
  const fixedLayers = useRef([]);
  const mobileLayers = useRef([]);

  const syncFilter = React.useCallback(() => {
    const sync = (type) => {
      return (layer) => (layer.visible = filter.transType[type]);
    };
    wirelineLayers.current.forEach(sync('wireline'));
    fixedLayers.current.forEach(sync('fixed'));
    mobileLayers.current.forEach(sync('mobile'));
  }, [filter]);

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

    map.when(() => {
      wirelineLayers.current = map.layers.filter((layer) => layer.title.toLowerCase().match(/wireline/));
      fixedLayers.current = map.layers.filter((layer) => layer.title.toLowerCase().match(/fixed/));
      mobileLayers.current = map.layers.filter((layer) => layer.title.toLowerCase().match(/mobile/));

      syncFilter();
      mapView.when(() => {
        const legend = new Legend({
          view: mapView,
        });

        mapView.ui.add(legend, 'bottom-right');
      });
    });

    if (window.Cypress) {
      addMapPropsToGlobal(mapView);
    }

    mapView.on('click', onClick);

    setView(mapView);
  }, [initialExtent, onClick, setView, syncFilter, view, webMapId]);

  useEffect(() => {
    if (!zoomToExtent || !view) return;

    view.goTo(zoomToExtent);
  }, [zoomToExtent, view]);

  React.useEffect(() => {
    syncFilter();
  }, [filter, syncFilter]);

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
  filter: propTypes.object.isRequired,
};

export default Map;
