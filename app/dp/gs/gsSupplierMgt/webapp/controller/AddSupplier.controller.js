sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/f/LayoutType",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "sap/m/TablePersoController",
	"./FinListPersoService",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
    "sap/m/Input",
    "sap/m/DatePicker",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/ObjectStatus"
], function (BaseController, Multilingual, Validator, JSONModel, TransactionManager, ManagedModel, ManagedListModel, LayoutType, DateFormatter, NumberFormatter,
	TablePersoController, FinListPersoService, Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
	ColumnListItem, ObjectIdentifier, Text, Input, DatePicker, ComboBox, Item, ObjectStatus) {
		
	"use strict";

	var oTransactionManager;

	return BaseController.extend("dp.gs.gsSupplierMgt.controller.AddSupplier", {

        dateFormatter: DateFormatter,

        numberFormatter: NumberFormatter,
        
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
                    delay : 0,
                    screen: "",
                    editMode: true,
                    showMode: true
				});
			this.getRouter().getRoute("suppliePage").attachPatternMatched(this._onRoutedThisPage, this);
			this.setModel(oViewModel, "addSupplierView");
			
            this.setModel(new ManagedModel(), "SupplierGenView");
            this.setModel(new ManagedModel(), "SupplierGen");
            this.setModel(new ManagedListModel(), "SupplierFin");
            this.setModel(new ManagedListModel(), "SupplierSal");

			oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("SupplierGen"));
            oTransactionManager.addDataModel(this.getModel("SupplierFin"));
            oTransactionManager.addDataModel(this.getModel("SupplierSal"));

			this.getModel("SupplierGen").attachPropertyChange(this._onMasterDataChanged.bind(this));

            this._initTableTemplates();
            this.enableMessagePopover();
            // this._doInitTablePerso();
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
		// onPageEnterFullScreenButtonPress: function () {
		// 	var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
		// 	this.getRouter().navTo("midPage", {
		// 		layout: sNextLayout, 
		// 		tenantId: this._sTenantId,
		// 		uomCode: this._sSsn
		// 	});
		// },
		// /**
		//  * Event handler for Exit Full Screen Button pressed
		//  * @public
		//  */
		// onPageExitFullScreenButtonPress: function () {
		// 	var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
		// 	this.getRouter().navTo("midPage", {
		// 		layout: sNextLayout, 
		// 		tenantId: this._sTenantId,
		// 		uomCode: this._sSsn
		// 	});
		// },
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
			// var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            // this.getRouter().navTo("mainPage", {layout: sNextLayout});
            var sLayout = LayoutType.OneColumn;
            // var oFclModel = this.getModel("fcl");
            // oFclModel.setProperty("/layout", sLayout);
            this.getRouter().navTo("mainPage", {layout: sLayout});
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
				oMasterModel = this.getModel("SupplierGen"),
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
			var oTable = this.byId("finTable"),
				oDetailsModel = this.getModel("SupplierFin");
			oDetailsModel.addRecord({
                "tenant_id": this._sTenantId,
                "sourcing_supplier_id": this._sSsi,
				"sourcing_supplier_nickname": this._sSsn,
				"fiscal_year": "",
				"fiscal_quarter": "",
                "sales_amount": 0,
                "opincom_amount": 0,
                "asset_amount": 0,
                "curasset_amount": 0,
                "nca_amount": 0,
                "liabilities_amount": 0,
                "curliablities_amount": 0,
                "ncl_amount": 0,
                "equity_capital": 0                				
			}, "/SupplierFin");
        },
        
        onMidTable2AddButtonPress: function(){
			var oTable = this.byId("salTable"),
				oDetailsModel = this.getModel("SupplierSal");
			oDetailsModel.addRecord({
                "tenant_id": this._sTenantId,
                "sourcing_supplier_id": this._sSsi,
				"sourcing_supplier_nickname": this._sSsn,
				"txn_year": "",
				"customer_english_name": "",
                "customer_local_name": "",
                "annual_txn_amount": 0,
                "sales_weight": 0                				
			}, "/SupplierSal");
		},

		onMidTableDeleteButtonPress: function(){
			var oTable = this.byId("finTable"),
				oModel = this.getModel("SupplierFin"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/SupplierFin").indexOf(oItem.getBindingContext("SupplierFin").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
        },
        
        onMidTable2DeleteButtonPress: function(){
			var oTable = this.byId("salTable"),
				oModel = this.getModel("SupplierSal"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/SupplierSal").indexOf(oItem.getBindingContext("SupplierSal").getObject()));
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
                oMasterModel = this.getModel("SupplierGen"),
                oDetailsModel = this.getModel("SupplierFin"),
                oDetailsModel2 = this.getModel("SupplierSal"),
                email = this.getView().byId("editEmail").getValue(),
                that = this;
            
            if(!oMasterModel.isChanged() && !oDetailsModel.isChanged() && !oDetailsModel2.isChanged()) {
                    MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                    return;
            }
                
            if(this.validator.validate(this.byId("pageSubSection1")) !== true) return;
            if(this.validator.validate(this.byId("finTable")) !== true) return;
            if(this.validator.validate(this.byId("salTable")) !== true) return;

            var chkEmail = this.CheckEmail(email);
            if(!chkEmail){
                MessageBox.alert("이메일 형식이 잘못되었습니다.");
                return false;
            }


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
                                // that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                that._fnMasterSearch();
								MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
							}
						});
					};
				}
            });
            this.validator.clearValueState(this.byId("pageSubSection1"));
            this.validator.clearValueState(this.byId("finTable"));
            this.validator.clearValueState(this.byId("salTable"));
        },        
        
        CheckEmail: function (str) {                                                 

            var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            if(!reg_email.test(str)) {

                return false;         

            }else {                       

                return true;         

            }
        },

        onLiveChange: function(oEvent){
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);
        },

        onInputChange: function(oEvent){
            // String upperCaseOnly = "^[A-Z]*$";
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
            if(this.isValNull(val))
                _oInput.setValue(0);                      
                
        },
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
            
            var oView = this.getView();
            var sMode = this._sMode;
            if (sMode === "edit"){
                this.onPageNavBackButtonPress();
            }else if (sMode !== "edit"){                
               
                this._bindView("/SupplierGen(tenant_id='" + this._sTenantId + "',sourcing_supplier_id=" + this._sSsi + ")");
				oView.setBusy(true);
                var oDetailsModel = this.getModel("SupplierFin");
                var oDetailsModel2 = this.getModel("SupplierSal");
                oDetailsModel.setTransactionModel(this.getModel());
                oDetailsModel2.setTransactionModel(this.getModel());
                oDetailsModel.read("/SupplierFin", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("sourcing_supplier_id", FilterOperator.EQ, this._sSsi),
                    ],
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
                oDetailsModel2.read("/SupplierSal", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("sourcing_supplier_id", FilterOperator.EQ, this._sSsi),
                    ],
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
                this._toShowMode();
            }
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            this.validator.clearValueState(this.byId("finTable"));
            this.validator.clearValueState(this.byId("salTable"));
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */
        
        _fnMasterSearch : function(){
            var oBeginColumnPage = this.getView().getParent().getParent().getBeginColumnPages()[0];
            var oSearchBtn = oBeginColumnPage.byId('pageSearchButton');
            oSearchBtn.firePress();
        },

		_onMasterDataChanged: function(oEvent){
			// if(this.getModel("addSupplierView").getProperty("/isAddedMode") == true){
			// 	var oMasterModel = this.getModel("SupplierGen");
			// 	var oDetailsModel = this.getModel("SupplierFin");
			// 	var sTenantId = oMasterModel.getProperty("/tenant_id");
			// 	var sUomCode = oMasterModel.getProperty("/sourcing_supplier_nickname");
			// 	var oDetailsData = oDetailsModel.getData();
			// 	oDetailsData.UomLng.forEach(function(oItem, nIndex){
			// 		oDetailsModel.setProperty("/UomLng/"+nIndex+"/tenant_id", sTenantId);
			// 		oDetailsModel.setProperty("/UomLng/"+nIndex+"/sourcing_supplier_nickname", sUomCode);
			// 	});
			// 	//oDetailsModel.setData(oDetailsData);
			// }
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
            this._sSsi = oArgs.ssi;
            this._sSsn = oArgs.ssn;
            this._sMode = oArgs.mode;
            
            this._bindView("/SupplierGen(tenant_id='" + this._sTenantId + "',sourcing_supplier_id=" + this._sSsi + ")");
            
            var oDetailsModel = this.getModel("SupplierFin");
            var oDetailsModel2 = this.getModel("SupplierSal");
            var oDetailsModel3 = this.getModel("SupplierGenView");
            oDetailsModel.setTransactionModel(this.getModel());
            oDetailsModel2.setTransactionModel(this.getModel());
            oDetailsModel3.setTransactionModel(this.getModel());
            oDetailsModel.read("/SupplierFin", {
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("sourcing_supplier_id", FilterOperator.EQ, this._sSsi),
                ],
                success: function(oData){
                    
                }
            });
            oDetailsModel2.read("/SupplierSal", {
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("sourcing_supplier_id", FilterOperator.EQ, this._sSsi),
                ],
                success: function(oData){
                   
                }
            });            
            oDetailsModel3.read("/SupplierGenView(tenant_id='" + this._sTenantId + "',sourcing_supplier_id=" + this._sSsi + ")", {
                success: function (oData) {
                    
                }
            });

            if(oArgs.mode == "edit"){
                this._toEditMode();
            } else {
                this._toShowMode();
            }
                
            oTransactionManager.setServiceModel(this.getModel());
            
            var sThisViewId = this.getView().getId();
            var oFcl = this.getOwnerComponent().getRootControl().byId("fcl");
            oFcl.to(sThisViewId);

            //ScrollTop
            //this.byId("suppliePage").setSelectedSection("pageSectionMain");
            var oObjectPageLayout = this.getView().byId("suppliePage");
            var oFirstSection = oObjectPageLayout.getSections()[0];
            oObjectPageLayout.scrollToSection(oFirstSection.getId(), 0, -500);
            
        },

        onFinTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},
        
        onFinTablePersoRefresh : function() {
			FinListPersoService.resetPersData();
			this._oTPC.refresh();
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oView = this.getView(),
				oMasterModel = this.getModel("SupplierGen");
			oView.setBusy(true);
			oMasterModel.setTransactionModel(this.getModel());
			oMasterModel.read(sObjectPath, {
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},

		_toEditMode: function(){
            var oAddSupplierView = this.getView().getModel("addSupplierView");            
			var FALSE = false;
            // this._showFormFragment('AddSupplier_Edit');
			this.byId("suppliePage").setSelectedSection("pageSectionMain");
			// this.byId("page").setProperty("showFooter", !FALSE);
			this.byId("pageEditButton").setEnabled(FALSE);
			// this.byId("pageDeleteButton").setEnabled(FALSE);
            // this.byId("pageNavBackButton").setEnabled(FALSE);
            this.byId("pageSaveButton").setEnabled(!FALSE);
            this.byId("pageCancelButton").setEnabled(!FALSE);

			this.byId("midTableAddButton").setEnabled(!FALSE);
            this.byId("midTableDeleteButton").setEnabled(!FALSE);
            this.byId("midTable2AddButton").setEnabled(!FALSE);
			this.byId("midTable2DeleteButton").setEnabled(!FALSE);
			// this.byId("midTableSearchField").setEnabled(FALSE);
			//this.byId("midTableApplyFilterButton").setEnabled(FALSE);
            this.byId("finTable").setMode(sap.m.ListMode.MultiSelect);
            this.byId("salTable").setMode(sap.m.ListMode.MultiSelect);
            this._bindMidTable(this.oEditableTemplate, "Edit");
            this._bindMidTable2(this.oEditableTemplate2, "Edit");
            oAddSupplierView.setProperty("/editMode", true);
            oAddSupplierView.setProperty("/showMode", false);            
		},

		_toShowMode: function(){
            var oAddSupplierView = this.getView().getModel("addSupplierView");
			var TRUE = true;
			// this._showFormFragment('AddSupplier_Show');
			this.byId("suppliePage").setSelectedSection("pageSectionMain");
			// this.byId("page").setProperty("showFooter", !TRUE);
			this.byId("pageEditButton").setEnabled(TRUE);
			// this.byId("pageDeleteButton").setEnabled(TRUE);
            // this.byId("pageNavBackButton").setEnabled(TRUE);
            this.byId("pageSaveButton").setEnabled(!TRUE);
            this.byId("pageCancelButton").setEnabled(!TRUE);

			this.byId("midTableAddButton").setEnabled(!TRUE);
            this.byId("midTableDeleteButton").setEnabled(!TRUE);
            this.byId("midTable2AddButton").setEnabled(!TRUE);
			this.byId("midTable2DeleteButton").setEnabled(!TRUE);
			// this.byId("midTableSearchField").setEnabled(TRUE);
			//this.byId("midTableApplyFilterButton").setEnabled(TRUE);
            this.byId("finTable").setMode(sap.m.ListMode.None);
            this.byId("salTable").setMode(sap.m.ListMode.None);
            this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
            this._bindMidTable2(this.oReadOnlyTemplate2, "Navigation");
            oAddSupplierView.setProperty("/editMode", false);
            oAddSupplierView.setProperty("/showMode", true);
            
		},

		_initTableTemplates: function(){
            var oQuarterView = new ComboBox({
                    selectedKey: "{SupplierFin>fiscal_quarter}",
                    editable: false
            });
            oQuarterView.bindItems({
                path: 'util>/Code',
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, 'L2100'),                        
                    new Filter("group_code", FilterOperator.EQ, 'DP_GS_DATE_QUARTER')
                ],
                template: new Item({
                    key: "{util>code}",
                    text: "{util>code_name}"
                })
            });
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{SupplierFin>_row_state_}"
					}), 
					new Text({
						text: "{SupplierFin>fiscal_year}"
                    }),
                    oQuarterView,
                    new Text({
                        text: {
                            path: 'SupplierFin>sales_amount',
                            formatter: '.numberFormatter.toNumberString'
                        }
                    }),
                    new Text({
						text: "{SupplierFin>opincom_amount}"
                    }),
                    new Text({
						text: "{SupplierFin>asset_amount}"
                    }),
                    new Text({
						text: "{SupplierFin>curasset_amount}"
                    }),
                    new Text({
						text: "{SupplierFin>nca_amount}"
                    }),
                    new Text({
						text: "{SupplierFin>liabilities_amount}"
                    }),
                    new Text({
						text: "{SupplierFin>curliablities_amount}"
                    }),
                    new Text({
						text: "{SupplierFin>ncl_amount}"
                    }),
                    new Text({
						text: "{SupplierFin>equity_capital}"
					})
				],
				type: sap.m.ListType.Inactive
            });
            
            this.oReadOnlyTemplate2 = new ColumnListItem({
				cells: [
					new Text({
						text: "{SupplierSal>_row_state_}"
					}), 
					new Text({
						text: "{SupplierSal>txn_year}"
                    }),
                    new Text({
						text: "{SupplierSal>customer_english_name}"
                    }),
                    new Text({
						text: "{SupplierSal>customer_local_name}"
                    }),
                    new Text({
						text: "{SupplierSal>annual_txn_amount}"
                    }),
                    new Text({
						text: "{SupplierSal>sales_weight}"
                    })
				],
				type: sap.m.ListType.Inactive
			});

            var oQuarterEdit = new ComboBox({
                    selectedKey: "{SupplierFin>fiscal_quarter}",
                    editable: "{= ${SupplierFin>_row_state_} === 'C' }",
                    required : true
            });
            oQuarterEdit.bindItems({
                path: 'util>/Code',
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, 'L2100'),                        
                    new Filter("group_code", FilterOperator.EQ, 'DP_GS_DATE_QUARTER')
                ],
                template: new Item({
                    key: "{util>code}",
                    text: "{util>code_name}"
                })
            });
			this.oEditableTemplate = new ColumnListItem({
				cells: [
					new ObjectStatus({
                        icon:{ path:'SupplierFin>_row_state_', formatter: this.formattericon
                                }                              
                    }),                    
                    new DatePicker({
                        value: "{SupplierFin>fiscal_year}",
                        valueFormat: "yyyy",
                        displayFormat: "yyyy",
                        editable: "{= ${SupplierFin>_row_state_} === 'C' }",
                        required: true
                    }),                    
                    oQuarterEdit,                                        
                    new Input({
                        value: {
                            path: 'SupplierFin>sales_amount'
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierFin>opincom_amount'
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierFin>asset_amount'
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierFin>curasset_amount'
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierFin>nca_amount'
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierFin>liabilities_amount'
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierFin>curliablities_amount'
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierFin>ncl_amount'                            
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierFin>equity_capital'                           
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    })
				]
            });

            this.oEditableTemplate2 = new ColumnListItem({
				cells: [
					new ObjectStatus({
                        icon:{ path:'SupplierSal>_row_state_', formatter: this.formattericon
                                }                              
                    }),
                    // oLanguageCode,
                    new DatePicker({
                        value: "{SupplierSal>txn_year}",
                        valueFormat: "yyyy",
                        displayFormat: "yyyy",
                        editable: "{= ${SupplierSal>_row_state_} === 'C' }",
                        required: true
                    }),                    
                    new Input({
                        value: {
                            path: 'SupplierSal>customer_english_name',
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 240
                            }
                        },
                        editable: "{= ${SupplierSal>_row_state_} === 'C' }",
                        required : true
                    }),
                    new Input({
                        value: {
                            path: 'SupplierSal>customer_local_name',
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 240
                            }
                        }
                    }),
                    new Input({
                        value: {
                            path: 'SupplierSal>annual_txn_amount'                            
                        },
                        type: "Number",
                        textAlign: "End",
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)  
                    }),
                    new Input({
                        value: {
                            path: 'SupplierSal>sales_weight',
                            type: 'sap.ui.model.type.Integer'                            
                        },
                        type: "Number",
                        textAlign: "End",                        
                        liveChange: function (oEvent) {
                            this.onInputChange(oEvent);
                        }.bind(this)                        
                    })
				]
            });
		},

		_bindMidTable: function(oTemplate, sKeyboardMode){
			this.byId("finTable").bindItems({
				path: "SupplierFin>/SupplierFin",
				template: oTemplate
				// templateShareable: true,
				// key: ""
			}).setKeyboardMode(sKeyboardMode);
        },

        _bindMidTable2: function(oTemplate, sKeyboardMode){
			this.byId("salTable").bindItems({
				path: "SupplierSal>/SupplierSal",
				template: oTemplate
				// templateShareable: true,
				// key: ""
			}).setKeyboardMode(sKeyboardMode);
		},

		// _oFragments: {},
		// _showFormFragment : function (sFragmentName) {
        //     var oPageSubSection = this.byId("pageSubSection1");
        //     this._loadFragment(sFragmentName, function(oFragment){
		// 		oPageSubSection.removeAllBlocks();
		// 		oPageSubSection.addBlock(oFragment);
		// 	})
        // },
        // _loadFragment: function (sFragmentName, oHandler) {
		// 	if(!this._oFragments[sFragmentName]){
		// 		Fragment.load({
		// 			id: this.getView().getId(),
		// 			name: "dp.gs.gsSupplierMgt.view." + sFragmentName,
		// 			controller: this
		// 		}).then(function(oFragment){
		// 			this._oFragments[sFragmentName] = oFragment;
		// 			if(oHandler) oHandler(oFragment);
		// 		}.bind(this));
		// 	}else{
		// 		if(oHandler) oHandler(this._oFragments[sFragmentName]);
		// 	}
        // },

        _doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("finTable"),
				componentName: "gsSupplierMgt",
				persoService: FinListPersoService,
				hasGrouping: true
			}).activate();
        }
    });
});