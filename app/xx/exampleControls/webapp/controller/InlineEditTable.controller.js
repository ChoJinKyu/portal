sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/formatter/Formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, Formatter, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("xx.exampleControls.controller.SmartTable", {

        formatter: Formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			this.setModel(new JSONModel({
				Books: [{
					value1: null,
					value2: null,
					value3: null,
					value4: null,
				}, {
					value1: null,
					value2: null,
					value3: null,
					value4: null,
				}]
			}), "books");
        },
        
        onAfterRendering: function(){
            var oView = this.getView();
            oView.setBusy(true);
            this.getModel().read("/Message", {
				success: function(oData){
					oView.setBusy(false);
				}
			});
        },

        onMainTableAddButtonPress: function(){
            var oContext = this.getModel().createEntry("/Message", {
                groupId: "changes",
                properties: {
                    "tenant_id": "L2100",
                    "chain_code": "CM",
                    "language_code": "KO",
                    "message_code": "TEST4",
                    "message_type_code": "LBL",
                    "message_contents": "Test 123123",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date()
                }
            });
            this.getModel().submitChanges({
                groupId: "changes",
                success: function(){
                    debugger;
                }, error: function(){
                    debugger;
                }});
            // this.getModel().deleteCreatedEntry(oContext);
        },

        onMainTableDeleteButtonPress: function(){
			var oTable = this.byId("mainTable"),
				oModel = this.getModel(),
                aItems = oTable.getSelectedItems();
                debugger;
            this.getModel().remove(aItems[0].getBindingContextPath(), {
                groupId: "changes"
            });
            this.getModel().submitChanges({
                groupId: "changes",
                success: function(){
                    debugger;
                }, error: function(){
                    debugger;
                }});
        },

        onMainTableTestButtonPress: function(){
            var oView = this.getView(),
                oModel = this.getModel();
                
            debugger;
        }

	});
});