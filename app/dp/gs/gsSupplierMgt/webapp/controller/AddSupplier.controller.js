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
], function (BaseController, Multilingual, Validator, JSONModel, TransactionManager, ManagedModel, ManagedListModel, LayoutType, DateFormatter, 
	Filter, FilterOperator, Fragment, MessageBox, MessageToast, 
	ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ObjectStatus) {
		
	"use strict";

	var oTransactionManager;

	return BaseController.extend("dp.gs.gsSupplierMgt.controller.AddSupplier", {

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
			this.getRouter().getRoute("suppliePage").attachPatternMatched(this._onRoutedThisPage, this);
			this.setModel(oViewModel, "addSupplierView");
			
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
				"sourcing_supplier_nickname": this._sSsn,
				"fiscal_year": "",
				"fiscal_quarter": "",
                "sales_amount": "",
                "opincom_amount": "",
                "asset_amount": "",
                "curasset_amount": "",
                "nca_amount": "",
                "liabilities_amount": "",
                "curliablities_amount": "",
                "ncl_amount": "",
                "equity_capital": ""                				
			}, "/SupplierFin");
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
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
            var oView = this.getView(),
                oMasterModel = this.getModel("SupplierGen"),
                oDetailsModel = this.getModel("SupplierFin"),
                that = this;

            if (this._sTenantId !== "new"){
                if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
                    MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                    return;
                }
            }
                
            if(this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;
            if(this.validator.validate(this.byId("finTable")) !== true) return;

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
								MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
							}
						});
					};
				}
            });
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            this.validator.clearValueState(this.byId("finTable"));
		},
		
		
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
            this.onPageNavBackButtonPress();
			// if(this.getModel("addSupplierView").getProperty("/isAddedMode") == true){
			// 	this.onPageNavBackButtonPress.call(this);
			// }else{
			// 	this._toShowMode();
            // }
            // var oView = this.getView();
            // var sTenantId = this._sTenantId;
            // if (sTenantId === "new"){
            //     this.onPageNavBackButtonPress();
            // }else if (sTenantId !== "new"){
                
            //     this.getModel("addSupplierView").setProperty("/isAddedMode", false);                
            //     this._bindView("/Uom(tenant_id='" + this._sTenantId + "',uom_code='" + this._sSsn + "')");
			// 	oView.setBusy(true);
			// 	var oDetailsModel = this.getModel("SupplierFin");
			// 	oDetailsModel.setTransactionModel(this.getModel());				
            //     oDetailsModel.read("/UomLng", {
			// 		filters: [
			// 			new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
			// 			new Filter("uom_code", FilterOperator.EQ, this._sSsn),
			// 		],
			// 		success: function(oData){
			// 			oView.setBusy(false);
			// 		}
			// 	});
            //     this._toShowMode();
            // }
            // this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            // this.validator.clearValueState(this.byId("midTable"));
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

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
			this._sSsn = oArgs.ssn;

			// if(oArgs.tenantId == "new" && oArgs.uomCode == "code"){
			// 	//It comes Add button pressed from the before page.
			// 	this.getModel("addSupplierView").setProperty("/isAddedMode", true);

			// 	var oMasterModel = this.getModel("SupplierGen");
			// 	oMasterModel.setData({
            //         "tenant_id": "L2600",
            //         "sourcing_supplier_nickname": "",
            //         "base_unit_flag": false					
			// 	}, "/Uom");
			// 	var oDetailsModel = this.getModel("SupplierFin");
			// 	oDetailsModel.setTransactionModel(this.getModel());
			// 	oDetailsModel.setData([], "/UomLng");
			// 	oDetailsModel.addRecord({
			// 		"tenant_id": this._sTenantId,
			// 		"uom_code": this._sSsn,
			// 		"language_code": "",
			// 		"commercial_uom_code": "",
            //         "technical_uom_code": "",
            //         "commercial_uom_name": "",
            //         "technical_uom_name": "",
            //         "uom_desc": ""					
			// 	}, "/UomLng");
			// 	this._toEditMode();
			// }else{
			// 	this.getModel("addSupplierView").setProperty("/isAddedMode", false);

			// 	this._bindView("/SupplierGen(tenant_id='" + this._sTenantId + "',sourcing_supplier_nickname='" + this._sSsn + "')");
			// 	oView.setBusy(true);
			// 	var oDetailsModel = this.getModel("SupplierFin");
			// 	oDetailsModel.setTransactionModel(this.getModel());
			// 	oDetailsModel.read("/SupplierFin", {
			// 		filters: [
			// 			new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
			// 			new Filter("sourcing_supplier_nickname", FilterOperator.EQ, this._sSsn),
			// 		],
			// 		success: function(oData){
			// 			oView.setBusy(false);
			// 		}
			// 	});
			// 	this._toShowMode();
            // }
            
            // this.getModel("addSupplierView").setProperty("/isAddedMode", false);

            this._bindView("/SupplierGen(tenant_id='" + this._sTenantId + "',sourcing_supplier_nickname='" + this._sSsn + "')");
            oView.setBusy(true);
            var oDetailsModel = this.getModel("SupplierFin");
            var oDetailsModel2 = this.getModel("SupplierSal");
            oDetailsModel.setTransactionModel(this.getModel());
            oDetailsModel2.setTransactionModel(this.getModel());
            oDetailsModel.read("/SupplierFin", {
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("sourcing_supplier_nickname", FilterOperator.EQ, this._sSsn),
                ],
                success: function(oData){
                    oView.setBusy(false);
                }
            });
            oDetailsModel2.read("/SupplierSal", {
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("sourcing_supplier_nickname", FilterOperator.EQ, this._sSsn),
                ],
                success: function(oData){
                    oView.setBusy(false);
                }
            });

            this._toEditMode();
                
            oTransactionManager.setServiceModel(this.getModel());
            
            var sThisViewId = this.getView().getId();
            var oFcl = this.getOwnerComponent().getRootControl().byId("fcl");
            oFcl.to(sThisViewId);
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
			var FALSE = false;
            this._showFormFragment('AddSupplier_Edit');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", !FALSE);
			// this.byId("pageEditButton").setEnabled(FALSE);
			// this.byId("pageDeleteButton").setEnabled(FALSE);
			// this.byId("pageNavBackButton").setEnabled(FALSE);

			this.byId("midTableAddButton").setEnabled(!FALSE);
			this.byId("midTableDeleteButton").setEnabled(!FALSE);
			// this.byId("midTableSearchField").setEnabled(FALSE);
			//this.byId("midTableApplyFilterButton").setEnabled(FALSE);
			this.byId("finTable").setMode(sap.m.ListMode.SingleSelectLeft);
			this._bindMidTable(this.oEditableTemplate, "Edit");
		},

		_toShowMode: function(){
			var TRUE = true;
			this._showFormFragment('AddSupplier_Show');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", !TRUE);
			// this.byId("pageEditButton").setEnabled(TRUE);
			// this.byId("pageDeleteButton").setEnabled(TRUE);
			// this.byId("pageNavBackButton").setEnabled(TRUE);

			this.byId("midTableAddButton").setEnabled(!TRUE);
			this.byId("midTableDeleteButton").setEnabled(!TRUE);
			// this.byId("midTableSearchField").setEnabled(TRUE);
			//this.byId("midTableApplyFilterButton").setEnabled(TRUE);
			this.byId("finTable").setMode(sap.m.ListMode.None);
			this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
		},

		_initTableTemplates: function(){
			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new Text({
						text: "{SupplierFin>_row_state_}"
					}), 
					new Text({
						text: "{SupplierFin>fiscal_year}"
                    }),
                    new Text({
						text: "{SupplierFin>fiscal_quarter}"
                    }),
                    new Text({
						text: "{SupplierFin>sales_amount}"
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

            var oLanguageCode = new ComboBox({
                    selectedKey: "{SupplierFin>language_code}",
                    required : true
                });
                oLanguageCode.bindItems({
                    path: 'util>/Code',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2600'),                        
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
                        icon:{ path:'SupplierFin>_row_state_', formatter: this.formattericon
                                }                              
                    }),
                    oLanguageCode,
                    new Input({
                        value: {
                            path: 'SupplierFin>uom_name',
                            type: 'sap.ui.model.type.String',
                            constraints: {
                                maxLength: 30
                            }
                        },
                        required : true
                    }), 
					// new Input({
                    //     value: {
                    //         path: 'SupplierFin>commercial_uom_code',
                    //         type: 'sap.ui.model.type.String',
                    //         constraints: {
                    //             maxLength: 3
                    //         }
                    //     },
                    //     required : true
                    // }),
                    // new Input({
                    //     value: {
                    //         path: 'SupplierFin>commercial_uom_name',
                    //         type: 'sap.ui.model.type.String',
                    //         constraints: {
                    //             maxLength: 30
                    //         }
                    //     }						
					// }), 
					// new Input({
                    //     value: {
                    //         path: 'SupplierFin>technical_uom_code',
                    //         type: 'sap.ui.model.type.String',
                    //         constraints: {
                    //             maxLength: 6
                    //         }
                    //     },
                    //     required : true                        
                    // }),                     
					// new Input({
                    //     value: {
                    //         path: 'SupplierFin>technical_uom_name',
                    //         type: 'sap.ui.model.type.String',
                    //         constraints: {
                    //             maxLength: 30
                    //         }
                    //     }						
                    // }),
                    new Input({
                        value: {
                            path: 'SupplierFin>uom_desc',
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
			this.byId("finTable").bindItems({
				path: "SupplierFin>/SupplierFin",
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
					name: "dp.gs.gsSupplierMgt.view." + sFragmentName,
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
				oFilter = new Filter("uom_name", FilterOperator.Contains, sValue);

			oView.byId("midTable").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);

        }

	});
});