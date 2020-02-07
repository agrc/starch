import { loadModules } from 'esri-loader';


export default async () => {
  const requires = [
    'esri/Basemap',
    'esri/layers/FeatureLayer',
    'esri/layers/support/LOD',
    'esri/layers/support/TileInfo',
    'esri/layers/VectorTileLayer',
    'esri/layers/WebTileLayer',
    'esri/Map',
    'esri/views/MapView',
    'esri/core/watchUtils'
  ];

  const [
    Basemap,
    FeatureLayer,
    LOD,
    TileInfo,
    VectorTileLayer,
    WebTileLayer,
    Map,
    MapView,
    watchUtils
  ] = await loadModules(requires, {
    version: '4.14',
    css: true
  });

  return {
    Basemap,
    FeatureLayer,
    LOD,
    TileInfo,
    VectorTileLayer,
    WebTileLayer,
    Map,
    MapView,
    watchUtils
  };
}
