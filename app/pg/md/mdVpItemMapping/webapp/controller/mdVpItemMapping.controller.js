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
                        }.bind(this)                        
                    });
                    
                }.bind(this)                        
            });

            // var rows = this.getModel("tblModel").getProperty("/left");
            // for(var i=0; i<rows.length; i++){
            //     var row = rows[i];
            //     // if(row.getCells()[0].getText() == this._category_code){
            //         var sId = "container-mdVpItemMapping---mdVpItemMapping--availableItems--table-rows-row0";//row.getId();
            //         $("#"+sId).css("background-color", "yellow");
                    
            
            //     // }
            // }
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