sap.ui.define([
    "sap/m/ComboBox",
    'sap/m/ComboBoxRenderer',
    "sap/base/util/deepClone",
    "ext/lib/util/Multilingual",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/core/ListItem",
    "sap/ui/model/json/JSONModel"
], function (Parent, Renderer, deepClone, Multilingual, ODataV2ServiceProvider, ListItem, JSONModel) {
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
                complete: {}
            }
        },

        constructor: function(){
            Parent.prototype.constructor.apply(this, arguments);

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            if(this.getModel("I18N").isReady()){
                this.createContent();
            }else{
                oMultilingual.attachEvent("ready", function(){
                    this.createContent();
                }.bind(this));
            }
        },

        createContent: function(){
            if(this.getProperty("useEmpty") == true) {
                this.setPlaceholder(this.getProperty("emptyText") || this.getModel("I18N").getText("/ALL"));
            }
        },
        
        extractBindingInfo(oValue){
            if(oValue && (oValue.serviceName || oValue.serviceUrl) && oValue.entityName){
                var sKey = "{"+ this.getProperty("keyField") +"}",
                    sText = "{"+ this.getProperty("textField") +"}",
                    sAdditionalTextField = "{"+ (this.getProperty("additionalTextField") || this.getProperty("keyField")) +"}";

                this.oServiceModel = oValue.serviceName ? 
                    ODataV2ServiceProvider.getService(oValue.serviceName) : ODataV2ServiceProvider.getServiceByUrl(oValue.serviceUrl);
                
                this.oServiceModel.read("/" + oValue.entityName, jQuery.extend(oValue, {
                    success: function(oData){
                        var aRecords = deepClone(oData.results);
                        this.getModel().setData(aRecords, false);
                        this.fireEvent("complete");
                    }.bind(this)
                }));

                this.setModel(new JSONModel());
                return {
                    path: "/",
                    templateShareable: true,
                    template: new ListItem({
                        key: sKey,
                        text: sText,
                        additionalText: sAdditionalTextField
                    })
                }
            }else{
                return Parent.prototype.extractBindingInfo.apply(this, arguments);
            }
        }
        
    });

    return CodeComboBox;

});