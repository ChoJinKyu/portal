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
	"sap/ui/core/Item"
],
  function (BaseController, Multilingual, Validator, DateFormatter, History, JSONModel, ManagedListModel, TablePersoController, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, Item) {
    "use strict";

    return BaseController.extend("pg.md.mdCategory.controller.mdCategory", {

      //formatter: formatter,
       Validator : new Validator(),
	   dateFormatter: DateFormatter,

      onInit: function () {
          
        var oMultilingual = new Multilingual();
        this.setModel(oMultilingual.getModel(), "I18N");
        this.getView().setModel(new ManagedListModel(), "list");
        this.rowIndex=0;
        // var oDataLength,oDataArr;

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
        this.onSearch();
      },


      /** 회사(tenant_id)값으로 법인, 사업본부 combobox item filter 기능
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
        var businessSorter = new sap.ui.model.Sorter("bizunit_name", false);        //sort Ascending
        
        business_combo.bindAggregation("items", {
            path: "org>/Org_Unit",
            sorter: businessSorter,
            filters: aFiltersComboBox,
            // @ts-ignore
            template: new sap.ui.core.Item({
                key: "{org>bizunit_code}",
                text: "{org>bizunit_code}: {org>bizunit_name}"
            })
        });
    },


    onListItemPress: function (oEvent) {
        
        var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);
        this.byId("buttonMainDeleteRow").setEnabled(false);
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
            var tenant_combo = this.getView().byId("searchTenantCombo").getSelectedKey();
			var sChain = this.getView().byId("searchChain").getSelectedKey();
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
                    urlParameters: {
                        "$expand": "org_infos"
                    },
                    success: (function (oData) {
                    this.getView().setBusy(false);
                    }).bind(this)
                });
            var oTable = this.byId("mainTable");
            this.byId("buttonMainAddRow").setEnabled(true);  
            // this.byId("buttonMainEditRow").setEnabled(true);    
            // this.byId("buttonMainCancelRow").setEnabled(false);    
            // var rowIndex = this.rowIndex;
            
            // oTable.getAggregation('items')[rowIndex].getCells()[1].getItems()[0].setVisible(true);
            // oTable.getAggregation('items')[rowIndex].getCells()[1].getItems()[1].setVisible(false);  
            // oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[0].setVisible(true);
            // oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[1].setVisible(false);
            // oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[0].setVisible(true);
            // oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[1].setVisible(false);
            // oTable.getAggregation('items')[rowIndex].getCells()[4].getItems()[0].setVisible(true);
            // oTable.getAggregation('items')[rowIndex].getCells()[4].getItems()[1].setVisible(false);
        },
      
      onAdd: function () {
          
            var orgCode = this.getView().byId("searchChain").setSelectedItem().getSelectedKey();
            if(orgCode=="" || orgCode==null){
                MessageToast.show("사업본부를 설정해주세요.");
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

            // var [tId, mName, sEntity, aCol] = arguments;
            // //tableId modelName EntityName tenant_id
            // var oTable = this.byId(tId), //mainTable
            //     oModel = this.getView().getModel(mName); //list
            // var oDataArr, oDataLength, lastCtgrSeq, ctgrSeq;

            // if(oModel.oData){
            //     oDataArr = oModel.getProperty("/MdCategory"); //oModel.oData.MdCategory;
            //     oDataLength = oDataArr.length;
            //     lastCtgrSeq = oDataArr[oDataLength-1].spmd_category_sort_sequence;
            //     ctgrSeq = String(parseInt(lastCtgrSeq)+1);
            // }

            // oModel.addRecord({
			// 	"tenant_id": "L2100",
			// 	"company_code": "*",
			// 	"org_type_code": "BU",
			// 	"org_code": "BIZ00200",
			// 	"spmd_category_code": "",
			// 	"spmd_category_code_name": "",
			// 	"rgb_font_color_code": "#000000",
			// 	"rgb_cell_clolor_code": "#FFFFFF",
            //     "spmd_category_sort_sequence": ctgrSeq
            //     // "system_update_dtm": new Date(),
            //     // "local_create_dtm": new Date(),
            //     // "local_update_dtm": new Date()
            // }, "/MdCategory" , 0);  

            // this.rowIndex = 0;
		    // this.byId("buttonMainAddRow").setEnabled(false);
            // this.byId("buttonMainEditRow").setEnabled(false); 
            // this.byId("buttonMainCancelRow").setEnabled(true);    
            // oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[1].getItems()[1].setVisible(true);
            // oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(true);
            // oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(true);
            // oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(true);
            
        },
    //   onEdit: function () {
    //         var [tId, mName, sEntity, aCol] = arguments;
    //         //tableId modelName EntityName tenant_id
    //         var oTable = this.byId(tId), //mainTable
    //             oModel = this.getView().getModel(mName), //list
    //             oItem = oTable.getSelectedItem();

    //         var idx = oItem.getBindingContextPath().split("/")[2];
    //         this.rowIndex = idx;

	// 	    this.byId("buttonMainAddRow").setEnabled(false);
    //         this.byId("buttonMainEditRow").setEnabled(false);
    //         this.byId("buttonMainCancelRow").setEnabled(true);  
    //         oTable.getAggregation('items')[idx].getCells()[1].getItems()[0].setVisible(false);
    //         oTable.getAggregation('items')[idx].getCells()[1].getItems()[1].setVisible(true);
    //         oTable.getAggregation('items')[idx].getCells()[2].getItems()[0].setVisible(false);
    //         oTable.getAggregation('items')[idx].getCells()[2].getItems()[1].setVisible(true);
    //         oTable.getAggregation('items')[idx].getCells()[3].getItems()[0].setVisible(false);
    //         oTable.getAggregation('items')[idx].getCells()[3].getItems()[1].setVisible(true);
    //         oTable.getAggregation('items')[idx].getCells()[4].getItems()[0].setVisible(false);
    //         oTable.getAggregation('items')[idx].getCells()[4].getItems()[1].setVisible(true);
            
    //     },

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
          onClose: (function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                success: (function (oEvent) {
                  view.setBusy(false);
                  MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                  this.onSearch();//this.refresh();
                }).bind(this)
              });
            }
          }).bind(this)
        })
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