sap.ui.define([
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (ComboBox, Item, JSONModel, ODataModel, Sorter, Filter, FilterOperator) {
    "use strict";

    var oServiceModel = new ODataModel({
        serviceUrl: "srv-api/odata/v2/cm.util.CommonService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });
    
    var CodeComboBox = ComboBox.extend("ext.lib.control.m.CodeComboBox", {

        metadata: {
            properties: {
                groupCode: { type: "string", group: "Misc" },
                useEmpty: { type: "boolean", group: "Misc", defaultValue: false },
                emptyKey: { type: "string", group: "Misc", defaultValue: "" },
                emptyText: { type: "string", group: "Misc", defaultValue: "" },
                showTextWithCode: { type: "boolean", group: "Misc", defaultValue: false },
            }
        },

        init: function () {
            ComboBox.prototype.init.call(this);
            
            this.setModel(new JSONModel());

            this.attachEvent("modelContextChange", this._onModelContextChange);
            // this.attachValueHelpRequest(this.handleValueHelpRequest);
        },

        _onModelContextChange: function(oEvent){
            this.bindItems({
                path: "/",
                template: new Item({
                    key: "{code}",
                    text: this.getProperty("showTextWithCode") ? "[{code}] {code_description}" : "{code_description}"
                })
            });

            if(!this.getProperty("groupCode")){
                return;
            }

            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("group_code", FilterOperator.EQ, this.getProperty("groupCode"))
                ], aSorters = [
                    new Sorter("sort_no", false)
                ];
            oServiceModel.read("/CodeDetails", {
                filters: aFilters,
                sorters: aSorters,
                urlParameters: {
                    "$select": "code,code_description"
                },
                success: this._onRead.bind(this)
            });
        },

        _onRead: function(oData){
            var aResults = oData.results;
            if(this.getProperty("useEmpty") == true) {
                aResults.splice(0, 0, {
                    code: this.getProperty("emptyKey"), 
                    code_description: this.getProperty("emptyText")
                });
            }
            this.getModel().setData(aResults, false);
        }
        
    });

    return CodeComboBox;

});