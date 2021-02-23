sap.ui.define([
    "sap/m/Text",
    './TextRenderer',
    "sap/base/util/deepClone",
    "ext/lib/util/Multilingual",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/core/ListItem",
    "sap/ui/model/json/JSONModel"
], function (Parent, Renderer, deepClone, Multilingual, ODataV2ServiceProvider, ListItem, JSONModel) {
    "use strict";
    
    var Text = Parent.extend("ext.lib.control.m.Text", {

        renderer: Renderer,

        metadata: {
            properties: {
                color: { type: "string", group: "Misc" }
            }
        }
        
    });

    return Text;

});