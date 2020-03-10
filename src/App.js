import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import getModules from './esriModules';
import config from './config';
import { LayerSelectorContainer, LayerSelector } from '@agrc/layer-selector';
import Form from 'react-bootstrap/Form';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import lodash from 'lodash';
import loaderSvg from './Eclipse-1s-50px.svg';


function App() {
  const mapDivRef = useRef();
  const [ filter, setFilter ] = useState({
    wireline: true,
    fixed: true,
    mobile: true
  });
  const providerLayers = useRef();
  const [ up, setUp ] = useState(1);
  const [ down, setDown ] = useState(1);
  const [ isLoading, setIsLoading ] = useState(false);
  const loaderNode = useRef();
  const view = useRef();

  useEffect(() => {
    if (!view.current) {
      return;
    }

    if (isLoading) {
      view.current.ui.add(loaderNode.current, 'bottom-left');
    } else {
      view.current.ui.remove(loaderNode.current);
    }
  }, [isLoading]);

  useEffect(() => {
    const initMap = async () => {
      console.log('initMap');
      const { Map, MapView, FeatureLayer, watchUtils } = await getModules();

      const map = new Map();
      view.current = new MapView({
        container: mapDivRef.current,
        map,
        zoom: 10,
        center: [-112, 40]
      });

      watchUtils.watch(view.current, 'updating', () => {
        setIsLoading(view.current.updating);
      });
      const selectorNode = document.createElement('div');
      view.current.ui.add(selectorNode, 'top-right');

      loaderNode.current = document.createElement('img');
      loaderNode.current.src = loaderSvg;
      loaderNode.current.className = 'loader';

      const layerSelectorOptions = {
        view: view.current,
        quadWord: process.env.REACT_APP_DISCOVER,
        baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo'],
        modules: await getModules()
      };

      ReactDOM.render(
        <LayerSelectorContainer>
          <LayerSelector {...layerSelectorOptions}></LayerSelector>
        </LayerSelectorContainer>,
        selectorNode);

      providerLayers.current = lodash.range(9).reverse().map(index => {
        const layer = new FeatureLayer({
          url: `${config.urls.providerCoverage}/${index}`,
          opacity: 0.5,
          definitionExpression: config.defaultDefinitionExpression
        });
        map.add(layer);
        // layer.on('click', event => console.log('event', event));

        return layer;
      });
    };

    initMap();
  }, [mapDivRef]);

  useEffect(() => {
    console.log('filter useEffect');

    if (providerLayers.current) {
      const upSpeed = config.speeds[up];
      const downSpeed = config.speeds[down];
      const visibleLayerIds = Object.keys(config.layerIds)
        .filter(key => filter[key])
        .map(key => config.layerIds[key])
        .flat()
      ;

      providerLayers.current.forEach(layer => {
        layer.visible = visibleLayerIds.indexOf(layer.layerId) > -1;
        layer.definitionExpression = `MAXADUP >= ${upSpeed} AND MAXADDOWN >= ${downSpeed}`;
      });
    }
  }, [filter, up, down]);

  const onChange = event => {
    const target = event.currentTarget;
    setFilter(previousFilter => {
      return {
        ...previousFilter,
        [target.id]: !previousFilter[target.id]
      };
    });
  };

  const speedLabels = config.speeds.reduce((newObject, speed, index) => {
    newObject[index] = speed;

    return newObject;
  }, {});
  const downloadSpeedLabels = { ...speedLabels };
  delete downloadSpeedLabels[0];

  return (
    <div className="app">
      <div className="slider-container">
        Download
        <Slider
          className='download'
          min={1}
          max={config.speeds.length - 1}
          step={1}
          labels={downloadSpeedLabels}
          value={down}
          tooltip={false}
          onChange={value => setDown(value)}
        />
        Upload
        <Slider
          min={0}
          max={config.speeds.length - 1}
          step={1}
          labels={speedLabels}
          value={up}
          tooltip={false}
          onChange={value => setUp(value)}
        />
      </div>
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
