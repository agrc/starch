define([
    'dojo/_base/declare', 
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin', 
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!app/templates/MapDataFilter.html',
    'dojo/has',
    'dojo/dom-style',
    'app/HelpPopup',
    'dojo/topic',
    'dojo/_base/lang',
    'dojo/query',
    'app/ListPicker',
    'dojo/dom-construct',
    'dojo/_base/array',
    'dojo/_base/event',

    'dijit/form/HorizontalRule',
    'dijit/form/HorizontalRuleLabels',
    'dojox/form/TriStateCheckBox',
    'dijit/form/Button',
    'dijit/Dialog',
    'dijit/form/Slider',
    'dojo/_base/sniff',
    'dijit/form/CheckBox'
],

function (
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    template,
    has,
    domStyle,
    HelpPopup,
    topic,
    lang,
    query,
    ListPicker,
    domConstruct,
    array,
    dojoEvent
    ) {
    return declare("app.MapDataFilter", 
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      Adjust's the definition query for the service areas
        
        widgetsInTemplate: true,
        templateString: template,
            
        layer: null, // set in setup - broadband map service layer
        updateTimer: null, // used to hold a timer in the onchange event of range sliders
        providersList: [], // list of all providers
        selectedProvidersIDs: [], // list of selected providers
        restricted: false, // disable provider selector
        showResetDialog: true, // controls whether the dialog is displayed after closing the list picker

        // dialogs: Widget[]
        //      dialogs associated with this widget
        //      for use in destroyRecursive
        dialogs: null,

        // setLayerDefTimeout: setTimeoutID
        //      see updateDefQuery
        setLayerDefTimeout: null,


        postCreate: function(){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            var that = this;

            this.wireControlEvents();
            
            // listen for mapLayerLoaded event
            this.subscribe("AGRC.ProvidersObtained", "_setProvidersList");
            
            // IE hack
            if (has('ie') <= 8){
                domStyle.set(this.downloadSlider.domNode, "width", "240px");
            }
            
            // create new Help Popups - has to be done programmatically here or offsets are not correct
            this.dialogs = [];
            this.dialogs.push(new HelpPopup({title: 'Maximum Advertised Speeds Help'}, 'speedsHelp'));
            this.dialogs.push(new HelpPopup({title: 'Technology Type Help'}, 'typeHelp'));
            
            this.dialogs.push(new HelpPopup({title: 'Broadband Providers Help'}, 'providersHelp'));
            this.dialogs.push(new HelpPopup({title: 'Target Market Help'}, 'endUserHelp'));
            this.dialogs.push(this.satelliteDialog);
            this.dialogs.push(this.resetDialog);
            
            // show sat dialog onclick in provider results
            topic.subscribe('broadband.ListProviders.onSatLinkClick', function(){
                that.satelliteDialog.show();
            });
        },
        wireControlEvents: function(){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            var dij;
            var that = this;

            function disableMouseWheel(slider) {
                slider._mouseWheeled = function () {};
            }

            this.connect(this.downloadSlider, "onChange", this._setTimer);
            disableMouseWheel(this.downloadSlider);
            this.connect(this.uploadSlider, "onChange", this._setTimer);
            disableMouseWheel(this.uploadSlider);
            this.connect(this.cbxWireBased, "onClick", function () {
                that._onTransCheckBoxChange(that.cbxWireBased);
            });
            this.connect(this.cbxWireless, "onClick", function () {
                that._onTransCheckBoxChange(that.cbxWireless);
            });
            this.connect(this.btnSelectProviders, "onClick", this.launchListPicker);
            this.connect(this.chbxShowAll, "onChange", this.updateDefQuery);
            this.connect(this.chbxShowOnly, "onClick", this.updateDefQuery);
            this.connect(this.btnResetOK, "onClick", this._onResetOK);
            this.connect(this.btnSatelliteOK, 'onClick', this._onSatelliteOK);
            this.connect(this.moreInfoLink, 'onclick', this._onSatelliteInfoClick);
            this.connect(this.resetBtn, 'onClick', this._onResetClick);
            this.connect(this.cbxResidential, 'onClick', this.updateDefQuery);
            this.connect(this.cbxBusiness, 'onClick', this.updateDefQuery);

            function wireSubCheckBoxes(parentCheckBoxId) {
                query('label[for="' + parentCheckBoxId + '"] + .sub-trans-list input').forEach(function (node) {
                    dij = dijit.getEnclosingWidget(node);
                    that.connect(dij, 'onClick', function () {
                        that._onSubCheckBoxChange(that[parentCheckBoxId]);
                    });
                });
            }

            wireSubCheckBoxes(this.cbxWireBased.id);
            wireSubCheckBoxes(this.cbxWireless.id);
        },
        _setProvidersList: function(providersObject){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            // create new array and populate from object
            for (var i in providersObject){
    //          // filter out Qwest
    //          if (providersObject[i].name != 'Qwest') {
                    this.providersList.push([providersObject[i].name, i]);
    //          }
            }
            
            // enable Select button
            if (this.restricted === false) {
                this.btnSelectProviders.set("disabled", false);
            }
        },
        _setTimer: function(){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            // use a timer to make sure that this function doesn't fire a lot when changing range sliders
            clearTimeout(this.updateTimer);
            this.updateTimer = setTimeout(lang.hitch(this, this.updateDefQuery), 500);
        },
        updateDefQuery: function(){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            var that = this;
            var defQueryProps = {};
            var transTypes;

            // clear any previous timers
            if (this.setLayerDefTimeout) {
                window.clearTimeout(this.setLayerDefTimeout);
                this.setLayerDefTimeout = null;
            }
            
            // Download slider
            // get start and end values for slice function on array
            var downQueryArray = AGRC.speedValues.slice(0, this.downloadSlider.value);
            var queryTxt = AGRC.fieldNames.MAXADDOWN + " IN (" + downQueryArray.join() + ")";
            defQueryProps.minDownSpeed = this.downloadSlider.get('value');
            
            // Upload slider
            var upQueryArray = AGRC.speedValues.slice(0, this.uploadSlider.value);
            queryTxt += " AND " + AGRC.fieldNames.MAXADUP + " IN (" + upQueryArray.join() + ")";
            defQueryProps.minUpSpeed = this.uploadSlider.get('value');

            // check to see if we should show the satellite providers link in results table
            var showSatLink = (this.downloadSlider.value[0] <= 5 && this.uploadSlider.value[0] <= 3);
            topic.publish('broadband.MapDataFilter.UpdateSatLinkVisibility', showSatLink);
            
            transTypes = this._getTransTypes();    
            if (transTypes.length > 0) {
                if (transTypes.length < 9) {
                    defQueryProps.transTypes = transTypes;
                    queryTxt += " AND " + AGRC.fieldNames.TRANSTECH + " IN (" + transTypes + ")";
                }
            } else {
                defQueryProps.transTypes = -1;
                queryTxt += " AND " + AGRC.fieldNames.TRANSTECH + " = -1";
            }

            // Providers
            if (this.chbxShowOnly.checked){
                domStyle.set(this.providerList, "color", "black");
                if (this.selectedProvidersIDs.length > 0) {
                    queryTxt += " AND " + AGRC.fieldNames.UTProvCode + " IN (" + this.selectedProvidersIDs + ")";
                    defQueryProps.providers = array.map(this.selectedProvidersIDs, function (id) {
                        return id.slice(1, id.length - 1);
                    });
                } else {
                    queryTxt += ' AND ' + AGRC.fieldNames.UTProvCode + " = '-1'";
                    defQueryProps.providers = -1;
                }
            }
            else {
                domStyle.set(this.providerList, "color", "grey");
            }

            // End User Categories
            var bus = this.cbxBusiness.get('checked');
            var res = this.cbxResidential.get('checked');
            if (!res && !bus) {
                queryTxt += " AND " + AGRC.fieldNames.EndUserCat + " = '-1'";
            } else {
                if (!res) {
                    queryTxt += " AND " + AGRC.fieldNames.EndUserCat + " = '2'";
                }
                if (!bus) {
                    queryTxt += " AND " + AGRC.fieldNames.EndUserCat + " <> '2'";
                }
            }
            defQueryProps.endUserCats = [];
            if (bus) {
                defQueryProps.endUserCats.push('bus');
            } 
            if (res) {
                defQueryProps.endUserCats.push('con');
            }
            if (defQueryProps.endUserCats.length === 0) {
                defQueryProps.endUserCats = -1;
            }
            
            // update query definitions for first 3 layers
            var layerDefs = [queryTxt, queryTxt, queryTxt];
            console.info(layerDefs[1]);
            
            // trying to prevent tons of calls to the server
            this.setLayerDefTimeout = window.setTimeout(function () {
                that.layer.setLayerDefinitions(layerDefs);
                console.log('def set');

                // change to dynamic coverage layer
                AGRC.bbLayer.show();
                AGRC.bbLayerCached.hide();
                AGRC.currentLayer = AGRC.bbLayer;
            }, 1250);

            // enable reset button
            this.resetBtn.set('disabled', false);
            
            // publish new query
            topic.publish(AGRC.topics.MapDataFilter.onQueryUpdate, queryTxt);
            topic.publish(AGRC.topics.Router.onDefQueryUpdate, defQueryProps);
        },
        _getTransTypes: function () {
            // summary:
            //      returns the values associates with the trans types checkboxes
            console.log(this.declaredClass + "::_getTransTypes", arguments);
            var ttValues = [];
            var newArray;
            var widget;

            query('.sub-trans-list input:checked', 'tech-type-div').forEach(function (node){
                widget = dijit.getEnclosingWidget(node);
                newArray = widget.get('value');
                ttValues = ttValues.concat(newArray);
            });

            return ttValues;
        },
        launchListPicker: function(){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            var that = this;

            // create list picker if needed
            if (!AGRC.listPicker){          
                // create new list picker
                AGRC.listPicker = new ListPicker({
                    listName: "Providers",            
                    availableListArray: this.providersList
                });
                
                // wire event to listen for OK button
                topic.subscribe(AGRC.topics.listpicker_onOK, function(selectedItems){              
                    that._onListPickerOK(selectedItems);
                });
            }
            
            AGRC.listPicker.show();
        },
        _onListPickerOK: function(selectedItems){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            this.resetFilters(false);
            
            // display dialog
            if (this.showResetDialog){
                this.resetDialog.show();
            }
            
            // clear existing lists
            this.providerList.innerHTML = "";
            this.selectedProvidersIDs = [];
            
            // process new providers list
            if (selectedItems.length === 0) {
                // switch back to showing all providers
                this.chbxShowAll.set("checked", true);
                
                // add no providers
                var li = domConstruct.create("li");
                li.innerHTML = "No Providers Selected";
                this.providerList.appendChild(li);
            }
            else {      
                array.forEach(selectedItems, function(item){
                    // add to id list
                    this.selectedProvidersIDs.push("'" + item[1] + "'");
                    
                    // add to list
                    var li = domConstruct.create("li");
                    li.innerHTML = item[0].replace('&', '&amp;'); // replace & for IE;
                    this.providerList.appendChild(li);
                }, this);
                
                this.chbxShowOnly.set("checked", true);
            }
            
            this.updateDefQuery();
            
            // enable reset button
            this.resetBtn.set('disabled', false);
            
            // change to dynamic coverage layer
            AGRC.bbLayer.show();
            AGRC.bbLayerCached.hide();
        },
        disableProviderSelector: function(){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            // this method was built for the provider preview to disable the ability to see other
            // provider's data
            
            // disable warning dialog
            this.showResetDialog = false;
            
            // check show only radio button
            this.chbxShowOnly.set('checked', true);
            
            // disable controls
            this.chbxShowAll.set('disabled', true);
            this.chbxShowOnly.set('disabled', true);
            this.btnSelectProviders.set('disabled', true);
            
            // set switch to prevent _setProvidersList from re-enabling the Select Providers button
            this.restricted = true;
        },
        _onResetOK: function () {
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            // store checkbox value
            this.showResetDialog = !this.chbxShowAgain.get('checked');
            
            this.resetDialog.hide();
        },
        resetFilters: function(resetProviders){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            // reset controls
            this.downloadSlider.set('value', '9');
            this.uploadSlider.set('value', '10');
            this.cbxWireBased.set('value', 'on');
            this.cbxWireless.set('value', 'on');
            query('.sub-trans-list input').forEach(function (node) {
                dijit.getEnclosingWidget(node).set('checked', true);
            });
            if (resetProviders && this.restricted === false){
                this.chbxShowAll.set('checked', true);
            }
        },
        _onSatelliteInfoClick: function(event){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            this.satelliteDialog.show();
            dojoEvent.stop(event);
        },
        _onSatelliteOK: function(){
            console.log(this.declaredClass + "::" + arguments.callee.nom);

            this.satelliteDialog.hide();
        },
        _onResetClick: function(){
            console.log(this.declaredClass + "::" + arguments.callee.nom);
            
            this.resetFilters(true);
            
            topic.publish(AGRC.topics.MapDataFilter.onResetFilter);
            
            // disable button
            this.resetBtn.set('disabled', true);
            
            // only switch back to cached layer if zoomed out beyond break point
            if (AGRC.map.getLevel() < AGRC.breakPointLevel) {
                // switch to cached layer
                AGRC.bbLayer.hide();
                AGRC.bbLayerCached.show();
                AGRC.currentLayer = AGRC.bbLayerCached;
            }
        },
        destroyRecursive: function () {
            // summary:
            //      need to remove the associated dialogs manually for tests to work
            console.log(this.declaredClass + "::destroyRecursive", arguments);
            
            array.forEach(this.dialogs, function (d) {
                d.destroyRecursive(false);
            });

            this.inherited(arguments);
        },
        _onSubCheckBoxChange: function (parentCheckBox, updateDefQuery) {
            // summary:
            //      updates the parent checkbox
            // parentCheckBox: TriStateCheckBox
            // updateDefQuery: ?Boolean (defaults to true)
            console.log(this.declaredClass + "::_onSubCheckBoxChange", arguments);
            var dij;
            var falseValues = [];
            var value;
            var boxes;

            if (updateDefQuery === undefined) {
                updateDefQuery = true;
            }

            // query for related sub checkboxes
            boxes = query('label[for="' + parentCheckBox.id + '"] + .sub-trans-list input').forEach(function (node) {
                dij = dijit.getEnclosingWidget(node);
                value = dij.get('value');
                if (value === false) {
                    falseValues.push(value);
                }
            });

            if (falseValues.length === boxes.length) {
                // no checkboxes selected
                parentCheckBox.set('value', false);
            } else if (falseValues.length > 0) {
                // some checkboxes selected
                parentCheckBox.set('value', 'mixed');
            } else {
                // all checkboxes are selected
                parentCheckBox.set('value', 'on');
            }

            if (updateDefQuery) {
                this.updateDefQuery();
            }
        },
        _onTransCheckBoxChange: function (chbox) {
            // summary:
            //      updates the sub checkboxes for the trans checkbox
            // chbox: TriStateCheckBox
            console.log(this.declaredClass + "::_onTransCheckBoxChange", arguments);
            var value = chbox.get('value');

            function setSubs(checked) {
                query('label[for="' + chbox.id + '"] + .sub-trans-list input').forEach(function (node) {
                    dijit.getEnclosingWidget(node).set('checked', checked);
                });
            }

            if (value === 'mixed') {
                chbox.set('value', 'on');
                setSubs(true);
            } else if (value === 'on') {
                setSubs(true);
            } else {
                setSubs(false);
            }

            this.updateDefQuery();
        },
        selectTransTypes: function (transTypes) {
            // summary:
            //      called by app/Router
            // transTypes: Number[]
            console.log(this.declaredClass + "::selectTransType", arguments);
            
            var chbox;
            var values;

            query('.sub-trans-list input').forEach(function (input) {
                chbox = dijit.getEnclosingWidget(input);
                // need to do this to make sure that we get
                // the correct return value for value
                chbox.set('checked', true);
                values = chbox.get('value');
                if (transTypes !== null) {
                    if (array.some(values, function (val) {
                            return array.indexOf(transTypes, val) !== -1;
                        })) {
                        chbox.set('checked', true);
                    } else {
                        chbox.set('checked', false);
                    }
                }
            });

            this._onSubCheckBoxChange(this.cbxWireBased, false);
            this._onSubCheckBoxChange(this.cbxWireless, false);

            this.updateDefQuery();
        },
        setSlider: function (sliderType, value) {
            // summary:
            //      called by app/Router to manually set the slider values
            // sliderType: String (up || down)
            // value: Number
            console.log(this.declaredClass + "::setSlider", arguments);
        
            var slider = (sliderType === 'down') ? this.downloadSlider : this.uploadSlider;

            slider.set('value', value);

            this.updateDefQuery();
        },
        setEndUserCategories: function (cats) {
            // summary:
            //      sets the end user category checkboxes
            // cats: String[]
            console.log('app/MapDataFilter:setEndUserCategories', arguments);

            this.cbxResidential.set('checked', array.indexOf(cats, 'con') !== -1);
            this.cbxBusiness.set('checked', array.indexOf(cats, 'bus') !== -1);

            this.updateDefQuery();
        }
    });
});