const MAXADUP = 'MAXADUP';
const MAXADDOWN = 'MAXADDOWN';
const speeds = [0.768, 1.5, 6, 10, 25, 50, 100, 1000, 10000];
export default {
  urls: {
    providerCoverage: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/ProviderCoverageSplit/FeatureServer'
  },
  speeds,
  layerIds: {
    wireline: [0, 1, 2],
    fixed: [3, 4, 5]
  },
  fieldNames: {
    MAXADUP,
    MAXADDOWN
  },
  defaultDefinitionExpression: `${MAXADUP} >= ${speeds[1]} AND ${MAXADDOWN} >= ${speeds[1]}`
};
