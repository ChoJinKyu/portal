sap.ui.define([
    "ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"jquery.sap.global",
	"./Utils"
], function (BaseController, Multilingual, ManagedListModel, Filter, FilterOperator, jQuery, Utils) {
    
    "use strict";
    
	return BaseController.extend("pg.md.mdVpItemMapping.controller.availableItems", {
       
        onBeforeRendering : function(){
            
            this.getModel("tblModel").setProperty("/table1",this.getView().byId("table").getId());

            // var oModel = this.getView().getModel();
            // oModel.setSizeLimit(20);

        },

        // 데이터 셋팅된 후 시점을 찾으려면 앞에서 success 부분에서 해야하ㅏㄴ?
        // onAfterRendering : function(){
        //     debugger;
        //     var rows = Utils.getAvailableItemsTable(this).getRows();
        //     for(var i=0; i<rows.length; i++){
        //         var row = rows[i];
        //         // if(row.getCells()[0].getText() == this._category_code){
        //             var sId = row.getId();
        //             $("#"+sId).css("background-color", "green");
                    
            
        //         // }
        //     }
        // },

        onDropAvailableItemsTable: function(oEvent) {
			var oDraggedItem = oEvent.getParameter("draggedControl");
			var oDraggedItemContext = oDraggedItem.getBindingContext();
			if (!oDraggedItemContext) {
				return;
			}

            // reset the rank property and update the model to refresh the bindings
			var oAvailableTable = Utils.getAvailableItemsTable(this); //table
			var oItemsModel = oAvailableTable.getModel();
			oItemsModel.setProperty("Rank", Utils.ranking.Initial, oDraggedItemContext);
		},

		moveToSelectedItemsTable: function() {
			var oAvailableTable = Utils.getAvailableItemsTable(this);
			Utils.getSelectedItemContext(oAvailableTable, function(oAvailableItemContext, iAvailableItemIndex) {
				var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
				var oFirstItemOfSelectedItemsTable = oSelectedItemsTable.getItems()[0];
				var iNewRank = Utils.ranking.Default;

				if (oFirstItemOfSelectedItemsTable) {
					var oFirstContextOfSelectedItemsTable = oFirstItemOfSelectedItemsTable.getBindingContext();
					iNewRank =  Utils.ranking.Before(oFirstContextOfSelectedItemsTable.getProperty("Rank"));
				}

				var oItemsModel = oAvailableTable.getModel();
				oItemsModel.setProperty("Rank", iNewRank, oAvailableItemContext);

				// select the inserted and previously selected item
				oSelectedItemsTable.getItems()[0].setSelected(true);
				var oPrevSelectedItem = oAvailableTable.getItems()[iAvailableItemIndex];
				if (oPrevSelectedItem) {
					oPrevSelectedItem.setSelected(true);
				}
			}.bind(this));
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameter("listItems").setSelected(true);
        },

        onTableFilterPress: function() {
            var oView = this.getView(),
				sValue = oView.byId("tableSearchField").getValue(),
				oFilter = new Filter("spmd_character_code_name", FilterOperator.Contains, sValue);

			oView.byId("table").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);
        }
	});
});