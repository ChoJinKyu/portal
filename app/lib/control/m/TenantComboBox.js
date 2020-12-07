sap.ui.define([
    "./BaseComboBox",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (ComboBox, ODataV2ServiceProvider, Sorter, Filter, FilterOperator) {
    "use strict";

    var TenantComboBox = ComboBox.extend("ext.lib.control.m.TenantComboBox", {

        init: function () {
            ComboBox.prototype.init.call(this);

            this.keyField = "tenant_id";
            this.textField = "tenant_name";

            this.oServiceModel = ODataV2ServiceProvider.getOrgService();

            this.attachEvent("ready", this._onReady);
        },

        _onReady: function(){
            this.read("/Tenant", {
                urlParameters: {
                    "$select": "tenant_id,tenant_name"
                }
            });
        }
        
    });

    return TenantComboBox;

});