sap.ui.define([
    "ext/lib/controller/BaseController",
	"sap/m/ColumnListItem",
	"sap/ui/table/Row",
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"./Utils"
], function(BaseController, ColumnListItem, TableRow, jQuery, JSONModel, MessageBox, MessageToast, Utils) {
	"use strict";
    
	return BaseController.extend("pg.md.mdVpItemList.controller.selectedItems", {  

        onBeforeRendering : function(){
            
            this.getModel("tblModel").setProperty("/table2",this.getView().byId("table").getId());

        },

		onDragStart: function(oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");

			// keep the dragged row context for the drop action
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext("tblModel"));
		},

		moveToAvailableItemsTable: function() {

            var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
            Utils.getSelectedItemContext(oSelectedItemsTable, function(oSelectedItemContext, iSelectedItemIndex) {
                
                var item = this.getModel("tblModel").getProperty(oSelectedItemContext.getPath());
                var arr = this.getModel("tblModel").getProperty("/right");
                var idx = oSelectedItemContext.getPath().split("/")[2];
                var length =  arr.length;
                var str = "/right/"+length;

                arr.splice(idx,1);
                this.getModel("tblModel").setProperty("/right",arr);
                
            }.bind(this));
            this.getModel("tblModel").refresh(true);
        },

		onDropSelectedItemsTable: function(oEvent) {

			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
			if (!oDraggedRowContext) {
				return;
            }
            
            var item = this.getModel("tblModel").getProperty(oDraggedRowContext.getPath());
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
                
                    if(a.spmd_category_sort_sequence < b.spmd_category_sort_sequence) return -1;
                    if(a.spmd_category_sort_sequence > b.spmd_category_sort_sequence) return 1;
                    if(a.spmd_category_sort_sequence === b.spmd_category_sort_sequence) return 0;
                    //return aSortNo - bSortNo;              
                });
            }
            this.getModel("tblModel").refresh(true);
		},

		onBeforeOpenContextMenu: function(oEvent) {
			oEvent.getParameters().listItems.setSelected(true);
		}
        
	});

});
