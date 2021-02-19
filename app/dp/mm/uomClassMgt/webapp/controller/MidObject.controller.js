sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/Formatter",
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
    "sap/m/ObjectStatus",
    "sap/f/LayoutType"
], function (BaseController, Multilingual, Validator, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
	Formatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
	ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ObjectStatus, LayoutType) {
		
	"use strict";

	var oTransactionManager;

	return BaseController.extend("dp.mm.uomClassMgt.controller.MidObject", {

        dateFormatter: DateFormatter,

        formatter: Formatter,
        
        validator: new Validator(),		

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

            // this._initTableTemplates();
            this.enableMessagePopover();
        },         

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */

        handleFullScreen: function () {
            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/midObject/visibleFullScreenBtn", false);

            // var sLayout = LayoutType.EndColumnFullScreen;
            var sLayout = LayoutType.MidColumnFullScreen;
			this._changeFlexibleColumnLayout(sLayout);
        },
        
		handleExitFullScreen: function () {
			var oContModel = this.getModel("contModel");
            oContModel.setProperty("/midObject/visibleFullScreenBtn", true);

            // var sLayout = LayoutType.ThreeColumnsEndExpanded;
            var sLayout = LayoutType.TwoColumnsMidExpanded;
            this._changeFlexibleColumnLayout(sLayout);
        },
        
		handleClose: function () {
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
        },

        _changeFlexibleColumnLayout : function(layout){
            var oFclModel = this.getModel("fcl");
            oFclModel.setProperty("/layout", layout);
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
            this.onPageSaveButtonPress("D");
			// var oView = this.getView(),
			// 	oMasterModel = this.getModel("master"),
			// 	that = this;
			// MessageBox.confirm("Are you sure to delete?", {
			// 	title : "Comfirmation",
			// 	initialFocus : sap.m.MessageBox.Action.CANCEL,
			// 	onClose : function(sButton) {
			// 		if (sButton === MessageBox.Action.OK) {
			// 			oView.setBusy(true);
			// 			oMasterModel.removeData();
			// 			oMasterModel.setTransactionModel(that.getModel());
			// 			oMasterModel.submitChanges({
			// 				success: function(ok){
			// 					oView.setBusy(false);
            //                     that.onPageNavBackButtonPress.call(that);
            //                     that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
			// 					MessageToast.show("Success to delete.");
			// 				}
			// 			});
			// 		};
			// 	}
			// });
		},

		onMidTableAddButtonPress: function(){
			var oTable = this.byId("midTable"),
				oDetailsModel = this.getModel("details");
			oDetailsModel.addRecord({
				"tenant_id": this._sTenantId,
				"uom_class_code": this._sUomClassCode,
				"language_code": "",
				"uom_class_name": "",
				"uom_class_desc": ""
			}, "/UomClassLng", 0);
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
        onPageSaveButtonPress: function(CUDType){
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
                that = this;

            var CUType = CUDType;            

            if(CUType !== "D") {
                if(this._sTenantId !== "new"){
                    CUType = "U";                
                } else {
                    CUType = "C";
                }
            } 

            console.log(CUType);
           
            if(CUType === "U"){
                if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
                    MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                    return;
                }
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
                                if(CUType === "D") {
                                    that.handleClose.call(that);
                                    that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    MessageToast.show(that.getModel("I18N").getText("/NCM01002"));                                       
                                } else if(CUType === "C"){
                                    that.handleClose.call(that);
                                    that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                }else {
                                    MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                    that._toShowMode();                                
                                    that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    that._onRoutedThisPage();
                                }								
							}
						});
					};
				}
            });
            this.validator.clearValueState(this.byId("page"));            
		},
		
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			
            var oView = this.getView();
            var sTenantId = this._sTenantId;
            if (sTenantId === "new"){
                this.handleClose();
            }else if (sTenantId !== "new"){
                this.getModel("contModel").setProperty("/createMode", false);                              
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
            this.validator.clearValueState(this.byId("page"));
            
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_onMasterDataChanged: function(oEvent){
			if(this.getModel("contModel").getProperty("/createMode") == true){
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
            var oView = this.getView();
            
            if(oEvent){
                var oArgs = oEvent.getParameter("arguments");
                this._sTenantId = oArgs.tenantId;
                this._sUomClassCode = oArgs.uomClassCode;
                this._slayout = oArgs.layout;               
            }			
            
            this._fnInitControlModel();

			if(this._sTenantId == "new" && this._sUomClassCode == "code"){
				//It comes Add button pressed from the before page.
				this.getModel("contModel").setProperty("/createMode", true);

				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
                    "tenant_id": "L2100",
                    "uom_class_code": "",
                    "uom_class_name": "",
                    "uom_class_desc": "",
                    "disable_date": null
				}, "/UomClass");
				var oDetailsModel = this.getModel("details");
				oDetailsModel.setTransactionModel(this.getModel());
				oDetailsModel.setData([], "/UomClassLng");
				oDetailsModel.addRecord({
					"tenant_id": this._sTenantId,
					"uom_class_code": this._sUomClassCode,
					"language_code": "",
					"uom_class_name": "",
					"uom_class_desc": ""
				}, "/UomClassLng");
				this._toEditMode();
			}else{
				this.getModel("contModel").setProperty("/createMode", false);

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
            this.validator.clearValueState(this.byId("page"));
			oTransactionManager.setServiceModel(this.getModel());
        },

        _fnInitControlModel : function(){
            var oData = {
                readMode : null,
                createMode : null,
                editMode : null
            }

            var oContModel = this.getModel("contModel");
            oContModel.setProperty("/midObject", oData);            
            oContModel.setProperty("/midObject/visibleFullScreenBtn", true);
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
			this.byId("page").setSelectedSection("pageSectionMain");			
			this.byId("pageEditButton").setVisible(FALSE);			
            this.byId("pageSaveButton").setVisible(!FALSE);
            this.byId("pageCancelButton").setVisible(!FALSE);
			this.byId("midTableAddButton").setVisible(!FALSE);
			this.byId("midTableDeleteButton").setVisible(!FALSE);
			this.byId("midTableSearchField").setVisible(FALSE);		
            
            this.getView().getModel("contModel").setProperty("/editMode", true);
            this.getView().getModel("contModel").setProperty("/readMode", false);
		},

		_toShowMode: function(){
			var TRUE = true;			
			this.byId("page").setSelectedSection("pageSectionMain");			
			this.byId("pageEditButton").setVisible(TRUE);			
            this.byId("pageSaveButton").setVisible(!TRUE);
            this.byId("pageCancelButton").setVisible(!TRUE);
			this.byId("midTableAddButton").setVisible(!TRUE);
			this.byId("midTableDeleteButton").setVisible(!TRUE);
			this.byId("midTableSearchField").setVisible(TRUE);			
            
            this.getView().getModel("contModel").setProperty("/editMode", false);
            this.getView().getModel("contModel").setProperty("/readMode", true);
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