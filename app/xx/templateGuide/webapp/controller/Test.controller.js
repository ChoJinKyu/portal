jQuery.sap.registerModulePath("commCodeMgt", "/cm/codeMgt/webapp");

sap.ui.define([
    'sap/m/MessageToast',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    "sap/ui/table/Row",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/EventBus",
    "sap/m/UploadCollectionParameter",
    "sap/ui/Device"
],
	function(MessageToast, Controller, JSONModel, Row, HashChanger, EventBus, UploadCollectionParameter, Device) {
	"use strict";
 
	return Controller.extend("xx.templateGuie.controller.Test", {
        onInit: function() {   
            this.getView().setBusyIndicatorDelay(0);

            var oModel = new JSONModel();
			var oData = {
				modelData: [
					{supplier: "Titanium", street: "401 23rd St", city: "Port Angeles", phone: "5682-121-828", openOrders: 10},
					{supplier: "Technocom", street: "51 39th St", city: "Smallfield", phone: "2212-853-789", openOrders: 0},
					{supplier: "Red Point Stores", street: "451 55th St", city: "Meridian", phone: "2234-245-898", openOrders: 5},
					{supplier: "Technocom", street: "40 21st St", city: "Bethesda", phone: "5512-125-643", openOrders: 0},
					{supplier: "Very Best Screens", street: "123 72nd St", city: "McLean", phone: "5412-543-765", openOrders: 6}
				]
			};
			var oView = this.getView();

			oModel.setData(oData);
            oView.setModel(oModel);

            var oFileModel = new JSONModel([]);
            oView.setModel(oFileModel, "fileList");
        },

        onExit : function(){
            console.log("onExit Test");
        },
        
        onPress: function (oEvent) {
			if (oEvent.getSource().getPressed()) {
				MessageToast.show(oEvent.getSource().getId() + " Pressed");
			} else {
				MessageToast.show(oEvent.getSource().getId() + " Unpressed");
			}
        },

        onRowSelectionChange : function (oEvent) {
            oEvent;
        },

        onDragStart : function(oEvent){
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");

			// keep the dragged row context for the drop action
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
        },
        onDrop : function(oEvent){
            var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
			}

			var oConfig = this.config;
			var iNewRank = oConfig.defaultRank;
			var oDroppedRow = oEvent.getParameter("droppedControl");

			if (oDroppedRow && oDroppedRow instanceof Row) {
				// get the dropped row data
				var sDropPosition = oEvent.getParameter("dropPosition");
				var oDroppedRowContext = oDroppedRow.getBindingContext();
				var iDroppedRowRank = oDroppedRow.getIndex(); //oDroppedRowContext.getProperty("Rank");
				var iDroppedRowIndex = oDroppedRow.getIndex();
				var oDroppedTable = oDroppedRow.getParent();

				// find the new index of the dragged row depending on the drop position
				var iNewRowIndex = iDroppedRowIndex + (sDropPosition === "After" ? 1 : -1);
				var oNewRowContext = oDroppedTable.getContextByIndex(iNewRowIndex);
				if (!oNewRowContext) {
					// dropped before the first row or after the last row
					iNewRank = oConfig.rankAlgorithm[sDropPosition](iDroppedRowRank);
				} else {
					// dropped between first and the last row
					iNewRank = oConfig.rankAlgorithm.Between(iDroppedRowRank, iNewRowIndex/*oNewRowContext.getProperty("Rank")*/);
				}
			}

            // set the rank property and update the model to refresh the bindings
            var oModel = this.getView().getModel();
			oModel.setProperty("/", iNewRank, oDraggedRowContext);
            oModel.refresh(true);
            
            // var oDragSession = oEvent.getParameter("dragSession");
			// var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			// if (!oDraggedRowContext) {
			// 	return;
			// }

            // // reset the rank property and update the model to refresh the bindings
            // var oModel = this.getView().getModel();
			// oModel.setProperty("/catalog/clothing", oDraggedRowContext);
			// oModel.refresh(true);
        },

        onNaviToCommCodeMgt : function(oEvent){
            var oEventBus = sap.ui.getCore().getEventBus();			
            oEventBus.publish("spp.portal.crossApplicationNavigation", {
                sMenuUrl : "../cm/codeMgt/webapp",
                sMenuPath : "cm.codeMgt",
                oCustomData : {
                    UID : "1234"
                }
            });
        },

        config: {
			initialRank: 0,
			defaultRank: 1024,
			rankAlgorithm: {
				Before: function(iRank) {
					return iRank + 1024;
				},
				Between: function(iRank1, iRank2) {
					// limited to 53 rows
					return (iRank1 + iRank2) / 2;
				},
				After: function(iRank) {
					return iRank / 2;
				}
			}
		},
	});

});