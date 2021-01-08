sap.ui.define([
    "sap/m/MultiInput",
    "sap/m/MultiInputRenderer",
    "dp/util/core/service/ODataV2ServiceProvider",
    "sap/ui/core/ListItem",
    "sap/ui/model/json/JSONModel",
    "./MaterialMstPickerValueHelp",
    "sap/m/Token"
], function (Parent, Renderer, ODataV2ServiceProvider, ListItem, JSONModel, MaterialMstPickerValueHelp, Token) {
    "use strict";

    var MaterialMstPicker = Parent.extend("dp.util.control.m.MaterialMstPicker", {
        
        renderer: Renderer,

        metadata: {
            properties: {
                keyField: { type: "string", group: "Misc", defaultValue: "material_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_desc" },
                showValueHelp: { type: "boolean", group: "Behavior", defaultValue: true },
                showSuggestion: { type: "boolean", group: "Behavior", defaultValue: true },
                textFormatMode: { type: "string", group: "Behavior", defaultValue: "KeyValue" }
            },
            defaultAggregation: "valueHelp",
            aggregations: {
				valueHelp: {type: "dp.util.control.m.MaterialMstPickerValueHelp", multiple: false, bindable : "bindable"}
            }
        },

        init: function () {
            Parent.prototype.init.call(this);
            this.setModel(new JSONModel());
            this.attachValueHelpRequest(this._onValueHelpRequest);
        },

        onAfterRendering: function(){
            if(!this.oValueHelp){
                this.oValueHelp = this.getValueHelp() || new MaterialMstPickerValueHelp({
                    contentWidth: "1000px",
                });
                this.oValueHelp.setModel(this.getModel());
                this.oValueHelp.attachEvent("ok", this.onValueHelpOkPress.bind(this));
            }
        },
        
        extractBindingInfo(oValue, oScope){ //SearchMaterialMstView, SearchMaterialOrgView

            var oBindingInfo = Parent.prototype.extractBindingInfo.apply(this, arguments);
            if(oBindingInfo && (oBindingInfo.serviceName || oBindingInfo.serviceUrl) && oBindingInfo.entityName){
                var sKey = "{"+ this.getProperty("keyField") +"}",
                    sText = "{"+ this.getProperty("textField") +"}";

                this.oServiceModel = oBindingInfo.serviceName ? 
                    ODataV2ServiceProvider.getService(oBindingInfo.serviceName) : ODataV2ServiceProvider.getServiceByUrl(oBindingInfo.serviceUrl);
                    
                this.oServiceModel.read("/" + oBindingInfo.entityName, jQuery.extend(oBindingInfo, {
                    success: function(oData){
                        var aRecords = oData.results;
                        this.getModel().setSizeLimit(aRecords.length || 100);
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
                        text: sText
                    });
            }
            return oBindingInfo;
        },

        _onValueHelpRequest: function (oEvent) {
            this.oValueHelp.open();
        },

        onValueHelpOkPress: function(oEvent){
            var oData = oEvent.getParameter("data");
            
            this.addToken(new Token({
                text:oData.material_code
            }));
        }
        
    });

    return MaterialMstPicker;

});