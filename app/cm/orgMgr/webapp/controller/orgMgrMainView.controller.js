sap.ui.define([
        "cm/orgMgr/controller/BaseController",
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/core/format/DateFormat"
	],
	function (Controller, Fragment, JSONModel, Filter, FilterOperator, FilterType, MessageToast, MessageBox, DateFormat) {
		"use strict";

		return Controller.extend("cm.orgMgr.controller.orgMgrMainView", {
			onInit: function () {

            },

            onAddRow1: function (oEvent) {
                debugger;
                var oList = this.byId("table"), 
                oBinding = oList.getBinding("items"),
                utcDate = this._getUtcSapDate(),
				oContext = oBinding.create({
					"tenant_id"                 : "",
					"tenant_name"               : "",
					"use_flag"                  : false,
                    "local_create_dtm"          : utcDate,
                    "local_update_dtm"          : utcDate
                }); 
                
                  oContext.created().then(function () {
                    oBinding.refresh();                    
                });     

                //this.getView().getModel().setProperty("/usernameEmpty", true);

                oList.getRows().some(function (oItem) {
                    if (oItem.getBindingContext() === oContext) {
                        oItem.focus();
                        oItem.setSelected(true);
                        return true;
                    }
                });

            },
            _getUtcSapDate : function(){
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm"
                });
                
                var oNow = new Date();
                var utcDate = oDateFormat.format(oNow)+":00Z"; 
                console.log("utcDate",utcDate);
                return utcDate;
            },
            onCreate1 : function() {
                debugger;
            }
            
		});
	});
