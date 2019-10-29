{
   "configurationSettings": [
      {
         "category": "<strong>Configure template</strong>",
         "fields": [
            {
               "type": "webmap"
            },
            {
               "type": "string",
               "stringFieldOption": "richtext",
               "label": "<strong>Alternate Map Text</strong>",
               "tooltip": "Define text that will be read by screen reader",
               "fieldName": "altMapText"
            },
            {
               "type": "paragraph",
               "value": "The primary purpose of alternative map text is to be read by screen readers to allow the content and function of the map to be accessible to users with visual or certain cognitive disabilities."
            },
            {
               "label": "<strong>Description</strong>",
               "type": "string",
               "fieldName": "description",
               "placeHolder": "Defaults to web map description.",
               "stringFieldOption": "richtext"
            },
            {
               "type": "paragraph",
               "value": "When present, this markup will replace the map description in the Details panel."
            },
            {
               "label": "<strong>Title:</strong>",
               "placeHolder": "Defaults to web map title",
               "fieldName": "title",
               "type": "string",
               "tooltip": "Defaults to web map title"
            },
            {
               "label": "<strong>More Help URL:</strong>",
               "placeHolder": "Add more help to Instructions",
               "fieldName": "moreHelpURL",
               "type": "string",
               "tooltip": "Opens in a separate page if defined"
            },
            {
               "type": "string",
               "stringFieldOption": "textarea",
               "label": "<strong>Alternate Splash-Screen Text:</strong>",
               "fieldName": "alternateSplashText",
               "tooltip": "Alternate text for the splash screen when not null."
            },
            {
               "label": "<strong>Logo Image:</strong>",
               "fieldName": "logo",
               "type": "string",
               "tooltip": "Defaults to sample logo"
            },
            {
               "label": "<strong>Logo Alternate Text:</strong>",
               "fieldName": "logoAltText",
               "type": "string",
               "tooltip": "Type here the text from the Logo Image"
            },
            {
               "label": "<strong>Contact Us page URL:</strong>",
               "fieldName": "contactUsURL",
               "type": "string",
               "tooltip": "Contact Us URL link to external application"
            },
            {
               "label": "<strong>Feature Marker File:</strong>",
               "fieldName": "marker",
               "placeHolder": "images/ripple-dot1.gif",
               "type": "string",
               "tooltip": "Defaults to blue-animated"
            },
            {
               "label": "<strong>Feature Marker size:</strong>",
               "fieldName": "marker_size",
               "placeHolder": "35",
               "type": "int",
               "tooltip": "Size of the Marker"
            },
            {
               "label": "<strong>Access Keys</strong>",
               "fieldName": "alt_keys",
               "type": "boolean",
               "tooltip": "Show hints for alternate keys when pressing ALT key."
            },
            {
               "type": "paragraph",
               "value": "The Access Key is a shortcut to activate or focus a screen control. <br/>The way of accessing the shortcut key is varying in different browsers.<br/>Most browsers use the [Alt]+# or [Alt][Shift]+#.<br/>However the shortcut can be set to another combination of keys."
            },
            {
               "label": "<strong>New Icons</strong>",
               "type": "boolean",
               "fieldName": "new_icons"
            },
            {
               "type": "paragraph",
               "value": "New Icons refer to map's zoom-in and zoom-out buttons."
            }
         ]
      },
      {
         "category": "<strong>Colors</strong>",
         "fields": [
            {
               "label": "Theme Color:",
               "type": "color",
               "fieldName": "theme",
               "tooltip": "Title bar color"
            },
            {
               "label": "Title Color:",
               "type": "color",
               "fieldName": "color",
               "tooltip": "Title bar text color"
            },
            {
               "label": "Hover Color:",
               "type": "color",
               "fieldName": "hoverColor",
               "tooltip": "Hover over color"
            },
            {
               "label": "Focus Color:",
               "type": "color",
               "fieldName": "focusColor",
               "tooltip": "Focus border color"
            },
            {
               "label": "Active Color:",
               "type": "color",
               "fieldName": "activeColor",
               "tooltip": "Selection color"
            },
            {
               "label": "Map Selection Color:",
               "type": "color",
               "fieldName": "mapSelectionColor",
               "tooltip": "Map Info Popup Selection color"
            },
            {
               "label": "Geolocator Label Color:",
               "type": "color",
               "fieldName": "geolocatorLabelColor",
               "tooltip": "Color for Map Label when Geolocator is used in Info Panel."
            },
            {
               "label": "Icons color:",
               "type": "string",
               "fieldName": "icons",
               "tooltip": "Icons color",
               "options": [
                  {
                     "label": "White",
                     "value": "white"
                  },
                  {
                     "label": "Black",
                     "value": "black"
                  }
               ]
            }
         ]
      },
      {
         "category": "Tools",
         "fields": [
            {
               "label": "<b>Details</b>",
               "type": "boolean",
               "fieldName": "tool_details"
            },
            {
               "label": "<i>Instructions</i>",
               "type": "boolean",
               "fieldName": "tool_instructions"
            },
            {
               "label": "<b>Overview Map</b>",
               "type": "boolean",
               "fieldName": "tool_overview"
            },
            {
               "label": "<b>Basemap Gallery</b>",
               "type": "boolean",
               "fieldName": "tool_basemap"
            },
            {
               "label": "<b>Bookmarks</b>",
               "type": "boolean",
               "fieldName": "tool_bookmarks"
            },
            {
               "label": "<b>Find Location</b>",
               "type": "boolean",
               "fieldName": "tool_locate"
            },
            {
               "label": "<b>Home Button</b>",
               "type": "boolean",
               "tooltip": "(Default Extent)",
               "fieldName": "tool_home"
            },
            {
               "label": "<b>Legend</b>",
               "type": "boolean",
               "fieldName": "tool_legend"
            },
            {
               "label": "<b>Layer Manager</b>",
               "type": "boolean",
               "fieldName": "tool_layerManager"
            },
            {
               "label": "<b>Layers</b>",
               "type": "boolean",
               "fieldName": "tool_layers"
            },
            {
               "label": "<b>Feature List</b>",
               "type": "boolean",
               "fieldName": "tool_features"
            },
            {
               "label": "<b>Feature Table</b>",
               "type": "boolean",
               "fieldName": "tool_featureTable"
            },
            {
               "label": "<i>Show 'List Features from Highlighted Rectangle' tool</i>",
               "type": "boolean",
               "fieldName": "featureTable_highlightedRectangle"
            },
            {
               "label": "<i>Show 'List Features from Highlighted Feature' tool</i>",
               "type": "boolean",
               "fieldName": "featureTable_highlightedFeature"
            },
            {
               "label": "<i>Show 'List Features from Current View' tool</i>",
               "type": "boolean",
               "fieldName": "featureTable_currentView"
            },
            {
               "label": "<b>Info Panel</b>",
               "type": "boolean",
               "fieldName": "tool_infoPanel"
            },
            {
               "label": "<i>Reverse Geocode</i>",
               "type": "boolean",
               "fieldName": "tool_GeoCoding"
            },
            {
               "label": "<b>Map Keyboard Navigation</b>",
               "type": "boolean",
               "fieldName": "tool_mapKeyboardNavigation"
            },
            {
               "label": "<b>Filters</b>",
               "type": "boolean",
               "fieldName": "tool_filter"
            },
            {
               "label": "<b>Measure Tool</b>",
               "type": "boolean",
               "fieldName": "tool_measure"
            },
            {
               "label": "<b>Share Tools</b>",
               "type": "boolean",
               "fieldName": "tool_share"
            },
            {
               "label": "<b>Print Button</b>",
               "type": "boolean",
               "fieldName": "tool_print"
            },
            {
               "label": "<b>Scalebar</b>",
               "type": "boolean",
               "fieldName": "scalebar"
            },
            {
               "label": "<b>Extended Navigation Tool Bar</b>",
               "type": "boolean",
               "fieldName": "navigation"
            }
         ]
      },
      {
         "category": "Directions Settings",
         "fields": [
            {
               "label": "Directions",
               "type": "boolean",
               "fieldName": "tool_directions"
            },
            {
               "type": "paragraph",
               "value": "The Directions widget uses the Routing and Directions Service to calculate driving directions.<br/>This is a subscription based service available through ArcGIS Online.<br/>You may use a Proxy to avoid the login dialog.‎"
            },
            {
               "label": "Directions Proxy:",
               "placeHolder": "",
               "fieldName": "directionsProxy",
               "type": "string",
               "tooltip": "Leave it blank for none"
            },
            {
               "type": "paragraph",
               "value": "Options:"
            },
            {
               "type": "boolean",
               "fieldName": "directions_locator",
               "label": "My Location"
            },
            {
               "type": "boolean",
               "fieldName": "directions_stops",
               "label": "Add/Modify Stops"
            },
            {
               "type": "boolean",
               "fieldName": "directions_barriers",
               "label": "Add/Delete Barrier"
            },
            {
               "type": "boolean",
               "fieldName": "directions_optimize",
               "label": "Optimize Route"
            },
            {
               "type": "boolean",
               "fieldName": "directions_print",
               "label": "Print Directions"
            },
            {
               "label": "<strong>Custom Print Page:</strong>",
               "fieldName": "directions_printPageURL",
               "type": "string",
               "tooltip": "Leave blank for no custom page"
            },
            {
               "type": "boolean",
               "fieldName": "directions_symbols",
               "label": "Enhanced Symbols"
            },
            {
               "type": "boolean",
               "fieldName": "directions_dragging",
               "label": "Allow Dragging"
            },
            {
               "type": "boolean",
               "fieldName": "directions_stopOrder",
               "label": "Change Stop Order"
            },
            {
               "type": "boolean",
               "fieldName": "directions_popup",
               "label": "Segment Popup"
            },
            {
               "label": "<strong>Images URL:</strong>",
               "fieldName": "directions_imagesURL",
               "type": "string",
               "tooltip": "Leave blank when the application Images folder is reachable by Print Server."
            }
         ]
      },
      {
         "category": "Search Settings",
         "fields": [
            {
               "type": "paragraph",
               "value": "Enable/disable the search tool and optionally select layers (and fields) to add to the search tool."
            },
            {
               "label": "Select search layers and fields",
               "fieldName": "searchLayers",
               "type": "multilayerandfieldselector",
               "tooltip": "Select layer and fields to search",
               "layerOptions": {
                  "supportedTypes": [
                     "FeatureLayer"
                  ],
                  "geometryTypes": [
                     "esriGeometryPoint",
                     "esriGeometryLine",
                     "esriGeometryPolyline",
                     "esriGeometryPolygon"
                  ]
               },
               "fieldOptions": {
                  "supportedTypes": [
                     "esriFieldTypeString"
                  ]
               }
            },
            {
               "type": "boolean",
               "fieldName": "tool_search",
               "label": "Address Finder"
            },
            {
               "type": "boolean",
               "fieldName": "searchExtent",
               "label": "Prioritize search results in current extent."
            },
            {
               "type": "paragraph",
               "value": "When Location Search is true the search widget will allow users to search for addresses and locations using one or more locators and also search the layers and fields specified in the Search Layers configuration option. Unchecking the Location Search option will remove the locator search and only configured search layers will be displayed."
            },
            {
               "type": "boolean",
               "fieldName": "locationSearch",
               "label": "Location Search"
            },
            {
               "type": "string",
               "fieldName": "countryCodeSearch",
               "label": "CountryCode"
            },
            {
               "type": "paragraph",
               "value": "When Country Code is not null, searches will be restricted in that country."
            },
            {
               "type": "paragraph",
               "value": "Next options will work only for Side Panel Info."
            },
            {
               "type": "int",
               "fieldName": "maxSearchResults",
               "label": "Max Results"
            },
            {
               "type": "boolean",
               "fieldName": "showSearchScore",
               "label": "Show Search Result Score",
               "tooltip": "Search Results may display a score of the match (1 to 100.)"
            },
            {
               "label": "<strong>Geocoder Image Marker:</strong>",
               "fieldName": "searchMarker",
               "type": "string",
               "tooltip": "Defaults to './images/SearchPin.png'"
            },
            {
               "label": "<strong>Reverse Geocoder Image Marker:</strong>",
               "fieldName": "geoCodingMarker",
               "type": "string",
               "tooltip": "Defaults to './images/SearchPin.png'"
            },
            {
               "type": "paragraph",
               "value": "The marker pointer is in the middle of its base. It will be resized to 50x50 pixels."
            }
         ]
      },
      {
         "category": "Print Settings",
         "fields": [
            {
               "type": "paragraph",
               "value": "Display the print tool and optionally display a legend on the print page and all the print layouts associated with the print service used by the template."
            },
            {
               "type": "boolean",
               "fieldName": "tool_print",
               "label": "Print Tool"
            },
            {
               "label": "Print Service:",
               "fieldName": "printService",
               "type": "string",
               "tooltip": "Leave it blank for default from 'helperServices.printTask.url'"
            },
            {
               "type": "paragraph",
               "value": "Default print Service:<br/>https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
            },
            {
               "type": "boolean",
               "fieldName": "tool_print_layouts",
               "label": "Display all Layout Options"
            },
            {
               "type": "paragraph",
               "value": "Specify the print format. Check your print service to see a list of valid values. The following values are valid for the default print service: PDF, PNG32, PNG8, JPG, GIF, EPS, SVG, SVGZ"
            },
            {
               "placeHolder": "Default value is PDF",
               "label": "Format:",
               "fieldName": "tool_print_format",
               "type": "string",
               "tooltip": "Defaults to PDF"
            },
            {
               "type": "boolean",
               "fieldName": "tool_print_legend",
               "label": "Add Legend to Output"
            }
         ]
      },
      {
         "category": "Languages",
         "fields": [
            {
               "label": "Control with label",
               "type": "boolean",
               "fieldName": "languageLabel",
               "tooltip": "Place a localized label in front of the Language control."
            },
            {
               "type": "paragraph",
               "value": "<strong>Language 1</strong>"
            },
            {
               "label": "Language code",
               "fieldName": "lang1code",
               "type": "string"
            },
            {
               "type": "paragraph",
               "value": "Enter the locale of the language. Example: 'en-us'"
            },
            {
               "label": "Language Short Name",
               "fieldName": "lang1shortName",
               "type": "string"
            },
            {
               "type": "paragraph",
               "value": "The name that will appear on the Language widget as active language.<br/>Leave it blank to display first two letters of language code when no image.<br/>You may use national charactes here to change the default display."
            },
            {
               "label": "Flag Image",
               "fieldName": "lang1imageSrc",
               "type": "string"
            },
            {
               "type": "paragraph",
               "value": "The location of the image representing the flag of the country.<br/>Note: Leave it blank to display no image and show the Language Short Name instead."
            },
            {
               "label": "Language name",
               "fieldName": "lang1name",
               "type": "string"
            },
            {
               "type": "paragraph",
               "value": "The name that will appear in the combo-box pull-down."
            },
            {
               "label": "Application Id",
               "fieldName": "lang1appId",
               "type": "string"
            },
            {
               "type": "paragraph",
               "value": "ID of application that will restart for this language.<br/>Note: you may want another application to customize layers, data and other custom attributes.<br/>Leave blank to use same application."
            },
            {
               "type": "paragraph",
               "value": "<strong>Language 2</strong>"
            },
            {
               "label": "Language code",
               "fieldName": "lang2code",
               "type": "string",
               "tooltip": "The locale of language 2."
            },
            {
               "label": "Language Short Name",
               "fieldName": "lang2shortName",
               "type": "string",
               "tooltip": "The two-letter name that will appear on the Language widget."
            },
            {
               "label": "Flag Image",
               "fieldName": "lang2imageSrc",
               "type": "string",
               "tooltip": "The location of a 22x22 image."
            },
            {
               "label": "Language name",
               "fieldName": "lang2name",
               "type": "string",
               "tooltip": "The name that will appear in the combo-box pull-down."
            },
            {
               "label": "Application Id",
               "fieldName": "lang2appId",
               "type": "string",
               "tooltip": "Application ID for language 2."
            },
            {
               "type": "paragraph",
               "value": "<strong>Language 3</strong>"
            },
            {
               "label": "Language code",
               "fieldName": "lang3code",
               "type": "string",
               "tooltip": "The locale of language 3."
            },
            {
               "label": "Language Short Name",
               "fieldName": "lang3shortName",
               "type": "string",
               "tooltip": "The name that will appear on the Language widget."
            },
            {
               "label": "Flag Image",
               "fieldName": "lang3imageSrc",
               "type": "string",
               "tooltip": "The location of a 22x22 image."
            },
            {
               "label": "Language name",
               "fieldName": "lang3name",
               "type": "string",
               "tooltip": "The name that will appear in the combo-box pull-down."
            },
            {
               "label": "Application Id",
               "fieldName": "lang3appId",
               "type": "string",
               "tooltip": "Application ID for language 3."
            }
         ]
      },
      {
         "category": "Debug",
         "fields": [
            {
               "type": "paragraph",
               "value": "Allow Google Analytics to receive information about how the application works. <br/>Your users private information won't be exposed."
            },
            {
               "label": "Use Google Analytics",
               "type": "boolean",
               "fieldName": "useGoogleAnalytics",
               "tooltip": "Check to get information in your Google Analytics account."
            },
            {
               "label": "Google Analytics User Account:",
               "fieldName": "googleAnalyticsUserAccount",
               "type": "string",
               "tooltip": "Enter here your Google Analytics User Account in the format:<br/>'UA-#########-#'."
            }
         ]
      }
   ],
   "values": {
      "icons": "white",
      "new_icons": false,
      "marker": "",
      "searchMarker": "./images/SearchPin.png",
      "geoCodingMarker": "./images/SearchPin.png",
      "marker_size": "35",
      "alt_keys": true,
      "logo": "images/logo.png",
      "logoAltText": "",
      "contactUsURL": "",
      "color": "#ffffff",
      "hoverColor": "#00A9E6",
      "focusColor": "#FF7700",
      "activeColor": "#00b9f6",
      "mapSelectionColor": "#00ffff",
      "geolocatorLabelColor": "#ff0000",
      "theme": "#005ce6",
      "activeTool": "details",
      "scalebar": false,
      "navigation": false,
      "tool_print_layouts": false,
      "tool_print_legend": false,
      "tool_share": true,
      "tool_overview": true,
      "tool_measure": true,
      "tool_details": true,
      "tool_instructions": true,
      "tool_filter": true,
      "tool_legend": true,
      "tool_layerManager": false,
      "tool_layers": true,
      "tool_features": true,
      "tool_featureTable": true,
      "tool_infoPanel": false,
      "tool_directions": false,
      "directionsProxy": "",
      "tool_GeoCoding": false,
      "tool_mapKeyboardNavigation": true,
      "tool_home": true,
      "tool_locate": true,
      "tool_edit": false,
      "tool_edit_toolbar": false,
      "tool_bookmarks": true,
      "tool_basemap": true,
      "tool_search": true,
      "tool_print": true,
      "locationSearch": true,
      "maxSearchResults": 10,
      "showSearchScore": true,
      "countryCodeSearch": "",
      "searchExtent": false,
      "languageLabel": true,
      "googleAnalyticsUserAccount": "",
      "useGoogleAnalytics": true,
      "lang1shortName": "EN",
      "lang1name": "English",
      "lang1code": "EN-US",
      "lang1imageSrc": "",
      "lang2shortName": "FR",
      "lang2name": "French",
      "lang2code": "FR-CA",
      "lang2imageSrc": "",
      "lang3shortName": "",
      "lang3name": "",
      "lang3code": "",
      "contactUsEmail": "",
      "contactUsSubject": "Enter subject line here",
      "contactUsBody": "Enter your text here",
      "alternateSplashText": "",
      "directions_locator": true,
      "directions_stops": true,
      "directions_barriers": false,
      "directions_print": false,
      "directions_optimize": true,
      "directions_symbols": true,
      "directions_dragging": true,
      "directions_stopOrder": true,
      "directions_popup": false,
      "directions_imagesURL": "",
      "directions_printPageURL": "js/DirectionsPrintPage/index.html",
      "featureTable_highlightedRectangle" : false,
      "featureTable_highlightedFeature": false,
      "featureTable_currentView": true,
      "printService": ""
   }
}