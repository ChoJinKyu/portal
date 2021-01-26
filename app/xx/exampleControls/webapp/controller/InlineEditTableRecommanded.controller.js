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
            this.getView().bindElement({
                path: "main>",
                events: {
                    dataStateChange: function(){
                        debugger;
                    },
                    dataRequested: function(){
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function(oData){
                        debugger;
                    }.bind(this),
                    change: function(){
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
            this.getOwnerComponent().getModel("main").setDeferredGroups(["updateGroup"]);
        },

        getTable: function(){
			return this.byId("mainTable");
        },

        onMainTableAddButtonPress: function(){
            var oContext = this.getModel("main").createEntry("/Message", {
                groupId: "updateGroup",
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
            // this.getModel("main").deleteCreatedEntry(oContext);
        },

        onMainTableDeleteButtonPress: function(){
            var aItems = this.getTable().getSelectedItems();
            this.getModel("main").remove(aItems[0].getBindingContextPath(), {
                groupId: "updateGroup"
            });
        },

        onMainTableSaveButtonPress: function(){
            var oModel = this.getModel("main"),
                aPendingChanges;
            if(oModel.hasPendingChanges()){
                // aPendingChanges = oModel.getPendingChanges();
                oModel.updateBindings();
                debugger;
            }
            oModel.submitChanges({
                    groupId: "updateGroup",
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