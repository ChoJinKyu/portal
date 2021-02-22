sap.ui.define([
    "sap/m/Text",
    "sap/m/TextRenderer",
    "sap/base/util/deepClone",
    "ext/lib/util/Multilingual",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "ext/lib/formatter/FlagFormatter",
    "sap/ui/core/ListItem",
    "sap/ui/model/json/JSONModel"
], function (Parent, Renderer, deepClone, Multilingual, ODataV2ServiceProvider, FlagFormatter, ListItem, JSONModel) {
    "use strict";
    
    var FlagText = Parent.extend("ext.lib.control.m.FlagText", {

        formatter: FlagFormatter,

        renderer: Renderer,

        metadata: {
            properties: {
                text: { type: "string", group: "Misc" ,defaultValue: "false"},
                mode: { type: "string", group: "Misc" ,defaultValue: "Yes"}
            }
        },
        

        init: function() {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel());
        },

        setText : function (sText) {

            var sFlagMode = FlagFormatter.toTextMode(this.getModel(), this.getProperty("mode"));
            if (sText === true) {
                this.setProperty("text", sFlagMode.True );
            } else {
                this.setProperty("text", sFlagMode.False);
            }
        },

    });
   
    return FlagText;

});