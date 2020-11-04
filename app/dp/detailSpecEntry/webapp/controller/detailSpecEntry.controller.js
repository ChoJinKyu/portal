sap.ui.define([
		"sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/format/DateFormat"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, History, UIComponent, JSONModel, DateFormat) {
		"use strict";

		return Controller.extend("dp.detailSpecEntry.controller.detailSpecEntry", {
			onInit: function () {
                
            },
            onSearch: function () {

                var filters = [];

                console.log('aa');

                var mstBinding = this.byId("itemSpecTable").getBinding("items");
                //var mstBinding = this.byId("codeMstTable").getBinding("rows");

                console.log('bb');

                console.log(mstBinding);

                mstBinding.resetChanges();

                console.log('cc');

                this.getView().setBusy(true);
                mstBinding.filter(filters);
                this.getView().setBusy(false);

            },
		});
	});
