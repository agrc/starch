(function () {
    require({
        packages: [
            'agrc',
            'app',
            'dijit',
            'dgrid',
            'dgrid1',
            'dojo',
            'dojox',
            'dstore',
            'esri',
            'ijit',
            'layer-selector',
            'moment',
            'polyfills',
            'put-selector',
            {
                name: 'bootstrap',
                location: './bootstrap',
                main: 'dist/js/bootstrap'
            }, {
                name: 'jquery',
                location: './jquery/dist',
                main: 'jquery'
            }, {
                name: 'ladda',
                location: './ladda-bootstrap',
                main: 'dist/ladda'
            }, {
                name: 'mustache',
                location: 'mustache',
                main: 'mustache'
            }, {
                name: 'proj4',
                location: './proj4',
                main: 'proj4-src'
            }, {
                name: 'spin',
                location: './spinjs',
                main: 'spin'
            }, {
                name: 'stubmodule',
                location: 'stubmodule/src',
                main: 'stub-module'
            }
        ]
    });
}());
