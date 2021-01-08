sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
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
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ExcelUtil) {
	"use strict";

	return BaseController.extend("dp.pd.activityMappingMgt.controller.MainList", {

        dateFormatter: DateFormatter,
        
        onInit: function() {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new ManagedListModel(), "list");

            this.getView().setModel(this.getOwnerComponent().getModel());

            oMultilingual.attachEvent("ready", function (oEvent) {
                var oi18nModel = oEvent.getParameter("model");
                this.addHistoryEntry({
                    title: oi18nModel.getText("/Activity Mapping MANAGEMENT"),
                    icon: "sap-icon://table-view",
                    intent: "#Template-display"
                }, true);
            }.bind(this));
            
            this._doInitTablePerso();
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
        
        _doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "activityMappingMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },

        _applySearch: function(aSearchFilters) {
            var oView = this.getView(),
                    oModel = this.getModel("list");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
            
            var oTable = this.byId("mainTable");
            oModel.read("/ActivityMapping", {
                filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
			});
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
            var oData = this.getModel("list").getProperty("/ActivityMapping");
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },

        onMainTableAddButtonPress: function(){
			var oTable = this.byId("mainTable"),
				oModel = this.getModel("list");
			oModel.addRecord({
				"tenant_id": "L1100",
				"org_code": "",
				"product_activity_code": "",
				"product_activity_name": "",
				"activity_dependency_code": "",
                "activity_code": "",
                "activity_name": ""
            }, "/ActivityMapping", 0);
            this.validator.clearValueState(this.byId("mainTable"));

		},

		onMainTableDeleteButtonPress: function(){
			var table = this.byId("mainTable"),
				model = this.getModel("list");
			
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });
        },
       
        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("list"),
                oView = this.getView(),
                table = this.byId("mainTable");
			
            if(this.validator.validate(this.byId("mainTable")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oModel.submitChanges({
							success: function(oEvent){
								oView.setBusy(false);
                                MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                                this.byId("onPageSearchButtonPress").firePress();
                                //table.clearSelection().removeSelections(true);
							}.bind(this)
						});
					};
				}.bind(this)
			});
			
        }, 

	});
});
