sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSONModel, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("cm.purOrgMgr.controller.purOrgMgr", {
			onInit: function () {
            },
            onSearch: function () {
                var bindings = this.byId("orgTypeMappingTable").getBinding("items");
                bindings.resetChanges()
                .then((function(resolved) {
                    //this.getView().setBusy(true);
                    bindings.filter([
                        new Filter("tenant_id", FilterOperator.EQ, '0000')
                    ]);
                    //this.getView().setBusy(false);
                }).bind(this))
                .catch(function(err) {
                    console.log(err);
                });
            },
            onMstUpdateFinished : function (oEvent) {
                console.log("########## onMstUpdateFinished - Start");
            }
		});
	});
