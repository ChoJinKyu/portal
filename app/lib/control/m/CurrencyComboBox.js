sap.ui.define([
    "./BaseComboBox",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (ComboBox, Sorter, Filter, FilterOperator) {
    "use strict";

    var CurrencyComboBox = ComboBox.extend("ext.lib.control.m.CurrencyComboBox", {

        metadata: {
            properties: {
            }
        },

        init: function () {
            ComboBox.prototype.init.call(this);

            this.keyField = "currency_code";
            this.textField = "currency_code_name";

            this.attachEvent("ready", this._onReady);
        },

        _onReady: function(){
            var sLanguageCode = this.getUserChoices().getLanguage();
            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("language_code", FilterOperator.EQ, sLanguageCode),
                    new Filter("use_flag", FilterOperator.EQ, true)
                ], aSorters = [
                    new Sorter("currency_code_name", false)
                ];
            this.read("/Currency", {
                filters: aFilters,
                sorters: aSorters,
                urlParameters: {
                    "$select": "currency_code,currency_code_name"
                }
            });
        }
        
    });

    return CurrencyComboBox;

});