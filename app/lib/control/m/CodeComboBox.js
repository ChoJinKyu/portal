sap.ui.define([
    "./BaseComboBox",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (ComboBox, Sorter, Filter, FilterOperator) {
    "use strict";

    var CodeComboBox = ComboBox.extend("ext.lib.control.m.CodeComboBox", {

        metadata: {
            properties: {
                groupCode: { type: "string", group: "Misc" }
            }
        },

        init: function () {
            ComboBox.prototype.init.call(this);

            this.keyField = "code";
            this.textField = "code_name";

            this.attachEvent("ready", this._onReady);
        },

        _onReady: function(){
            if(!this.getProperty("groupCode")){
                return;
            }

            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("group_code", FilterOperator.EQ, this.getProperty("groupCode"))
                ], aSorters = [
                    new Sorter("sort_no", false)
                ],
                sLanguageCode = this.getUserChoices().getLanguage();
            this.read("/Code", {
                filters: aFilters,
                sorters: aSorters,
                urlParameters: {
                    "$select": "code,code_name"
                }
            });
        }
        
    });

    return CodeComboBox;

});