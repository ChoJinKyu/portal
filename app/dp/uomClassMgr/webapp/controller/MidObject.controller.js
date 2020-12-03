sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
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
    "sap/m/ObjectStatus"
], function (BaseController, Multilingual, Validator, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
	Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
	ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ObjectStatus) {
		
	"use strict";

	var oTransactionManager;

	return BaseController.extend("dp.uomClassMgr.controller.MidObject", {

        dateFormatter: DateFormatter,
        
        validator: new Validator(),

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
            var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedListModel(), "list");
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

        formattericon: function(sState){
            switch(sState){
                case "D":
                    return "sap-icon://decline";
                break;
                case "U": 
                    return "sap-icon://accept";
                break;
                case "C": 
                    return "sap-icon://add";
                break;
            }
            return "";
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
				uomClassCode: this._sUomClassCode
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
				uomClassCode: this._sUomClassCode
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
			MessageBox.confirm("Are you sure to delete?", {
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
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
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
				"uom_class_code": this._sUomClassCode,
				"language_code": "",
				"uom_class_name": "",
				"uom_class_desc": "",
				"local_create_dtm": new Date(),
				"local_update_dtm": new Date()
			}, "/UomClassLng");
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("midTable"),
				oModel = this.getModel("details"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/UomClassLng").indexOf(oItem.getBindingContext("details").getObject()));
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
                oDetailsModel = this.getModel("details"),
                that = this;
            // 폼의 변경은 어떻게 체크를 해야할까
            // if(!oDetailsModel.isChanged()) {
			// 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
			// 	return;
            // }
                
            if(this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;
            if(this.validator.validate(this.byId("midTable")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
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
								MessageToast.show(that.getModel("I18N").getText("/NCM0005"));
							}
						});
					};
				}
            });
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            this.validator.clearValueState(this.byId("midTable"));
		},
		
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			// if(this.getModel("midObjectView").getProperty("/isAddedMode") == true){
			// 	this.onPageNavBackButtonPress.call(this);
			// }else{
			// 	this._toShowMode();
            // }
            var oView = this.getView();
            var sTenantId = this._sTenantId;
            if (sTenantId === "new"){
                this.onPageNavBackButtonPress();
            }else if (sTenantId !== "new"){
                
                this.getModel("midObjectView").setProperty("/isAddedMode", false);                
                this._bindView("/UomClass(tenant_id='" + this._sTenantId + "',uom_class_code='" + this._sUomClassCode + "')");
				oView.setBusy(true);
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());				
                oDetailsModel.read("/UomClassLng", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("uom_class_code", FilterOperator.EQ, this._sUomClassCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
				});
                this._toShowMode();
            }
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            this.validator.clearValueState(this.byId("midTable"));
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
			if(this.getModel("midObjectView").getProperty("/isAddedMode") == true){
				var oMasterModel = this.getModel("master");
				var oDetailsModel = this.getModel("details");
				var sTenantId = oMasterModel.getProperty("/tenant_id");
				var sUomClassCode = oMasterModel.getProperty("/uom_class_code");
				var oDetailsData = oDetailsModel.getData();
				oDetailsData.UomClassLng.forEach(function(oItem, nIndex){
					oDetailsModel.setProperty("/UomClassLng/"+nIndex+"/tenant_id", sTenantId);
					oDetailsModel.setProperty("/UomClassLng/"+nIndex+"/uom_class_code", sUomClassCode);
				});
				//oDetailsModel.setData(oDetailsData);
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
			this._sUomClassCode = oArgs.uomClassCode;

			if(oArgs.tenantId == "new" && oArgs.uomClassCode == "code"){
				//It comes Add button pressed from the before page.
				this.getModel("midObjectView").setProperty("/isAddedMode", true);

				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": "L2600",
                    "uom_class_code": "",
                    "uom_class_name": "",
                    "uom_class_desc": "",
                    "disable_date": null,                    
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date()
				}, "/UomClass");
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.setData([], "/UomClassLng");
				oDetailsModel.addRecord({
					"tenant_id": this._sTenantId,
					"uom_class_code": this._sUomClassCode,
					"language_code": "",
					"uom_class_name": "",
					"uom_class_desc": "",
					"local_create_dtm": new Date(),
					"local_update_dtm": new Date()
				}, "/UomClassLng");
				this._toEditMode();
			}else{
				this.getModel("midObjectView").setProperty("/isAddedMode", false);

				this._bindView("/UomClass(tenant_id='" + this._sTenantId + "',uom_class_code='" + this._sUomClassCode + "')");
				oView.setBusy(true);
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.read("/UomClassLng", {
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
						new Filter("uom_class_code", FilterOperator.EQ, this._sUomClassCode),
					],
					success: function(oData){
						oView.setBusy(false);
					}
				});
				this._toShowMode();
            }
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            this.validator.clearValueState(this.byId("midTable"));
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
			// this.byId("pageDeleteButton").setEnabled(FALSE);
			this.byId("pageNavBackButton").setEnabled(FALSE);

			this.byId("midTableAddButton").setEnabled(!FALSE);
			this.byId("midTableDeleteButton").setEnabled(!FALSE);
			this.byId("midTableSearchField").setEnabled(FALSE);
			//this.byId("midTableApplyFilterButton").setEnabled(FALSE);
			this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
			this._bindMidTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
			var TRUE = true;
			this._showFormFragment('MidObject_Show');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", !TRUE);
			this.byId("pageEditButton").setEnabled(TRUE);
			// this.byId("pageDeleteButton").setEnabled(TRUE);
			this.byId("pageNavBackButton").setEnabled(TRUE);

			this.byId("midTableAddButton").setEnabled(!TRUE);
			this.byId("midTableDeleteButton").setEnabled(!TRUE);
			this.byId("midTableSearchField").setEnabled(TRUE);
			//this.byId("midTableApplyFilterButton").setEnabled(TRUE);
			this.byId("midTable").setMode(sap.m.ListMode.None);
			this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
		},

		_initTableTemplates: function(){
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{details>_row_state_}"
					}), 
					new Text({
						text: "{details>language_code}"
					}), 
					new Text({
						text: "{details>uom_class_name}"
					}), 
					new Text({
						text: "{details>uom_class_desc}"
					})
				],
				type: sap.m.ListType.Inactive
			});

            var oLanguageCode = new ComboBox({
                    selectedKey: "{details>language_code}",
                    required : true
                });
                oLanguageCode.bindItems({
                    path: 'util>/CodeDetails',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2600'),
                        // new Filter("company_code", FilterOperator.EQ, 'G100'),
                        new Filter("group_code", FilterOperator.EQ, 'CM_LANG_CODE')
                    ],
                    template: new Item({
                        key: "{util>code}",
                        text: "{util>code_description}"
                    })
                });                
			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new ObjectStatus({
                        icon:{ path:'details>_row_state_', formatter: this.formattericon
                                }                              
                    }),
					oLanguageCode, 
					new Input({
                        value: {
                            path: 'details>uom_class_name',
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 20
                            }
                        },
                        required : true                        
					}), 
					new Input({
						value: {
                            path: 'details>uom_class_desc',
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 50
                            }
                        }
					})
				]
            });
		},

		_bindMidTable: function(oTemplate, sKeyboardMode){
			this.byId("midTable").bindItems({
				path: "details>/UomClassLng",
				template: oTemplate
				// templateShareable: true,
				// key: ""
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
					name: "dp.uomClassMgr.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
        },
        
        onMidTableFilterPress: function() {
            this._MidTableApplyFilter();
        },

        _MidTableApplyFilter: function() {

            var oView = this.getView(),
				sValue = oView.byId("midTableSearchField").getValue(),
				oFilter = new Filter("uom_class_name", FilterOperator.Contains, sValue);

			oView.byId("midTable").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);

        }

	});
});