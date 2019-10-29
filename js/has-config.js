
/*This module defines feature tests for Basic Viewer features and
organizes all the conditional checking we have to do for the template in one place.
https://dojotoolkit.org/documentation/tutorials/1.8/device_optimized_builds/
http://dante.dojotoolkit.org/hasjs/tests/runTests.html*/

define(["dojo/has"], function (has) {
'use strict';
    const getTool = function (name, config) {
        let tool = false;
        for (let i = 0; i < config.tools.length; i++) {
            if (config.tools[i].name === name) {
                tool = config.tools[i].enabled;
                break;
            }
        }
        return tool;
    };

    /*App capabilities*/
    has.add("navigation", function (g) {
        var navigation = getTool("navigation", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("navigation")) {
            navigation = g.config.navigation;
        }
        return navigation;
    });
    has.add("search", function (g) {
        var search = g.config.search || false;
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_search")) {
            search = g.config.tool_search;
        }
        return search;
    }); /*Toolbar tools*/
    has.add("basemap", function (g) {
        var basemap = getTool("basemap", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_basemap")) {
            basemap = g.config.tool_basemap;
        }
        return basemap;
    });
    has.add("directions", function (g) {
        // https://developers.arcgis.com/javascript/3/jssamples/widget_directions_basic.html
        var directions = getTool("directions", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_directions")) {
            directions = g.config.tool_directions;
        }
        return directions;
    });
    has.add("bookmarks", function (g) {
        var bookmarks = getTool("bookmarks", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_bookmarks")) {
            bookmarks = g.config.tool_bookmarks;
        }
        return bookmarks;
    });
    has.add("details", function (g) {
        var details = getTool("details", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_details")) {
            details = g.config.tool_details;
        }
        return details;
    });
    has.add("edit", function (g) {
        var edit = getTool("edit", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_edit")) {
            edit = g.config.tool_edit;
        }
        return edit;
    });
    has.add("edit-toolbar", function (g) {
        let toolbar = false;

        for (let i = 0; i < g.config.tools.length; i++) {
            if (g.config.tools[i].name === "edit") {
                toolbar = g.config.tools[i].toolbar;
                break;
            }
        }
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_edit_toolbar")) {
            toolbar = g.config.tool_edit_toolbar;
        }
        return toolbar;
    });
    has.add("scalebar", function (g) {
        var scalebar = g.config.scalebar || false;
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("scalebar")) {
            scalebar = g.config.scalebar;
        }
        return scalebar;
    });
    has.add("home", function (g) {
        var home = g.config.home || false;
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_home")) {
            home = g.config.tool_home;
        }
        return home;
    });
    has.add("features", function (g) {
        var features = getTool("features", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_features")) {
            features = g.config.tool_features;
        }
        return features;
    });
    has.add("infoPanel", function (g) {
        var infoPanel = getTool("infoPanel", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_infoPanel")) {
            infoPanel = g.config.tool_infoPanel;
        }
        return infoPanel;
    });
    has.add("geoCoding", function (g) {
        var geoCoding = getTool("geoCoding", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_GeoCoding")) {
            geoCoding = g.config.tool_GeoCoding;
        }
        return geoCoding;
    });
    has.add("mapKeyboardNavigation", function (g) {
        var mapKeyboardNavigation = g.config.tool_mapKeyboardNavigation || false;
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_mapKeyboardNavigation")) {
            mapKeyboardNavigation = g.config.tool_mapKeyboardNavigation;
        }
        return mapKeyboardNavigation;
    });
    has.add("filter", function (g) {
        var filter = getTool("filter", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_filter")) {
            filter = g.config.tool_filter;
        }
        return filter;
    });
    has.add("layerManager", function (g) {
        var layerManager = getTool("layerManager", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_layerManager")) {
            layerManager = g.config.tool_layerManager;
        }
        return layerManager;
    });

    has.add("layers", function (g) {
        var layers = getTool("layers", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_layers")) {
            layers = g.config.tool_layers;
        }
        return layers;
    });
    has.add("featureTable", function (g) {
        var featureTable = getTool("featureTable", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_featureTable")) {
            featureTable = g.config.tool_featureTable;
        }
        return featureTable;
    });
    has.add("instructions", function (g) {
        var instructions = getTool("instructions", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_instructions")) {
            instructions = g.config.tool_instructions;
        }
        return instructions;
    });

    has.add("legend", function (g) {
        var legend = getTool("legend", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_legend")) {
            legend = g.config.tool_legend;
        }
        return legend;
    });

    has.add("locate", function (g) {
        var location = has("native-gelocation");
        if (location) {
            location = g.config.locate || false;
            if (g.config.hasOwnProperty("tool_locate")) {
                location = g.config.tool_locate;
            }
        }
        return location;
    });


    has.add("measure", function (g) {
        var measure = getTool("measure", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_measure")) {
            measure = g.config.tool_measure;
        }
        return measure;
    });
    has.add("overview", function (g) {
        var overview = getTool("overview", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_overview")) {
            overview = g.config.tool_overview;
        }
        return overview;
    });
    has.add("print", function (g) {
        var print = getTool("print", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_print")) {
            print = g.config.tool_print;
        }
        if (print) {
            //is there a print service defined? If not set print to false
            if (g.config.helperServices.printTask.url === null) {
                print = false;
            }
        }

        return print;
    });

    has.add("print-legend", function (g) {
        let printLegend = false;
        for (let i = 0; i < g.config.tools.length; i++) {
            if (g.config.tools[i].name === "print") {
                printLegend = g.config.tools[i].legend;
                break;
            }
        }
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_print_legend")) {
            printLegend = g.config.tool_print_legend;
        }
        return printLegend;
    });

    has.add("print-layouts", function (g) {
        let printLayouts = false;

        for (let i = 0; i < g.config.tools.length; i++) {
            if (g.config.tools[i].name === "print") {
                printLayouts = g.config.tools[i].layouts;
                break;
            }
        }
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_print_layouts")) {
            printLayouts = g.config.tool_print_layouts;
        }
        return printLayouts;
    });



    has.add("share", function (g) {
        var share = getTool("share", g.config);
        //overwrite the default with app settings
        if (g.config.hasOwnProperty("tool_share")) {
            share = g.config.tool_share;
        }
        return share;
    });

    /*Geolocation Feature Detection*/
    has.add("native-gelocation", function (g) {
        return has("native-navigator") && ("geolocation" in g.navigator);
    });
    has.add("native-navigator", function (g) {
        return ("navigator" in g);
    });


    return has;
});
