sap.ui.define([
    "ext/lib/controller/BaseController",
	"sap/m/ColumnListItem",
	"sap/ui/table/Row",
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel",
	"./Utils"
], function(BaseController, ColumnListItem, TableRow, jQuery, JSONModel, Utils) {
	"use strict";
    
	return BaseController.extend("pg.md.mdVpItemMapping.controller.selectedItems", {  

        onBeforeRendering : function(){
            
            this.getModel("tblModel").setProperty("/table2",this.getView().byId("table").getId());

            ////
            // var oView = this.getView();
			// this.oProductsModel = this.initSampleProductsModel();
			// oView.setModel(this.oProductsModel,"value2");

        },

		// initSampleProductsModel: function() {
            
        //     var oModel = new JSONModel();
        //     jQuery.ajax({
        //         url: "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemIngView(language_code='EN')/Set?$orderby=spmd_category_sort_sequence asc,spmd_character_sort_seq asc&$filter=trim(vendor_pool_code) eq 'VP201610260096'", 
        //         contentType: "application/json",
        //         success: function(oData2){ 
        //             debugger;
		// 	        oModel.setData(oData2);
        //             // this.getModel().setData(oData2);
        //             // oData2.value.forEach(function(oProduct) {
        //             //     oProduct.Rank = 1;
        //             // }, this);
                    
        //         }.bind(this)                        
        //     });

		// 	// var oModel = new JSONModel();
		// 	// oModel.setData(oData2);
		// 	return oModel;
		// },

		onDragStart: function(oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");

			// keep the dragged row context for the drop action
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext("tblModel"));
		},

		moveToAvailableItemsTable: function() {

            var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
            Utils.getSelectedItemContext(oSelectedItemsTable, function(oSelectedItemContext, iSelectedItemIndex) {
                debugger;
                var item = this.getModel("tblModel").getProperty(oSelectedItemContext.getPath());
                var arr = this.getModel("tblModel").getProperty("/right");
                var idx = oSelectedItemContext.getPath().split("/")[2];
                var length =  arr.length;
                var str = "/right/"+length;

                arr.splice(idx,1);
                this.getModel("tblModel").setProperty("/right",arr);
                
                this.getModel("tblModel").refresh(true);
            }.bind(this));
            // oSelectedItemsTable.setSelectedIndex(idx-1);

            
            //////////////////////////////////////////////////////////////////
            // var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
            // Utils.getSelectedItemContext(oSelectedItemsTable, function(oSelectedItemContext, iSelectedItemIndex) {
            //     var oItemsModel = oSelectedItemsTable.getModel();
            //     oItemsModel.setProperty("Rank", Utils.ranking.Initial, oSelectedItemContext);
            //     oItemsModel.refresh(true);
                
			// 	var oNextContext = oSelectedItemsTable.getContextByIndex(iSelectedItemIndex + 1);
			// 	if (!oNextContext) {
			// 		oSelectedItemsTable.setSelectedIndex(iSelectedItemIndex - 1);
			// 	}
            // });




			// var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
			// Utils.getSelectedItemContext(oSelectedItemsTable, function(oSelectedItemContext, iSelectedItemIndex) {
            //     // reset the rank property and update the model to refresh the bindings
            //     var oItemsModel = oSelectedItemsTable.getModel();
            //     oItemsModel.setProperty("Rank", Utils.ranking.Initial, oSelectedItemContext);
                
			// 	// select the previously selected position
			// 	var aItemsOfSelectedItemsTable = oSelectedItemsTable.getItems();
			// 	var oPrevItem = aItemsOfSelectedItemsTable[Math.min(iSelectedItemIndex, aItemsOfSelectedItemsTable.length - 1)];
			// 	if (oPrevItem) {
			// 		oPrevItem.setSelected(true);
			// 	}
			// });
        },

		onDropSelectedItemsTable: function(oEvent) {
            
            var oLeftModel = this.getModel("tblModel").getProperty("/left");

            
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
            }
            
            var item = this.getModel("tblModel").getProperty(oDraggedRowContext.getPath())
            var length =  this.getModel("tblModel").getProperty("/right").length;
            var str = "/right/"+length;
            this.getModel("tblModel").setProperty(str,item);

            this.getModel("tblModel").setProperty(str+"/vendor_pool_code","VP201610260087");

//////////////////////////////////////////////////////////////////////////////
			// var oConfig = Utils.ranking;
			// var iNewRank = oConfig.Default;
			// var oDroppedRow = oEvent.getParameter("droppedControl");

			// if (oDroppedRow && oDroppedRow instanceof TableRow) {
			// 	// get the dropped row data
			// 	var sDropPosition = oEvent.getParameter("dropPosition");
            //     var oDroppedRowContext = oDroppedRow.getBindingContext("tblModel");
            //     debugger;
			// 	var iDroppedRowRank = oDroppedRowContext.getProperty("Rank");
			// 	var iDroppedRowIndex = oDroppedRow.getIndex();
			// 	var oDroppedTable = oDroppedRow.getParent();

			// 	// find the new index of the dragged row depending on the drop position
			// 	var iNewRowIndex = iDroppedRowIndex + (sDropPosition === "After" ? 1 : -1);
			// 	var oNewRowContext = oDroppedTable.getContextByIndex(iNewRowIndex);
			// 	if (!oNewRowContext) {
			// 		// dropped before the first row or after the last row
			// 		iNewRank = oConfig[sDropPosition](iDroppedRowRank);
			// 	} else {
			// 		// dropped between first and the last row
			// 		iNewRank = oConfig.Between(iDroppedRowRank, oNewRowContext.getProperty("Rank"));
			// 	}
			// }

            // set the rank property and update the model to refresh the bindings
            // var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
            // var oItemsModel = oSelectedItemsTable.getModel("tblModel");
			// oItemsModel.setProperty("/right/2", iNewRank, oDraggedRowContext);
			// oItemsModel.setProperty("Rank", iNewRank, oDraggedRowContext);
            this.getModel("tblModel").refresh(true);
            
            // var oDraggedItem = oEvent.getParameter("draggedControl");
			// var oDraggedItemContext = oDraggedItem.getBindingContext();
			// if (!oDraggedItemContext) {
			// 	return;
			// }
		
			// var oRanking = Utils.ranking;
			// var iNewRank = oRanking.Default;
			// var oDroppedItem = oEvent.getParameter("droppedControl");

			// if (oDroppedItem instanceof ColumnListItem) {
			// 	// get the dropped row data
			// 	var sDropPosition = oEvent.getParameter("dropPosition");
			// 	var oDroppedItemContext = oDroppedItem.getBindingContext();
			// 	var iDroppedItemRank = oDroppedItemContext.getProperty("Rank");
			// 	var oDroppedTable = oDroppedItem.getParent();
			// 	var iDroppedItemIndex = oDroppedTable.indexOfItem(oDroppedItem);

			// 	// find the new index of the dragged row depending on the drop position
			// 	var iNewItemIndex = iDroppedItemIndex + (sDropPosition === "After" ? 1 : -1);
			// 	var oNewItem = oDroppedTable.getItems()[iNewItemIndex];
			// 	if (!oNewItem) {
			// 		// dropped before the first row or after the last row
			// 		iNewRank = oRanking[sDropPosition](iDroppedItemRank);
			// 	} else {
			// 		// dropped between first and the last row
			// 		var oNewItemContext = oNewItem.getBindingContext();
			// 		iNewRank = oRanking.Between(iDroppedItemRank, oNewItemContext.getProperty("Rank"));
			// 	}
			// }

			// // set the rank property and update the model to refresh the bindings
			// var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
			// var oItemsModel = oSelectedItemsTable.getModel();
			// oItemsModel.setProperty("Rank", iNewRank, oDraggedItemContext);
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameters().listItems.setSelected(true);
		},

        onSave: function() { 
			var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
			var oItemsModel = oSelectedItemsTable.getModel();
			var oModel = this.getModel();
            var oView = this.getView();
            var that = this;

            var selectedItems = this.byId("table").getItems();
            //this.byId("table").getSelectedContextPaths();

            if(selectedItems.length > 0 ){
                var param = {};
                var items = [];
                for(var i = 0 ; i < selectedItems.length; i++){
                    var selectedItemstPath = selectedItems[i].getBindingContextPath();
                    var curData = this.getView().getModel().getProperty(selectedItemstPath);
                    
                    items.push({
                        tenant_id: curData.tenant_id,
                        company_code: curData.company_code,
                        org_type_code: curData.org_type_code,
                        org_code: curData.org_code,
                        spmd_category_code: curData.spmd_category_code,
                        spmd_character_code: curData.spmd_character_code,
                        spmd_character_serial_no: Number(curData.spmd_character_serial_no),
                        vendor_pool_code: "VP201610260087"  // TODO:Mapping 페이지에 선택 되어있는 VendorPool Lavel3 코드값 으로 셋팅바람.
                    });

                }

                param.items = items;
                var url = "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemMultiProc";

                $.ajax({
                    url: url,
                    type: "POST",
                    data : JSON.stringify(param),
                    contentType: "application/json",
                    success: function(data){
					    alert("Reslt Value => ["+data.rsltCd+"] ["+data.rsltMesg+"] ["+data.rsltInfo+"] ");
                        
                    },
                    error: function(req){
					    alert("Ajax Error => "+req.status);
                    }
                });

            }
            
        }
	});

});
