sap.ui.define([
	"sap/m/MessageToast"
], function(MessageToast) {
	"use strict";

	var Utils = {

		ranking: {
			Initial: 0,
			Default: 300, //1024,
			Before: function(iRank) {
				return iRank + 300; //1024
			},
			Between: function(iRank1, iRank2) {
				// limited to 53 rows
				return (iRank1 + iRank2) / 2;
			},
			After: function(iRank) {
				return iRank / 2;
			}
		},

		getAvailableItemsTable: function(oController) {
            
            var aTableId = oController.getModel("tblModel").getProperty("/table1")
			return oController.getOwnerComponent().byId(aTableId);//"container-mdVpItemMapping---mdVpItemMapping--availableItems--table"
			// return oController.getOwnerComponent().getRootControl().byId("availableItems").byId("table");
		},

		getSelectedItemsTable: function(oController) {
            
            var sTableId = oController.getModel("tblModel").getProperty("/table2")
			return oController.getOwnerComponent().byId(sTableId);
			// return oController.getOwnerComponent().getRootControl().byId("selectedItems").byId("table");
		},

		getSelectedItemContext: function(oTable, fnCallback) {
            var aSelectedItems = oTable.getSelectedItems();
			var oSelectedItem = aSelectedItems[0];
            console.log(oSelectedItem);

			if (!oSelectedItem) {
				MessageToast.show("Please select a row!");
				return;
			}

			var oSelectedContext = oSelectedItem.getBindingContext();
			if (oSelectedContext && fnCallback) {
				var iSelectedIndex = oTable.indexOfItem(oSelectedItem);
				fnCallback(oSelectedContext, iSelectedIndex, oTable);
			}

			return oSelectedContext;
		}

	};

	return Utils;

});