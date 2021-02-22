sap.ui.define([
    "sap/m/ToggleButton",
    "sap/m/ToggleButtonRenderer",
    "ext/lib/util/Multilingual",
    "ext/lib/formatter/FlagFormatter",
], function (Parent, Renderer,  Multilingual, FlagFormatter) {
    "use strict";

    var FlagButton = Parent.extend("ext.lib.control.m.FlagButton", {

        formatter: FlagFormatter,

        renderer: Renderer,

        metadata: {
            properties: {
                pressed: { type: "Boolean", group: "Misc", defaultValue: false },
                mode: { type: "string", group: "Misc", defaultValue: "Yes" }
            },
            events: {
                truePress: {},
                falsePress: {},
            }
        },

        init: function() {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "Multilingual_I18N");
            oMultilingual.attachEvent("ready", function(oEvent){
                if(Object.keys(this.oParent.oBindingContexts)[0]===undefined){
                    this.setPressed();
                }
                var oModel = Object.keys(this.oParent.oBindingContexts);
                if(this.getModel(oModel[0])!==undefined){
                    for (var key in this.oParent.oBindingContexts) { this.getModel(key).refresh(true); }
                }
            }.bind(this));
            Parent.prototype.setPressed.apply(this, arguments);
        },

        setPressed: function (sPressed) {
            Parent.prototype.setPressed.apply(this, arguments);
            
            var sFlagTextMode = FlagFormatter.toTextMode(this.getModel("Multilingual_I18N"), this.getProperty("mode"));
            var sFlagButtonType = FlagFormatter.toButtonType(this.getProperty("mode"));
            if (sPressed === true) {
                this.setProperty("type", sFlagButtonType.True);
                this.setProperty("text", sFlagTextMode.True);
                // this.fireEvent("truePress");
            } else {
                this.setProperty("type", sFlagButtonType.False);
                this.setProperty("text", sFlagTextMode.False);
                // this.fireEvent("falsePress");
            }
            Parent.prototype.setPressed.apply(this, arguments);
        },
    });
    return FlagButton;

});