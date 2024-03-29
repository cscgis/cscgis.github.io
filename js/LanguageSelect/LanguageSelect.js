define([
    "dojo/Evented", "dojo/_base/declare", "dojo/_base/lang", "dojo/has", "dojo/dom","esri/kernel",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/on",
    "dojo/query", "dijit/registry",
    "dojo/text!application/LanguageSelect/Templates/LanguageSelect.html",
    "dojo/i18n!application/nls/LanguageSelect",
    "dijit/form/DropDownButton", "dijit/DropDownMenu", "dijit/MenuItem",
    "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style",
    "dojo/dom-construct", "dojo/_base/event", "esri/lang",
    "dojo/NodeList-dom", "dojo/NodeList-traverse"

    ], function (
        Evented, declare, _lang, has, dom, esriNS,
        _WidgetBase, _TemplatedMixin, on,
        query, registry,
        LanguageSelectTemplate, i18n,
        DropDownButton, DropDownMenu, MenuItem,
        domClass, domAttr, domStyle,
        domConstruct, event, esriLang
    ) {
    var Widget = declare("esri.dijit.LanguageSelect", [_WidgetBase, _TemplatedMixin, Evented], {
        templateString: LanguageSelectTemplate,

        options: {
            locale: 'en-us',
            languages:{},
            textColor:null,
            showLabel:true
        },

        constructor: function (options, srcRefNode) {
            this.defaults = _lang.mixin({}, this.options, options);
            //this._i18n = i18n;
            this.domNode = srcRefNode;

            var link = document.createElement("link");
            link.href = "js/LanguageSelect/Templates/LanguageSelect.css";
            link.type = "text/css";
            link.rel = "stylesheet";
            query('head')[0].appendChild(link);
        },

        Click: function(e) {
            //console.log(e.target.parentElement);
            const menuItemDataSet = query(e.target).closest('.dijitMenuItem')[0].dataset;
            const docLocale = query('html')[0].lang;
            let locale = menuItemDataSet.code;
            if(!locale || locale==='' || locale === "undefined" || locale === undefined)
            {
                locale = navigator.language;
            }
            locale = locale.toLowerCase();

            if(docLocale.toLowerCase() === locale) return;

            const urlParams = new URLSearchParams(window.location.search);

            let appId = menuItemDataSet.appid;
            if(!appId || appId==='' || appId === "undefined" || appId === undefined) {
                appId = urlParams.get('appid');
                // appId = /(?:[?|&]appid=)([a-z0-9]*)/gi.exec(window.location.search);
                // if(appId && appId.length===2) {
                //     appId = appId[1];
                // }
            }

            let opt = '';
            if(urlParams.has('cache')) {
                opt += '&cache';

                const cacheVal = urlParams.get('cache');
                if(cacheVal) {
                    opt+= '='+cacheVal;
                }
            }
            // if(urlParams.has('reload')) {
            //     opt += '&reload';
            // }
            // if(urlParams.has('unregister')) {
            //     opt += '&unregister';
            // }

            window.location.search=('?appid='+appId+'&locale='+locale + opt);
        },

        startup: function () {
            if(this.button) return;

            var menu = new DropDownMenu({
                style: "display: none;",
                //id: 'languageMenu',
            });
            var currentLocale = this.defaults.locale.substring(0,2).toUpperCase();
            var currentIcon = null;
            var currentLanguage = null;

            for(var i = 0; i<this.defaults.languages.length; i++)
            {
                var lang = this.defaults.languages[i];
                if(!lang.code || lang.code==='') continue;

                var menuItem = new MenuItem({
                    label: lang.name,
                    'data-code': lang.code,
                    'data-appid': lang.appId,
                });
                on(menuItem, 'click', this.Click);

                if(lang.img && lang.img !== '') {
                    var iconCell = query(".dijitMenuItemIconCell",menuItem.domNode)[0];
                    domConstruct.create("img",{
                        src:lang.img,
                        alt: esriLang.stripTags(i18n.widgets.languageSelect.flag.replace("_",lang.name)),
                        class: 'langMenuItemIcon',
                    }, iconCell);
                }

                var langHint = i18n.widgets.languageSelect.aria.changeLanguage+" "+lang.name;
                dojo.attr(menuItem.domNode,'aria-label', esriLang.stripTags(langHint));
                dojo.attr(menuItem.domNode,'title', esriLang.stripTags(langHint));
                dojo.attr(menuItem.domNode,'data-code', lang.code);
                dojo.attr(menuItem.domNode,'data-appid', lang.appId);
                menu.addChild(menuItem);

                if(lang.code.substring(0,2).toLowerCase() === this.defaults.locale.substring(0,2).toLowerCase()) {
                    document.documentElement.lang = lang.code.toLowerCase();
                    if(lang.img && lang.img !== '') {
                        currentIcon = domConstruct.create("img",{
                            src:lang.img,
                            alt: esriLang.stripTags(i18n.widgets.languageSelect.flag.replace("_",lang.name)),
                            class: 'langIcon',
                        });
                        if(lang.shortName && lang.shortName !== "") {
                            currentLocale = "";
                        }
                        currentLanguage = lang.name;
                    }
                }
            }

            menu.startup();

            let currentHint = i18n.widgets.languageSelect.aria.currentLanguage+" "+(currentLanguage ? currentLanguage : document.documentElement.lang);
            let btnLbl = this.defaults.showLabel ? i18n.widgets.languageSelect.language : "";
            if(!currentIcon) {
                let shortName = document.documentElement.lang.substring(0,2).toUpperCase();
                let languages = this.defaults.languages.filter(function(l) {return l.shortName == shortName;});
                let langName = 'English';
                if(languages && languages.length>0) {
                    langName = languages[0].name;
                    langName = langName.replace(/<.*?>/g, '');
                }
                btnLbl += ' <span aria-label="'+langName+'" style="font-weight:bold;">'+shortName+'</span>';
            }
            if(this.defaults.textColor) {
                btnLbl = '<span style="color:'+this.defaults.textColor+';">'+btnLbl+'</span>';
            }

            this.button = new DropDownButton({
                label: btnLbl,
                title: currentHint,
                dropDown: menu,
                id: 'languageButton',
                role: 'application',
            });
            this.button.startup();

            if(currentIcon) {
                dojo.removeClass(this.button.iconNode, "dijitNoIcon");
                dojo.place(currentIcon, query(this.button._buttonNode).query(".dijitReset").query(".dijitArrowButtonChar")[0], "after");
                dojo.attr(this.button.iconNode,'aria-label', currentHint);
                dojo.attr(this.button.iconNode,'title', esriLang.stripTags(currentHint));
            }

            // if(this.defaults.showLabel) {
            //     domConstruct.create("label", {
            //         for: 'languageButton',
            //         innerHTML: i18n.widgets.languageSelect.language,
            //         title: i18n.widgets.languageSelect.changeHere,
            //         'aria-label': i18n.widgets.languageSelect.changeHere,
            //         tabindex: -1
            //     }, this.domNode);
            // }

            this.domNode.appendChild(this.button.domNode);

            query('.dijitMenuTable').forEach(function(table){
                dojo.attr(table, "role", "presentation");
            });

            query('.dijitPopup').forEach(function(table){
                dojo.attr(table, "role", "menu");
            });
        }
    });

    if (has("extend-esri")) {
        _lang.setObject("dijit.LanguageSelect", Widget, esriNS);
    }
    return Widget;
});
