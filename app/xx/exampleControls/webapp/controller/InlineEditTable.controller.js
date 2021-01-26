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
            this.setModel(new JSONModel());
            this.getOwnerComponent().getModel("main").setDeferredGroups(["updateGroup", "readGroup"]);
        },

        getTable: function(){
			return this.byId("mainTable");
        },


        concat: function(aDatas){
            var aResults = [];
            aDatas.forEach(function(oData){
                if(oData && oData.d && oData.d.results)
                    aResults = aResults.concat(oData.d.results);
                else if(oData.results)
                    aResults = aResults.concat(oData.results);
            });
            return aResults;
        }, 
        onMainTableSearchButtonPress: function(){
            this.getModel("main").read("/Message", {
                urlParameters: {
                    "$inlinecount": "allpages"
                },
                success: function(oData){
                    this.getModel().setData(oData.results, false);
                    oData.__count;

                    this.getModel("main").read("/Message", {
                        groupId: "readGroup",
                        urlParameters: {
                            "$skip": 1000,
                            "$top": 2000
                        },
                        success: function(oData){
                            var aData = this.getModel().getData();
                            aData = aData.concat(oData.results);
                            this.getModel().setData(aData);
                        }.bind(this)
                    });
                    this.getModel("main").read("/Message", {
                        groupId: "readGroup",
                        urlParameters: {
                            "$skip": 2000,
                            "$top": 3000
                        },
                        success: function(oData){
                            var aData = this.getModel().getData();
                            aData = aData.concat(oData.results);
                            this.getModel().setData(aData);
                        }.bind(this)
                    });
                    
                    this.getModel("main").submitChanges({
                        groupId: "readGroup",
                        success: function(oEvent){
                            debugger;
                        }, error: function(){
                            debugger;
                        }
                    });
                    
                }.bind(this)
            })
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
        }

	});
});