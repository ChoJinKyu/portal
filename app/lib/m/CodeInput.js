sap.ui.define([
    "sap/m/Input",
    "./CodeDialog"
], function (Input, CodeDialog) {
    "use strict";

    var CodeInput = Input.extend("ext.lib.m.CodeInput", {
        metadata: {
            properties: {
                showValueHelp: { type: "boolean", group: "Behavior", defaultValue: true },
                valueHelpRequest: {
                    parameters: {
                        fromSuggestions: { type: "boolean", defaultValue: true }
                    }
                }
            }
        },

        init: function () {
            Input.prototype.init.call(this);
            this.attachValueHelpRequest(this.handleValueHelpRequest);
        },

        handleValueHelpRequest: function (oEvent) {
            var codeDialog = new CodeDialog();
            codeDialog.open();
            //this.addDependent(codeDialog);
        }
    });

    return CodeInput;

});