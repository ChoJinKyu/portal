sap.ui.define([
    "ext/lib/controller/BaseController",
	"sap/m/ColumnListItem",
	"./Utils"
], function(BaseController, ColumnListItem, Utils) {
	"use strict";
    
	return BaseController.extend("pg.md.mdVpItemMapping.controller.selectedItems", {  
		moveToAvailableProductsTable: function() {
			var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
			Utils.getSelectedItemContext(oSelectedProductsTable, function(oSelectedItemContext, iSelectedItemIndex) {
				// reset the rank property and update the model to refresh the bindings
				var oProductsModel = oSelectedProductsTable.getModel();
				oProductsModel.setProperty("Rank", Utils.ranking.Initial, oSelectedItemContext);

				// select the previously selected position
				var aItemsOfSelectedProductsTable = oSelectedProductsTable.getItems();
				var oPrevItem = aItemsOfSelectedProductsTable[Math.min(iSelectedItemIndex, aItemsOfSelectedProductsTable.length - 1)];
				if (oPrevItem) {
					oPrevItem.setSelected(true);
				}
			});
		},

		onDropSelectedProductsTable: function(oEvent) {
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
			var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
			var oProductsModel = oSelectedProductsTable.getModel();
			oProductsModel.setProperty("Rank", iNewRank, oDraggedItemContext);
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameters().listItem.setSelected(true);
		}
	});

});
