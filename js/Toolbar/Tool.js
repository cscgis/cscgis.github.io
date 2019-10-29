define([
    "dojo/Evented", "dijit/_WidgetBase", "dijit/_TemplatedMixin", 
    "dojo/text!application/Toolbar/Templates/Tool.html",
    "application/Toolbar/ToolPage",
    "dojo/_base/declare", 
    "dojo/_base/lang", "dojo/has", "dojo/dom",
    "dojo/dom-class", "dojo/dom-style", "dojo/dom-attr", "dojo/dom-construct", 
    "dojo/on", "dojo/query", "dojo/Deferred"], function (
Evented, _WidgetBase, _TemplatedMixin, 
toolTemplate, ToolPage,
declare, lang, has, dom,
domClass, domStyle, domAttr, domConstruct, 
on, query, Deferred) {
    return declare("esri.dijit.Tool", [_WidgetBase, _TemplatedMixin, Evented], {
        options: {
            toolbar: null,
            loaderImg: ''
        },
        templateString: toolTemplate,

        constructor: function (options, srcRefNode) {
            this.deferrer = new Deferred();
            this.config = lang.mixin({}, this.options, options);
            this.toolbar = this.config.toolbar;

            //(tool, panelClass, loaderImg, badgeEvName) {
            this.name = this.config.name;
            this.id = "toolButton_" + this.name;
            this.icon = this.config.icon;
            this.tip = this.config.i18n.tooltips[this.name] || this.name;
            this.badgeImg = this.config.badgeImg;
            let badge = (this.badgeImg && this.badgeImg !== '') ? this.badgeImg : this.config.badgeEvName;
            if(badge && badge !== '') {
                badge = badge.includes('.') ? badge :"images/"+badge+".png";
            }
            this.badge = badge;
        },

        postCreate : function() {
            if(this.config.aditionalBadges) {
                this.config.aditionalBadges.forEach(lang.hitch(this, function(badge) {
                    domConstruct.create("img", {
                        src: badge.badgeImg,
                        className: "setIndicator",
                        style: "display:none;",
                        tabindex: 0,
                        id: "badge_"+badge.badgeEvName,
                        alt: badge.badgeTip,
                        title: badge.badgeTip,
                }, this.panelTool)
            }))}; 

            new ToolPage({
                name: this.name,
                deferrer: this.deferrer,
                pageTitle: this.config.i18n.tooltips[this.name] || this.name,
                loaderImg: this.config.loaderImg,
                toolbar: this.toolbar
            }, domConstruct.create("div", {}, dom.byId("panelPages"))).startup();
        },

        startup: function () {
            return this.deferrer.promise;
        },

        // IsToolSelected: function(name) {
        //     const page = dom.byId("page_"+this.name);
        //     if(!page) return false;
        //     const hidden = page.classList.contains("hideAttr");
        //     return !hidden;
        // },

        executeByKbd: lang.hitch(this, function(ev) {
            if(ev.keyCode === 13) {
                const input = dojo.query("input", ev.target);
                if(input) {
                    input[0].click();
                    ev.preventDefault();
                    ev.stopPropagation();
                }
            }
        }),

        execute: function (ev) {
            // console.log(ev);

            const defaultBtns = dojo.query(".panelToolDefault");
            let defaultBtn;
            if(defaultBtns !== undefined && defaultBtns.length > 0) {
                defaultBtn = defaultBtns[0].id.split("_")[1];
            }

            // this._updateMap(); // ! out of place
            let active = false;
            const page = dom.byId("page_"+this.name);
            const hidden = page.classList.contains("hideAttr");
            const pages = query(".page");
            pages.forEach(function(p){
                if(hidden && p === page) {
                    active = true;
                }
            });

            if(_gaq) _gaq.push(['_trackEvent', "Tool: '"+this.name+"'", 'selected']);

            pages.forEach(lang.hitch(this, function(p){
                if(hidden && p === page) {
                    domClass.replace(p, "showAttr","hideAttr");
                    this.config.toolbar.emit("updateTool", this.name);
                    this.config.toolbar.emit("updateTool_"+this.name);
                } else {
                    domClass.replace(p,"hideAttr","showAttr");
                }
            }));
            const tool = dom.byId("toolButton_"+this.name);
            const ptools = query(".panelTool");
            ptools.forEach(lang.hitch(this, function(t){
                if(active && t === tool) {
                    domClass.add(t, "panelToolActive");
                    // this.emit("updateTool_"+this.name);
                } else {
                    domClass.remove(t,"panelToolActive");
                }
            }));

            if(!active && defaultBtns !== undefined) {
                this.toolbar._activateDefautTool();
            }
        },
    });

    if (has("extend-esri")) {
        lang.setObject("dijit.Tool", Widget, esriNS);
    }
    return Widget;
});