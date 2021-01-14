sap.ui.define([
    "sap/m/ToggleButton",
    "sap/m/ToggleButtonRenderer",
    "ext/lib/util/Multilingual",
    "ext/lib/formatter/Formatter"
], function (Parent, Renderer, Multilingual, Formatter) {
    "use strict";

    var FlagToggleButton = Parent.extend("ext.lib.control.m.FlagToggleButton", {

        formatter: Formatter,

        renderer: Renderer,

        metadata: {
            properties: {
                text: { type: "string", group: "Misc", defaultValue: "No" },
                pressed: { type: "Boolean", group: "Misc", defaultValue: false },
                type: { type: "string", group: "Misc", defaultValue: "Default" },
            },
            events: {
                truePress: {},
                falsePress: {},
            }
        },

        init: function () {
            Parent.prototype.init.call(this);
            this.attachPress(this._onPress);
            // this._contextChange();
            this.attachModelContextChange(this._contextChange);
        },

        _onPress: function () {
            if (this.getProperty("pressed") === true) {
                this.setProperty("pressed", false);
                this.setProperty("type", "Default");
                this.setProperty("text", "No");
                this.fireEvent("truePress");
            } else {
                this.setProperty("pressed", true);
                this.setProperty("type", "Emphasized");
                this.setProperty("text", "Yes");
                this.fireEvent("falsePress");
            }
        },

        _contextChange: function () {
            if (this.getProperty("pressed") === true) {
                this.setProperty("type", "Emphasized");
                this.setProperty("text", "Yes");
            } else {
                this.setProperty("type", "Default");
                this.setProperty("text", "No");
            }
        }

    });

    return FlagToggleButton;

});