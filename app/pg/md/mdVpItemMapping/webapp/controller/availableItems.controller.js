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

        },

        // 데이터 셋팅된 후 시점을 찾으려면 앞에서 success 부분에서 해야하ㅏㄴ?
        onAfterRendering : function(){
            var sId = "container-mdVpItemMapping---mdVpItemMapping--availableItems--table-rows-row0";//row.getId();
            $("#"+sId).css("background-color", "yellow");
            // debugger;
            // var rows = Utils.getAvailableItemsTable(this).getRows();
            // for(var i=0; i<rows.length; i++){
            //     var row = rows[i];
            //     // if(row.getCells()[0].getText() == this._category_code){
            //         var sId = row.getId();
            //         $("#"+sId).css("background-color", "green");
                    
            
            //     // }
            // }
        },

		onDragStart: function(oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");
			
            oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext("tblModel"));
		},

        onDropAvailableItemsTable: function(oEvent) {
            
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
            }
            
            var item = this.getModel("tblModel").getProperty(oDraggedRowContext.getPath());
            var arr = this.getModel("tblModel").getProperty("/right");
            var idx = oDraggedRowContext.getPath().split("/")[2];
                       
            arr.splice(idx,1);
            this.getModel("tblModel").setProperty("/right",arr);


			// var oDragSession = oEvent.getParameter("dragSession");
			// var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			// if (!oDraggedRowContext) {
			// 	return;
            // }
            // var oAvailableTable = Utils.getAvailableItemsTable(this);
			// var oItemsModel = oAvailableTable.getModel();
			// oItemsModel.setProperty("Rank", Utils.ranking.Initial, oDraggedRowContext);
            this.getModel("tblModel").refresh(true);
            
			// var oDraggedItem = oEvent.getParameter("draggedControl");
			// var oDraggedItemContext = oDraggedItem.getBindingContext();
			// if (!oDraggedItemContext) {
			// 	return;
			// }

            // // reset the rank property and update the model to refresh the bindings
			// var oAvailableTable = Utils.getAvailableItemsTable(this); //table
			// var oItemsModel = oAvailableTable.getModel();
			// oItemsModel.setProperty("Rank", Utils.ranking.Initial, oDraggedItemContext);
		},

		moveToSelectedItemsTable: function() {
        
            var oAvailableTable = Utils.getAvailableItemsTable(this);
			Utils.getSelectedItemContext(oAvailableTable, function(oSelectedRowContext) {
                var oSelectedItemsTable = Utils.getSelectedItemsTable(this);

                var item = this.getModel("tblModel").getProperty(oSelectedRowContext.getPath());
                var arr =  this.getModel("tblModel").getProperty("/right");
                var length =  this.getModel("tblModel").getProperty("/right").length;
                var str = "/right/"+length;

                var flag=true;
                for(var idx=0; idx<length; idx++){
                    if(arr[idx].spmd_character_code ==item.spmd_character_code){
                        flag = false ;
                        return;
                    }
                }

                if(flag){
                    item.vendor_pool_code = "VP201610260087";
                    arr.push(item); 
                    arr.sort(function(a, b) {
                        // var aSortNo = a.spmd_category_sort_sequence+"_"+a.spmd_character_sort_seq;
                        // var bSortNo = b.spmd_category_sort_sequence+"_"+b.spmd_character_sort_seq;
                        // if(aSortNo < bSortNo) return -1;
                        // if(aSortNo > bSortNo) return 1;
                        // if(aSortNo === bSortNo) return 0;
                    
                        if(a.spmd_category_sort_sequence < b.spmd_category_sort_sequence) return -1;
                        if(a.spmd_category_sort_sequence > b.spmd_category_sort_sequence) return 1;
                        if(a.spmd_category_sort_sequence === b.spmd_category_sort_sequence) return 0;
                        //return aSortNo - bSortNo;              
                    });
                }

                this.getModel("tblModel").refresh(true);
            }.bind(this));


            // var oAvailableTable = Utils.getAvailableItemsTable(this);
			// Utils.getSelectedItemContext(oAvailableTable, function(oSelectedRowContext) {
			// 	var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
            //     var oFirstRowContext = oSelectedItemsTable.getContextByIndex(0);

			// 	// insert always as a first row
			// 	var iNewRank = Utils.ranking.Default;
			// 	if (oFirstRowContext) {
			// 		iNewRank =  Utils.ranking.Before(oFirstRowContext.getProperty("Rank"));
			// 	}

            //     var oItemsModel = oAvailableTable.getModel();
			// 	oItemsModel.setProperty("Rank", iNewRank, oSelectedRowContext);
			// 	oItemsModel.refresh(true);

			// 	// select the inserted row
			// 	oSelectedItemsTable.setSelectedIndex(0);
            // }.bind(this));
            ///////////////////////////////////////////////////////



            // var oMasterModel = this.getModel("tblModel");
            // var oDetailsModel = this.getModel("details");
            // var sTenantId = oMasterModel.getProperty("/tenant_id");
            // var sControlOPtionCode = oMasterModel.getProperty("/control_option_code");
            // var oDetailsData = oDetailsModel.getData();
            // oDetailsData.forEach(function (oItem, nIndex) {
            // oDetailsModel.setProperty("/" + nIndex + "/tenant_id", sTenantId);
            // oDetailsModel.setProperty("/" + nIndex + "/control_option_code", sControlOPtionCode);
            // });
            // oDetailsModel.setData(oDetailsData);

			// var oAvailableTable = Utils.getAvailableItemsTable(this);
			// Utils.getSelectedItemContext(oAvailableTable, function(oAvailableItemContext, iAvailableItemIndex) {
			// 	var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
			// 	var oFirstItemOfSelectedItemsTable = oSelectedItemsTable.getItems()[0];
			// 	var iNewRank = Utils.ranking.Default;

			// 	if (oFirstItemOfSelectedItemsTable) {
			// 		var oFirstContextOfSelectedItemsTable = oFirstItemOfSelectedItemsTable.getBindingContext();
			// 		iNewRank =  Utils.ranking.Before(oFirstContextOfSelectedItemsTable.getProperty("Rank"));
			// 	}

			// 	var oItemsModel = oAvailableTable.getModel();
			// 	oItemsModel.setProperty("Rank", iNewRank, oAvailableItemContext);

			// 	// select the inserted and previously selected item
			// 	oSelectedItemsTable.getItems()[0].setSelected(true);
			// 	var oPrevSelectedItem = oAvailableTable.getItems()[iAvailableItemIndex];
			// 	if (oPrevSelectedItem) {
			// 		oPrevSelectedItem.setSelected(true);
			// 	}
			// }.bind(this));
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameter("listItems").setSelected(true);
        },

        onTableFilterPress: function() {
            var oView = this.getView(),
				sValue = oView.byId("tableSearchField").getValue(),
				oFilter = new Filter("spmd_character_code_name", FilterOperator.Contains, sValue);

			oView.byId("table").getBinding("rows").filter(oFilter, sap.ui.model.FilterType.Application);
        }
	});
});