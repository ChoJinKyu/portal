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
    var that;

    return BaseController.extend("pg.md.mdVpItemMapping.controller.mdVpItemMapping", {

		onInit: function () {
            that = this;
            this.onRead();
           
        },

        onRead: function(){
            // return new Promise(function(resolve,seject){

            // });
            //var oMultilingual = new Multilingual();
			//this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new JSONModel()); 

            jQuery.ajax({
                url: "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdItemListConditionView(language_code='KO')/Set", 
                contentType: "application/json",
                success: function(oData){ 
                    // debugger;
                    this.getModel("tblModel").setProperty("/left",oData.value);
                    
                    jQuery.ajax({
                        url: "pg/md/mdVpItemMapping/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdVpMappingItemIngView(language_code='EN')/Set?$orderby=spmd_category_sort_sequence asc,spmd_character_sort_seq asc&$filter=trim(vendor_pool_code) eq 'VP201610260087'", 
                        contentType: "application/json",
                        success: function(oData2){ 
                            this.getModel("tblModel").setProperty("/right",oData2.value);
                            //setTimeout(this.onSetColor(), 3000); //화면그려지고 호출될때도 있지만 그려지기 전에 호출되기도 함
                        }.bind(this)                        
                    });
                    
                }.bind(this)                        
            });
            
            
        },
        onSetColor: function(){
        // onRead().then(function(){

        // })    
            var leftRows = this.getModel("tblModel").getProperty("/left");
            var rightRows = this.getModel("tblModel").getProperty("/right");
            var cellColor ="#FFFFFF";
            var cellColor2 ="#FFFFFF";
            // debugger;
            var sId = Utils.getAvailableItemsTableRows(that);
            var sId2 = Utils.getSelectedItemsTableRows(that);

            //전체다 동일 색상
            for(var i=0; i<leftRows.length; i++){
                var row = leftRows[i];
                if(row.rgb_cell_clolor_code != null){
                    cellColor = row.rgb_cell_clolor_code;
                    var rowId = "#"+sId+i;
                    $(rowId).css("background-color", cellColor); 
                    // console.log(rowId, row.spmd_category_code+":"+cellColor)

                }
            }

            for(var i=0; i<rightRows.length; i++){
                var row = rightRows[i];
                if(row.rgb_cell_clolor_code != null){
                    cellColor2 = row.rgb_cell_clolor_code;
                    var rowId = "#"+sId2+i;
                    $(rowId).css("background-color", cellColor2); 
                }
            }

        },
        
		onExit: function() {
			this.oItemsModel.destroy();
		},

		moveToAvailableItemsTable: function() {
			this.byId("selectedItems").getController().moveToAvailableItemsTable();
		},

		moveToSelectedItemsTable: function() {
			this.byId("availableItems").getController().moveToSelectedItemsTable();
		}

    });
  }
);