define([
    'app/config',
    'app/HelpPopup',

    'dijit/form/DropDownButton',
    'dijit/registry',
    'dijit/TooltipDialog',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/has',
    'dojo/query',
    'dojo/text!app/templates/MapDisplayOptions.html',
    'dojo/_base/array',
    'dojo/_base/declare',

    'dijit/form/CheckBox',
    'dijit/form/HorizontalSlider',
    'dijit/form/Select',
    'dojo/_base/sniff',
    'xstyle/css!app/resources/MapDisplayOptions.css'
], function (
    config,
    HelpPopup,

    DropDownButton,
    registry,
    TooltipDialog,
    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domClass,
    domConstruct,
    domStyle,
    has,
    query,
    template,
    array,
    declare
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary: Contains controls that adjust the map display along with the legend
        // example:

        widgetsInTemplate: true,
        templateString: template,

        // properties passed in via params
        map: null,
        bbLayer: null, // broadband overlay layer
        bbLayerCached: null, // cached broadband overlay layer
        typeLegendImagePath: config.appBaseUrl + 'app/resources/images/type_legend.png',
        speedLegendImagePath: config.appBaseUrl + 'app/resources/images/speed_legend.png',

        postCreate: function () {
            console.log('app/MapDisplayOptions:postCreate', arguments);

            this.inherited(arguments);

            // init slider values
            this.overlaySlider.set('value', this.bbLayer.opacity);

            this._updateLegendOpacity();

            // CSS browser hacks
            if (has('ie')) {
                query('.fieldset').style('height', '165px');
            }

            new HelpPopup({
                title: 'Map Display Help',
                autoPosition: true
            }, this.displayHelp);
        },
        _updateLegendOpacity: function () {
            console.log('app/MapDisplayOptions:_updateLegendOpacity', arguments);

            // set legend block opacities
            domStyle.set(this.sliderLegend, 'opacity', this.bbLayer.opacity);
        },
        _onOverlayCheckBoxClick: function () {
            console.log('app/MapDisplayOptions:_onOverlayCheckBoxClick', arguments);

            var isChecked = this.overlayCheckBox.get('value');

            // toggle layers
            var layer = config.app.getCurrentCoverageLayer();
            layer.setVisibility(isChecked);

            this.overlaySlider.set('disabled', false);

            domClass.toggle(this.sliderLegend, 'gray');
        },
        _onOverlaySliderChange: function (newValue) {
            console.log('app/MapDisplayOptions:_onOverlaySliderChange', arguments);

            // adjust layer opacity
            this.bbLayer.setOpacity(newValue);
            this.bbLayerCached.setOpacity(newValue);

            this._updateLegendOpacity();
        },
        _adjustLayerOpacity: function (value) {
            // adjust layer opacity
            array.forEach(this.currentTheme.layers, function (layer) {
                layer.setOpacity(value);
            }, this);
        }
    });
});
