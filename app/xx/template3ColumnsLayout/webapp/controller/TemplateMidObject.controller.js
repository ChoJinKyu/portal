sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/json/JSONModel",
    "ext/lib/util/Validator",
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
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, Formatter, DateFormatter, 
        Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
        ColumnListItem, ObjectStatus, ObjectIdentifier, Text, Input, CodeComboBox, Item) {
	"use strict";

	var oTransactionManager;

	return BaseController.extend("xx.template3ColumnsLayout.controller.TemplateMidObject", {

		validator: new Validator(),
		
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
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
		onInit : function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new JSONModel(), "company");
			this.setModel(new JSONModel(), "department");
			this.setModel(new JSONModel(), "midObjectViewModel");

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("company"));
			oTransactionManager.addDataModel(this.getModel("department"));

            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            
			this.getModel("company").attachPropertyChange(this._onMasterDataChanged.bind(this));

			this._initTableTemplates();
            this.enableMessagePopover();
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
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
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
						oMasterModel.setTransactionModel(that.getModel());
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
			var oTable = this.byId("midTable"),
				oDetailsModel = this.getModel("department");
			oDetailsModel.addRecord({
				"tenant_id": this._sTenantId,
				"company_code": this._sCompanyCode,
				"control_option_level_code": "",
				"control_option_level_val": "",
				"company_name": "",
				"local_create_dtm": new Date(),
				"local_update_dtm": new Date()
			}, "/Company");
            this.validator.clearValueState(this.byId("midTable"));
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("midTable"),
				oDetailsModel = this.getModel("department"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oDetailsModel.getProperty("/Company").indexOf(oItem.getBindingContext("department").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oDetailsModel.removeRecord(nIndex);
				oDetailsModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
            this.validator.clearValueState(this.byId("midTable"));
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            var oView = this.getView(),
                oMasterModel = this.getModel("company"),
                oDetailsModel = this.getModel("department"),
                that = this;
                
			if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
				MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
				return;
            }

            if(this.validator.validate(this.byId("page")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oTransactionManager.submit({
							success: function(ok){
								that._toShowMode();
								oView.setBusy(false);
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
								MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
							}
						});
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
                oDetailsModel = this.getModel("department"),
				cancelEdit = function(){
					if(this.getModel("midObjectViewModel").getProperty("/isAddedMode") == true){
						this.onPageNavBackButtonPress.call(this);
					}else{
						this.validator.clearValueState(this.byId("page"));
						this._toShowMode();
					}
				}.bind(this);
				
			if(oMasterModel.isChanged() || oDetailsModel.isChanged()) {
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

		_onMasterDataChanged: function(oEvent){
			if(this.getModel("midObjectViewModel").getProperty("/isAddedMode") == true){
				var oMasterModel = this.getModel("company");
				var oDetailsModel = this.getModel("department");
				var sTenantId = oMasterModel.getProperty("/tenant_id");
				var sControlOPtionCode = oMasterModel.getProperty("/company_code");
				var oDetailsData = oDetailsModel.getData();
				oDetailsData.forEach(function(oItem, nIndex){
					oDetailsModel.setProperty("/"+nIndex+"/tenant_id", sTenantId);
					oDetailsModel.setProperty("/"+nIndex+"/company_code", sControlOPtionCode);
				});
				oDetailsModel.setData(oDetailsData);
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
				this.getModel("midObjectViewModel").setProperty("/isAddedMode", true);

				var oMasterModel = this.getModel("company");
				oMasterModel.setData({
					"tenant_id": "L2100",
					"use_flag": true
				}, "/Company");

				var oDetailsModel = this.getModel("department");
                oDetailsModel.setData([], "/Company");
				oDetailsModel.addRecord({
					"tenant_id": this._sTenantId,
					"company_code": this._sCompanyCode,
					"company_name": ""
				}, "/Company");
				this._toEditMode();
			}else{
				this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);
				
				var sPath = "/Company(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "')";
				oView.setBusy(true);
				this.getModel().read(sPath, {
					success: function(oData){
                        this.getModel("company").setProperty("/", oData);
						oView.setBusy(false);
					}.bind(this)
				});
			
				// oView.setBusy(true);
				// var oDetailsModel = this.getModel("department");
				// oDetailsModel.read("/Company", {
				// 	filters: [
				// 		new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
				// 		new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
				// 	],
				// 	success: function(oData){
				// 		oView.setBusy(false);
				// 	}
				// });
				this._toShowMode();
			}
		},

		_toEditMode: function(){
			var FALSE = false;
            this._showFormFragment('TemplateMidObject_Edit');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("pageDeleteButton").setEnabled(FALSE);
			this.byId("pageSaveButton").setEnabled(!FALSE);
			this.byId("pageNavBackButton").setEnabled(FALSE);

			this.byId("midTableAddButton").setEnabled(!FALSE);
			this.byId("midTableDeleteButton").setEnabled(!FALSE);
			this.byId("midTableSearchField").setEnabled(FALSE);
			this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
			this.byId("midTable").getColumns()[0].setVisible(!FALSE);
			this._bindMidTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
			var TRUE = true;
			this._showFormFragment('TemplateMidObject_Show');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("pageDeleteButton").setEnabled(TRUE);
			this.byId("pageSaveButton").setEnabled(!TRUE);
			this.byId("pageNavBackButton").setEnabled(TRUE);

			this.byId("midTableAddButton").setEnabled(!TRUE);
			this.byId("midTableDeleteButton").setEnabled(!TRUE);
			this.byId("midTableSearchField").setEnabled(TRUE);
			this.byId("midTable").setMode(sap.m.ListMode.None);
			this.byId("midTable").getColumns()[0].setVisible(!TRUE);
			this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
		},

		_initTableTemplates: function(){
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new ObjectStatus({
						icon: {
							path: 'department>_row_state_',
							formatter: this.formatter.toModelStateColumnIcon
						}
					}), 
					new ObjectIdentifier({
						text: "{department>company_code}"
					}), 
					new ObjectIdentifier({
						text: "{department>control_option_level_code}"
					}), 
					new Text({
						text: "{department>control_option_level_val}"
					}), 
					new Text({
						text: "{department>company_name}"
					})
				],
				type: sap.m.ListType.Inactive
			});

			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new ObjectStatus({
						icon: {
							path: 'department>_row_state_',
							formatter: this.formatter.toModelStateColumnIcon
						}
					}),
					new Text({
						text: "{department>company_code}"
					}), 
					new CodeComboBox({
						selectedKey: "{department>control_option_level_code}",
						emptyText: "Choose One",
                        items: {
                            path: '/',
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                                new Filter("group_code", FilterOperator.EQ, 'CM_CHAIN_CD')
							],
							serviceName: 'cm.util.CommonService',
							entityName: 'Code'
                        },
                        required: true
                    }), 
					new Input({
						value: {
							path: "department>control_option_level_val",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							}),
						},
						required: true
					}),
					new Input({
						value: {
							path: "department>company_name",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							})
						},
						required: true
					})
				]
            });
		},

		_bindMidTable: function(oTemplate, sKeyboardMode){
			this.byId("midTable").bindItems({
				path: "department>/Company",
				template: oTemplate
			}).setKeyboardMode(sKeyboardMode);
		},

		_oFragments: {},
		_showFormFragment : function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection.removeAllBlocks();
				oPageSubSection.addBlock(oFragment);
			})
        },
        _loadFragment: function (sFragmentName, oHandler) {
			if(!this._oFragments[sFragmentName]){
				Fragment.load({
					id: this.getView().getId(),
					name: "xx.template3ColumnsLayout.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
		}


	});
});