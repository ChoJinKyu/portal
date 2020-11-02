sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment"
	],
	function (Controller, Fragment) {
		"use strict";

		return Controller.extend("cm.timeZoneMgr.controller.timeZoneMgr", {
			onInit: function () {
                this.getView().getModel();
                this.byId();

            },
            handleValueHelp: function () {
                if (!this._oValueHelpDialog) {
                    Fragment.load({
                        name: "cm.timeZoneMgr.view.CountryValueHelpDialog",
                        controller: this
                    }).then(function (oValueHelpDialog) {
                        this._oValueHelpDialog = oValueHelpDialog;
                        this.getView().addDependent(this._oValueHelpDialog);
                        this._configValueHelpDialog();
                        this._oValueHelpDialog.open();
                    }.bind(this));
                } else {
                    this._configValueHelpDialog();
                    this._oValueHelpDialog.open();
                }
            },

            _configValueHelpDialog: function () {

                var sInputValue = this.byId("productInput").getValue(),
                    oModel = this.getView().getModel();
                    //aProducts = oModel.getProperty("/TimeZone");

                // aProducts.forEach(function (oProduct) {
                //     oProduct.selected = (oProduct.timezone_name === sInputValue);
                // });
                // oModel.setProperty("/TimeZone", aProducts);
            },

            handleValueHelpClose: function () {
                var oModel = this.getView().getModel(),
                    //aProducts = oModel.getProperty("/TimeZone"),
                    oInput = this.byId("productInput");

                // var bHasSelected = aProducts.some(function (oProduct) {
                //     if (oProduct.selected) {
                //         oInput.setValue(oProduct.timezone_name);
                //         return true;
                //     }
                // });

                // if (!bHasSelected) {
                //     oInput.setValue(null);
                // }
            },
            onCreate : function () {
          
            var oList = this.byId("table"), 
                oBinding = oList.getBinding("rows"),

				// Create a new entry through the table's list binding
				oContext = oBinding.create({
					"tenant_id" : "",
					"timezone_code" : "",
					"timezone_name" : "",
                    "country_code" : "",
                    "gmt_offset" : "",
					"dst_flag" : "",
					"dst_start_month" : "",
                    "dst_start_day" : "",
                    "dst_start_week" : "",
					"dst_start_day_of_week" : "",
					"dst_start_time_rate" : "",
                    "dst_end_month" : "",
                    "dst_end_day" : "",
					"dst_end_week" : "",
					"dst_end_day_of_week" : "",
                    "dst_end_time_rate" : ""
                });
                
                  oContext.created().then(function () {
                    oBinding.refresh();                    
                });     

                //this._setUIChanges(true);
                this.getView().getModel("appView").setProperty("/usernameEmpty", true);

                // Select and focus the table row that contains the newly created entry
                oList.getRows().some(function (oItem) {
                    if (oItem.getBindingContext() === oContext) {
                        oItem.focus();
                        oItem.setSelected(true);
                        return true;
                    }
                });
            }
		});
	});
