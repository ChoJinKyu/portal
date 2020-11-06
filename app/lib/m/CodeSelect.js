sap.ui.define([
    "sap/m/Select"
], function (Select) {
    "use strict";

    var CodeSelect = Select.extend("ext.lib.m.CodeSelect", {
        metadata: {
            properties: {
                useEmptyValue: { type: "boolean", group: "Behavior", defaultValue: true }
            }
        },

        init: function () {
            Select.prototype.init.call(this);
            
        }
    });

    return CodeInput;

});