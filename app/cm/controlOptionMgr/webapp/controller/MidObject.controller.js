sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/ValidatorUtil",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
	"sap/ui/core/Item",
], function (BaseController, ValidatorUtil, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
	Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
	ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
        
	"use strict";

	var oTransactionManager;

	return BaseController.extend("cm.controlOptionMgr.controller.MidObject", {

		dateFormatter: DateFormatter,

		formatter: (function(){
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
			// Model used to manipulate controlstates. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
			this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
			this.setModel(oViewModel, "midObjectView");
			
			this.setModel(new ManagedModel(), "master");
			this.setModel(new ManagedListModel(), "details");

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("master"));
			oTransactionManager.addDataModel(this.getModel("details"));

			this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

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
				controlOptionCode: this._sControlOptionCode
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
				controlOptionCode: this._sControlOptionCode
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
				oMasterModel = this.getModel("master"),
				that = this;
			MessageBox.confirm("Are you sure to delete this control option and details?", {
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
				oDetailsModel = this.getModel("details");
			oDetailsModel.addRecord({
				"tenant_id": this._sTenantId,
				"control_option_code": this._sControlOptionCode,
				"control_option_level_code": "",
				"control_option_level_val": "",
				"control_option_val": "",
				"local_create_dtm": new Date(),
				"local_update_dtm": new Date()
			});
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("midTable"),
				oModel = this.getModel("details"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getData().indexOf(oItem.getBindingContext("details").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
			var oView = this.getView(),
				that = this;
			MessageBox.confirm("Are you sure ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oTransactionManager.submit({
							success: function(ok){
								that._toShowMode();
								oView.setBusy(false);
								that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
								MessageToast.show("Success to save.");
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
			if(this.getModel("midObjectView").getProperty("/isAddedMode") == true){
				this.onPageNavBackButtonPress.call(this);
			}else{
				this._toShowMode();
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
			if(this.getModel("midObjectView").getProperty("/isAddedMode") == true){
				var oMasterModel = this.getModel("master");
				var oDetailsModel = this.getModel("details");
				var sTenantId = oMasterModel.getProperty("/tenant_id");
				var sControlOPtionCode = oMasterModel.getProperty("/control_option_code");
				var oDetailsData = oDetailsModel.getData();
				oDetailsData.forEach(function(oItem, nIndex){
					oDetailsModel.setProperty("/"+nIndex+"/tenant_id", sTenantId);
					oDetailsModel.setProperty("/"+nIndex+"/control_option_code", sControlOPtionCode);
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
			this._sControlOptionCode = oArgs.controlOptionCode;

			if(oArgs.tenantId == "new" && oArgs.controlOptionCode == "code"){
				//It comes Add button pressed from the before page.
				this.getModel("midObjectView").setProperty("/isAddedMode", true);

				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
					"tenant_id": "L2100",
					"site_flag": false,
					"company_flag": false,
					"role_flag": false,
					"organization_flag": false,
					"user_flag": false,
					"start_date": new Date(),
					"end_date": new Date(9999, 11, 31),
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date()
				}, "/ControlOptionMasters");
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.addRecord({
					"tenant_id": this._sTenantId,
					"control_option_code": this._sControlOptionCode,
					"control_option_level_code": "",
					"control_option_level_val": "",
					"control_option_val": "",
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date()
				}, "/ControlOptionDetails");
				this._toEditMode();
			}else{
				this.getModel("midObjectView").setProperty("/isAddedMode", false);

				this._bindView("/ControlOptionMasters(tenant_id='" + this._sTenantId + "',control_option_code='" + this._sControlOptionCode + "')");
				oView.setBusy(true);
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.read("/ControlOptionDetails", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("control_option_code", FilterOperator.EQ, this._sControlOptionCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
				});
				this._toShowMode();
			}
			oTransactionManager.setServiceModel(this.getModel());
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oView = this.getView(),
				oMasterModel = this.getModel("master");
			oView.setBusy(true);
			oMasterModel.setTransactionModel(this.getModel());
			oMasterModel.read(sObjectPath, {
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},

		_toEditMode: function(){
			var FALSE = false;
            this._showFormFragment('MidObject_Edit');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", !FALSE);
			this.byId("pageEditButton").setEnabled(FALSE);
			this.byId("pageDeleteButton").setEnabled(FALSE);
			this.byId("pageNavBackButton").setEnabled(FALSE);

			this.byId("midTableAddButton").setEnabled(!FALSE);
			this.byId("midTableDeleteButton").setEnabled(!FALSE);
			this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
			this._bindMidTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
			var TRUE = true;
			this._showFormFragment('MidObject_Show');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", !TRUE);
			this.byId("pageEditButton").setEnabled(TRUE);
			this.byId("pageDeleteButton").setEnabled(TRUE);
			this.byId("pageNavBackButton").setEnabled(TRUE);

			this.byId("midTableAddButton").setEnabled(!TRUE);
			this.byId("midTableDeleteButton").setEnabled(!TRUE);
			this.byId("midTable").setMode(sap.m.ListMode.None);
			this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
		},

		_initTableTemplates: function(){
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{details>_row_state_}"
					}), 
					new ObjectIdentifier({
						text: "{details>control_option_code}"
					}), 
					new ObjectIdentifier({
						text: "{details>control_option_level_code}"
					}), 
					new Text({
						text: "{details>control_option_level_val}"
					}), 
					new Text({
						text: "{details>control_option_val}"
					})
				],
				type: sap.m.ListType.Inactive
			});

			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{details>_row_state_}"
					}), 
					new Text({
						text: "{details>control_option_code}"
					}), 
					new ComboBox({
                        selectedKey: "{details>control_option_level_code}",
                        items: {
                            id: "testCombo1",
                            path: 'util>/CodeDetails',
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                                new Filter("group_code", FilterOperator.EQ, 'TEST')
                            ],
                            template: new Item({
                                key: "{util>code}",
                                text: "{util>code_description}"
                            })
                        },
						editable: "{= ${details>_row_state_} === 'C' }",
                        required: true
                    }), 
					new Input({
						value: {
							path: "details>control_option_level_val",
                            type: new sap.ui.model.type.String(null, {
								maxLength: 100
							}),
						},
						editable: "{= ${details>_row_state_} === 'C' }",
						required: true
					}),
					new Input({
						value: {
							path: "details>control_option_val",
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
				path: "details>/ControlOptionDetails",
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
					name: "cm.controlOptionMgr.view." + sFragmentName,
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