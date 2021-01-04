sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Text",
	"sap/m/Input",
    "sap/m/ComboBox",    
], function (BaseController, History, JSONModel,TreeListModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, Text, Input, ComboBox) {
    "use strict";
    
    var oTransactionManager;
    var that;
	return BaseController.extend("vp.vpMgt.controller.MidObjectDetail", {

		dateFormatter: DateFormatter,

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
            this.setModel(new ManagedModel(), "geninfo");
            this.setModel(new ManagedListModel(), "suplist");
			this.setModel(new ManagedListModel(), "matlist");
            this.setModel(new ManagedListModel(), "manlist");
            this.setModel(new ManagedListModel(), "psuplist");                

            this.getRouter().getRoute("midPageDetail").attachPatternMatched(this._onRoutedThisPageDtl, this);
			// this.setModel(oViewModel, "midObjectView");
            
            that = this;
            // this.setModel(new ManagedModel(), "vpDetailView");
            // this.setModel(new ManagedListModel(), "VpSupplierDtlView");
			// this.setModel(new ManagedListModel(), "vpMaterialDtlView");
            // this.setModel(new ManagedListModel(), "vpManagerDtlView");

            // oTransactionManager = new TransactionManager();
			// oTransactionManager.addDataModel(this.getModel("vpDetailView"));
            // oTransactionManager.addDataModel(this.getModel("VpSupplierDtlView"));
            // oTransactionManager.addDataModel(this.getModel("vpMaterialDtlView"));
            // oTransactionManager.addDataModel(this.getModel("vpManagerDtlView"));
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
				moldId: this._sMoldId
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
				moldId: this._sMoldId
			});
		},
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
		onPageNavBackButtonPress: function () {
			var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
            
            // this.getRouter().navTo("mainPage", {
            //     // layout: sap.f.LayoutType.TwoColumnsMidExpanded, 
            //     layout: sap.f.LayoutType.OneColumn
            // });             

		},

         /**
         * @public
         * @see 사용처 DialogCreate Fragment Open 이벤트
         */

         onDialogSupList: function (){
            var oView = this.getView();

			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "vp.vpMgt.view.DialogSupList",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			} 
			this.pDialog.then(function(oDialog) {
                oDialog.open();
                this.onAfterDialog();
			}.bind(this));
        },
        onAfterDialog:function(){
            
            var oView = this.getView(),
			    oModel = this.getModel("psuplist");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/VpSupplierMstView", {
				success: function(oData){
                    console.log("oData:"+ oData);
 					oView.setBusy(false);
                }.bind(this)
            });

        },        

        onSupSearchButtonPress :function (){
        
            var predicates = [];

            if (!!this.byId("s_pop_supplier_local_name").getValue()) {
                    predicates.push(new Filter("supplier_local_name", FilterOperator.Contains, this.byId("s_pop_supplier_local_name").getValue()));
                }
            console.log("_PopsupplySearch!!");
            var oView = this.getView(),
			    oModel = this.getModel("psuplist");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/VpSupplierMstView", {
				filters: predicates,
				success: function(oData){
                    console.log("oData:"+ oData);
 					oView.setBusy(false);
                }.bind(this)
            });


        },
        supPopupClose : function(oEvent){
          this.byId("addSupList").close();
        },


		/**
		 * Event handler for page edit button press
		 * @public
		 */

		
		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function(){
			var oView = this.getView(),
				me = this;
			MessageBox.confirm("Are you sure to delete?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						me.getView().getBindingContext().delete('$direct').then(function () {
								me.onNavBack();
							}, function (oError) {
								MessageBox.error(oError.message);
							});
					};
				}
			});
		},
        
        

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
			var oView = this.getView(),
				me = this;
			MessageBox.confirm("Are you sure ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oTransactionManager.submit({
						// oView.getModel("master").submitChanges({
							success: function(ok){
								me._toShowMode();
								oView.setBusy(false);
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
  

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		

        _onRoutedThisPageDtl: function(oEvent) {

            var oArgs = oEvent.getParameter("arguments"),
				oView = this.getView();
            // this.getView().setModel(this.getOwnerComponent().getModel());

            this._sTenantId = oArgs.tenantId;
			this._sVendorPool = oArgs.vendorPool;
            this._sOrgCode = oArgs.orgCode;
            this._sOperationUnitCode = oArgs.operationUnitCode;

            var predicates = [];
            var predicates1 = [];
            var predicates2 = [];
            if (!!this._sTenantId) {
                    predicates.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
                    predicates1.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
                    predicates2.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
                }
            if (!!this._sOrgCode) {
                    predicates.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                    predicates1.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                    predicates2.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                }
            if (!!this._sOperationUnitCode) {
                    // predicates.push(new Filter("operation_unit_code", FilterOperator.EQ, this._sOperationUnitCode));
                    predicates1.push(new Filter("operation_unit_code", FilterOperator.EQ, this._sOperationUnitCode));
                    predicates2.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                }         
            if (!!this._sVendorPool) {
                    predicates.push(new Filter("vendor_pool_code", FilterOperator.EQ, this._sVendorPool));
                    predicates1.push(new Filter("vendor_pool_code", FilterOperator.EQ, this._sVendorPool));
                    predicates2.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                }  

            predicates.push(new Filter("language_cd", FilterOperator.EQ, "KO"));
            this._generalInfo(predicates1);
            this._supplySearch(predicates);
            this._metrialSearch(predicates);
            this._managerSearch(predicates2);
        },

         _generalInfo: function(aFilter) {
            //alert(that.getView().byId("pop_operation_unit_name").getText());
            // var oView = this.getView("midDtlView");
			// var	oModel = this.getModel("geninfo");
            // oView.setBusy(true);
            var oView = this.getView("midDtlView");
            var	oModel = this.getView().getModel("mapping");
            var oFilter = [];
			oFilter.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
			// oFilter.push(new Filter("company_code", FilterOperator.EQ, "*"));
            // oFilter.push(new Filter("org_type_code", FilterOperator.EQ, "BU"));
            oFilter.push(new Filter("org_code", FilterOperator.EQ, "BIZ00200"));
            oFilter.push(new Filter("operation_unit_code", FilterOperator.EQ, "EQUIPMENT"));
            oFilter.push(new Filter("vendor_pool_code", FilterOperator.EQ, "VP201610280406"));
            oView.setBusy(true);
            // oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/VpDetailView", {
                
				filters: aFilter,
				success: function(oData){
                    oView.setBusy(false);
                    var oDataRst = oData.results[0];
                    //sap.ui.getCore().byId("general_higher_level_path").setText(oDataRst.higher_level_path_name);
                    // that.getView().byId("general_higher_level_path").setText("234123rt234");
                    that.getView().byId("general_higher_level_path").setText(oDataRst.higher_level_path_name);
                    that.getView().byId("general_operation_unit_name").setText(oDataRst.operation_unit_name);
                    that.getView().byId("general_vendor_pool_local_name").setValue(oDataRst.vendor_pool_local_name);
                    that.getView().byId("general_vendor_pool_english_name").setValue(oDataRst.vendor_pool_english_name);
                    that.getView().byId("general_vendor_pool_desc").setValue("vendor_pool_desc");
                    that.getView().byId("general_repr_department_code").setValue(oDataRst.Department);
                    that.getView().byId("general_industry_class_code").setSelectedKey(oDataRst.industry_class_code);
                    that.getView().byId("general_inp_type_code").setSelectedKey(oDataRst.inp_type_code);
                    that.getView().byId("general_plan_base").setSelectedKey(oDataRst.mtlmob_base_code);
                    that.getView().byId("general_regular_evaluation_flag").setState(oDataRst.regular_evaluation_flag);
                    that.getView().byId("general_sd_exception_flag").setState(oDataRst.sd_exception_flag);
                    that.getView().byId("general_vendor_pool_apply_exception_flag").setState(oDataRst.vendor_pool_apply_exception_flag);
                    that.getView().byId("general_equipment_grade_code").setSelectedKey(oDataRst.equipment_grade_code);
                    that.getView().byId("general_equipment_type_code").setSelectedKey(oDataRst.equipment_type_code);
                    that.getView().byId("general_dom_oversea_netprice_diff_rate").setValue(oDataRst.domestic_net_price_diff_rate);
                    that.getView().byId("general_domestic_net_price_diff_rate").setValue(oDataRst.dom_oversea_netprice_diff_rate);
				}
			});
        },


        _supplySearch: function(aFilter) {


            console.log("_supplySearch!!");
            var oView = this.getView(),
			    oModel = this.getModel("suplist");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/VpSupplierDtlView", {
				filters: aFilter,
				success: function(oData){
                    console.log("oData:"+ oData);
					oView.setBusy(false);
                }.bind(this)
            });

        },
        
        _metrialSearch: function(aFilter) {
            console.log("_metrialSearch!!");
            var oView = this.getView(),
				oModel = this.getModel("matlist");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/vpMaterialDtlView", {
				filters: aFilter,
				success: function(oData){
                    console.log(oData.results);
					oView.setBusy(false);
				}
            });
        },

        _managerSearch: function(aFilter) {
            var oView = this.getView(),
				oModel = this.getModel("manlist");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("mapping"));
			oModel.read("/vpManagerDtlView", {
				filters: aFilter,
				success: function(oData){
					oView.setBusy(false);
				}
			});
        }        

        


	});
});