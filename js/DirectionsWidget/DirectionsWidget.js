define([
    "dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dojo/dom","esri/kernel",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/on",
    "dojo/query",
    "esri/units",
    "esri/dijit/Directions",
    "application/DirectionsWidget/DirectionsHeader",
    "esri/symbols/PictureMarkerSymbol", "esri/symbols/Font", "esri/Color",
    "dojo/i18n!application/nls/DirectionsWidget",
    "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style",
    "dojo/dom-construct"

    ], function (
        Evented, declare, lang, has, dom, esriNS,
        _WidgetBase, _TemplatedMixin, on,
        query,
        units,
        Directions,
        DirectionHeader,
        PictureMarkerSymbol, Font, Color,
        i18n,
        domClass, domAttr, domStyle,
        domConstruct
    ) {
    var Widget = declare("esri.dijit.DirectionWidget", [_WidgetBase, /*_TemplatedMixin,*/ Evented], {

        options: {
            map: null,
            header: 'pageHeader_directions',
            id: "directionsWidget",
            deferred: null,
            toolbar: null,
            proxyUrl: null,
            directionsProxy: null,
            iconsColor: 'white',
            options: {
                locator: false,
                stops: false,
                barriers: false,
                optimize: false,
                print: false,

                enhancedSymbols: true,
                allowDragging: true,
                changeStopOrder: true,
                segmentPopup: false,
                imagesURL: '',
                printPage: ''
            },
            superNavigator : null,
        },

        constructor: function (options, srcRefNode) {
            this.defaults = lang.mixin({}, this.options, options);
            this._i18n = i18n;
            this.iconsColor = this.defaults.iconsColor;
            this.domNode = srcRefNode;
            this.headerNode = dom.byId(this.defaults.header);
            this.map = this.defaults.map;
            this.toolbar = this.defaults.toolbar;
            this.deferred = this.defaults.deferred;
            this.options = this.defaults.options;
            const directionsProxy = this.defaults.directionsProxy;

            var link = document.createElement("link");
            link.href = "js/DirectionsWidget/Templates/DirectionWidget.css";
            link.type = "text/css";
            link.rel = "stylesheet";
            query('head')[0].appendChild(link);

            if(this.defaults.options.imagesURL.isNonEmpty()) {
                this.imagesPath = this.defaults.options.imagesURL;
            } else {
                const pathRegex = new RegExp(/\/[^\/]+$/);
                const locationPath = location.protocol+'//'+location.host+location.pathname.replace(pathRegex, '');
                this.imagesPath = locationPath+"/images";
            }

            let directionOptions = {
                map: this.map,
                id: this.defaults.id,

                showMilesKilometersOption: false,
                showOptimalRouteOption: false,
                showSegmentHighlight: true,
                showTrafficOption: false,
                showTravelModesOption: false,

                showActivateButton: false,
                showClearButton: false,
                showBarriersButton: false,
                showReturnToStartOption: false,
                showReverseStopsButton: true,
                showSegmentPopup: this.options.segmentPopup,
                showPrintPage: false,

                directionsLengthUnits: units.KILOMETERS,

                optimalRoute: false,

                dragging: this.options.allowDragging,
                canModifyStops: true,
                maxStops: 9,

                //searchOptions: <Object>
                //segmentInfoTemplate: <InfoTemplate> 
                // printPage: "../js/DirectionsPrintPage/index.html"
            };

            if(this.options.printPage.isNonEmpty()) {
                directionOptions.printPage = this.options.printPage;
            }

            if(this.options.enhancedSymbols) {
                const fromSymb = new PictureMarkerSymbol(this.imagesPath+"/greenPoint.png", 21, 29);
                fromSymb.setOffset(0, 12);
                const stopSymb = new PictureMarkerSymbol(this.imagesPath+"/bluePoint.png", 21, 29);
                stopSymb.setOffset(0, 12);
                const toSymb = new PictureMarkerSymbol(this.imagesPath+"/redPoint.png", 21, 29);
                toSymb.setOffset(0, 12);
                const unSymb = new PictureMarkerSymbol(this.imagesPath+"/grayCircle.png", 21, 29);
                unSymb.setOffset(0, 12);

                const fromSymbDrag = new PictureMarkerSymbol(this.imagesPath+"/greenPointDrag.png", 21, 29);
                fromSymbDrag.setOffset(0, 12);
                const stopSymbDrag = new PictureMarkerSymbol(this.imagesPath+"/bluePointDrag.png", 21, 29);
                stopSymbDrag.setOffset(0, 12);
                const toSymbDrag = new PictureMarkerSymbol(this.imagesPath+"/redPointDrag.png", 21, 29);
                toSymbDrag.setOffset(0, 12);
                const unSymbDrag = new PictureMarkerSymbol(this.imagesPath+"/grayCircleDrag.png", 21, 29);
                unSymbDrag.setOffset(0, 12);

                directionOptions = Object.assign( {
                    fromSymbol: fromSymb,
                    stopSymbol: stopSymb,
                    toSymbol: toSymb,
                    unreachedSymbol: unSymb,
                    fromSymbolDrag: fromSymbDrag,
                    stopSymbolDrag: stopSymbDrag,
                    toSymbolDrag: toSymbDrag,
                    unreachedSymbolDrag: unSymbDrag,
                    textSymbolColor: new Color('#000000'),
                    textSymbolFont: new Font("10pt", null, null, Font.WEIGHT_BOLD, "Arial, Helvetica, sans-serif"),
                }, directionOptions);
            }

            if(directionsProxy && directionsProxy.isNonEmpty()) {
                directionOptions.routeTaskUrl = directionsProxy;
            }

            window.directionDijit = this.directions = new Directions(directionOptions,
                domConstruct.create("div", null, this.domNode)); //"pageBody_directions");

            window.directionDijit.imagesPath = this.imagesPath;
            
            on(
                this.directions,
                "load",
                lang.hitch(this, function() {
                    const esriStopsContainer = query('.esriDirectionsContainer');
                    if(esriStopsContainer && esriStopsContainer.length >0) {
                        new MutationObserver(lang.hitch(this, function(mutations) {
                            // console.log('mutations', mutations);
                            mutations.forEach(lang.hitch(this, function(mutation) {
                                // console.log('mutation', mutation);

                                try{
                                    const hiddens = query('input[type=hidden][aria-hidden]', mutation.target);
                                    hiddens.forEach(function(hidden) { domAttr.remove(hidden, 'aria-hidden'); });

                                    // console.log('mutation target', mutation.target);
                                    const stopRows = query('tr.esriStop.dojoDndItem');
                                    // console.log('stopRows', stopRows);
                                    stopRows.forEach(lang.hitch(this, function(row) {
                                        const stopIcon = query('.esriStopIcon',row);
                                        if(stopIcon && stopIcon.length>0){
                                            let background = domStyle.getComputedStyle(stopIcon[0]).background;
                                            if(!background.isNonEmpty()) {
                                                background = domStyle.getComputedStyle(stopIcon[0]).backgroundImage;
                                            }
                                            if(background.includes("Directions")) {
                                                const left = background.indexOf('url(\"')+5;
                                                let imgSrc = background.substring(left, background.indexOf('\")'));
                                                if(this.options.enhancedSymbols) {
                                                    if(imgSrc.includes("Directions/blueCircle.png")) {
                                                        imgSrc = this.imagesPath+"/bluePoint.png";
                                                    }
                                                    else if(imgSrc.includes("Directions/greenPoint.png")) {
                                                        imgSrc = this.imagesPath+"/greenPoint.png";
                                                    }
                                                    else if(imgSrc.includes("Directions/redPoint.png") || imgSrc.includes("esriDMTDepart.png")) {
                                                        imgSrc = this.imagesPath+"/redPoint.png";
                                                    }
                                                    else if(imgSrc.includes("Directions/grayCircle.png") || imgSrc.includes("esriDMTDepart.png")) {
                                                        imgSrc = this.imagesPath+"/grayCircle.png";
                                                    }

                                                }
                                                const text = stopIcon[0].innerText;
                                                stopIcon[0].innerText = '';

                                                // domStyle.set(stopIcon[0], "background", background.replace(/center/, '-100px'));
                                                const img = domConstruct.create("img",{alt:"", src:imgSrc},stopIcon[0]);

                                                if(text.isNonEmpty()) {
                                                    const span = domConstruct.toDom("<span aria-hidden='true'>"+text+"</span>");
                                                    domConstruct.place(span, img, "after");
                                                }
                                            }
                                        }
                                    }));
                                } catch (ex) {
                                    console.log('Directions Widget Mutation Error', ex);
                                }
                            }));
                        })).observe(esriStopsContainer[0], {
                            attributes: true,
                            childList: false,
                            characterData: false
                        });
                    }
                })
            );

            if(this.defaults.superNavigator) {
                const mapKeyEvent = on.pausable(this.defaults.superNavigator, 'mapClick', lang.hitch(this, function(evt) {
                    if(!this.toolbar.IsToolSelected('directions')) return;
                    if(this.directions.mapClickActive) {
                        this.directions.addStop(evt.mapPoint);
                    }
                }));
                mapKeyEvent.pause();

                this.toolbar.on('updateTool', lang.hitch(this, function(name) {
                    if(name==='directions') {
                        mapKeyEvent.resume();
                    } else {
                        mapKeyEvent.pause();
                    }
                }));
            }
        },

        startup: function () {
            if (!this.map) {
                this.destroy();
                console.error("DirectionWidget: Map required");
            }

            if (!this.toolbar) {
                this.destroy();
                console.error("DirectionWidget: Toolbar required");
            }

            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function () {
                    this._init();
                }));
            } 
        },

        loaded : false,

        _init : function() {  

            this.directionsHeader = new DirectionHeader({
                map: this.map,
                directions: this.directions,
                options: this.options,
                header: 'pageHeader_directions',
                // id: 'directionsHeaderId',
                toolbar: this.toolbar,
                iconsColor: this.iconsColor,
                locateCallBack: lang.hitch(this, function(ev) {
                    // console.log('locateCallBack', ev, this);

                    const stop = [ev.position.coords.longitude, ev.position.coords.latitude];
                    this.directions.updateStop(stop, 0);

                    // console.log('stops', this.directions.stops);

                    const stopsTr = query('tr.esriStop.dojoDndItem', this.directions._dndNode);
                    if(stopsTr && stopsTr.length>0) {
                        const firstStop = query('td.esriStopGeocoderColumn .arcgisSearch', stopsTr[0]);
                        if(firstStop && firstStop.length>0) {
                            const searchWidget = dijit.byId(domAttr.get(firstStop[0], 'widgetid'));
                            searchWidget.inputNode.focus();
                            setTimeout(function () { 
                                searchWidget.inputNode.select(); 
                            }, 250);
                        }
                    }
                })
            }, domConstruct.create('Div', {}, this.headerNode));
            this.directionsHeader.startup();        

            try {

                this.directions.startup();
                this.loaded = true; 

                domClass.add(this.domNode, "pageBody");

                // this.map.setInfoWindowOnClick(false);

                // domAttr.set(this.directions._dndNode, "role", "presentation");

                this.directions.on("load", lang.hitch(this, this._fixStops));
                this.directions.on("directions-finish", lang.hitch(this, this._fixUi));

                if(this.deferred)
                    this.deferred.resolve(true);
            } catch (ex) {
                console.log('error directions-finish', ex);
                if(this.deferred)
                    this.deferred.resolve(false);
            }
        },

        postCreate: function(){
            // this.toolbar.showBadge('route');
            this.directions.on("directions-finish", lang.hitch(this, function() {this.toolbar.showBadge('route');}));
            this.directions.on("directions-clear", lang.hitch(this, function() {this.toolbar.hideBadge('route');}));
        },

        _usedSearchIds : [],

        _fixStops :function(ev) {
            const nodes = query('[role=presentation]', ev.target.domNode);
            // console.log("presentationNodes", nodes);
            nodes.forEach(function(node) { domAttr.remove(node, "role"); });

            const esriRoutesErrors = query('[data-dojo-attach-point=_msgNode]', ev.target.domNode);
            if(esriRoutesErrors && esriRoutesErrors.length>0) {
                esriRoutesErrors.forEach(function(esriRoutesError) {
                    domAttr.set(esriRoutesError,'aria-live', 'polite');
                    domAttr.set(esriRoutesError,'aria-atomic', 'true');
                });
            }

            const travelModes = query('table.esriTravelModesDDL');
            if(travelModes && travelModes.length>0) {
                travelModes.forEach(function(table) {
                    domAttr.remove(table, 'aria-haspopup');
                    domAttr.remove(table, 'aria-expanded');
                    domAttr.remove(table, 'aria-invalid');
                });
            }

            const tables = query('table', ev.target.domNode);
            // console.log("tables", tables);
            tables.forEach(function(table) { domAttr.set(table, "role", "presentation"); });

            const tbodies = query('tbody[role=menu]', ev.target.domNode);
            // console.log("tbodies", tbodies);
            tbodies.forEach(function(tbody) { domAttr.set(tbody, "role", "list"); });

            const trs = query('tr[role=menuitem]', ev.target.domNode);
            // console.log("trs", trs);
            trs.forEach(function(tr) { domAttr.set(tr, "role", "listitem"); });

            const stopsTr = query('tr.esriStop.dojoDndItem', ev.target.domNode);
            // console.log('stopsTr', stopsTr);
            // const usedSearchIds = this._usedSearchIds;
            stopsTr.forEach(lang.hitch(this, function(stopTr) {
                const searchDiv = query('td.esriStopGeocoderColumn .arcgisSearch', stopTr)[0];
                // console.log('searchDiv', searchDiv); 
                if(searchDiv) {
                    const searchWidget = dijit.byId(domAttr.get(searchDiv, 'widgetid'));
                    if(!this._usedSearchIds.includes(searchWidget.id)) {
                        // domAttr.set(searchWidget.clearNode, 'title', i18n.widgets.directionsWidget.removeStop);
                        domAttr.remove(searchWidget.clearNode, 'tabindex');
                        domAttr.remove(searchWidget.clearNode, 'class');
                        domAttr.remove(searchWidget.clearNode, 'role');
                        domAttr.set(searchWidget.noResultsMenuNode, 'aria-live', 'polite');
                        domAttr.set(searchWidget.noResultsMenuNode, 'aria-atomic', 'true');
                        
                        const closeSpan = query('span.searchIcon.esri-icon-close.searchClose', stopTr)[0];
                        domAttr.remove(closeSpan, 'aria-hidden');
                        domConstruct.empty(closeSpan);
                        const removeStopBtn = domConstruct.create('input', {
                            type: "image",
                            src: "images/icons_black/searchClear.png",
                            alt: "clear",
                            title: i18n.widgets.directionsWidget.removeStop,
                            'aria-label': i18n.widgets.directionsWidget.removeStop,
                            'aria-hidden': 'true'
                        }, closeSpan);
                        domAttr.remove(searchWidget.clearNode, 'title');

                        on(removeStopBtn, 'focus', function(ev) { 
                            domAttr.set(ev.target, 'aria-hidden', 'false');
                        });

                        on(removeStopBtn, 'blur', function(ev) { 
                            domAttr.set(ev.target, 'aria-hidden', 'true');
                        });

                        // console.log('closeSpan', closeSpan);
                        // console.log('searchWidget', searchWidget.id);

                        const clearAllBtns = query('.esriStopIconRemoveHidden, .esriStopIconRemove', stopTr);

                        if(clearAllBtns && clearAllBtns.length>0) {
                            searchWidget.on('clear-search', function() {
                                // console.log('clearSearch', this, clearAllBtns[0]);
                                clearAllBtns[0].click();
                            });
                        }

                        domAttr.set(this.directions._dndNode, 'tabindex', 0);

                        const dojoDndHandles = query('.dojoDndHandle.esriStopDnDHandleHidden', stopTr);
                        dojoDndHandles.forEach(lang.hitch(this, function(dojoDndHandle) {
                            if(!this.options.changeStopOrder) {
                                domStyle.set(dojoDndHandle, 'display', 'none');
                                const iconCell = query('.esriStopIconColumn .esriStopIcon.dojoDndHandle', stopTr);
                                if(iconCell && iconCell.length>0) {
                                    domClass.remove(iconCell[0], 'dojoDndHandle');
                                }
                            }
                            else {
                                domAttr.set(dojoDndHandle, 'tabindex', 0);
                                domAttr.set(dojoDndHandle, 'aria-label', i18n.widgets.directionsWidget.dragUpDown);
                                domAttr.set(dojoDndHandle, 'aria-hidden', 'true');
                                domAttr.set(dojoDndHandle, 'data-tip', i18n.widgets.directionsWidget.dragUpDown);
                                domAttr.set(dojoDndHandle, 'role', 'application');
                                domConstruct.empty(dojoDndHandle);
                                domConstruct.create('img', {
                                    src : 'images/upDown.18.png',
                                    alt : 'up/down',
                                    class: 'upDownHandle',
                                    'aria-hidden': 'true'
                                }, dojoDndHandle);

                                on(dojoDndHandle, 'focus', function(ev) { 
                                    domAttr.set(ev.target, 'aria-hidden', 'false');
                                });

                                on(dojoDndHandle, 'blur', function(ev) { 
                                    domAttr.set(ev.target, 'aria-hidden', 'true');
                                });

                                on(dojoDndHandle, 'click', function(ev) { ev.target.focus(); });

                                on(dojoDndHandle, 'keyup', lang.hitch(this, function(ev) { 
                                    const stopsNo = query('.esriStopIcon.dojoDndHandle span', stopTr);
                                    if(stopsNo && stopsNo.length>0) {
                                        const indexA = Number(stopsNo[0].innerText)-1;
                                        let indexB = -1;
                                        // console.log(indexA, stopTr, ev); 
                                        switch(ev.keyCode) {
                                            case 38 : // "ArrowUp"
                                                if(indexA>0) {
                                                    indexB = indexA-1;
                                                }
                                                break;
                                            case 40 : // "ArrowDown"
                                                if(indexA<this.directions.stops.length-1) {
                                                    indexB = indexA+1;
                                                }
                                                break;
                                            case 36 : // "Home"
                                                if(indexA>0) {
                                                    indexB = 0;
                                                }
                                                break;
                                            case 35 : // "End"
                                                if(indexA<this.directions.stops.length-1) {
                                                    indexB = this.directions.stops.length-1;
                                                }
                                                break;
                                        }
                                        if(indexB>=0) {
                                            this.directions.set('autoSolve', false);
                                            let stops = Array.from(this.directions.stops);
                                            const stopA = stops.splice(indexA, 1)[0];
                                            stops.splice(indexB, 0, stopA);
                                            
                                            this.directions.set('autoSolve', false);
                                            this.directions.removeStops().then(lang.hitch(this, function () {
                                                const lenFix = stops.length;
                                                this.directions.addStops(stops, 0).then(lang.hitch(this, function () {
                                                    const actualLen = this.directions.stops.length;
                                                    if(lenFix > actualLen) {
                                                        const restStops = stops.splice(actualLen);
                                                        this.directions.addStops(restStops, actualLen).then(
                                                            lang.hitch(this, function () {
                                                                this.directions.set('autoSolve', true);
                                                                this.directions._dndNode.focus();
                                                            })
                                                        );
                                                    }
                                                    else {
                                                        this.directions.set('autoSolve', true);
                                                        this.directions._dndNode.focus();
                                                    }
                                                }));
                                            }), 
                                            function (err) {
                                                console.error(err);
                                            });
                                        }
                                    }
                                }));
                            }
                        }));
                        this._usedSearchIds.push(searchWidget.id);
                    }
                }
            }));

        },

        _fixUi : function(ev){
            this.directions.zoomToFullRoute();
            this._fixStops(ev);

            const hiddens = query('input[type=hidden][aria-hidden]', ev.target.domNode);
            hiddens.forEach(function(hidden) { domAttr.remove(hidden, 'aria-hidden'); });

            const routeIcons = query('.esriRouteIcon', ev.target.domNode);
            // console.log("routeIcons", routeIcons);

            routeIcons.forEach(lang.hitch(this, function(routeIcon) {
                try {
                    let imgSrc = domStyle.getComputedStyle(routeIcon).backgroundImage;
                    imgSrc = imgSrc.substring(5, imgSrc.length-2);
                    if(this.options.enhancedSymbols) {
                        if(imgSrc.includes("esriDMTStopOrigin.png")) {
                            imgSrc = this.imagesPath+"/greenPoint.png";
                        }
                        else if(imgSrc.includes("esriDMTStopDestination.png")) {
                            imgSrc = this.imagesPath+"/redPoint.png";
                        }
                        else if(imgSrc.includes("esriDMTStop.png") || imgSrc.includes("esriDMTDepart.png")) {
                            imgSrc = this.imagesPath+"/bluePoint.png";
                        }
                        // grayCircle
                    }
                    

                    const text = routeIcon.innerText;
                    routeIcon.innerText = '';

                    domStyle.set(routeIcon, "background", "transparent");
                    const img = domConstruct.create("img",{alt:"", src:imgSrc},routeIcon);

                    if(text.isNonEmpty()) {
                        const span = domConstruct.toDom("<span aria-hidden='true'>"+text+"</span>");
                        domConstruct.place(span, img, "after");
                    }
                } catch (ex) {
                    console.log(ex);
                }

            }));

            const summary = query('.esriResultsSummary', ev.target.domNode);
            if(summary && summary.length>0)
            {
                // domAttr.set(summary[0],'aria-live', 'polite');
                // domAttr.set(summary[0],'aria-atomic', 'true');
                domAttr.set(summary[0],'role', 'alert');
            }

            const esriImpedanceCost = query('.esriImpedanceCost', ev.target.domNode);
            if(esriImpedanceCost && esriImpedanceCost.length>0) {
                const htmin = esriImpedanceCost[0].innerText.split('\n')[0].split(':');
                domAttr.set(esriImpedanceCost[0],'aria-label', i18n.widgets.directionsWidget.hrmin.format(Number(htmin[0]), Number(htmin[1])));
            }

            const esriImpedanceCostHrMin = query('.esriImpedanceCostHrMin', ev.target.domNode);
            if(esriImpedanceCostHrMin && esriImpedanceCostHrMin.length>0) {
                domAttr.set(esriImpedanceCostHrMin[0],'aria-hidden', 'true');
            }

        }
    });

    if (has("extend-esri")) {
        lang.setObject("dijit.DirectionWidget", Widget, esriNS);
    }
    return Widget;
});
