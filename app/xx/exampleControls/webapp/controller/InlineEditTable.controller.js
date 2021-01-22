sap.ui.define([
	"./Empty.controller",
	"ext/lib/formatter/Formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, Formatter, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.InlineEditTable", {

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
            this.getModel("main").read("/Message", {
				success: function(oData){
					oView.setBusy(false);
				}
			});
        },

        onMainTableAddButtonPress: function(){
            var oContext = this.getModel("main").createEntry("/Message", {
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
            this.getModel("main").submitChanges({
                groupId: "changes",
                success: function(){
                    debugger;
                }, error: function(){
                    debugger;
                }});
            // this.getModel("main").deleteCreatedEntry(oContext);
        },

        onMainTableDeleteButtonPress: function(){
			var oTable = this.byId("mainTable"),
				oModel = this.getModel("main"),
                aItems = oTable.getSelectedItems();
                debugger;
            this.getModel("main").remove(aItems[0].getBindingContextPath(), {
                groupId: "changes"
            });
            this.getModel("main").submitChanges({
                groupId: "changes",
                success: function(){
                    debugger;
                }, error: function(){
                    debugger;
                }});
        },

        onMainTableTestButtonPress: function(){
            var oView = this.getView(),
                oModel = this.getModel("main");
                
            debugger;
        }

	});
});