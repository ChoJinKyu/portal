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
    
	return BaseController.extend("pg.md.mdVpItemList.controller.availableItems", {
       
        onBeforeRendering : function(){
            
            this.getModel("tblModel").setProperty("/table1",this.getView().byId("table").getId());

        },

        // 데이터 셋팅된 후 시점을 찾으려면 앞에서 success 부분에서 해야하ㅏㄴ?
        onAfterRendering : function(){
            this.getView().byId("table").getBinding("rows").attachDataReceived(function(data, aa){
                

            }.bind(this));
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

            this.getModel("tblModel").refresh(true);
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
                    // arr.sort(function(a, b) {
                    
                    //     if(a.spmd_category_sort_sequence < b.spmd_category_sort_sequence) return -1;
                    //     if(a.spmd_category_sort_sequence > b.spmd_category_sort_sequence) return 1;
                    //     if(a.spmd_category_sort_sequence === b.spmd_category_sort_sequence) return 0;
                    //     //return aSortNo - bSortNo;              
                    // });
                }

                this.getModel("tblModel").refresh(true);
            }.bind(this));
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