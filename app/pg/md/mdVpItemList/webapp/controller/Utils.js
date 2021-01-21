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

        getAvailableItemsTableRows:function(oController){
            var tableId = oController.getModel("tblModel").getProperty("/table1");
            var rowId = tableId+"-rows-row";
			return rowId;
        },

        getSelectedItemsTableRows:function(oController){
            var tableId = oController.getModel("tblModel").getProperty("/table2");
            var rowId = tableId+"-rows-row";
			return rowId;
        },
        
		getAvailableItemsTable: function(oController) {
            
            var aTableId = oController.getModel("tblModel").getProperty("/table1")
			return oController.byId(aTableId);
		},

		getSelectedItemsTable: function(oController) {
            
            var sTableId = oController.getModel("tblModel").getProperty("/table2")
			return oController.byId(sTableId);//.getOwnerComponent()
		},

		getSelectedItemContext: function(oTable, fnCallback) {
			var iSelectedIndex = oTable.getSelectedIndex();

			if (iSelectedIndex === -1) {
				MessageToast.show("Please select a row!");
				return;
			}

			var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
			if (oSelectedContext && fnCallback) {
				fnCallback.call(this, oSelectedContext, iSelectedIndex, oTable);
			}

			return oSelectedContext;
		}

	};

	return Utils;

});