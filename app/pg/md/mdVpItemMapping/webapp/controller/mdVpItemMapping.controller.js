sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"jquery.sap.global",
    "sap/ui/core/util/MockServer",
	"./Utils"
],
  function (BaseController, Multilingual, JSONModel, ManagedListModel, jQuery, MockServer, Utils) {
    "use strict";

    return BaseController.extend("pg.md.mdVpItemMapping.controller.mdVpItemMapping", {

		onInit: function () {
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new JSONModel()); 
            
            var that = this;
            jQuery.ajax({
                url: "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdItemListConditionView(language_code='KO')/Set", 
                contentType: "application/json",
                success: function(oData){ 
                    // this.getModel().setData(oData);
                    // this.getModel("leftModel").setData(oData.value);
                    this.getModel("tblModel").setProperty("/left",oData.value);
                    jQuery.ajax({
                        url: "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemIngView(language_code='EN')/Set?$orderby=spmd_category_sort_sequence asc,spmd_character_sort_seq asc&$filter=trim(vendor_pool_code) eq 'VP201610260087'", 
                        contentType: "application/json",
                        success: function(oData2){ 
                            this.getModel("tblModel").setProperty("/right",oData2.value);
                            // debugger;
                            // var oSelectedItemsTable = Utils.getSelectedItemsTable(this);
                            // oSelectedItemsTable.getModel("tblModel").setProperty("/right/Rank",1);

                            // var oItemsModel = oSelectedItemsTable.getModel("/right");
			                // oItemsModel.setProperty("Rank", 1);
                            
                            // if(oData2.value.length > 0){
                            //     // for(var idx = 0; idx<oData2.value.length; idx++){
                            //         var oSelectedItemsTable = Utils.getSelectedItemsTable(that); //table2
                            //         // oSelectedItemsTable.setSelecedItem(oData2.value[0]);
                            //         //table1에서 하나씩 돌면서 해당 아이템찾아서 select했다고 하고 넘기려 했음

                            //         //같은 모델을 써서,,
                            //         // oSelectedItemsTable.getModel().setData(oData2); 
                            //     // }
                            // }
                        }.bind(this)                        
                    });
                    
                }.bind(this)                        
            });

    
        },

		onExit: function() {
			this.oItemsModel.destroy();
		},

		// initItemsModel: function() {
		// 	var oData = jQuery.sap.sjax({
        //         url: "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdItemListConditionView(language_code='KO')/Set", 
		// 		contentType: "application/json"
        //     }).data;

		// 	var oModel = new JSONModel();
        //     oModel.setData(oData);
		// 	return oModel;
		// },

		moveToAvailableItemsTable: function() {
			this.byId("selectedItems").getController().moveToAvailableItemsTable();
		},

		moveToSelectedItemsTable: function() {
			this.byId("availableItems").getController().moveToSelectedItemsTable();
		}

    });
  }
);