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
            
            jQuery.ajax({
                url: "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdItemListConditionView(language_code='KO')/Set", 
                contentType: "application/json",
                success: function(oData){ 
                    this.getModel().setData(oData); 
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