define(["dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "esri/kernel",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/registry",
    "dojo/on",
    "dojo/Deferred", "dojo/query",
    "dojo/text!application/PopupInfo/Templates/PopupInfoHeader.html",
    "dojo/dom", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style", "dojo/dom-construct", "dojo/_base/event",
    "dojo/parser", "dojo/ready",
    "dijit/layout/ContentPane",
    "dojo/string",
    "dojo/i18n!application/nls/PopupInfo",
    "esri/domUtils",
    "esri/dijit/Popup",
    // "application/ImageToggleButton/ImageToggleButton",
    "dojo/NodeList-dom", "dojo/NodeList-traverse"

    ], function (
        Evented, declare, lang, has, esriNS,
        _WidgetBase, _TemplatedMixin, registry,
        on,
        Deferred, query,
        PopupInfoHeaderTemplate,
        dom, domClass, domAttr, domStyle, domConstruct, event,
        parser, ready,
        ContentPane,
        string,
        i18n,
        domUtils,
        Popup// , ImageToggleButton
    ) {

    // ready(function(){
    //     // Call the parser manually so it runs after our widget is defined, and page has finished loading
    //     parser.parse();
    // });

    var Widget = declare("esri.dijit.PopupInfoHeader", [_WidgetBase, _TemplatedMixin, Evented], {
        // templateString: PopupInfoHeaderTemplate,

        options: {
            map: null,
            toolbar: null,
            header: 'pageHeader_infoPanel',
            id: 'popupInfoHeadrId',
            popupInfo: null,
            superNavigator: null,
            template: PopupInfoHeaderTemplate,
            emptyMessage: 'empty',
            iconsColor: 'black',
        },

        constructor: function (options, srcRefNode) {
            var defaults = lang.mixin({}, this.options, options);
            this.domNode = srcRefNode;
            this.widgetsInTemplate = true;

            this.map = defaults.map;
            this.toolbar = defaults.toolbar;
            this.templateString = defaults.template;
            this.popupHeaderId = defaults.id;
            this._i18n = i18n;
            this.headerNode = dom.byId(defaults.header);
            this.popupInfo = defaults.popupInfo;
            this.emptyMessage = defaults.emptyMessage;
            this.iconsColor = defaults.iconsColor;
        },

        startup: function () {
            if (!this.map || !this.toolbar) {
                this.destroy();
                console.log("PopupInfo: map or toolbar required");
            }
            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function () {
                    this._init();
                }));
            }
        },

//https://developers.arcgis.com/javascript/3/sandbox/sandbox.html?sample=popup_sidepanel

        total:0,

        // toggleGeoCoding:function(e) {
        //     if(e.type === 'keyup' && !(e.key === ' ' || e.key === 'Spacebar') && e.key !== 'Enter') return;
        //     var cb = dom.byId('popupGeoCoding_cb');
        //     this.GeoCodingEnabled = cb.checked=!cb.checked;
        //     var img1 = dom.byId('geoCodingDisableBtn');
        //     var img2 = dom.byId('geoCodingEnableBtn');
        //     if(this.GeoCodingEnabled)
        //     {
        //        dojo.removeClass(img2, 'geoCodingUnselected');
        //        dojo.addClass(img1, 'geoCodingUnselected');
        //        img2.focus();
        //     } else {
        //        dojo.removeClass(img1, 'geoCodingUnselected');
        //        dojo.addClass(img2, 'geoCodingUnselected');
        //        img1.focus();
        //     }
        // },

        _init: function () {

            this.loaded = true;

            var popup = this.map.infoWindow;

            on(query('#'+this.popupHeaderId+' .popupInfoButton.prev')[0], 'click', lang.hitch(this, this.selectPrevious));
            on(query('#'+this.popupHeaderId+' .popupInfoButton.next')[0], 'click', lang.hitch(this, this.selectNext));
            on(query('#'+this.popupHeaderId+' .popupInfoButton.zoom')[0], 'click', lang.hitch(this, this.zoomTo));
            on(query('#'+this.popupHeaderId+' .popupInfoButton.map')[0], 'click', lang.hitch(this, this.toMap));
            on(query('#'+this.popupHeaderId+' .popupInfoButton.clear')[0], 'click', lang.hitch(this, this.clearFeatures));

            var buttons = query(".popupInfoButton");
            buttons.forEach(lang.hitch(this, function (btn) {
                on(btn,'keydown', lang.hitch(this, function(ev) {
                    switch(ev.keyCode) {
                        case 13:
                            btn.click();
                            ev.stopPropagation();
                            ev.preventDefault();
                            break;
                        case 37: // <
                            if(ev && ev.ctrlKey && this.map.infoWindow.count>1) {
                                this.map.infoWindow.selectedIndex = 1;
                            }
                            this.ToPrev();
                            ev.stopPropagation();
                            ev.preventDefault();
                            break;
                        case 39: // >
                            if(ev && ev.ctrlKey && this.map.infoWindow.count>2) {
                                this.map.infoWindow.selectedIndex = this.map.infoWindow.count - 2;
                            }
                            this.ToNext();
                            ev.stopPropagation();
                            ev.preventDefault();
                            break;
                        case 40: // down
                            dojo.byId("popupInfoContentWrapper").focus();
                            ev.stopPropagation();
                            ev.preventDefault();
                            break;
                        case 90: // Z
                            this.ToZoom();
                            ev.stopPropagation();
                            ev.preventDefault();
                            break;
                        case 77: // M
                        case 80: // P
                            this.ToMap();
                            ev.stopPropagation();
                            ev.preventDefault();
                            break;
                        case 88: // X
                        case 67: // C
                        case 69: // E
                            this.ToClear();
                            ev.stopPropagation();
                            ev.preventDefault();
                            break;
                    }
                }));
            }));

            on(popup, "SelectionChange", lang.hitch(this, function() {
                if(popup.selectedIndex>=0) {
                    this.setIndexOfTotal(popup.selectedIndex, this.total);
                }
            }));

            on(popup, "SetFeatures", lang.hitch(this, function() {
                if(popup.features && popup.features.length > 0) {
                    this.setTotal(popup.features.length);
                }
                else {
                    this.clearFeatures();
                }
            }));

            this.setTotal(-1);
        },

        setIndexOfTotal : function(index, total) {
            this._indexOfTotal.innerHTML = i18n.widgets.popupInfo.resultOf.format(index + 1, total);
        },

        pagerIsVisible : function() {
            return domStyle.get(dojo.byId('popupPager'),'display') !== 'none';
        },

        ToPrev: function() {
            if(!this.pagerIsVisible()) return;
            var _prev = query('#popupPager .popupInfoButton.prev')[0];
            _prev.focus();
            _prev.click();
        },

        ToNext:function() {
            if(!this.pagerIsVisible()) return;
            var _next = query('#popupPager .popupInfoButton.next')[0];
            _next.focus();
            _next.click();
        },

        ToZoom: function() {
            query('.popupInfoButton.zoom')[0].focus();
        },

        ToMap : function() {
            var _toMap = query('.popupInfoButton.map')[0];
            _toMap.focus();
            _toMap.click();
        },

        ToClear : function() {
            query('.popupInfoButton.clear')[0].focus();
        },

        setTotal : function(count) {
            if(this.toolbar.IsToolSelected('geoCoding')) return;

            this.total = count;

            const msgNode = dojo.byId("popupMessage");
            const ctrlNode = dojo.byId("popupControls");
            const pagerNode = dojo.byId("popupPager");

            domStyle.set(msgNode, 'display', (this.total <= 0 ? 'inline' : 'none'));
            domStyle.set(ctrlNode, 'display', (this.total > 0 ? 'inline' : 'none'));
            domStyle.set(pagerNode, 'display', (this.total > 1 ? 'inline' : 'none'));

            // this._totalFeatures.innerHTML = this.total;
            // this.setIndexOfTotal(this.map.infoWindow.selectedIndex + 1, this.total);

            // if(this.total===0) {
            //     popupInfo.clear();
            // }

            if(this.total > 0) {
                this.setIndexOfTotal(this.map.infoWindow.selectedIndex, this.total);
                query('#popupPager .popupInfoButton.next')[0].focus();
            }
        },

        selectPrevious : function (event) {
            if(event && event.ctrlKey) {
                this.map.infoWindow.select(0);
            }
            else {
                this.map.infoWindow.selectPrevious();
            }
            this.clearSuperNavigator();
        },

        selectNext : function (event) {
            if(event && event.ctrlKey) {
                this.map.infoWindow.select(this.map.infoWindow.count-1);
            } else {
                this.map.infoWindow.selectNext();
            }
            this.clearSuperNavigator();
        },

        clearFeatures : function(ev) {
            this.superNavigator.followTheMapMode(false);
            this.setTotal(0);
            this.popupInfo.clear();
        },

        toMap : function(ev) {
            this.map.container.focus();
            this.clearSuperNavigator();
       },

        zoomTo : function(ev) {
            this.panZoom(false);
            this.clearSuperNavigator();
        },

        panZoom: function(panOnly) {
            const popup = this.map.infoWindow;
            if(popup.selectedIndex<0) return;
            let geometry = popup.features[popup.selectedIndex].geometry;
            if(panOnly) {
                if (geometry.type !== "point") {
                    geometry = geometry.getExtent().getCenter();
                }
                this.map.centerAt(geometry);
            } else {
                if(geometry.type === "point") {
                    this.map.centerAndZoom(geometry, 13);
                } else {
                    var extent = geometry.getExtent().expand(1.5);
                    this.map.setExtent(extent);
                }
            }
        },

        clearSuperNavigator: function() {
            if(this.superNavigator)
                this.superNavigator.clearZone();
        },


    });
    if (has("extend-esri")) {
        lang.setObject("dijit.PopupInfoHeader", Widget, esriNS);
    }
    return Widget;
});
