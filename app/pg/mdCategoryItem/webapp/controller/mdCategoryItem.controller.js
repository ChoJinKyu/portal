sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"sap/m/TablePersoController",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/ui/core/Item",
	"./Utils"
],
  function (BaseController, Multilingual, Validator, DateFormatter, History, JSONModel, ManagedListModel, TablePersoController, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, Item, Utils) {
    "use strict";

    return BaseController.extend("pg.mdCategoryItem.controller.mdCategoryItem", {

      //formatter: formatter,
       Validator : new Validator(),
	   dateFormatter: DateFormatter,

      onInit: function () {
          
        var oMultilingual = new Multilingual();
        this.setModel(oMultilingual.getModel(), "I18N");
        this.getView().setModel(new ManagedListModel(), "list");
        
        // 개인화 - UI 테이블의 경우만 해당
        this._oTPC = new TablePersoController({
          customDataKey: "mdCategoryItem"
        }).setTable(this.byId("mainTable"));
        
        this.rowIndex=0;
        this.aSearchCategoryCd = "C001";
        this.byId("textCategoryCode").setText(this.aSearchCategoryCd);
        // this.byId("textCategoryName").setText();
      },


      onMainTablePersoButtonPressed: function (event) {
        this._oTPC.openDialog();
      },
      // Display row number without changing data
      onAfterRendering: function () {
        this.onSearch();
      },

      onSeletionChange: function () {
        var oTable = this.byId("mainTable"),
            oModel = this.getView().getModel("list"),
            
            oItem = oTable.getSelectedItem(); //*********************전역변수로 갖고 처리해보기 */
            this._setEditChange(this.rowIndex,"R");
            // oTable.getAggregation('items')[2].setSelected(false);
            // debugger;
            var idx = oTable.indexOfItem(oItem);//oItem.getBindingContextPath().split("/")[2];
            this.rowIndex = idx;

            this.byId("buttonMainCancelRow").setEnabled(true);  
            this._setEditChange(this.rowIndex,"E");
            
    //     var aItems = oTable.getSelectedItems();
    //     if(aItems.length>0){
    //         aItems[1].setSelected(false);
    //     }
      },


      onSearch: function () {
            var aFilters = [];
            aFilters.push(new Filter("spmd_category_code", FilterOperator.EQ, this.aSearchCategoryCd));

            this.getView()
                .setBusy(true)
                .getModel("list")
                .setTransactionModel(this.getView().getModel())
                .read("/MdCategoryItem?$orderby=spmd_character_sort_seq", {
				    filters: aFilters,
                    success: (function (oData) {
                    this.getView().setBusy(false);
                    }).bind(this)
                });
            var oTable = this.byId("mainTable");
            this.byId("buttonMainAddRow").setEnabled(true);     
            this.byId("buttonMainCancelRow").setEnabled(false);  
            this._setEditChange(this.rowIndex,"R"); 
        },
      
      onAdd: function () {
            var [tId, mName, sEntity, aCol] = arguments;
            //tableId modelName EntityName tenant_id
            var oTable = this.byId(tId), //mainTable
                oModel = this.getView().getModel(mName); //list
            var oDataArr, oDataLength, lastCtgrSeq, ctgrSeq;
            this._setEditChange(this.rowIndex,"R");

            //데이터 불러올때 spmd_character_sort_seq으로 가져와야함 orderby
            if(oModel.oData){
                oDataArr = oModel.getProperty("/MdCategoryItem"); 
                oDataLength = oDataArr.length;
                lastCtgrSeq = oDataArr[oDataLength-1].spmd_character_sort_seq;
                debugger;
                console.log(lastCtgrSeq);
                ctgrSeq = String(parseInt(lastCtgrSeq)+1);
            }

            oModel.addRecord({
				"tenant_id": "L2100",
				"company_code": "*",
				"org_type_code": "BU",
                "org_code": "BIZ00200",
                "spmd_category_code":"C001", //*************파라미터값으로 변경 필요************ */
				"spmd_character_code": "",
				"spmd_character_sort_seq": ctgrSeq,
                "spmd_character_code_name": "",
                "spmd_character_desc": ""
                // "system_update_dtm": new Date(),
                // "local_create_dtm": new Date(),
                // "local_update_dtm": new Date()
            }, "/MdCategoryItem" , oDataLength);  

            this.rowIndex = oDataLength;
		    this.byId("buttonMainAddRow").setEnabled(false);
            this.byId("buttonMainCancelRow").setEnabled(true); 
            this._setEditChange(this.rowIndex,"E");  
        },
        
        onDelete: function(oEvent){
            var table = oEvent.getSource().getParent().getParent();
           
            var model = this.getView().getModel(table.getBindingInfo('items').model);
            model.setProperty("/entityName", "MdCategoryItem");

            table.getSelectedItems().reverse().forEach(function(item){
                var iSelectIndex = table.indexOfItem(item);
                if(iSelectIndex > -1){
                    model.markRemoved(iSelectIndex);
                }
             });

            table.removeSelections(true);
            this._setEditChange(this.rowIndex,"R");  
        },

      onSave: function () {
        var [tId, mName] = arguments;
        var view = this.getView();
        var model = view.getModel(mName);
        // Validation
        if (model.getChanges() <= 0) {
			MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
          return;
        }
        if(this.Validator.validate(this.byId(tId)) !== true){
            // MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            return;
        }

        MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
          title: this.getModel("I18N").getText("/SAVE"),
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: (function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                groupId: "MdCategoryItem",
                success: (function (oEvent) {
                  view.setBusy(false);
                  MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                  this.refresh();
                //   this.onSearch();
                }).bind(this)
              });
            }
          }).bind(this)
        })
      },


    _setEditChange: function(index,mode){
        var oTable = this.byId("mainTable");
        var flag = true;
        if(mode=="E"){
            flag = false;
        }
        console.log(index);
        oTable.getAggregation('items')[index].getCells()[3].getItems()[0].setVisible(flag);
        oTable.getAggregation('items')[index].getCells()[3].getItems()[1].setVisible(!flag);
        oTable.getAggregation('items')[index].getCells()[4].getItems()[0].setVisible(flag);
        oTable.getAggregation('items')[index].getCells()[4].getItems()[1].setVisible(!flag);
        oTable.getAggregation('items')[index].getCells()[5].getItems()[0].setVisible(flag);
        oTable.getAggregation('items')[index].getCells()[5].getItems()[1].setVisible(!flag); 
            
    },

    onDropSelectedProductsTable: function(oEvent) {
        var oDraggedItem = oEvent.getParameter("draggedControl");
        var oDraggedItemContext = oDraggedItem.getBindingContext("list");
        if (!oDraggedItemContext) {
            return;
        }

        var oRanking = Utils.ranking;
        var iNewRank = oRanking.Default;
        var oDroppedItem = oEvent.getParameter("droppedControl");

        if (oDroppedItem instanceof ColumnListItem) {
            // get the dropped row data
            var sDropPosition = oEvent.getParameter("dropPosition");
            var oDroppedItemContext = oDroppedItem.getBindingContext("list");
            var iDroppedItemRank = oDroppedItemContext.getProperty("spmd_character_sort_seq");
            var oDroppedTable = this.byId("mainTable"); //oDroppedItem.getParent();
            var iDroppedItemIndex = oDroppedTable.indexOfItem(oDroppedItem)-1;

            // find the new index of the dragged row depending on the drop position
            var iNewItemIndex = iDroppedItemIndex + (sDropPosition === "After" ? 1 : -1);
            var oNewItem = oDroppedTable.getItems()[iNewItemIndex];
            debugger;
            if (!oNewItem) {
                // dropped before the first row or after the last row
                iNewRank = oRanking[sDropPosition](iDroppedItemRank);
            } else {
                // dropped between first and the last row
                var oNewItemContext = oNewItem.getBindingContext("list");
                iNewRank = oRanking.Between(iDroppedItemRank, oNewItemContext.getProperty("spmd_character_sort_seq"));
            }
        }

        // set the rank property and update the model to refresh the bindings
        var oSelectedProductsTable = this.byId("mainTable");
        var oProductsModel = oSelectedProductsTable.getModel("list");
        // oProductsModel.setProperty("", iNewRank, oDraggedItemContext);
    },

    moveSelectedItem: function(sDirection) {
        var oSelectedProductsTable = this.byId("mainTable");// 
        Utils.getSelectedItemContext(oSelectedProductsTable, function(oSelectedItemContext, iSelectedItemIndex) {
            var oSelectedItem = oSelectedProductsTable.getItems()[iSelectedItemIndex];
            var iSiblingItemIndex = iSelectedItemIndex + (sDirection === "Up" ? -1 : 1);
            
            var oSiblingItem = oSelectedProductsTable.getItems()[iSiblingItemIndex];
            var oSiblingItemContext = oSiblingItem.getBindingContext("list");
            console.log(oSiblingItemContext);
            
            if (!oSiblingItemContext) {
                return;
            }

            // swap the selected and the siblings rank
            var oProductsModel = oSelectedProductsTable.getModel("list");
            console.log(oProductsModel);
            var iSiblingItemRank = oSiblingItemContext.getProperty(); //바뀔
            var iSelectedItemRank = oSelectedItemContext.getProperty(); //선택셀
            console.log(iSiblingItemRank);
            console.log(iSelectedItemRank);

            var iSeq = oProductsModel.getProperty(oSiblingItem.getBindingContextPath()).spmd_character_sort_seq
            var oSeq = oProductsModel.getProperty(oSelectedItem.getBindingContextPath()).spmd_character_sort_seq //클릭셀
            var iSeqIdx = "/MdCategoryItem/"+iSiblingItemIndex+"/spmd_character_sort_seq"
            var oSeqIdx = "/MdCategoryItem/"+iSelectedItemIndex+"/spmd_character_sort_seq"
            
            oProductsModel.setProperty("", iSiblingItemRank, oSelectedItemContext);
            oProductsModel.setProperty("", iSelectedItemRank, oSiblingItemContext);
            oProductsModel.setProperty(iSeqIdx,iSeq);
            oProductsModel.setProperty(oSeqIdx,oSeq);

            // after move select the sibling
            oSelectedProductsTable.getItems()[iSiblingItemIndex].setSelected(true);
        });
    },

    moveUp: function() {
        this.moveSelectedItem("Up");
    },

    moveDown: function() {
        this.moveSelectedItem("Down");
    }

    });
  }
);