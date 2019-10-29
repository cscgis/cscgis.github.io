define([
    "dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dojo/dom","esri/kernel",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/on", "dojo/Deferred",
    "dojo/query", "dijit/registry",
    "esri/toolbars/navigation", 
    "esri/dijit/HomeButton", "esri/dijit/LocateButton",
    "esri/symbols/SimpleLineSymbol", "esri/Color",
    "dojo/text!application/NavToolBar/Templates/NavToolBar.html",
    "dojo/i18n!application/nls/NavToolBar",
    "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style",
    "dojo/dom-construct", "dojo/_base/event",
    "dojo/NodeList-dom", "dojo/NodeList-traverse"

    ], function (
        Evented, declare, lang, has, dom, esriNS,
        _WidgetBase, _TemplatedMixin, on, Deferred,
        query, registry,
        Navigation, 
        HomeButton, LocateButton,
        SimpleLineSymbol, Color,
        NavToolBarTemplate, i18n,
        domClass, domAttr, domStyle,
        domConstruct, event
    ) {
    var Widget = declare("esri.dijit.NavToolBar", [_WidgetBase, _TemplatedMixin, Evented], {
        templateString: NavToolBarTemplate,

        options: {
            map: null,
            navToolBar: null,
            iconColor: "white",
            newIcons: '',
            zoomColor: 'red',
            deferred: null
        },

        constructor: function (options, srcRefNode) {
            var defaults = lang.mixin({}, this.options, options);
            this._i18n = i18n;
            this.domNode = srcRefNode;

            this.set("map", defaults.map);
            this.set("navToolBar", defaults.navToolBar);
            this.set("nav", new Navigation(this.map));
            this.set("iconColor", defaults.iconColor);
            this.set("newIcons", defaults.newIcons);
            this.set("zoomColor", defaults.zoomColor);
            this.dfr = defaults.deferred ? defaults.deferred : new Deferred();
        },

        startup: function () {
            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function () {
                    this._init();
                }));
            }
            return this.dfr.promise;
        },

        __init:false,

        _init: function () {
            if(this.__init) return;

            this.nav.setZoomSymbol(new SimpleLineSymbol("SOLID", new Color(this.zoomColor), 4));

            dojo.empty(this.navToolBar);

            domConstruct.place(this.domNode, this.navToolBar);

            on(dom.byId("navZoomIn"), "click", lang.hitch(this, function(e) {
                this.map.setLevel(this.map.getLevel()+1);
            }));

            on(dom.byId("navZoomOut"), "click", lang.hitch(this, function(e) {
                this.map.setLevel(this.map.getLevel()-1);
            }));

            if(has("home")) {
                var home = new HomeButton({
                    map: this.map
                }, domConstruct.create("div",{},dom.byId("navHome")));
                home.startup();

                var homeButton = dojo.query(".homeContainer")[0];
                var homen = dojo.query(".homeContainer .home")[0];
                dojo.removeAttr(homen, 'role');
                var homeNode = dojo.query(".home")[0];
                dojo.empty(homeNode);
                var homeHint = i18n.widgets.navToolBar.home;

                var btnHome = domConstruct.create("input", {
                    type: 'image',
                    src: 'images/icons_'+this.iconColor+'/home.png',
                    alt: homeHint,
                    title: homeHint,
                }, homeNode);
            } else {
                dojo.destroy("navHome");
            }

            // var isLocationEnabled = //!(!!window.chrome && !!window.chrome.webstore) ||
            //     (window.location.protocol === "https:") ||
            //     (window.location.hostname === "localhost");
            if (has("locate")) {// && isLocationEnabled) {
                var geoLocate = new LocateButton({
                    map: this.map
                }, domConstruct.create("div",{},dom.byId("navLocate")));
                geoLocate.startup();

                var locateButton = dojo.query(".locateContainer")[0];
                var zoomLocateButton = dojo.query(".zoomLocateButton")[0];
                //dojo.removeAttr(zoomLocateButton, 'title');
                var locateHint = dojo.attr(zoomLocateButton, 'title');
                dojo.removeAttr(zoomLocateButton, 'role');

                dojo.empty(zoomLocateButton);

                domConstruct.create("input", {
                    type: 'image',
                    src: 'images/icons_white/locate.png',
                    alt: locateHint,
                    title: locateHint,
                }, zoomLocateButton);
            } else {
                dojo.destroy("navLocate");
            }

            if(has("navigation")) {
                on(dom.byId("navPrev"), "click", lang.hitch(this, function(e) {
                    this.nav.zoomToPrevExtent();
                }));

                on(dom.byId("navNext"), "click", lang.hitch(this, function(e) {
                    this.nav.zoomToNextExtent();
                }));

                on(dom.byId("navZoomInTool"), "click", lang.hitch(this, function(e) {
                    this.map.setMapCursor("url(images/ZoomIn.cur),auto");
                    this.nav.activate("zoomin");
                }));

                on(dom.byId("navZoomOutTool"), "click", lang.hitch(this, function(e) {
                    this.map.setMapCursor("url(images/ZoomOut.cur),auto");
                    this.nav.activate("zoomout");
                }));

                on(dom.byId("extenderNavLabel"), "keypress", lang.hitch(this, function(e) {
                    if(e.key === " " || e.char === " ") {
                        e.target.click();
                    }
                }));

                on(dom.byId("extenderNavCheckbox"), "change", lang.hitch(this, function(e) {
                    var ck = e.target.checked;

                    if(_gaq) _gaq.push(['_trackEvent', "Extended Navigator Bar", e.target.checked ? 'Expand' : 'Collapse']);

                    dojo.setStyle(dom.byId("extendedTools"), "display", ck?"":"none");
                    this.nav.deactivate();
                    this.map.setMapCursor("default");
                }));

            } else {
                dojo.destroy("navPrevNext");
                dojo.destroy("ZoomTools");
                dojo.destroy("extenderNav");
                dojo.setStyle(dom.byId("extendedTools"), "display", "");
            }

            this.nav.on("extent-history-change", lang.hitch(this, function () {
                var zoom = this.map.getZoom();
                this.tryDisableBtn("navZoomIn", zoom == this.map.getMaxZoom());
                this.tryDisableBtn("navZoomOut", zoom == this.map.getMinZoom());
                this.tryDisableBtn("navHome", window.initExt === this.map.extent);
                if(has("navigation")) {
                    this.tryDisableBtn("navPrev",this.nav.isFirstExtent());
                    this.tryDisableBtn("navNext",this.nav.isLastExtent());
                    this.nav.deactivate();
                    this.map.setMapCursor("default");
                }
            }));

            this.__init = true;
            this.dfr.resolve(true);
        },

        tryDisableBtn:function(id, disable) {
            var div = query("#"+id)[0];
            var btn = query("input", div)[0];
            var dis = query(".disabledBtn", div)[0];
            var crs = disable ? "not-allowed": "pointer";
            dojo.setStyle(btn, "cursor", crs);
            dojo.setStyle(div, "cursor", crs);
            dojo.setStyle(dis, "cursor", crs);
            dojo.setAttr(btn, "tabIndex", disable?-1:0);
            dojo.setStyle(dis, "display", disable?null:"none");
            dojo.setAttr(btn, "aria-hidden", disable?"true":"false");
            return disable;
        },

        blurAll: function(text) {
            if(text===undefined)
                text='';
            var tmp = domConstruct.create("div", {tabindex:0, 'aria-label':text}, document.body);
            tmp.focus();
            document.body.removeChild(tmp);
        }

    });

    if (has("extend-esri")) {
        lang.setObject("dijit.NavToolBar", Widget, esriNS);
    }
    return Widget;
});
