import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import getModules from './esriModules';
import config from './config';
import { LayerSelectorContainer, LayerSelector } from 'layer-selector';


function App() {
  const mapDivRef = useRef();

  useEffect(() => {
    const initMap = async () => {
      console.log('initMap');
      const { Map, MapView, VectorTileLayer } = await getModules();

      const map = new Map();
      const view = new MapView({
        container: mapDivRef.current,
        map
      });

      const selectorNode = document.createElement('div');

      view.ui.add(selectorNode, 'top-right');

      const layerSelectorOptions = {
        view: view,
        quadWord: process.env.REACT_APP_DISCOVER,
        baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo'],
        modules: await getModules()
      };

      ReactDOM.render(
        <LayerSelectorContainer>
          <LayerSelector {...layerSelectorOptions}></LayerSelector>
        </LayerSelectorContainer>,
        selectorNode);

      const layer = new VectorTileLayer({
        url: config.urls.providerCoverage
      });

      map.add(layer);
    };

    initMap();
  }, [mapDivRef]);

  return (
    <div className="app">
      <div ref={mapDivRef}></div>
    </div>
  );
}

export default App;
