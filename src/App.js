import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import getModules from './esriModules';
import config from './config';
import { LayerSelectorContainer, LayerSelector } from '@agrc/layer-selector';
import Form from 'react-bootstrap/Form';


function App() {
  const mapDivRef = useRef();
  const [ filter, setFilter ] = useState({
    wireline: true,
    fixed: true,
    mobile: true
  });

  useEffect(() => {
    const initMap = async () => {
      console.log('initMap');
      const { Map, MapView, VectorTileLayer } = await getModules();

      const map = new Map();
      const view = new MapView({
        container: mapDivRef.current,
        map,
        zoom: 10,
        center: [-112, 40]
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

  useEffect(() => {
    console.log('filter useEffect');
  }, [filter]);

  const onChange = event => {
    const target = event.currentTarget;
    setFilter(previousFilter => {
      return {
        ...previousFilter,
        [target.id]: !previousFilter[target.id]
      }
    });
  };

  return (
    <div className="app">
      <Form>
        <Form.Check type="checkbox" label="Wireline" id="wireline" checked={filter.wireline} onChange={onChange} />
        <Form.Check type="checkbox" label="Fixed Wireless" id="fixed" checked={filter.fixed} onChange={onChange} />
        <Form.Check type="checkbox" label="Mobile Wireless" id="mobile" checked={filter.mobile} onChange={onChange} />
      </Form>
      <div ref={mapDivRef}></div>
    </div>
  );
}

export default App;
