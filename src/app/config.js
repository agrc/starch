/* jshint camelcase: false */
define([
    'dojo/has'
],

function (
    has
) {
    // var appServerPath = window.location.protocol + '//' + window.location.hostname +'/ArcGIS/rest/services/';
    // TODO to make work on broadband.utah.gov domain as well as local and test
    // var appServerPath = 'http://mapserv.utah.gov/ArcGIS/rest/services/';
    // get from require.baseUrl
    var appServerPath = '/ArcGIS/rest/services/';
    window.AGRC = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // version.: String
        //      The version number.
        version: '2.4.1',

        map: null,

        // currentLayer: esri/layer
        //      keeps track if the dynamic or cached layer is showing
        currentLayer: null,

        // path to app
        appServerPath: appServerPath,
        broadbandMapURL: appServerPath + 'Broadband/ProviderCoverage/MapServer',
        broadbandMapCachedURL: appServerPath + 'Broadband/ProviderCoverageCached/MapServer',
        redlineUrl: '/chalkdust',
        exportWebMapUrl: appServerPath + 'Broadband/ExportWebMap/GPServer/Export Web Map',

        fieldNames: {
            UTProvCode: 'UTProvCode',
            MAXADUP: 'MAXADUP',
            MAXADDOWN: 'MAXADDOWN',
            NAME: 'Colloquial',
            ID: 'Code',
            URL: 'URL',
            ID_NUM: 'ID_NUM',
            TRANSTECH: 'TRANSTECH',
            EndUserCat: 'EndUserCat',
            Biz_Only: 'Biz_Only'
        },
        providers: {},
        speedsDomain: {
            '2': '256 - 768 Kbps',
            '3': '768 Kbps - 1.5 Mbps',
            '4': '1.5 - 3 Mbps',
            '5': '3 - 6 Mbps',
            '6': '6 - 10 Mbps',
            '7': '10 - 25 Mbps',
            '8': '25 - 50 Mbps',
            '9': '50 - 100 Mbps',
            '10': '100 - 1000 Mbps',
            '11': 'greater than 1000 Mbps'
        },
        // TODO: refactor MapDataFilter.js to use speedsDomain and get rid of this property
        speedValues: ['11','10','9','8','7','6','5','4','3','2'],
        typesDomain: {
            '10': 'DSL',
            '20': 'DSL',
            '30': 'Other Wireline',
            '40': 'Cable',
            '41': 'Cable',
            '50': 'Fiber',
            '60': 'Satellite',
            '70': 'Fixed Wireless',
            '71': 'Fixed Wireless',
            '80': 'Mobile Wireless'
        },
        layersDrawing: 0, // keeps track of layers that have draw - see addLoadingToLayer
        breakPointLevel: 9, // the level at which the dynamic coverage service turns on and the cached service turns off
        topics: {
            Router: {
                onDefQueryUpdate: 'broadband.Router.onDefQueryUpdate'
            },
            listpickerOnOK: 'broadband.listpickerOnOK',
            MapDataFilter: {
                onResetFilter: 'broadband.MapDataFilter.onResetFilter',
                onQueryUpdate: 'broadband.MapDataFilter.onQueryUpdate'
            },
            App: {
                onMapExtentChange: 'broadband.App.onMapExtentChange'
            }
        },
        hashIdentifier: '/route/',

        // disableFeedback: Boolean
        //      Used to disable feedback being sent during testing
        disableFeedback: false
    };

    if (has('agrc-api-key') === 'prod') {
        // *.utah.gov
        window.AGRC.apiKey = 'AGRC-D3CDE591211690';
    } else if (has('agrc-api-key') === 'stage') {
        // test.mapserv.utah.gov
        window.AGRC.apiKey = 'AGRC-AC122FA9671436';
    } else {
        // localhost
        window.AGRC.apiKey = 'AGRC-E5B94F99865799';
    }

    return window.AGRC;
});
