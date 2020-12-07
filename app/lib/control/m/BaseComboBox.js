sap.ui.define([
    "sap/m/ComboBox",
    "ext/lib/core/UserChoices",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/core/Item",
    "sap/ui/model/json/JSONModel"
], function (ComboBox, UserChoices, ODataV2ServiceProvider, Item, JSONModel) {
    "use strict";
    
    var BaseComboBox = ComboBox.extend("ext.lib.control.m.BaseComboBox", {

        metadata: {
            properties: {
                useEmpty: { type: "boolean", group: "Misc", defaultValue: false },
                emptyKey: { type: "string", group: "Misc", defaultValue: "" },
                emptyText: { type: "string", group: "Misc", defaultValue: "" },
                textPattern: { type: "string", defaultValue: "$text" }
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
            ComboBox.prototype.init.call(this);
            this.setModel(new JSONModel());

            this.keyField = "code";
            this.textField = "text";

            this.attachEvent("modelContextChange", this._onModelContextChange);
        },

        _onModelContextChange: function(){
            var sKey = "{"+this.keyField+"}";
            var sText = this.getProperty("textPattern")
                .replace(/\$text/g, "{"+this.textField+"}")
                .replace(/\$key/g, "{"+this.keyField+"}")
                .replace(/\[/g, "{").replace(/\]/g, "}");

            this.bindItems({
                path: "/",
                template: new Item({
                    key: sKey,
                    text: sText
                })
            });

            this.fireEvent("ready", {serviceModel: this.oServiceModel});
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
                    this.getModel().setData(aRecords, false);
                    if(handleSuccess) 
                        handleSuccess.apply(this, arguments);
                    this.fireEvent("complete");
                }.bind(this)
            }));
        },

        getUserChoices: function(){
            return new UserChoices();            
        }
        
    });

    return BaseComboBox;

});