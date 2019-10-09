/* eslint-disable no-unused-vars */
var profile = {
    basePath: '../src',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: false,
    layerOptimize: false,
    selectorEngine: 'acme',
    layers: {
        'dojo/dojo': {
            include: [
                'app/App',
                'app/packages',
                'app/run',
                'dojo/domReady',
                'dojo/has',
                'dojo/i18n',
                'dojox/gfx/filters',
                'dojox/gfx/path',
                'dojox/gfx/shape',
                'dojox/gfx/svg',
                'dojox/gfx/svgext',
                'esri/dijit/Attribution',
                'esri/layers/VectorTileLayerImpl'
            ],
            exclude: [
                'esri/arcade/lib/esprima'
            ],
            includeLocales: ['en-us'],
            customBase: true,
            boot: true
        }
    },
    packages: [{
        name: 'moment',
        main: 'moment',
        resourceTags: {
            amd: function (filename) {
                return /\.js$/.test(filename);
            },
            test: function (filename, mid) {
                return /\/tests/.test(mid);
            },
            miniExclude: function (filename, mid) {
                return /\/src/.test(mid) || /\/templates/.test(mid);
            }
        }
    }, 'xstyle'],
    staticHasFeatures: {
        'dojo-trace-api': 0,
        'dojo-log-api': 0,
        'dojo-publish-privates': 0,
        'dojo-sync-loader': 0,
        'dojo-xhr-factory': 0,
        'dojo-test-sniff': 0
    },
    userConfig: {
        packages: ['app', 'dijit', 'esri', 'layer-selector', 'ijit', 'agrc', 'dojox']
    }
};
