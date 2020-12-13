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

        },
        
        onAfterRendering: function(){
            // var oView = this.getView();
            // oView.setBusy(true);
            // this.getModel("main-v4").read("Message", {
			// 	success: function(oData){
			// 		oView.setBusy(false);
			// 	}
			// });
        },

        onMainTableAddButtonPress: function(){
            var oModel = this.getModel("main-v4");
            oModel.bindProperty("/Message");

            return;
            debugger;
            var oContext = this.getModel("main-v4").createEntry("/Message", {
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
            this.getModel("odata").submitChanges({
                groupId: "changes",
                success: function(){
                    debugger;
                }, error: function(){
                    debugger;
                }});
            // this.getModel("odata").deleteCreatedEntry(oContext);
        },

        onMainTableDeleteButtonPress: function(){
			var oTable = this.byId("mainTable"),
				oModel = this.getModel("odata"),
                aItems = oTable.getSelectedItems();
                debugger;
            this.getModel("odata").remove(aItems[0].getBindingContextPath(), {
                groupId: "changes"
            });
            this.getModel("odata").submitChanges({
                groupId: "changes",
                success: function(){
                    debugger;
                }, error: function(){
                    debugger;
                }});
        },

        onMainTableTestButtonPress: function(){
            var oView = this.getView(),
                oModel = this.getModel("odata");
                
            debugger;
        }

	});
});