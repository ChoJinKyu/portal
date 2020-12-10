sap.ui.define([
    "sap/m/ComboBox",
    'sap/m/ComboBoxRenderer',
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/core/ListItem",
    "sap/ui/model/json/JSONModel"
], function (Parent, Renderer, ODataV2ServiceProvider, ListItem, JSONModel) {
    "use strict";
    
    var CodeComboBox = Parent.extend("ext.lib.control.m.CodeComboBox", {

        renderer: Renderer,

        metadata: {
            properties: {
                keyField: { type: "string", group: "Misc", defaultValue: "code" },
                textField: { type: "string", group: "Misc", defaultValue: "code_name" },
                additionalTextField: { type: "string", group: "Misc" },
                useEmpty: { type: "boolean", group: "Misc", defaultValue: false },
                emptyKey: { type: "string", group: "Misc", defaultValue: "" },
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
                    
                this.oServiceModel.read("/" + oBindingInfo.entityName, jQuery.extend(oBindingInfo, {
                    success: function(oData){
                        var aRecords = oData.results;
                        if(this.getProperty("useEmpty") == true) {
                            if(aRecords && aRecords.splice){
                                var oEmpty = {};
                                oEmpty[this.getProperty("keyField")] = this.getProperty("emptyKey");
                                oEmpty[this.getProperty("textField")] = this.getProperty("emptyText");
                                aRecords.splice(0, 0, oEmpty);
                            }
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
        },

        read: function(sPath, oParameters){
            var handleSuccess = oParameters.success;
            if(!this.oServiceModel)
                this.oServiceModel = ODataV2ServiceProvider.getCommonService();
            this.oServiceModel.read(sPath, jQuery.extend(oParameters, {
                success: function(oData){
                    var aRecords = oData.results;
                    if(this.getProperty("useEmpty") == true) {
                        if(aRecords && aRecords.splice){
                            var oEmpty = {};
                            oEmpty[this.keyField] = this.getProperty("emptyKey");
                            oEmpty[this.textField] = this.getProperty("emptyText");
                            aRecords.splice(0, 0, oEmpty);
                        }
                    }
                    this.getModel().setSizeLimit(aRecords.length || 100);
                    this.getModel().setData(aRecords, false);
                    if(handleSuccess) 
                        handleSuccess.apply(this, arguments);
                    this.fireEvent("complete");
                }.bind(this)
            }));
        }
        
    });

    return CodeComboBox;

});