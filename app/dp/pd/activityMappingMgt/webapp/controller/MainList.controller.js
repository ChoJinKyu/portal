sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/Formatter",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/util/Validator",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "ext/lib/util/ExcelUtil"
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, Formatter, DateFormatter, Validator, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ExcelUtil) {
	"use strict";

	return BaseController.extend("dp.pd.activityMappingMgt.controller.MainList", {

        formatter: Formatter,
        dateFormatter: DateFormatter,
        validator: new Validator(),
        
        onInit: function() {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new ManagedListModel(), "list");

            this.getView().setModel(this.getOwnerComponent().getModel());

            oMultilingual.attachEvent("ready", function (oEvent) {
                var oi18nModel = oEvent.getParameter("model");
                this.addHistoryEntry({
                    title: oi18nModel.getText("/Activity Mapping Management"),
                    icon: "sap-icon://table-view",
                    intent: "#Template-display"
                }, true);
            }.bind(this));
            
            this.byId("btn_search").firePress();
        },

        onMainTablePersoButtonPressed: function(event) {
            this._oTPC.openDialog();
        },
        
        onMainTablePersoRefresh : function() {
			MainListPersoService.resetPersData();
			this._oTPC.refresh();
        },
        
        onPageSearchButtonPress : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				this.onRefresh();
			} else {
				var aSearchFilters = this._getSearchStates();
				this._applySearch(aSearchFilters);
			}
        },
      
        _applySearch: function(aSearchFilters) {
            var oView = this.getView(),
                    oModel = this.getModel("list");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
            
                this.byId("mainTableCancButton").setEnabled(false);

            var oTable = this.byId("mainTable");
            oModel.read("/ActivityMappingNameView", {
                filters: aSearchFilters,
				success: function(oData){
                    oView.setBusy(false);

                    for (var i = 0; i < oTable.getItems().length; i++) {
                        oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[5].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[5].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[6].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[6].getItems()[1].setVisible(false);

                        oModel.oData.ActivityMappingNameView[i]._row_state_ = "";
                    }
                    
                    oTable.removeSelections(true);
                    
				}.bind(this)
			});
        },

        onMainTableUpdateFinished: function (oEvent) {
            // update the mainList's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("appTitle");
            console.log(sTitle+" ["+iTotalItems+"]");
            this.byId("mainTableTitle").setText(sTitle+"["+iTotalItems+"]");
        
        },
        
        _getSearchStates: function(){
            var sTenantId = "L1100",
                sOrgCombo = this.getView().byId("searchOrgCombo").getSelectedKey(),
                sProductActivity = this.getView().byId("searchProductActivity").getValue(),
                sActivity = this.getView().byId("searchActivity").getValue();
            
            var aSearchFilters = [];
            
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenantId));

            if (sOrgCombo && sOrgCombo.length > 0) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, sOrgCombo));
            }

			if (sProductActivity && sProductActivity.length > 0) {
                aSearchFilters.push(new Filter("product_activity_code", FilterOperator.Contains, sProductActivity));
                //aSearchFilters.push(new Filter("product_activity_name", FilterOperator.Contains, sProductActivity));
            }

            if (sActivity && sActivity.length > 0) {
                aSearchFilters.push(new Filter("activity_code", FilterOperator.Contains, sActivity));
                //aSearchFilters.push(new Filter("activity_name", FilterOperator.Contains, sActivity));
            }
			return aSearchFilters;
        },
        
        onExportPress: function (oEvent) {
            var sTableId = oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            var sFileName = "Activity Mapping Management";
            var oData = this.getModel("list").getProperty("/ActivityMappingNameView");
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },

        onMainTableAddButtonPress: function(){
            var [tId, mName, sEntity, aCol] = arguments;
			var oTable = this.byId(tId),
                oModel = this.getView().getModel(mName); //list
            var oDataArr, oDataLength;    
            if (oModel.oData) {
                oDataArr = oModel.getProperty("/ActivityMappingNameView");
                oDataLength = oDataArr.length;
            }

			oModel.addRecord({
                "TENANT_ID": "L1100",
                "COMPANY_CODE": "*",
                "ORG_TYPE_CODE": "BU",
                "ORG_CODE": "L110010000",
                "ACTIVITY_CODE": null,
                "PRODUCT_ACTIVITY_CODE": null,
                "ACTIVITY_DEPENDENCY_CODE": null,
                "ACTIVE_FLAG": null,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": "Test",
                "update_user_id": "Test",
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date()
            }, "/ActivityMappingNameView", 0);
			
            this.rowIndex = 0;
            this.byId("mainTableCancButton").setEnabled(true);
            
            oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[1].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(true);

            oTable.getAggregation('items')[0].getCells()[5].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[5].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[6].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[6].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[7].getItems()[0].setEnabled(false);
            oTable.getAggregation('items')[0].getCells()[8].getItems()[0].setEnabled(false);

            oTable.setSelectedItem(oTable.getAggregation('items')[0]);
            this.validator.clearValueState(this.byId("mainTable"));
		},

        onMainTableCancButtonPress: function() {
            var oTable = this.byId("mainTable");
            var oModel = this.getView().getModel("list");
            var oData = oModel.oData;
            var cntMod = 0;
            for (var i = 0; i < oTable.getItems().length; i++) {
                if(oData.ActivityMappingNameView[i]._row_state_  == "C"
                    || oData.ActivityMappingNameView[i]._row_state_  == "U"
                    || oData.ActivityMappingNameView[i]._row_state_  == "D"){
                    cntMod++;
                }
            }
            if( cntMod > 0){
                MessageBox.confirm(this.getModel("I18N").getText("/NCM00007"), {
                    title: this.getModel("I18N").getText("/EDIT_CANCEL"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: (function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            var rowIndex = this.rowIndex;
                            oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[0].getCells()[1].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(false);

                            oTable.getAggregation('items')[0].getCells()[5].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[0].getCells()[5].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[0].getCells()[6].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[0].getCells()[6].getItems()[1].setVisible(false);
                            
                            this.byId("btn_search").firePress();
                        }
                    }).bind(this)
                })
            }else{
                var rowIndex = this.rowIndex;
                oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[1].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(false);

                oTable.getAggregation('items')[0].getCells()[5].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[5].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[6].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[6].getItems()[1].setVisible(false);
               
                this.byId("btn_search").firePress();
            }
        },

		onMainTableDeleteButtonPress: function(){
			var oTable = this.byId("mainTable"),
                oModel = this.getModel("list"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];

            for (var i = 0; i < oTable._iVisibleItemsLength-1; i++) {
                oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[5].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[5].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[6].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[6].getItems()[1].setVisible(false);
            }

            aItems.forEach(function (oItem) {
                aIndices.push(oModel.getProperty("/ActivityMappingNameView").indexOf(oItem.getBindingContext("list").getObject()));
            });
            aIndices = aIndices.sort(function (a, b) { return b - a; });
            aIndices.forEach(function (nIndex) {
                oModel.markRemoved(nIndex);
            });
            oTable.removeSelections(true);
            oTable.setSelectedItem(aItems);
        },
       
        // 저장 수정해야함
        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("v4Proc");
            var oModel2 = this.getView().getModel("list"); 
            var oView = this.getView();
            var v_this = this;
            var oTable = this.byId("mainTable");
            var oData = oModel2.oData;                
            var inputData = {
                inputData : {
                    pdProdActivityTemplateType :  []
                }
            };
            
            if(this.validator.validate(this.byId("mainTable")) !== true) return;
            var now = new Date();
            var PdProdActivityTemplateType  = [];
            for (var i = 0; i < oTable.getItems().length; i++) {
                if( oData.PdProdActivityTemplate[i]._row_state_ != null && oData.PdProdActivityTemplate[i]._row_state_ != "" ){
                    var activeFlg = "false";
                    if (oTable.getAggregation('items')[i].getCells()[4].getItems()[2].getPressed()) {
                        activeFlg = "true";
                    }else {
                        activeFlg = "false";
                    }
                    var milestoneFlg = "false";
                    if (oTable.getAggregation('items')[i].getCells()[5].getItems()[2].getPressed()) {
                        milestoneFlg = "true";
                    }else {
                        milestoneFlg = "false";
                    }
                    var pacOri = oTable.getAggregation('items')[i].getCells()[1].getItems()[2].getValue();
                    if(oData.PdProdActivityTemplate[i]._row_state_  == "C"){
                        pacOri = oTable.getAggregation('items')[i].getCells()[1].getItems()[1].getValue();
                    }
                    var seq = oData.PdProdActivityTemplate[i].sequence;
                    if(oData.PdProdActivityTemplate[i]._row_state_ == "C"){
                        seq ="1";
                    }
                    PdProdActivityTemplateType.push( 
                        {
                            tenant_id : oData.PdProdActivityTemplate[i].tenant_id,
                            company_code : oData.PdProdActivityTemplate[i].company_code,
                            org_type_code : oData.PdProdActivityTemplate[i].org_type_code,
                            org_code : oData.PdProdActivityTemplate[i].org_code,
                            product_activity_code : pacOri,
                            develope_event_code : oData.PdProdActivityTemplate[i].develope_event_code,	
                            sequence : oData.PdProdActivityTemplate[i].sequence,
                            product_activity_name : oData.PdProdActivityTemplate[i].product_activity_name,	
                            product_activity_english_name : oData.PdProdActivityTemplate[i].product_activity_english_name,
                            milestone_flag : milestoneFlg,
                            active_flag : activeFlg,
                            update_user_id : this.loginUserId,
                            system_update_dtm : now, 
                            crud_type_code : oData.PdProdActivityTemplate[i]._row_state_,
                            update_product_activity_code : oData.PdProdActivityTemplate[i].product_activity_code
                    });
                    inputData.inputData.pdProdActivityTemplateType = PdProdActivityTemplateType;
                    var url = "dp/pd/productActivity/webapp/srv-api/odata/v4/dp.ProductActivityV4Service/PdProductActivitySaveProc";
                }
            }
            //console.log(inputData);
            var v_this = this;
            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: (function (sButton) {
                    $.ajax({
                        url: url,
                        type: "POST",
                        //datatype: "json",
                        //data: inputData,
                        data: JSON.stringify(inputData),
                        contentType: "application/json",
                        success: function (data) {
                            //console.log(data);
                            v_this.onSearch();
                            //var v_returnModel = oView.getModel("returnModel").getData();
                        },
                        error: function (e) {
                            //console.log(e);
                            v_this.onSearch();

                        }
                    });
                }).bind(this)
            })
        },

        onSelectionChange: function (oEvent) {
            var [tId, mName, sEntity, aCol] = arguments;
            var oTable = this.byId("mainTable");
            var oModel = this.getView().getModel(mName);
            var oItem = oTable.getSelectedItem();
            var idxs = [];
            for (var i = 0; i < oTable._iVisibleItemsLength; i++) {
                oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);

                oTable.getAggregation('items')[i].getCells()[5].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[5].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[6].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[6].getItems()[1].setVisible(false);
            }
            if (oItem != null && oItem != undefined) {
                this.byId("mainTableCancButton").setEnabled(true);                    
                for(var k=0; k<oTable.getSelectedContextPaths().length; k++){
                    idxs[k] = oTable.getSelectedContextPaths()[k].split("/")[2];
                    oTable.getAggregation('items')[idxs[k]].getCells()[1].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idxs[k]].getCells()[1].getItems()[1].setVisible(true);
                    oTable.getAggregation('items')[idxs[k]].getCells()[2].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idxs[k]].getCells()[2].getItems()[1].setVisible(true);
                    oTable.getAggregation('items')[idxs[k]].getCells()[3].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idxs[k]].getCells()[3].getItems()[1].setVisible(true);
                    oTable.getAggregation('items')[idxs[k]].getCells()[4].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idxs[k]].getCells()[4].getItems()[1].setVisible(true);

                    oTable.getAggregation('items')[idxs[k]].getCells()[5].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idxs[k]].getCells()[5].getItems()[1].setVisible(true);
                    oTable.getAggregation('items')[idxs[k]].getCells()[6].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idxs[k]].getCells()[6].getItems()[1].setVisible(true);
                }
            }
        },

        onSearchProdecuActivity: function() {

        },

	});
});
