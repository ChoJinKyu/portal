sap.ui.define([
    "ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"./Utils"
], function (BaseController, Multilingual, ManagedListModel, Filter, FilterOperator, Utils) {
    
    "use strict";
    
	return BaseController.extend("pg.mdVpItemMapping.controller.availableItems", {
        
        
        onInit: function () {
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new ManagedListModel(), "list");
            this.onSearch();
        },

      onSearch: function () {
            // this.getView()
            //     .setBusy(true)
            //     .getModel("list")
            //     .setTransactionModel(this.getView().getModel())
            //     .read("/MdCategory", {
            //         success: (function (oData) {
            //         this.getView().setBusy(false);
            //         }).bind(this)
            //     });
        },

        onDropAvailableProductsTable: function(oEvent) {
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext();
			if (!oDraggedItemContext) {
				return;
			}

			// reset the rank property and update the model to refresh the bindings
			var oAvailableTable = Utils.getAvailableProductsTable(this);
			var oProductsModel = oAvailableTable.getModel();
			oProductsModel.setProperty("Rank", Utils.ranking.Initial, oDraggedItemContext);
		},

		moveToSelectedProductsTable: function() {
			var oAvailableTable = Utils.getAvailableProductsTable(this);
			Utils.getSelectedItemContext(oAvailableTable, function(oAvailableItemContext, iAvailableItemIndex) {
				var oSelectedProductsTable = Utils.getSelectedProductsTable(this);
				var oFirstItemOfSelectedProductsTable = oSelectedProductsTable.getItems()[0];
				var iNewRank = Utils.ranking.Default;

				if (oFirstItemOfSelectedProductsTable) {
					var oFirstContextOfSelectedProductsTable = oFirstItemOfSelectedProductsTable.getBindingContext();
					iNewRank =  Utils.ranking.Before(oFirstContextOfSelectedProductsTable.getProperty("Rank"));
				}

				var oProductsModel = oAvailableTable.getModel();
				oProductsModel.setProperty("Rank", iNewRank, oAvailableItemContext);

				// select the inserted and previously selected item
				oSelectedProductsTable.getItems()[0].setSelected(true);
				var oPrevSelectedItem = oAvailableTable.getItems()[iAvailableItemIndex];
				if (oPrevSelectedItem) {
					oPrevSelectedItem.setSelected(true);
				}
			}.bind(this));
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameter("listItem").setSelected(true);
		}

	});
});