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

		getSelectedProductsTable: function(oController) {
            return oController.getOwnerComponent().byId("mainTable");
			//return oController.getOwnerComponent().getRootControl().byId("mdCategoryItem").byId("mainTable");
		},

		getSelectedItemContext: function(oTable, fnCallback) {
            var aSelectedItems = oTable.getSelectedItems();
			var oSelectedItem = aSelectedItems[0];
            console.log(oSelectedItem);

			if (!oSelectedItem) {
				MessageToast.show("Please select a row!");
				return;
			}

			var oSelectedContext = oSelectedItem.getBindingContext("list");
			if (oSelectedContext && fnCallback) {
				var iSelectedIndex = oTable.indexOfItem(oSelectedItem);
				fnCallback(oSelectedContext, iSelectedIndex, oTable);
			}

			return oSelectedContext;
		}

	};

	return Utils;

});