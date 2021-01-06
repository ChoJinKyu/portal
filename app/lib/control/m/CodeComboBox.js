sap.ui.define([
    "sap/m/ComboBox",
    'sap/m/ComboBoxRenderer',
    "sap/base/util/deepClone",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/core/ListItem",
    "sap/ui/model/json/JSONModel"
], function (Parent, Renderer, deepClone, ODataV2ServiceProvider, ListItem, JSONModel) {
    "use strict";
    
    var CodeComboBox = Parent.extend("ext.lib.control.m.CodeComboBox", {

        renderer: Renderer,

        metadata: {
            properties: {
                keyField: { type: "string", group: "Misc", defaultValue: "code" },
                textField: { type: "string", group: "Misc", defaultValue: "code_name" },
                additionalTextField: { type: "string", group: "Misc" },
                useEmpty: { type: "boolean", group: "Misc", defaultValue: true },
                emptyText: { type: "string", group: "Misc", defaultValue: "" }
            },
            events: {
                ready: {
                    parameters: {
						serviceModel: {type: "object"}
					}
                },
                complete: {
                }
            }
        },

        init: function () {
            Parent.prototype.init.call(this);
            this.setModel(new JSONModel());
        },

        extractBindingInfo(oValue, oScope){
            var oBindingInfo = Parent.prototype.extractBindingInfo.apply(this, arguments);
            if(oBindingInfo && (oBindingInfo.serviceName || oBindingInfo.serviceUrl) && oBindingInfo.entityName){
                var sKey = "{"+ this.getProperty("keyField") +"}",
                    sText = "{"+ this.getProperty("textField") +"}",
                    sAdditionalTextField = "{"+ (this.getProperty("additionalTextField") || this.getProperty("keyField")) +"}";

                this.oServiceModel = oBindingInfo.serviceName ? 
                    ODataV2ServiceProvider.getService(oBindingInfo.serviceName) : ODataV2ServiceProvider.getServiceByUrl(oBindingInfo.serviceUrl);
                
                if(!oBindingInfo.hasOwnProperty('templateShareable')) oBindingInfo.templateShareable = true;

                this.oServiceModel.read("/" + oBindingInfo.entityName, jQuery.extend(oBindingInfo, {
                    success: function(oData){
                        var aRecords = deepClone(oData.results);
                        if(this.getProperty("useEmpty") == true) {
                            this.setPlaceholder(this.getProperty("emptyText") || "All");
                        }
                        this.getModel().setData(aRecords, false);
                        this.fireEvent("complete");
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
        }
        
    });

    return CodeComboBox;

});