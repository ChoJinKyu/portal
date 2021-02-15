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
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/ui/core/Item",
	"./Utils"
],
  function (BaseController, Multilingual, Validator, DateFormatter, Formatter, History, JSONModel, ManagedListModel, TablePersoController, Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, Item, Utils) {
    "use strict";

    return BaseController.extend("pg.md.mdCategory.controller.mdCategory", {

      formatter: Formatter,
       Validator : new Validator(),
	   dateFormatter: DateFormatter,

      onInit: function () {
          
        var oMultilingual = new Multilingual();
        this.setModel(oMultilingual.getModel(), "I18N");
        this.getView().setModel(new ManagedListModel(), "list");
        this.rowIndex=0;

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
          customDataKey: "mdCategory"
        }).setTable(this.byId("mainTable"));
      },


      onMainTablePersoButtonPressed: function (event) {
        this._oTPC.openDialog();
      },
      // Display row number without changing data
      onAfterRendering: function () {
        //this.onSearch();

        //화학 기본설정 - 사업본부
        this.getView().byId("searchTenantCombo").setSelectedKey("L2100");
        var oSelectedkey = this.getView().byId("searchTenantCombo").getSelectedKey();
        var business_combo = this.getView().byId("searchChain");  
        business_combo.setValue("");

        var aFiltersComboBox = [];
        aFiltersComboBox.push( new Filter("tenant_id", "EQ", oSelectedkey));
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


    /**
    * @public
    */
    onChangeTenant: function (oEvent) {
        var oSelectedkey = oEvent.getSource().getSelectedKey();                
        var business_combo = this.getView().byId("searchChain");  
        business_combo.setValue("");

        var aFiltersComboBox = [];
        var oFilterComboBox = new sap.ui.model.Filter("tenant_id", "EQ", oSelectedkey);
        aFiltersComboBox.push(oFilterComboBox);
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
            spmd_category_sort_sequence: oRecord.spmd_category_sort_sequence
        });
            
    },

      onSearch: function () {
            var aSorter = [];
            aSorter.push(new Sorter("spmd_category_sort_sequence"));

            var tenant_combo = this.getView().byId("searchTenantCombo").getSelectedKey();
            var category_combo = this.getView().byId("searchChain");

            var sChain = this.getView().byId("searchChain").getSelectedKey();

            if(sChain == null || category_combo.getValue() == ""){
			    MessageToast.show(this.getModel("I18N").getText("/NPG10003"));
                return;
            }

			var aSearchFilters = [];
            if (tenant_combo.length > 0) {
                aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, tenant_combo));
            }
			if (sChain.length > 0) {
				aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, sChain));
            }

            this.getView()
                .setBusy(true)
                .getModel("list")
                .setTransactionModel(this.getView().getModel())
                .read("/MdCategory", {
                    filters: aSearchFilters,
                    sorters: aSorter,
                    urlParameters: {
                        "$expand": "org_infos"
                    },
                    success: (function (oData) {
                        this.getView().setBusy(false);
                        if(oData.results == null || oData.results.length < 1){
                            MessageToast.show(this.getModel("I18N").getText("/NPG10004"));
                        }else{
                            MessageToast.show(this.getModel("I18N").getText("/NPG10005",oData.results.length));
                        }
                    }).bind(this)
                });
            this.byId("buttonMainAddRow").setEnabled(true);  
        },
      
      onAdd: function () {
          
            var orgCode = this.getView().byId("searchChain").setSelectedItem().getSelectedKey();
            if(orgCode=="" || orgCode==null){
			    MessageToast.show(this.getModel("I18N").getText("/NPG10003")); //사업본부를 선택하세요.
                return;
            }
            var oTable = this.byId("mainTable"), 
                oModel = this.getView().getModel("list");
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            var  oDataArr, oDataLength, lastCtgrSeq;
            var ctgrSeq="";

            if(oModel.oData){
                oDataArr = oModel.getProperty("/MdCategory"); 
                oDataLength = oDataArr.length;
                if(oDataLength>0){
                    lastCtgrSeq = oDataArr[oDataLength-1].spmd_category_sort_sequence;
                    ctgrSeq = String(parseInt(lastCtgrSeq)+1);
                }else{
                    ctgrSeq="1";
                }
            }
            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout, 
                company_code: "*",
                org_type_code: "BU",
                org_code: this.getView().byId("searchChain").setSelectedItem().getSelectedKey(),//org_code: "BIZ00200",
                spmd_category_code: "new",
                spmd_category_sort_sequence: ctgrSeq
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

        MessageBox.confirm(this.getModel("I18N").getText("/NPG10006"), {
          title: this.getModel("I18N").getText("/SAVE"),
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: (function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                    success: (function (oEvent) {
                        view.setBusy(false);
                        MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                        this.onSearch();
                    }).bind(this)
              });
            }
          }).bind(this)
        })
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

                var iSeq = oProductsModel.getProperty(oSiblingItem.getBindingContextPath()).spmd_category_sort_sequence
                var oSeq = oProductsModel.getProperty(oSelectedItem.getBindingContextPath()).spmd_category_sort_sequence //클릭셀
                var iSeqIdx = "/MdCategory/"+iSiblingItemIndex+"/spmd_category_sort_sequence"
                var oSeqIdx = "/MdCategory/"+iSelectedItemIndex+"/spmd_category_sort_sequence"
                
                oProductsModel.setProperty("", iSiblingItemRank, oSelectedItemContext);//oSelectedItemContext
                oProductsModel.setProperty("", iSelectedItemRank, oSiblingItemContext);//oSiblingItemContext
                oProductsModel.setProperty(iSeqIdx,iSeq);//iSeq
                oProductsModel.setProperty(oSeqIdx,oSeq);//oSeq

                // after move select the sibling
                oSelectedProductsTable.getItems()[iSiblingItemIndex].setSelected(true);
                that.rowIndex = iSiblingItemIndex;
            }); 
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