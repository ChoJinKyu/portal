sap.ui.define([
    "ext/lib/controller/BaseController",
	"sap/m/ColumnListItem",
	"./Utils"
], function(BaseController, ColumnListItem, Utils) {
	"use strict";
    
	return BaseController.extend("pg.md.mdVpItemMapping.controller.selectedItems", {  

        onBeforeRendering : function(){
            
            this.getModel("tblModel").setProperty("/table2",this.getView().byId("table").getId());

        },

		moveToAvailableItemsTable: function() {
			var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
			Utils.getSelectedItemContext(oSelectedItemsTable, function(oSelectedItemContext, iSelectedItemIndex) {
                // reset the rank property and update the model to refresh the bindings
                var oItemsModel = oSelectedItemsTable.getModel();
                oItemsModel.setProperty("Rank", Utils.ranking.Initial, oSelectedItemContext);
                
				// select the previously selected position
				var aItemsOfSelectedItemsTable = oSelectedItemsTable.getItems();
				var oPrevItem = aItemsOfSelectedItemsTable[Math.min(iSelectedItemIndex, aItemsOfSelectedItemsTable.length - 1)];
				if (oPrevItem) {
					oPrevItem.setSelected(true);
				}
			});
        },

		onDropSelectedItemsTable: function(oEvent) {
            var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext();
			if (!oDraggedItemContext) {
				return;
			}
		
			var oRanking = Utils.ranking;
			var iNewRank = oRanking.Default;
			var oDroppedItem = oEvent.getParameter("droppedControl");

			if (oDroppedItem instanceof ColumnListItem) {
				// get the dropped row data
				var sDropPosition = oEvent.getParameter("dropPosition");
				var oDroppedItemContext = oDroppedItem.getBindingContext();
				var iDroppedItemRank = oDroppedItemContext.getProperty("Rank");
				var oDroppedTable = oDroppedItem.getParent();
				var iDroppedItemIndex = oDroppedTable.indexOfItem(oDroppedItem);

				// find the new index of the dragged row depending on the drop position
				var iNewItemIndex = iDroppedItemIndex + (sDropPosition === "After" ? 1 : -1);
				var oNewItem = oDroppedTable.getItems()[iNewItemIndex];
				if (!oNewItem) {
					// dropped before the first row or after the last row
					iNewRank = oRanking[sDropPosition](iDroppedItemRank);
				} else {
					// dropped between first and the last row
					var oNewItemContext = oNewItem.getBindingContext();
					iNewRank = oRanking.Between(iDroppedItemRank, oNewItemContext.getProperty("Rank"));
				}
			}

			// set the rank property and update the model to refresh the bindings
			var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
			var oItemsModel = oSelectedItemsTable.getModel();
			oItemsModel.setProperty("Rank", iNewRank, oDraggedItemContext);
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
            debugger;
            var selectedItems = this.byId("table").getItems();
            //this.byId("table").getSelectedContextPaths();

            if(selectedItems.length > 0 ){
                var param = {};
                var items = [];
                for(var i = 0 ; i < selectedItems.length; i++){
                    var selectedItemstPath = selectedItems[i].getBindingContextPath();
                    var curData = this.getView().getModel().getProperty(selectedItemstPath);

                    // items.push(curData);
                    
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
                        // var v_returnModel = oView.getModel("returnModel").getData();
                        // v_returnModel.headerList = data.savedHeaders;
                        // v_returnModel.detailList = data.savedDetails;
                        // oView.getModel("returnModel").updateBindings(true);
                        // that.onSearch();
                        // oSelectedItemsTable.
                        
                    },
                    error: function(req){
					    alert("Ajax Error => "+req.status);
                    }
                });

            }
            
        }
	});

});
