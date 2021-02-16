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

    return BaseController.extend("pg.md.mdCategoryItem.controller.mdCategoryItem", {

      formatter: Formatter,
       Validator : new Validator(),
	   dateFormatter: DateFormatter,

      onInit: function () {
          
        var oMultilingual = new Multilingual();
        this.setModel(oMultilingual.getModel(), "I18N");
        this.getView().setModel(new ManagedListModel(), "list");

        var STATE_COL = "_row_state_";
        ManagedListModel.prototype._executeBatch = function (sGroupId) {
            var oServiceModel = this._oTransactionModel,
                sTransactionPath = this._transactionPath,
                cs = this.getCreatedRecords(),
                us = this.getUpdatedRecords(),
                ds = this.getDeletedRecords();

            (cs || []).forEach(function (oItem) {
                var sPath = oItem.__entity || sTransactionPath;
                delete oItem[STATE_COL];
                delete oItem.__entity;
                oServiceModel.create(sPath, oItem, {
                    groupId: sGroupId,
                    success: function (oData) {
                        oItem.__entity = sPath;
                    }
                });
            });
            (ds || []).forEach(function (oItem) {
                //delete oItem[STATE_COL];
                oServiceModel.remove(oItem.__entity, {
                    groupId: sGroupId,
                    success: function () {
                    }
                });
            });
            (us || []).forEach(function (oItem) {
                var sEntity = oItem.__entity;
                delete oItem[STATE_COL];
                delete oItem.__entity;
                delete oItem.org_infos;
                delete oItem.category_infos;

                oServiceModel.update(sEntity, oItem, {
                    groupId: sGroupId,
                    success: function () {
                        oItem.__entity = sEntity;
                    }
                });
            });
        },
 
        this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);


        // 개인화 - UI 테이블의 경우만 해당
        this._oTPC = new TablePersoController({
          customDataKey: "mdCategoryItem"
        }).setTable(this.byId("mainTable"));
        
        this.rowIndex=0;
      },

      //window창 파라메터 분리
        getQueryStringObject: function() {
            if(window.location.search != ""){
                var a = window.location.search.substr(1).split('&');
                if (a == null) return {};
                var b = {};
                for (var i = 0; i < a.length; ++i) {
                    var p = a[i].split('=', 2);
                    if (p.length == 1)
                        b[p[0]] = "";
                    else
                        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                }
                return b;

            }else{
                return "";
            }
        },

      onMainTablePersoButtonPressed: function (event) {
        this._oTPC.openDialog();
      },


      // Display row number without changing data
      onAfterRendering: function () {
        this.getModel("list").setProperty("/mainMode", "Main"); 
        var qs = this.getQueryStringObject();
        
        if(qs != ""){
            var tenant_id = qs.tenant_id; 
            var org_code = qs.org_code; 
            var spmd_category_code = qs.spmd_category_code; 
            this.getView().byId("searchTenantCombo").setSelectedKey(tenant_id);
            this.getView().byId("searchChain").setSelectedKey(org_code);
            this.getView().byId("searchCategory").setSelectedKey(spmd_category_code);


            var business_combo = this.getView().byId("searchChain");  
                business_combo.setValue("");
            var aFiltersComboBox = [];
            aFiltersComboBox.push( new Filter("tenant_id", "EQ", tenant_id));
            var businessSorter = new sap.ui.model.Sorter("bizunit_code", false);   
            
            business_combo.bindAggregation("items", {
                path: "org>/Org_Unit",
                sorter: businessSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.ListItem({
                    key: "{org>bizunit_code}",
                    text: "{org>bizunit_name}",
                    additionalText: "{org>bizunit_code}"
                })
            });
            
                        
            var category_combo = this.getView().byId("searchCategory");  
            category_combo.setValue("");
            aFiltersComboBox = [];
            aFiltersComboBox.push( new Filter("tenant_id", "EQ", tenant_id));
            aFiltersComboBox.push( new Filter("org_code", "EQ", org_code));
            var businessSorter = new sap.ui.model.Sorter("spmd_category_code", false); 
            
            category_combo.bindAggregation("items", {
                path: "category>/MdCategory",
                sorter: businessSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.ListItem({
                    key: "{category>spmd_category_code}",
                    text: "{category>spmd_category_code_name}",
                    additionalText: "{category>spmd_category_code}"
                })
            });  
        }else{
            
            //화학 기본설정 - 사업본부
            this.getView().byId("searchTenantCombo").setSelectedKey("L2100");
            var oSelectedkey = this.getView().byId("searchTenantCombo").getSelectedKey();

            var business_combo = this.getView().byId("searchChain");  
                business_combo.setValue("");
                
            var aFiltersComboBox = [];
            aFiltersComboBox.push( new Filter("tenant_id", "EQ", oSelectedkey));
            var businessSorter = new sap.ui.model.Sorter("bizunit_code", false);   

            business_combo.bindAggregation("items", {
                path: "org>/Org_Unit",
                sorter: businessSorter,
                filters: aFiltersComboBox,
                // @ts-ignore
                template: new sap.ui.core.ListItem({
                    key: "{org>bizunit_code}",
                    text: "{org>bizunit_name}",
                    additionalText: "{org>bizunit_code}"
                })
            });
        }
         
      },
    
      /** 
    * @public
    */
    onChangeTenant: function (oEvent) {
        var oSelectedkey = oEvent.getSource().getSelectedKey();                  //법인 
        var business_combo = this.getView().byId("searchChain");  
        business_combo.setValue("");

        var aFiltersComboBox = [];
        aFiltersComboBox.push( new Filter("tenant_id", "EQ", oSelectedkey));
        // oBindingComboBox.filter(aFiltersComboBox);          //sort Ascending
        var businessSorter = new sap.ui.model.Sorter("bizunit_code", false);        //sort Ascending
        
        business_combo.bindAggregation("items", {
            path: "org>/Org_Unit",
            sorter: businessSorter,
            filters: aFiltersComboBox,
            // @ts-ignore
            template: new sap.ui.core.ListItem({
                key: "{org>bizunit_code}",
                text: "{org>bizunit_name}",
                additionalText: "{org>bizunit_code}"
            })
        });
    },


      /** 회사(tenant_id)값으로 법인, 사업본부 combobox item filter 기능
    * @public
    */
    onChangeBizUnit: function (oEvent) {
        var tenant_combo = this.getView().byId("searchTenantCombo").getSelectedKey();
        var oSelectedkey = oEvent.getSource().getSelectedKey();                  
        var category_combo = this.getView().byId("searchCategory");  
        category_combo.setValue("");

        var aFiltersComboBox = [];
        aFiltersComboBox.push( new Filter("tenant_id", "EQ", tenant_combo));
        aFiltersComboBox.push( new Filter("org_code", "EQ", oSelectedkey));

        // oBindingComboBox.filter(aFiltersComboBox);          //sort Ascending
        var businessSorter = new sap.ui.model.Sorter("spmd_category_code", false);        //sort Ascending
        
        category_combo.bindAggregation("items", {
            path: "category>/MdCategory",
            sorter: businessSorter,
            filters: aFiltersComboBox,
            // @ts-ignore
            template: new sap.ui.core.ListItem({
                key: "{category>spmd_category_code}",
                text: "{category>spmd_category_code_name}",
                additionalText: "{category>spmd_category_code}"
            })
        });
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

        if (this.getModel("list").getChanges().length > 0) {
            MessageBox.confirm(this.getModel("I18N").getText("/NPG10018"), {
                title: this.getModel("I18N").getText("/CONFIRM"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        
                        this.getModel("list").setProperty("/mainMode", "Detail");  
                        this.getRouter().navTo("midPage", {
                            layout: oNextUIState.layout, 
                            company_code: oRecord.company_code,
                            org_type_code: oRecord.org_type_code,
                            org_code: oRecord.org_code,
                            spmd_category_code: oRecord.spmd_category_code,
                            spmd_character_code: oRecord.spmd_character_code,
                            spmd_character_sort_seq: oRecord.spmd_character_sort_seq
                        });
                        this.onSearch();
                    }
                }.bind(this)
            })
        }else{
            this.getModel("list").setProperty("/mainMode", "Detail"); 
            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout, 
                company_code: oRecord.company_code,
                org_type_code: oRecord.org_type_code,
                org_code: oRecord.org_code,
                spmd_category_code: oRecord.spmd_category_code,
                spmd_character_code: oRecord.spmd_character_code,
                spmd_character_sort_seq: oRecord.spmd_character_sort_seq
            });
        }
                
        
            
    },

      onSearch: function () {
            this.mainModeFlag = this.getModel("list").getProperty("/mainMode");
            var aFilters = [];
            var aSorter = [];
            // aFilters.push(new Filter("spmd_category_code", FilterOperator.EQ, this.aSearchCategoryCd));
            
            aSorter.push(new Sorter("spmd_character_sort_seq"));
            
            var tenant_combo = this.getView().byId("searchTenantCombo").getSelectedKey(),   
                bizunit_combo = this.getView().byId("searchChain").getSelectedKey(),       
                category_combo = this.getView().byId("searchCategory").setSelectedItem().getSelectedKey();  
            
            var org_combo = this.getView().byId("searchChain");
            var category = this.getView().byId("searchCategory");
            if(bizunit_combo == null || org_combo.getValue() == ""){
			    MessageToast.show(this.getModel("I18N").getText("/NPG10003"));
                return;
            }
            if(category_combo == null || category.getValue() == ""){
			    MessageToast.show(this.getModel("I18N").getText("/NPG10012"));//범주를 설정해주세요
                return;
            }

            if (tenant_combo.length > 0) {
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, tenant_combo));
            }
            if (bizunit_combo.length > 0) {
                aFilters.push(new Filter("org_code", FilterOperator.EQ, bizunit_combo));                
            }
            if (category_combo.length > 0) {
                aFilters.push(new Filter("spmd_category_code", FilterOperator.EQ, category_combo));                
            }

            // var oView = this.getView();
            // var param1 = "'C001'";
            
            // var url = "pg/md/mdCategoryItem/webapp/srv-api/odata/v4/pg.md.MdCategoryV4Service/MdItemListConditionView(language_code='KO')/Set?$filter=spmd_category_code eq "+param1;    // 아이템특성목록View 파라메터 호출O
            // $.ajax({
            //     url: url,
            //     type: "GET",
            //     // data : JSON.stringify(input),
            //     contentType: "application/json",
            //     success: function(data){
            //         var v_list = oView.getModel("list").getData();
            //         v_list.MdCategoryItem = data.value;
            //         oView.getModel("list").updateBindings(true); 
            //     },
            //     error: function(e){
                    
            //     }
            // });

            this.getView()
                .setBusy(true)
                .getModel("list")
                .setTransactionModel(this.getView().getModel())
                .read("/MdCategoryItem", {
                    filters: aFilters,                
                    sorters : aSorter,
                    urlParameters: {
                        "$expand": "org_infos,category_infos"
                    },
                    success: (function (oData) {
                        // this.onSearch();
                        this.getView().setBusy(false);
                        if(oData.results == null || oData.results.length < 1){
                            MessageToast.show(this.getModel("I18N").getText("/NPG10004"));
                        }else{
                            this.getModel("list").setProperty("/mainMode", this.mainModeFlag); 
                            //MessageToast.show(this.getModel("I18N").getText("/NPG10005",oData.results.length));
                        }
                    }).bind(this)
                });

            this.byId("buttonMainAddRow").setEnabled(true);  
            // this._setEditChange(this.rowIndex,"R"); 
        },
      
      onAdd: function () { 

            if (this.getModel("list").getChanges().length > 0) {
                MessageBox.confirm(this.getModel("I18N").getText("/NPG10018"), {
                    title: this.getModel("I18N").getText("/CONFIRM"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            this.onNavToMidPage();
                        }
                    }.bind(this)
                })
            }else{
                this.onNavToMidPage();
            }
 
        },

        onNavToMidPage: function(){
            this.getModel("list").setProperty("/mainMode", "Detail"); 
            var ctgrCode = this.getView().byId("searchCategory").setSelectedItem().getSelectedKey();
            if(ctgrCode=="" || ctgrCode==null){
                MessageToast.show(this.getModel("I18N").getText("/NPG10012"));
                return;
            }         
            var oTable = this.byId("mainTable"), 
                oModel = this.getView().getModel("list");
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            var  oDataArr, oDataLength, lastCtgrSeq;
            var ctgrSeq="";

            if(oModel.oData){
                oDataArr = oModel.getProperty("/MdCategoryItem"); 
                oDataLength = oDataArr.length;
                if(oDataLength>0){
                    lastCtgrSeq = oDataArr[oDataLength-1].spmd_character_sort_seq;
                    ctgrSeq = String(parseInt(lastCtgrSeq)+1);
                }else{
                    ctgrSeq="1";
                }
            }
            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout, 
                company_code: "*",
                org_type_code: "BU",
                org_code: this.getView().byId("searchChain").setSelectedItem().getSelectedKey(),
                //org_code: "BIZ00200",
                spmd_category_code: ctgrCode,
                spmd_character_code: "new",
                spmd_character_sort_seq: ctgrSeq
            });
        },

      onSave: function () {
        var [tId, mName] = arguments;
        var view = this.getView();
        var model = view.getModel(mName);
        // Validation
        if (model.getChanges() <= 0) {
            MessageToast.show(this.getModel("I18N").getText("/NPG10010"));
            return;
        }
        if(this.Validator.validate(this.byId(tId)) !== true){
            // MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            return;
        }

        MessageBox.confirm(this.getModel("I18N").getText("/NPG10011"), {
          title: this.getModel("I18N").getText("/SAVE"),
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                success: function (oEvent) {
                  view.setBusy(false);
                  MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                //   this.byId("mainTable").getBinding("items").refresh();
                  this.onSearch();
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
        var category_combo = this.getView().byId("searchChain");
        var sChain = this.getView().byId("searchChain").getSelectedKey();
        if(sChain == null || category_combo.getValue() == ""){
			    MessageToast.show(this.getModel("I18N").getText("/NPG10003"));
            return;
        }
        this.moveSelectedItem("Up");
    },

    moveDown: function() {
        var category_combo = this.getView().byId("searchChain");
        var sChain = this.getView().byId("searchChain").getSelectedKey();
        if(sChain == null || category_combo.getValue() == ""){
			    MessageToast.show(this.getModel("I18N").getText("/NPG10003"));
            return;
        }
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
        this.mainModeFlag = "Main";
        this.getModel("list").setProperty("/mainMode", "Main");                
    },

    });
  }
);