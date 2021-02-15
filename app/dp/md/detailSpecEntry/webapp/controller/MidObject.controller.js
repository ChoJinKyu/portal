sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
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
    "ext/lib/util/Validator",
    "dp/md/util/controller/SupplierSelection"
], function (BaseController, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, Validator, SupplierSelection) {
    "use strict";
    
    var oTransactionManager;

	return BaseController.extend("dp.md.detailSpecEntry.controller.MidObject", {

        dateFormatter: DateFormatter,
        validator: new Validator(),
        supplierSelection: new SupplierSelection(),

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
            this.setModel(new ManagedModel(), "mstSpecView");
			this.setModel(new ManagedListModel(), "schedule");
            this.setModel(new ManagedModel(), "spec");

            oTransactionManager = new TransactionManager();
            oTransactionManager.aDataModels.length = 0;
            
			oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("schedule"));
            oTransactionManager.addDataModel(this.getModel("spec"));

            this._oFragments = {};
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
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
            this._toEditMode();
            this.clearValueState();
        },
        
        clearValueState: function(){
            this.validator.clearValueState( this.byId('scheduleTable1E') );
            this.validator.clearValueState( this.byId('frmMold') );
            this.validator.clearValueState( this.byId('frmPress') );
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
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){

			var oView = this.getView(),
                me = this;

            if(this.validator.validate( this.byId('scheduleTable1E') ) !== true){
                MessageToast.show( this.getModel('I18N').getText('/ECM01002') );
                return;
            }

            //mold 인지 press 인지 구분해야한다..
            var dtlForm = '';
            if(this.itemType == 'P' || this.itemType == 'E'){
                dtlForm = 'frmPress';
            }else{
                dtlForm = 'frmMold';
            }

            if(this.validator.validate( this.byId(dtlForm) ) !== true){
                MessageToast.show( this.getModel('I18N').getText('/ECM01002') );
                return;
            }
            
			MessageBox.confirm(this.getModel('I18N').getText('/NCM00001') || 'NCM00001', {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        
                        me.getModel('spec').setProperty('/mold_spec_status_code', 'D'); //이건 이제 필요없을듯 21.01.07
                        me.getModel("master").setProperty('/mold_progress_status_code', 'DTL_ENT');

						oTransactionManager.submit({
							success: function(ok){

                                console.log('ok',ok);

								me._toShowMode();
								oView.setBusy(false);
								MessageToast.show(me.getModel('I18N').getText('/NCM01001') || 'NCM01001');
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

         onSuppValueHelpRequested: function(oEvent){

            var oInput = oEvent.getSource();
            var companyCode  = this.getModel('master').getProperty('/company_code');
            var orgCode = this.getModel('master').getProperty('/org_code');

            var param = {
                'oThis':this,
                'oEvent':oEvent,
                'companyCode':companyCode,
                'orgCode':orgCode,
                'isMulti':false
            }
            
            this.supplierSelection.showSupplierSelection(param, function(tokens){

                var suppCode = tokens[0].getKey();
                oInput.setValue(tokens[0].getKey());
                oInput.setDescription( tokens[0].getText().replace(' ('+suppCode+')', '') );
            });
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
			this._sMoldId = oArgs.moldId;

			if(oArgs.tenantId == "new" && oArgs.moldId == "code"){
				//It comes Add button pressed from the before page.
				var oMasterModel = this.getModel("master");
				oMasterModel.setData({
					tenant_id: this._sTenantId
				});
				this._toEditMode();
			}else{

                var self = this;
				this._bindView("/MoldMasters(tenant_id='" + this._sTenantId + "',mold_id='" + this._sMoldId + "')", "master", [], function(oData){
                    self._toShowMode();
                });

                this._bindView("/MoldMasterSpec(tenant_id='" + this._sTenantId + "',mold_id='" + this._sMoldId + "')", "mstSpecView", [], function(oData){
                    
                });

                var schFilter = [
                                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                                    new Filter("mold_id", FilterOperator.EQ, this._sMoldId)
                                ];
                this._bindView("/MoldSchedule", "schedule", schFilter, function(oData){
                    
                });

                this._bindView("/MoldSpec(tenant_id='" + this._sTenantId + "',mold_id='" + this._sMoldId + "')", "spec", [], function(oData){
                    
                });
            }
            
            oTransactionManager.setServiceModel(this.getModel());
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

        
        _toEditMode: function(){
            this._showFormFragment('MidObject_Edit');
			this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("pageEditButton").setEnabled(false);
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("pageSaveButton").setEnabled(true);
			this.byId("pageNavBackButton").setEnabled(false);
		},

		_toShowMode: function(){
			this._showFormFragment('MidObject_Show');
			this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("pageEditButton").setEnabled(true);
            this.byId("pageCancelButton").setEnabled(false);
            this.byId("pageSaveButton").setEnabled(false);
			this.byId("pageNavBackButton").setEnabled(true);
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
            this._loadFragment("MidObjectDevelopmentPlan_"+mode, function(oFragment){
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
					name: "dp.md.detailSpecEntry.view." + sFragmentName,
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