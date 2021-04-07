import './Map.scss';
import addMapPropsToGlobal from './addMapPropsToGlobal';
import propTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Legend from '@arcgis/core/widgets/Legend';
import config from '../../config';

export function getQueryFromFilter(filter) {
  const transTypeValues = Object.keys(filter.transType).reduce((previous, key) => {
    if (filter.transType[key] && config.transTechValues[key]) {
      return previous.concat(config.transTechValues[key]);
    }
    return previous;
  }, []);

  return `${config.fieldNames.TransTech} IN (${transTypeValues.join(',')})`;
}

const Map = ({ onClick, setView, view, webMapId, children, zoomToExtent, initialExtent, filter }) => {
  const mapDiv = useRef(null);

  // these are layer views
  const wirelineLayers = useRef([]);
  const fixedLayers = useRef([]);
  const mobileLayers = useRef([]);

  const syncMapWithFilter = React.useCallback(() => {
    const syncVisibility = (visible) => {
      return (layer) => (layer.visible = visible);
    };
    fixedLayers.current.forEach(syncVisibility(filter.transType.fixed));
    mobileLayers.current.forEach(syncVisibility(filter.transType.mobile));
    wirelineLayers.current.forEach(
      syncVisibility(filter.transType.cable || filter.transType.dsl || filter.transType.fiber)
    );

    // for each visible layer, apply def query
    const visibleLayers = fixedLayers.current
      .concat(mobileLayers.current, wirelineLayers.current)
      .filter((layer) => layer.visible);

    const query = getQueryFromFilter(filter);
    console.log('new query: ', query);

    visibleLayers.forEach((layer) => (layer.filter = { where: query }));
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

    function getLayerViews(regex) {
      const layers = map.layers.filter((layer) => layer.title.toLowerCase().match(regex));

      return Promise.all(layers.map((layer) => mapView.whenLayerView(layer)));
    }
    map.when(async () => {
      wirelineLayers.current = await getLayerViews(/wireline/);
      fixedLayers.current = await getLayerViews(/fixed/);
      mobileLayers.current = await getLayerViews(/mobile/);

      syncMapWithFilter();
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
  }, [initialExtent, onClick, setView, syncMapWithFilter, view, webMapId]);

  useEffect(() => {
    if (!zoomToExtent || !view) return;

    view.goTo(zoomToExtent);
  }, [zoomToExtent, view]);

  React.useEffect(() => {
    syncMapWithFilter();
  }, [filter, syncMapWithFilter]);

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
