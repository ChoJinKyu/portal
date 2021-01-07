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
    "sap/ui/core/Item",
    "ext/lib/util/Validator",
    "dp/md/util/controller/SupplierSelection"
], function (BaseController, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, Item, Validator, SupplierSelection) {
    "use strict";
    
    var oTransactionManager;

	return BaseController.extend("dp.md.detailSpecConfirm.controller.MidObject", {

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
			oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("schedule"));
            oTransactionManager.addDataModel(this.getModel("spec"));
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
            this.setImportOrg();
            this.clearValueState();
        },

        clearValueState: function(){
            this.validator.clearValueState( this.byId('scheduleTable1E') );
            this.validator.clearValueState( this.byId('frmMold') );
            this.validator.clearValueState( this.byId('frmPress') );
        },
        
        setImportOrg: function(){
            var importCompanyCode = this.getModel('master').getProperty('/import_company_code');
            //importOrg filter
            var filter = new Filter({
                            filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, 'L1100' ),
                                    new Filter("company_code", FilterOperator.EQ, importCompanyCode)
                                ],
                                and: true
                        });

            this.getView().byId("importOrg").bindItems(
                {
                    path: '/Divisions',
                    filters: filter,
                    template: new Item({
                    key: "{org_code}", text: "[{org_code}] {org_name}"
                    })
                }
            )
            //this.getView().byId("importOrg").setSelectedKey("CVZ");
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
            
            
            // if(!this.checkChange()){
            //     MessageToast.show(this.getModel('I18N').getText("/NCM0002"));
            //     return;
            // }

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

            MessageBox.confirm( this.getModel('I18N').getText('/NCM0004'), {
                title : "Draft",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        
                        me.getModel('spec').setProperty('/mold_spec_status_code', 'D'); //21.01.07 안쓸듯
                        me.getModel("master").setProperty('/mold_progress_status_code', 'DTL_ENT');

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

        checkChange: function(){
            debugger
            var omMaster = this.getModel('master');
            var omSchedule = this.getModel('schedule');
            var omSpec = this.getModel('spec');

            console.log('omSpec.isChanged()',omSpec.isChanged());

            if(omMaster.isChanged() || omSchedule.isChanged() || omSpec.isChanged()){
                return true;
            }else{
                return false;
            }
        },
        
        onPageConfirmButtonPress: function(){
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
                
            MessageBox.confirm("Are you sure ?", {
                title : "Comfirmation",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        
                        me.getModel('spec').setProperty('/mold_spec_status_code', 'C'); //21.01.07 안쓸듯
                        me.getModel("master").setProperty('/mold_progress_status_code', 'DTL_CNF');

						oTransactionManager.submit({
							success: function(ok){

                                oView.setBusy(false);

                                var err = ok.__batchResponses[0].__changeResponses.filter(function(item){
                                    return item.statusCode != '204';
                                });

                                if(err.length > 0){
                                    
                                    var body = JSON.parse(err[0].response.body);

                                    MessageToast.show(body.error.code+'\n'+body.error.message.value);
                                    return;
                                }

                                me._toShowMode();
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

        onSuppValueHelpRequested: function(oEvent){

            var sCompanyCode  = this.getModel('master').getProperty('/company_code')
            var sPlantCode = this.getModel('master').getProperty('/org_code')
            
            this.supplierSelection.showSupplierSelection(this, oEvent, sCompanyCode, sPlantCode);
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
					tenant_id: "L2100"
				});
				this._toEditMode();
			}else{

                var self = this;
				this._bindView("/MoldMasters('" + this._sMoldId + "')", "master", [], function(oData){
                    self._toShowMode();
                });

                this._bindView("/MoldMasterSpec('" + this._sMoldId + "')", "mstSpecView", [], function(oData){
                    
                });

                var schFilter = [new Filter("mold_id", FilterOperator.EQ, this._sMoldId)];
                this._bindView("/MoldSchedule", "schedule", schFilter, function(oData){
                    
                });

                this._bindView("/MoldSpec('"+this._sMoldId+"')", "spec", [], function(oData){
                    
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
			this.byId("page").setProperty("showFooter", true);
			this.byId("pageEditButton").setEnabled(false);
			// this.byId("pageDeleteButton").setEnabled(false);
			this.byId("pageNavBackButton").setEnabled(false);
		},

		_toShowMode: function(){
			this._showFormFragment('MidObject_Show');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", false);
			this.byId("pageEditButton").setEnabled(true);
			// this.byId("pageDeleteButton").setEnabled(true);
			this.byId("pageNavBackButton").setEnabled(true);
		},

		_oFragments: {},
		_showFormFragment : function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection.removeAllBlocks();
				oPageSubSection.addBlock(oFragment);
            });

            var mode = sFragmentName.split('_')[1];

            //development plan
            var oPageSubSection2 = this.byId("pageSubSection2");
            this._loadFragment("MidObjectDevelopmentPlan_"+mode, function(oFragment){
				oPageSubSection2.removeAllBlocks();
				oPageSubSection2.addBlock(oFragment);
            });  

            var master = this.getModel("master");
            var budgetType = master.oData.investment_ecst_type_code;

            //ship plan
            var oPageSubSectionSP = this.byId("pageSubSectionSP");
            oPageSubSectionSP.removeAllBlocks();
            if(budgetType == 'S'){
                this._loadFragment("MidObjectShipPlan_"+mode, function(oFragment){
                    oPageSubSectionSP.addBlock(oFragment);
                });  
            }
            

            //detail spec
            var oPageSubSection3 = this.byId("pageSubSection3");
            var oPageSubSection4 = this.byId("pageSubSection4");
            oPageSubSection3.removeAllBlocks();
            oPageSubSection4.removeAllBlocks();

            //mold 인지 press 인지 분기
            this.itemType = master.oData.mold_item_type_code;

            if(this.itemType == 'P' || this.itemType == 'E'){
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
					name: "dp.md.detailSpecConfirm.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
                    if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
		},
        handleChangeImpComp: function(oEvent){

            console.group('===============handleChangeImpComp==================');

            var params = oEvent.getParameters();

            var filter = new Filter({
                            filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, 'L1100' ),
                                    new Filter("company_code", FilterOperator.EQ, params.selectedItem.getKey() )
                                ],
                                and: true
                        });
                        
            console.log('handleChangeImpComp',filter);

            this.getView().byId("importOrg").getBinding("items").filter(filter, "Application");

            console.groupEnd();
        },

	});
});