define([
    "dojo/Evented", "dijit/_WidgetBase", "dijit/_TemplatedMixin", 
    "dojo/text!application/Toolbar/Templates/Toolbar.html",
    "application/Toolbar/Tool",
    "dojo/_base/declare", "dojo/_base/window",
    "dojo/_base/html", "dojo/_base/lang", "dojo/has", "dojo/dom",
    "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", "dojo/dom-geometry",
    "dojo/on", "dojo/mouse", "dojo/query", "dojo/Deferred"], function (
Evented, _WidgetBase, _TemplatedMixin, 
toolbarTemplate, Tool,
declare, win, html, lang, has, dom,
domClass, domStyle, domAttr, domConstruct, domGeometry,
on, mouse, query, Deferred) {
    return declare("esri.dijit.Toolbar", [_WidgetBase, _TemplatedMixin, Evented], {

        options : {
            map: null,
        },

        templateString: toolbarTemplate,

        constructor: function (options, srcRefNode) {
            this.config = lang.mixin({}, this.options, options);
            this.map = this.config.map;
            this.domNode = srcRefNode;
        },

        startup: function () {
            const deferred = this._init();
            deferred.then(
                lang.hitch(this, function (config) {
                    // optional ready event to listen to
                    this.emit("ready", config);
                }),
                lang.hitch(this, function (error) {
                    // optional error event to listen to
                    this.emit("error", error);
                })
            );
            domAttr.remove(this.domNode, 'title'); // ?!
            return deferred;
        },

        _init: function () {
            //Don't need deferred now setting it up just in case
            const deferred = new Deferred();
            on(window, "scroll", lang.hitch(this, this._windowScrolled));
            on(window, "resize", lang.hitch(this, this._windowScrolled));
            // this.pTools = dom.byId("panelTools");

            this.pPages = dom.byId("panelPages");
            //Prevent body scroll when scrolling to the end of the panel content
            on(this.pPages, mouse.enter, lang.hitch(this, function () {

                if (this._hasScrollbar()) {
                    var p = dom.byId("panelPages");
                    if (p) {
                        domClass.add(p, "modal-scrollbar");
                    }
                }
                domStyle.set(win.body(), "overflow", "hidden");

            }));
            on(this.pPages, mouse.leave, lang.hitch(this, function () {
                if (this._hasScrollbar === false) {
                    var p = dom.byId("panelPages");
                    if (p) {
                        domClass.remove(p, "modal-scrollbar");
                    }
                    domStyle.set(win.body(), "overflow-y", "auto");
                }


            }));
            deferred.resolve();

            return deferred.promise;
        },

        _hasScrollbar: function () {
            // The Modern solution
            if (typeof window.innerWidth === 'number') return window.innerWidth > document.documentElement.clientWidth;

            // rootElem for quirksmode
            var rootElem = document.documentElement || document.body;

            // Check overflow style property on body for fauxscrollbars
            var overflowStyle;

            if (typeof rootElem.currentStyle !== 'undefined') overflowStyle = rootElem.currentStyle.overflow;

            overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;

            // Also need to check the Y axis overflow
            var overflowYStyle;

            if (typeof rootElem.currentStyle !== 'undefined') overflowYStyle = rootElem.currentStyle.overflowY;

            overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;

            var contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
            var overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
            var alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

            return (contentOverflows && overflowShown) || (alwaysShowScroll);
        },

        //Create a tool and return the div where you can place content
        createTool: function (tool,  config) {
            const _tool = new Tool(lang.mixin({}, {
                panelClass: "", 
                loaderImg: "", 
                badgeEvName: "",
                badgeImg: "",
                badgeTip: "",
                aditionalBadges: null,
                name: tool.name,
                icon: "images/icons_" + this.config.icons + "/" + tool.name + ".png",
                toolbar: config.toolbar,
                i18n: this.config.i18n,
            }, config), domConstruct.create("div", {}, dom.byId("panelTools")));

            return _tool.startup();
        },

        OpenTool: function(name) {
            const page = dom.byId("page_"+name);
            const hidden = page.classList.contains("hideAttr");
            if(!hidden) return;
            const btn = dom.byId('toolButton_'+name);
            this._toolClick(name);
        },

        IsToolSelected: function(name) {
            const page = dom.byId("page_"+name);
            if(!page) return false;
            const hidden = page.classList.contains("hideAttr");
            return !hidden;
        },

        _toolKeyPress: function(ev) {
            const target = ev.target;
            if(ev.keyCode===13) {
                const input = dojo.query("input", target);
                if(input) {
                    input[0].click();
                }
            }
        },

        _toolClick: function (name) {

            var defaultBtns = dojo.query(".panelToolDefault");
            var defaultBtn;
            if(defaultBtns !== undefined && defaultBtns.length > 0) {
                defaultBtn = defaultBtns[0].id.split("_")[1];
            }

            this._updateMap(); // ! out of place
            var active = false;
            var page = dom.byId("page_"+name);
            var hidden = page.classList.contains("hideAttr");
            var pages = query(".page");
            pages.forEach(function(p){
                if(hidden && p === page) {
                    active = true;
                }
            });

            if(_gaq) _gaq.push(['_trackEvent', "Tool: '"+name+"'", 'selected']);

            pages.forEach(lang.hitch(this, function(p){
                if(hidden && p === page) {
                    domClass.replace(p, "showAttr","hideAttr");
                    this.emit("updateTool", name);
                    this.emit("updateTool_"+name);
                } else {
                    domClass.replace(p,"hideAttr","showAttr");
                }
            }));
            var tool = dom.byId("toolButton_"+name);
            var tools = query(".panelTool");
            tools.forEach(lang.hitch(this, function(t){
                if(active && t === tool) {
                    domClass.add(t, "panelToolActive");
                    // this.emit("updateTool_"+name);
                } else {
                    domClass.remove(t,"panelToolActive");
                }
            }));

            if(!active && defaultBtns !== undefined) {
                this._activateDefautTool();
            }
        },

        _atachEnterKey: function(onButton, clickButton) {
            on(onButton, 'keydown', lang.hitch(clickButton, function(event){
            if(event.keyCode=='13')
                this.click();
            }));
        },

        _updateMap: function () {
            if (this.map) {
                this.map.resize();
                this.map.reposition();
            }
        },

       _activateDefautTool: function() {
            var defaultBtns = dojo.query(".panelToolDefault");
            var defaultBtn;
            if(defaultBtns !== undefined && defaultBtns.length>0) {
                defaultBtn = defaultBtns[0].id.split("_")[1];
            }
            if(defaultBtn !== undefined) {
                this._toolClick(defaultBtn);
            }
        },

        closePage: function() {

        },

        showBadge: function(toolName){
            domStyle.set(dom.byId('badge_'+toolName),'display','');
        },

        hideBadge: function(toolName){
            domStyle.set(dom.byId('badge_'+toolName),'display','none');
        },

        showLoading: function(toolName) {
            domClass.replace(dom.byId('loading_'+toolName), "hideLoading", "showLoading");
        },

        hideLoading: function(toolName) {
            domClass.replace(dom.byId('loading_'+toolName), "showLoading", "hideLoading");
        },

    });
    if (has("extend-esri")) {
        lang.setObject("dijit.Toolbar", Widget, esriNS);
    }
    return Widget;
});
