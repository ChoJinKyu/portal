sap.ui.define([
    "sap/m/Label",
    './ColoredLabelRenderer',
    "sap/base/util/deepClone",
    "ext/lib/util/Multilingual",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/core/ListItem",
    "sap/ui/model/json/JSONModel"
], function (Parent, Renderer, deepClone, Multilingual, ODataV2ServiceProvider, ListItem, JSONModel) {
    "use strict";
    
    var ColoredLabel = Parent.extend("ext.lib.control.m.ColoredLabel", {

        renderer: Renderer,

        metadata: {
            properties: {
                color: { type: "string", group: "Misc" }
            }
        }
        
    });

    return ColoredLabel;

});