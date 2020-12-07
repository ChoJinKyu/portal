sap.ui.define([
    "sap/m/Input",
    "./CodeDialog"
], function (Input, CodeDialog) {
    "use strict";

    var CodeInput = Input.extend("ext.lib.control.m.CodeInput", {
        metadata: {
            properties: {
                groupCode: { type: "string", group: "Misc" },
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
            this.attachValueHelpRequest(this._onValueHelpRequest);
        },

        _onValueHelpRequest: function (oEvent) {
            if(!this.codeDialog)
                this.codeDialog = new CodeDialog({
                    groupCode: this.getProperty("groupCode")
                });
            this.codeDialog.open();
            this.codeDialog.addStyleClass("sapUiSizeCompact");
            this.codeDialog.attachEvent("applyPress", this._onApplyPress.bind(this));
            // this.codeDialog.addStyleClass(this.getParent().getOwnerComponent().getContentDensityClass());
            //this.addDependent(this.codeDialog);
        },

        _onApplyPress: function(oEvent){
            var oData = oEvent.getParameter("data");
            this.setValue(oData.code);
        }
    });

    return CodeInput;

});