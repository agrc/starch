const config = {
  urls: {
    masquerade: 'https://masquerade-kkktr623oa-uc.a.run.app/arcgis/rest/services/UtahLocator/GeocodeServer',
  },
  fieldNames: {
    TransTech: 'TransTech',
    MAXADDOWN: 'MAXADDOWN',
    MAXADUP: 'MAXADUP',
  },
  transTechValues: {
    dsl: [10, 20],
    cable: [30, 40, 41],
    fiber: [50],
    fixed: [70, 71],
    mobile: [80],
  },
  speedValues: {
    0: {
      label: 'all',
      value: null,
    },
    1: {
      label: '0.7',
      value: 0.768,
    },
    2: {
      label: '1.5',
      value: 1.5,
    },
    3: {
      label: '6',
      value: 6,
    },
    4: {
      label: '10',
      value: 10,
    },
    5: {
      label: '50',
      value: 50,
    },
    6: {
      label: '100',
      value: 100,
    },
    7: {
      label: '1G',
      value: 1000,
    },
    8: {
      label: '10G',
      value: 10000,
    },
  },
};

export default config;
