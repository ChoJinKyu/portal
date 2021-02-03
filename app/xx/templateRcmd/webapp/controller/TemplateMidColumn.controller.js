sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/json/JSONModel",
	"ext/lib/formatter/Formatter",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectStatus",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"ext/lib/control/m/CodeComboBox",
	"sap/ui/core/Item",
], function (BaseController, Multilingual, ManagedModel, ManagedListModel, JSONModel, Formatter, DateFormatter, 
        Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
        ColumnListItem, ObjectStatus, ObjectIdentifier, Text, Input, CodeComboBox, Item) {
	"use strict";

	return BaseController.extend("xx.templateRcmd.controller.TemplateMidColumn", {

        formatter: Formatter,
        
        dateFormatter: DateFormatter,
        
		viewFormatter: (function(){
			return {
				toYesNo: function(oData){
					return oData === true ? "YES" : "NO"
				},
			}
		})(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit : function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new JSONModel(), "midPageViewModel");

            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            
			//this.getModel("company").attachPropertyChange(this._onMasterDataChanged.bind(this));

		}, 

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
		onPageEnterFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getRouter().navTo("midPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				companyCode: this._sCompanyCode
			});
		},
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
		onPageExitFullScreenButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.getRouter().navTo("midPage", {
				layout: sNextLayout, 
				tenantId: this._sTenantId,
				companyCode: this._sCompanyCode
			});
		},
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("beginPage", {layout: sNextLayout});
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
		},
		
		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function(){
			var oView = this.getView(),
				oMasterModel = this.getModel("company"),
				that = this;
			MessageBox.confirm("Are you sure to delete this control option and department?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oMasterModel.removeData();
						oMasterModel.submitChanges({
							success: function(ok){
								oView.setBusy(false);
								that.onPageNavBackButtonPress.call(that);
								MessageToast.show("Success to delete.");
							}
						});
					};
				}
			});
		},

		onMidTableAddButtonPress: function(){
			var oTable = this.getList(),
				oDepartmentModel = this.getModel("department");
			oDepartmentModel.addRecord({
				"tenant_id": this._sTenantId,
				"company_code": this._sCompanyCode,
				"control_option_level_code": "",
				"control_option_level_val": "",
				"company_name": ""
			}, "/Company");
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.getList(),
				oDepartmentModel = this.getModel("department"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oDepartmentModel.getProperty("/Company").indexOf(oItem.getBindingContext("department").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oDepartmentModel.removeRecord(nIndex);
				oDepartmentModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            var oView = this.getView(),
                oMasterModel = this.getModel("company"),
                oDepartmentModel = this.getModel("department"),
                that = this;
                
			if(!oMasterModel.isChanged() && !oDepartmentModel.isChanged()) {
				MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
				return;
            }

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						// oTransactionManager.submit({
						// 	success: function(ok){
						// 		that._toViewMode();
						// 		oView.setBusy(false);
                        //         that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
						// 		MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
						// 	}
						// });
					};
				}
			});

		},
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
            var oView = this.getView(),
                oMasterModel = this.getModel("company"),
                oDepartmentModel = this.getModel("department"),
				cancelEdit = function(){
					if(this.getModel("midPageViewModel").getProperty("/isAddedMode") == true){
						this.onPageNavBackButtonPress.call(this);
					}else{
						this._toViewMode();
					}
				}.bind(this);
				
			if(oMasterModel.isChanged() || oDepartmentModel.isChanged()) {
				MessageBox.confirm(this.getModel("I18N").getText("/NCM00007"), {
					title : "Comfirmation",
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						cancelEdit();
					}
				});
            }else{
				cancelEdit();
			}

        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

        getList: function(){
			return this.byId("departmentList");
        },

		_onMasterDataChanged: function(oEvent){
			if(this.getModel("midPageViewModel").getProperty("/isAddedMode") == true){
				var oMasterModel = this.getModel("company");
				var oDepartmentModel = this.getModel("department");
				var sTenantId = oMasterModel.getProperty("/tenant_id");
				var sControlOPtionCode = oMasterModel.getProperty("/company_code");
				var oDetailsData = oDepartmentModel.getData();
				oDetailsData.forEach(function(oItem, nIndex){
					oDepartmentModel.setProperty("/"+nIndex+"/tenant_id", sTenantId);
					oDepartmentModel.setProperty("/"+nIndex+"/company_code", sControlOPtionCode);
				});
				oDepartmentModel.setData(oDetailsData);
			}
		},

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(oEvent){
			var oArgs = oEvent.getParameter("arguments"),
				oView = this.getView();
			this._sTenantId = oArgs.tenantId;
			this._sCompanyCode = oArgs.companyCode;

			if(oArgs.tenantId == "create" && oArgs.companyCode == "new"){
				//It comes Add button pressed from the before page.
				this.getModel("midPageViewModel").setProperty("/isAddedMode", true);

				var oMasterModel = this.getModel("company");
				oMasterModel.setData({
					"tenant_id": "L2100",
					"use_flag": true
				}, "/Company");

				var oDepartmentModel = this.getModel("department");
                oDepartmentModel.setData([], "/Company");
				oDepartmentModel.addRecord({
					"tenant_id": this._sTenantId,
					"company_code": this._sCompanyCode,
					"company_name": ""
				}, "/Company");
				this._toEditMode();
			}else{
                this.getModel("midPageViewModel").setProperty("/isAddedMode", false);
                this.getView().bindElement({
                    path: "/Company(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "')"
                });
				
                this.getList().getBinding("items").filter([
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("company_code", FilterOperator.EQ, "LGCKR")
                ], "Application");

				// this.getModel().read("/Department", {
                //     urlParameters: {
                //         "$top": 20,
                //         "$expand": "parent,children"
                //     },
				// 	filters: [
				// 		new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
				// 		new Filter("company_code", FilterOperator.EQ, "LGCKR"),
				// 	],
				// 	success: function(oData){
                //         this.getModel("department").setProperty("/", oData.results);
				// 		oView.setBusy(false);
				// 	}.bind(this)
				// });
				this._toViewMode();
			}
		},

		_toEditMode: function(){
			var VIEW_MODE = false;
			this.byId("page").setSelectedSection("pageSectionMain");
			// this.byId("pageDeleteButton").setEnabled(VIEW_MODE);
			// this.byId("pageSaveButton").setEnabled(!VIEW_MODE);
			this.byId("pageNavBackButton").setEnabled(VIEW_MODE);

			// this.byId("midTableAddButton").setEnabled(!VIEW_MODE);
			// this.byId("midTableDeleteButton").setEnabled(!VIEW_MODE);
			this.getList().setMode(sap.m.ListMode.SingleSelectLeft);
			// this.getList().getColumns()[0].setVisible(!VIEW_MODE);
		},

		_toViewMode: function(){
			var VIEW_MODE = true;
			this.byId("page").setSelectedSection("pageSectionMain");
			// this.byId("pageDeleteButton").setEnabled(VIEW_MODE);
			// this.byId("pageSaveButton").setEnabled(!VIEW_MODE);
			this.byId("pageNavBackButton").setEnabled(VIEW_MODE);

			// this.byId("midTableAddButton").setEnabled(!VIEW_MODE);
			// this.byId("midTableDeleteButton").setEnabled(!VIEW_MODE);
			this.getList().setMode(sap.m.ListMode.None);
			// this.getList().getColumns()[0].setVisible(!VIEW_MODE);
		},

        
        onDepartmentListItemPress: function(oEvent){
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2),
			var sPath = oEvent.getSource().getBindingContextPath(),
				oRecord = this.getModel().getProperty(sPath);
                
			this.getRouter().navTo("endPage", {
				layout: sap.f.LayoutType.ThreeColumnsEndExpanded, 
				tenantId: oRecord.tenant_id,
				companyCode: oRecord.company_code,
                departmentCode: oRecord.department_code
			});
            //navigate next column
        }


	});
});