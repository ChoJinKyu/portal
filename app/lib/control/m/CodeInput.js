sap.ui.define([
    "sap/m/Input",
    'sap/m/InputRenderer',
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/core/ListItem",
    "sap/ui/model/json/JSONModel",
    "./CodePicker"
], function (Parent, Renderer, ODataV2ServiceProvider, ListItem, JSONModel, CodePicker) {
    "use strict";

    var CodeInput = Parent.extend("ext.lib.control.m.CodeInput", {
        
        renderer: Renderer,

        metadata: {
            properties: {
                keyField: { type: "string", group: "Misc", defaultValue: "code" },
                textField: { type: "string", group: "Misc", defaultValue: "code_name" },
                additionalTextField: { type: "string", group: "Misc" },
                showValueHelp: { type: "boolean", group: "Behavior", defaultValue: true },
                showSuggestion: { type: "boolean", group: "Behavior", defaultValue: true },
                textFormatMode: { type: "string", group: "Behavior", defaultValue: "KeyValue" }
            },
            defaultAggregation: "picker",
            aggregations: {
				picker: {type: "ext.lib.control.m.CodePicker", multiple: false, bindable : "bindable"}
            }
        },

        init: function () {
            Parent.prototype.init.call(this);
            this.setModel(new JSONModel());
            this.attachValueHelpRequest(this._onValueHelpRequest);
        },
        
        extractBindingInfo(oValue, oScope){
            var oBindingInfo = Parent.prototype.extractBindingInfo.apply(this, arguments);
            if(oBindingInfo && (oBindingInfo.serviceName || oBindingInfo.serviceUrl) && oBindingInfo.entityName){
                var sKey = "{"+ this.getProperty("keyField") +"}",
                    sText = "{"+ this.getProperty("textField") +"}",
                    sAdditionalTextField = "{"+ (this.getProperty("additionalTextField") || this.getProperty("keyField")) +"}";

                this.oServiceModel = oBindingInfo.serviceName ? 
                    ODataV2ServiceProvider.getService(oBindingInfo.serviceName) : ODataV2ServiceProvider.getServiceByUrl(oBindingInfo.serviceUrl);
                    
                this.oServiceModel.read("/" + oBindingInfo.entityName, jQuery.extend(oBindingInfo, {
                    success: function(oData){
                        var aRecords = oData.results;
                        this.getModel().setData(aRecords, false);
                    }.bind(this)
                }));

                delete oBindingInfo.serviceName;
                delete oBindingInfo.entityName;
                delete oBindingInfo.filters;
                delete oBindingInfo.sorter;
                oBindingInfo.path = "/";
                oBindingInfo.template = new ListItem({
                        key: sKey,
                        text: sText,
                        additionalText: sAdditionalTextField
                    });
                // oBindingInfo.filters = oBindingInfo.filters || [];
            }
            return oBindingInfo;
        },

        _onValueHelpRequest: function (oEvent) {
            if(!this.oPicker){
                this.oPicker = this.getPicker() || new CodePicker();
                this.oPicker.setModel(this.getModel());
                this.oPicker.addStyleClass("sapUiSizeCompact");
                this.oPicker.attachEvent("ok", this.onPickerOkPress.bind(this));
            }
            this.oPicker.open();
            //this.oPicker.addStyleClass(this.getParent().getOwnerComponent().getContentDensityClass());
            //this.addDependent(this.oPicker);
        },

        onPickerOkPress: function(oEvent){
            var oData = oEvent.getParameter("data");
            this.setSelectedKey(oData[this.getProperty("keyField")]);
        }
    });

    return CodeInput;

});