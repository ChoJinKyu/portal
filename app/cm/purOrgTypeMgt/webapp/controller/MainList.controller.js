sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedListModel",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
	"sap/ui/core/Item",
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Formatter, Validator, TablePersoController, MainListPersoService, 
		Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
	"use strict";

	var oTransactionManager;

	return BaseController.extend("cm.purOrgTypeMgt.controller.MainList", {

        formatter: Formatter,
        
        validator: new Validator(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            
			this.setModel(new ManagedListModel(), "details");

            oTransactionManager = new TransactionManager();
            //oTransactionManager.addDataModel(this.getModel("list"));
            //oTransactionManager.addDataModel(this.getModel("details"));
            oTransactionManager.addDataModel(this.getModel("list"));


			oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
					icon: "sap-icon://table-view",
					intent: "#Template-display"
				}, true);
			}.bind(this));

           //this._doInitTablePerso();
            this.enableMessagePopover();
        },
        
        onRenderedFirst : function () {
			this.byId("pageSearchButton").firePress();
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler when a page state changed
		 * @param {sap.ui.base.Event} oEvent the page stateChange event
		 * @public
		 */
		onPageStateChange: function(oEvent){
			debugger;
		},


		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table updateFinished event
		 * @public
		 */
		onMainTableUpdateFinished : function (oEvent) {
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			//this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
			MainListPersoService.resetPersData();
			this._oTPC.refresh();
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
			var forceSearch = function(){
				var aTableSearchState = this._getSearchStates();
				this._applySearch(aTableSearchState);
			}.bind(this);
			
			if(this.getModel("list").isChanged() === true){
				MessageBox.confirm(this.getModel("I18N").getText("/NCM00005"), {
					title : this.getModel("I18N").getText("/SEARCH"),
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
							forceSearch();
						}
					}.bind(this)
				});
			}else{
				forceSearch();
			}
		},

		onMainTableAddButtonPress: function(){
			var oTable = this.byId("mainTable"),
                oModel = this.getModel("list");
                // oModel_details = this.getModel("details");
			oModel.addRecord({
				"tenant_id": "L2100",
				"company_code": "",
				"process_type_name": "",
				"org_type_name": "",
				"use_flag": false,
            }, "/PurOrgTypeView", 0);
            // oModel_details.addRecord({
			// 	"tenant_id": "L2100",
			// 	"company_code": "",
			// 	"process_type_code": "",
			// 	"org_type_code": "",
			// 	"use_flag": false,
            // }, "/PurOrgTypeMap", 0);
            this.validator.clearValueState(this.byId("mainTable"));
            oTransactionManager.setServiceModel(this.getModel());
		},

		onMainTableDeleteButtonPress: function(){
			var table = this.byId("mainTable"),
                model = this.getModel("list");
                //modelDetails = this.getModel("details");
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
                //modelDetails.markRemoved(idx);
            });
        },
       
        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("list"),
                oView = this.getView(),
                table = this.byId("mainTable");
                // "tenant_id": "L2100",
				// "company_code": "",
				// "process_type_name": "",
				// "org_type_name": "",
				// "use_flag": false,
                // var oMasterModel = this.getModel("list");
                // var oDetailsModel = this.getModel("details");
                // var oMasterData = oMasterModel.getData();
				
                // //var oDetailsData = oMasterModel.getData();
				// oMasterData.PurOrgTypeView.forEach(function(oItem,nIndex){
                //     var row_state = oMasterModel.getProperty("/PurOrgTypeView/"+nIndex+"/_row_state_");
                //     var sTenantId = oMasterModel.getProperty("/PurOrgTypeView/"+nIndex+"/tenant_id");
                //     var sCompany_code = oMasterModel.getProperty("/PurOrgTypeView/"+nIndex+"/company_code");
                //     var sProcess_type_name = oMasterModel.getProperty("/PurOrgTypeView/"+nIndex+"/process_type_name");
                //     var sOrg_type_name = oMasterModel.getProperty("/PurOrgTypeView/"+nIndex+"/org_type_name");
                //     var sUse_flag = oMasterModel.getProperty("/PurOrgTypeView/"+nIndex+"/use_flag");
                //     if(row_state !== undefined ){
                //         oDetailsModel.setProperty("/PurOrgTypeMap/"+nIndex+"/tenant_id", sTenantId);
                //         oDetailsModel.setProperty("/PurOrgTypeMap/"+nIndex+"/company_code", sCompany_code);
                //         oDetailsModel.setProperty("/PurOrgTypeMap/"+nIndex+"/process_type_code", sProcess_type_name);
                //         oDetailsModel.setProperty("/PurOrgTypeMap/"+nIndex+"/org_type_code", sOrg_type_name);
                //         oDetailsModel.setProperty("/PurOrgTypeMap/"+nIndex+"/use_flag", sUse_flag);
                //     }
                // });
                // oDetailsModel.setTransactionModel(this.getModel());
                
				//oDetailsModel.setData(oDetailsData.PurOrgTypeMap, "/PurOrgTypeMap");
			
			// if(!oModel.isChanged()) {
			// 	MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
			// 	return;
            // }
            
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
                                this.byId("pageSearchButton").firePress();
                                //table.clearSelection().removeSelections(true);
							}.bind(this)
						});
					};
				}.bind(this)
			});
			
        }, 

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oView = this.getView(),
                oModel = this.getModel("list"),
                oDetailsModel = this.getModel("details");
			oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
			oModel.read("/PurOrgTypeView", {
                filters: aTableSearchState,
                sorters: [
				],
				success: function(oData){
                    this.validator.clearValueState(this.byId("mainTable"));
					oView.setBusy(false);
				}.bind(this)
            });
            // oDetailsModel.setTransactionModel(this.getModel());
            // oDetailsModel.read("/PurOrgTypeMap", {
			// 		filters: [
			// 			aTableSearchState
			// 		],
			// 		success: function(oData){
			// 			oView.setBusy(false);
			// 		}
			// 	});
            // ,
			// 	sorters: [
			// 		new Sorter("chain_code"),
			// 		new Sorter("message_code"),
			// 		new Sorter("language_code", true)
			// 	]
			//oTransactionManager.setServiceModel(this.getModel());
		},
		
		_getSearchStates: function(){
			var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
				// chain = this.getView().byId("searchChain"+sSurffix).getSelectedKey(),
				// language = this.getView().byId("searchLanguage"+sSurffix).getSelectedKey(),
                // keyword = this.getView().byId("searchKeyword"+sSurffix).getValue(),
                tenant,
                company;
				
			var aTableSearchState = [];
			if (this.getView().byId("search_tenant"+sSurffix)) {
                tenant = this.getView().byId("search_tenant"+sSurffix).getSelectedKey();
                this.getView().getModel("view").setProperty("/tenant_id", this.byId("search_tenant"+sSurffix).getSelectedKey());
            }
            if (this.getView().byId("search_company"+sSurffix)) {
                company = this.getView().byId("search_company"+sSurffix).getSelectedKey();
                this.getView().getModel("view").setProperty("/company_code", this.byId("search_company"+sSurffix).getSelectedKey());
            }
            // "Tenant", "Company", "Plant", "Purchasing",  "Unit", "Division"
            // if (selectedKey == "Tenant" || selectedKey == "Company" || selectedKey == "Plant" || selectedKey == "Purchasing") {
            //     nameFilter = selectedKey + "_name";
            //     nameFilter = nameFilter.toLowerCase();
            // } else if (selectedKey == "Unit" || selectedKey == "Division") {
            //     nameFilter = "biz" + selectedKey + "_name";
            //     nameFilter = nameFilter.toLowerCase();
            // }
            var aTableSearchState = [];
            if (tenant && tenant.length > 0) {
                aTableSearchState.push(new Filter("tenant_id", FilterOperator.EQ, tenant));
            }
            
            if (company && company.length > 0) {
                aTableSearchState.push(new Filter("company_code", FilterOperator.EQ, company));
            }
            
            return aTableSearchState;
        },
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "cm.purOrgTypeMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },
        onTenantChange: function (oEvent) {
            var sTenant = oEvent.getSource().getSelectedKey();
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, sTenant)
            ];
            var oItemTemplate = new sap.ui.core.ListItem({
                key: "{org>company_code}",
                text: "{org>company_name}",
                additionalText: "{org>company_code}"
            });
            var oChain = this.byId("search_company"+sSurffix);
            oChain.setSelectedKey(null);
            oChain.bindItems("org>/Org_Company", oItemTemplate, null, aFilters);
        }


	});
});