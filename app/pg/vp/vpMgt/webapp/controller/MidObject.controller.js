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
    "sap/f/library",    
], function (
    BaseController, 
    History,  
    JSONModel,
    TreeListModel, 
    TransactionManager, 
    ManagedModel, 
    ManagedListModel, 
    DateFormatter, 
    Filter, 
    FilterOperator, 
    Fragment, 
    MessageBox, 
    MessageToast, 
    Text, 
    Input, 
    ComboBox,
    library
    ) {
    "use strict";
    //routing param
    var pVendorPool = "";
    var pTenantId  = "";
    var pOrg_code  = "";
    var pOperation_unit_code = "";
    var pTempType = "";
    var oTransactionManager;
    var that;
	return BaseController.extend("pg.vp.vpMgt.controller.MidObject", {

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
            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            // this.getRouter().getRoute("midPageDetail").attachPatternMatched(this._onRoutedThisPageDtl, this);
			this.setModel(oViewModel, "midObjectView");
            
            that = this;
            // this.setModel(new ManagedModel(), "VpDetailLngView");
            // this.setModel(new ManagedListModel(), "VpSupplierDtlView");
			// this.setModel(new ManagedListModel(), "vpMaterialDtlView");
            // this.setModel(new ManagedListModel(), "vpManagerDtlView");

            // oTransactionManager = new TransactionManager();
			// oTransactionManager.addDataModel(this.getModel("VpDetailLngView"));
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
        onMidTreeSearchButtonPress : function(){
            
            var predicates = [];

            if (!!this.byId("mid_Tree_Operation_ORG_E").getSelectedKey()) {
                    predicates.push(new Filter("org_code", FilterOperator.Contains, this.byId("mid_Tree_Operation_ORG_E").getSelectedKey()));
                }
            if (!!this.byId("mid_Tree_Operation_UNIT_E").getSelectedKey()) {
                    predicates.push(new Filter("operation_unit_code", FilterOperator.Contains, this.byId("mid_Tree_Operation_UNIT_E").getSelectedKey()));
                }                
            if (!!this.byId("mid_Tree_Vp_Name").getValue()) {
                predicates.push(new Filter({
                    filters: [
                        new Filter("vendor_pool_local_name", FilterOperator.Contains, this.byId("mid_Tree_Vp_Name").getValue())
                    ],
                    and: false
                }));
            }
            // predicates.push(new Filter("language_cd", FilterOperator.EQ, "KO"));

            this._treeView(predicates);

            // this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel("mapping"));
            //     this.getView().setBusy(true);
            //     this.treeListModel
            //         .read("/vpTreeLngView", {
            //             filters: predicates
            //         })
            //         // 성공시
            //         .then((function (jNodes) {
            //             this.getView().setModel(new JSONModel({
            //                 "vpTreeLngView": {
            //                     "nodes": jNodes
            //                 }
            //             }), "tree");
            //         }).bind(this))
            //         // 실패시
            //         .catch(function (oError) {
            //             alert("Erroe : " + oError);
            //         })
            //         // 모래시계해제
            //         .finally((function () {
            //             this.getView().setBusy(false);
            //         }).bind(this));            
        },
        
        onCellClick : function (event) {

            // var oTable = this.byId("midTreeTable");
            // var aIndices = oTable.getSelectedIndices();
            //선택된 Tree Table Value 
            // var p_vendor_pool_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[1].mProperties.text
            // var p_org_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[2].mProperties.text            
            // var p_operation_unit_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[3].mProperties.text
            // var p_tenat_id = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[4].mProperties.text
            // var p_temp_type = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[5].mProperties.text
            
            var row = this.getView().getModel("tree").getObject(event.getParameters().rowContext.sPath);    

            var p_vendor_pool_code = row.vendor_pool_code;
            var p_org_code = row.org_code;           
            var p_operation_unit_code = row.operation_unit_code;
            var p_tenat_id = row.tenant_id;
            var p_temp_type = row.temp_type;


            


            // var rowData = oEvent.getParameter('rowBindingContext').getObject();
            var LayoutType = library.LayoutType;

            pVendorPool =  p_vendor_pool_code;
            pTenantId = p_tenat_id;
            pOrg_code  = p_org_code;
            pOperation_unit_code = p_operation_unit_code;
            pTempType = p_temp_type;

            // alert( "pVendorPool   : " + pVendorPool + 
            //        "pTenantId     : " + pTenantId);

            // var oNavParam = {
            //     layout: oNextUIState.layout,
            //     tenantId : rowData.tenant_id,
            //     vendorPool : rowData.vendor_pool_code
            // };
            // this.getRouter().navTo("midPage", oNavParam); 
			// if (this.currentRouteName === "MainList") { // last viewed route was master
			// 	var oMasterView = this.oRouter.getView("pg.vp.vpMgt.view.MainList");
			// 	this.getView().byId("fcl").removeBeginColumnPage(oMasterView);
			// }


			this.getRouter().navTo("midPageDetail", {
                layout: sap.f.LayoutType.TwoColumnsMidExpanded, 
                // layout: sap.f.LayoutType.OneColumn, 
				tenantId: pTenantId,
                vendorPool: pVendorPool,
                orgCode: pOrg_code,
                operationUnitCode: pOperation_unit_code,
                temptype : pTempType,
                target : "NEXT"
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
        onPageCancelEditButtonPress: function(){
			this._toShowMode();
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(oEvent){
			var oArgs = oEvent.getParameter("arguments"),
				oView = this.getView();
			this._sTenantId = oArgs.tenantId;
			this._sVendorPool = oArgs.vendorPool;
            this._sOrgCode = oArgs.orgCode;
            this._sOperationUnitCode = oArgs.operationUnitCode;
            this._sTempType = oArgs.temptype;
            

            // alert("_sTenantId : " + this._sTenantId + 
            //       "_sVendorPool : " + this._sVendorPool + 
            //       "_sOrgCode : " + this._sOrgCode + 
            //       "_sOperationUnitCode : " + this._sOperationUnitCode +
            //       "_sTempType : " + this._sTempType );


            var predicates = [];

            if (!!this._sTenantId) {
                    predicates.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
                }
            if (!!this._sOrgCode) {
                    predicates.push(new Filter("org_code", FilterOperator.EQ, this._sOrgCode));
                }
            if (!!this._sOperationUnitCode) {
                    predicates.push(new Filter("operation_unit_code", FilterOperator.EQ, this._sOperationUnitCode));
                }         
            if (!!this._sVendorPool) {

                
                    predicates.push(new Filter({
                        path:'keyword',
                        filters:[
                            new Filter("vendor_pool_code", FilterOperator.EQ, this._sVendorPool),
                        ]
                        }));
                }                        

                // predicates.push(new Filter("language_cd", FilterOperator.EQ, "EN"));

            this._treeView(predicates);

            this._settreeInputValue(this._sOrgCode, this._sOperationUnitCode);


			this.getRouter().navTo("midPageDetail", {
                layout: sap.f.LayoutType.TwoColumnsMidExpanded, 
                // layout: sap.f.LayoutType.OneColumn, 
				tenantId: this._sTenantId,
                vendorPool: this._sVendorPool,
                orgCode: this._sOrgCode,
                operationUnitCode: this._sOperationUnitCode,
                temptype : this._sTempType,
                target : "NEXT"
            });                  
			// if(oArgs.tenantId == "new" && oArgs.moldId == "code"){
			// 	//It comes Add button pressed from the before page.
			// 	var oMasterModel = this.getModel("master");
			// 	oMasterModel.setData({
			// 		tenant_id: "L2100"
			// 	});
			// 	this._toEditMode();
			// }else{

            //     var self = this;
			// 	this._bindView("/MoldMasters(" + this._sMoldId + ")", "master", [], function(oData){
            //         self._toShowMode();
            //     });

            //     this._bindView("/MoldMasterSpec(" + this._sMoldId + ")", "mstSpecView", [], function(oData){
                    
            //     });

            //     var schFilter = [new Filter("mold_id", FilterOperator.EQ, this._sMoldId)];
            //     this._bindView("/MoldSchedule", "schedule", schFilter, function(oData){
                    
            //     });

            //     this._bindView("/MoldSpec("+this._sMoldId+")", "spec", [], function(oData){
                    
            //     });
            // }
            
            // oTransactionManager.setServiceModel(this.getModel());
        },

        _treeView : function (aFilter) {

            this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel("mapping"));
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/vpTreeLngView", {
                        filters: aFilter
                    })
                    // 성공시
                    .then((function (jNodes) { console.log("jNodes : " + jNodes);
                        this.getView().setModel(new JSONModel({
                            "vpTreeLngView": {
                                "nodes": jNodes
                            }
                        }), "tree");
                    }).bind(this))
                    // 실패시
                    .catch(function (oError) {
                        alert("Erroe : " + oError);
                    })
                    // 모래시계해제
                    .finally((function () {
                        this.getView().setBusy(false);
                    }).bind(this));  

        },
        _settreeInputValue : function(sOrg, sOper) {

            // alert("sOrg : " +sOrg  + "    sOper : " +sOper);
            this.getView().byId("mid_Tree_Operation_ORG_S").setSelectedKey(sOrg);
            this.getView().byId("mid_Tree_Operation_UNIT_S").setSelectedKey(sOper);
            this.getView().byId("mid_Tree_Operation_ORG_E").setSelectedKey(sOrg);
            this.getView().byId("mid_Tree_Operation_UNIT_E").setSelectedKey(sOper);            
        },

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath, sModel, aFilter, callback) {
			var oView = this.getView(),
				oModel = this.getModel(sModel);
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel());
			oModel.read(sObjectPath, {
                filters: aFilter,
				success: function(oData){
                    oView.setBusy(false);
                    callback(oData);
				}
			});
		},

		
		_oFragments: {},
		_showFormFragment : function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection.removeAllBlocks();
				oPageSubSection.addBlock(oFragment);
            })

            var mode = sFragmentName.split('_')[1];

            var oPageSubSection2 = this.byId("pageSubSection2");
            this._loadFragment("MidObjectShipPlan_"+mode, function(oFragment){
				oPageSubSection2.removeAllBlocks();
				oPageSubSection2.addBlock(oFragment);
            })  
            
            var oPageSubSection3 = this.byId("pageSubSection3");
            var oPageSubSection4 = this.byId("pageSubSection4");
            oPageSubSection3.removeAllBlocks();
            oPageSubSection4.removeAllBlocks();

            //mold 인지 press 인지 분기
            var master = this.getModel("master");
            var itemType = master.oData.mold_item_type_code;

            if(itemType == 'P' || itemType == 'E'){
                this._loadFragment("MidObjectDetailSpecPress_"+mode, function(oFragment){
                    oPageSubSection4.addBlock(oFragment);
                })  
            }else{
                this._loadFragment("MidObjectDetailSpecMold_"+mode, function(oFragment){
                    oPageSubSection3.addBlock(oFragment);
                })  
            }
        },
        _loadFragment: function (sFragmentName, oHandler) {
			if(!this._oFragments[sFragmentName]){
				Fragment.load({
					id: this.getView().getId(),
					name: "pg.vp.vpMgt.view." + sFragmentName,
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