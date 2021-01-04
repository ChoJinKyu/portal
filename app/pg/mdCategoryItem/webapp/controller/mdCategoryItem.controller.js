sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
	"ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/Formatter",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"sap/m/TablePersoController",
	"sap/ui/model/Sorter",
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
  function (BaseController, Multilingual, Validator, DateFormatter, Formatter, History, JSONModel, ManagedListModel, TablePersoController, Sorter, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, Item, Utils) {
    "use strict";

    return BaseController.extend("pg.mdCategoryItem.controller.mdCategoryItem", {

      formatter: Formatter,
       Validator : new Validator(),
	   dateFormatter: DateFormatter,

      onInit: function () {
          
        var oMultilingual = new Multilingual();
        this.setModel(oMultilingual.getModel(), "I18N");
        // this.getView().setModel(new ManagedListModel(), "list");
        
        this.viewModel = new JSONModel({
            MdCategoryItem : []
        });
        this.getView().setModel(this.viewModel, "list");
        
        this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);


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
            // this._setEditChange(this.rowIndex,"R");
            
            var idx = oTable.indexOfItem(oItem);//oItem.getBindingContextPath().split("/")[2];
            this.rowIndex = idx;
 
            // this._setEditChange(this.rowIndex,"E");
            
      },

    onListItemPress: function (oEvent) {
        
        var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);
        
        this.getRouter().navTo("midPage", {
            layout: oNextUIState.layout, 
            company_code: oRecord.company_code,
            org_type_code: oRecord.org_type_code,
            org_code: oRecord.org_code,
            spmd_category_code: oRecord.spmd_category_code,
            spmd_character_code: oRecord.spmd_character_code,
            spmd_character_sort_seq: oRecord.spmd_character_sort_seq
        });
            
    },

      onSearch: function () {
            var aFilters = [];
            var aSorter = [];
            aFilters.push(new Filter("spmd_category_code", FilterOperator.EQ, this.aSearchCategoryCd));
            aSorter.push(new Sorter("spmd_character_sort_seq", false));

            var oView = this.getView();
            var param1 = "'C001'";
        //     var input = {};
        //     var inputData = {};
        //    inputData = {
        //         "spmd_category_code": 'C001'//oView.getModel("list").getData().spmd_category_code
        //     }
        //     input.inputData = inputData;
            
            var url = "pg/mdCategoryItem/webapp/srv-api/odata/v4/pg.MdCategoryV4Service/MdItemListConditionView(language_code='KO')/Set?$filter=spmd_category_code eq "+param1;    // 아이템특성목록View 파라메터 호출O
            $.ajax({
                url: url,
                type: "GET",
                // data : JSON.stringify(input),
                contentType: "application/json",
                success: function(data){
                    var v_list = oView.getModel("list").getData();
                    v_list.MdCategoryItem = data.value;
                    oView.getModel("list").updateBindings(true); 
                },
                error: function(e){
                    
                }
            });

            // this.getView()
            //     .setBusy(true)
            //     .getModel("list")
            //     .setTransactionModel(this.getView().getModel())
            //     .read("/MdCategoryItem", {
            //         filters: aFilters,                
            //         sorters : aSorter,
            //         success: (function (oData) {
            //         this.getView().setBusy(false);
            //         }).bind(this)
            //     });

            this.byId("buttonMainAddRow").setEnabled(true);  
            // this._setEditChange(this.rowIndex,"R"); 
        },
      
      onAdd: function () {          
            var oTable = this.byId("mainTable"), 
                oModel = this.getView().getModel("list");
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            var  oDataArr, oDataLength, lastCtgrSeq;
            var ctgrSeq="";

            if(oModel.oData){
                oDataArr = oModel.getProperty("/MdCategoryItem"); 
                oDataLength = oDataArr.length;
                lastCtgrSeq = oDataArr[oDataLength-1].spmd_character_sort_seq;
                console.log(lastCtgrSeq);
                ctgrSeq = String(parseInt(lastCtgrSeq)+1);
            }
            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout, 
                company_code: "*",
                org_type_code: "BU",
                org_code: "BIZ00200",
                spmd_category_code: "C001",
                spmd_character_code: "new",
                spmd_character_sort_seq: ctgrSeq
            });

            // var [tId, mName, sEntity, aCol] = arguments;
            // //tableId modelName EntityName tenant_id
            // var oTable = this.byId(tId), //mainTable
            //     oModel = this.getView().getModel(mName); //list
            // var oDataArr, oDataLength, lastCtgrSeq, ctgrSeq;
            // // this._setEditChange(this.rowIndex,"R");

            // if(oModel.oData){
            //     oDataArr = oModel.getProperty("/MdCategoryItem"); 
            //     oDataLength = oDataArr.length;
            //     lastCtgrSeq = oDataArr[oDataLength-1].spmd_character_sort_seq;
            //     console.log(lastCtgrSeq);
            //     ctgrSeq = String(parseInt(lastCtgrSeq)+1);
            // }

            // oModel.addRecord({
			// 	"tenant_id": "L2100",
			// 	"company_code": "*",
			// 	"org_type_code": "BU",
            //     "org_code": "BIZ00200",
            //     "spmd_category_code":"C001", //*************파라미터값으로 변경 필요************ */
			// 	"spmd_character_code": "",
			// 	"spmd_character_sort_seq": ctgrSeq,
            //     "spmd_character_code_name": "",
            //     "spmd_character_desc": ""
            //     // "local_create_dtm": new Date(),
            //     // "local_update_dtm": new Date()
            // }, "/MdCategoryItem" , oDataLength);  

            // this.rowIndex = oDataLength;
		    // this.byId("buttonMainAddRow").setEnabled(false);
            // // this._setEditChange(this.rowIndex,"E");  
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
            // this._setEditChange(this.rowIndex,"R");  
        },

      onSave: function () {
        var [tId, mName] = arguments;
        var view = this.getView();
        var model = view.getModel(mName);
        // Validation
        if (model.getChanges() <= 0) {
			MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
          return;
        }
        if(this.Validator.validate(this.byId(tId)) !== true){
            // MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            return;
        }

        MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
          title: this.getModel("I18N").getText("/SAVE"),
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                groupId: "MdCategoryItem",
                success: function (oEvent) {
                  view.setBusy(false);
                  MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                  this.byId("mainTable").getBinding("items").refresh();
                //   this._setEditChange(this.rowIndex,"R");  
                //   this.refresh();
                //   setTimeout(this.onSearch(), 3000);
                  //위로 이동 클릭시 refresh 정상
                  //아래 이동 클릭시 원복처리됨
                }.bind(this)
              });
            }
          }.bind(this)
        })
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
        var that = this;       
        var oSelectedProductsTable = this.byId("mainTable");// 
        Utils.getSelectedItemContext(oSelectedProductsTable, function(oSelectedItemContext, iSelectedItemIndex) {
            var oSelectedItem = oSelectedProductsTable.getItems()[iSelectedItemIndex];
            var iSiblingItemIndex = iSelectedItemIndex + (sDirection === "Up" ? -1 : 1);
            
            console.log(iSelectedItemIndex + " / "+iSiblingItemIndex);

            // that._setEditChange(iSelectedItemIndex,"R");  
            var oSiblingItem = oSelectedProductsTable.getItems()[iSiblingItemIndex];
            var oSiblingItemContext = oSiblingItem.getBindingContext("list");
            
            if (!oSiblingItemContext) {
                return;
            }

            // swap the selected and the siblings rank
            var oProductsModel = oSelectedProductsTable.getModel("list");
            var iSiblingItemRank = oSiblingItemContext.getProperty(); //바뀔
            var iSelectedItemRank = oSelectedItemContext.getProperty(); //선택셀

            var iSeq = oProductsModel.getProperty(oSiblingItem.getBindingContextPath()).spmd_character_sort_seq
            var oSeq = oProductsModel.getProperty(oSelectedItem.getBindingContextPath()).spmd_character_sort_seq //클릭셀
            var iSeqIdx = "/MdCategoryItem/"+iSiblingItemIndex+"/spmd_character_sort_seq"
            var oSeqIdx = "/MdCategoryItem/"+iSelectedItemIndex+"/spmd_character_sort_seq"
            
            oProductsModel.setProperty("", iSiblingItemRank, oSelectedItemContext);//oSelectedItemContext
            oProductsModel.setProperty("", iSelectedItemRank, oSiblingItemContext);//oSiblingItemContext
            oProductsModel.setProperty(iSeqIdx,iSeq);//iSeq
            oProductsModel.setProperty(oSeqIdx,oSeq);//oSeq

            // after move select the sibling
            oSelectedProductsTable.getItems()[iSiblingItemIndex].setSelected(true);
            that.rowIndex = iSiblingItemIndex;
            // that._setEditChange(iSiblingItemIndex,"E");  
        }); //}.bind(this)); 도 가능
    },

    moveUp: function() {
        this.moveSelectedItem("Up");
    },

    moveDown: function() {
        this.moveSelectedItem("Down");
    },


    // /**
    //  * @public
    //  */
    // _setEditChange: function(index,mode){
    //     var oTable = this.byId("mainTable");
    //     var flag = true;
    //     if(mode=="E"){
    //         flag = false;
    //     }
        
    //     if(oTable.getAggregation('items').length > 0){

    //         oTable.getAggregation('items')[index].getCells()[6].getItems()[0].setVisible(flag);
    //         oTable.getAggregation('items')[index].getCells()[6].getItems()[1].setVisible(!flag);
    //         oTable.getAggregation('items')[index].getCells()[5].getItems()[0].setVisible(flag);
    //         oTable.getAggregation('items')[index].getCells()[5].getItems()[1].setVisible(!flag); 
        
    //     }    
    // },
    
    /**
     * When it routed to this page from the other page.
     * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
     * @private
     */
    _onRoutedThisPage: function(){            
        // this.getModel("list").setProperty("/headerExpanded", true);            
    },

    });
  }
);