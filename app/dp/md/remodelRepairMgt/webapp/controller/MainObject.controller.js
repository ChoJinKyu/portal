sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedModel",
	"ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Item",
    "ext/lib/util/Validator",
    "dp/md/util/controller/SupplierSelection",
    "dp/md/util/controller/ReModelRepairItemDialog"
], function (BaseController, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, NumberFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, Item, Validator, SupplierSelection, ReModelRepairItemDialog) {
    "use strict";
    
    var oTransactionManager = null;

	return BaseController.extend("dp.md.remodelRepairMgt.controller.MainObject", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,
        validator: new Validator(),
        supplierSelection: new SupplierSelection(),
        tenantId: 'L2101',
        rrItem : new ReModelRepairItemDialog(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
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
			this.getRouter().getRoute("mainObject").attachPatternMatched(this._onRoutedThisPage, this);
			this.setModel(oViewModel, "mainObjectView");
			
            this.setModel(new ManagedModel(), "repairItem");
            this.setModel(new ManagedModel(), "moldView");
			this.setModel(new ManagedListModel(), "history");

            oTransactionManager = new TransactionManager();
            oTransactionManager.aDataModels.length = 0;

			oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("schedule"));
            oTransactionManager.addDataModel(this.getModel("asset"));
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
			this.getRouter().navTo("mainObject", {
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
			this.getRouter().navTo("mainObject", {
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
			//var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            //this.getRouter().navTo("mainPage", {layout: sNextLayout});
            var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("mainList", {}, true);
			}
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){

            this._toEditMode();
            //this.setImportOrg();
            //this.clearValueState();
        },

        clearValueState: function(){
            this.validator.clearValueState( this.byId('scheduleTable1E') );
            this.validator.clearValueState( this.byId('frmMold') );
            this.validator.clearValueState( this.byId('frmPress') );
            this.validator.clearValueState( this.byId('detailSpecForm') );
        },
        
        setImportOrg: function(){
            var importCompanyCode = this.getModel('master').getProperty('/import_company_code');
            //importOrg filter
            var filter = new Filter({
                            filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId ),
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
         * @description moldItemSelect 공통팝업   
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code (필수)
		 */
        onPagePartNoSearchButtonPress : function () {
            var oArgs = {
                company_code: this.company_code,
                org_code: this.plant_code,
            }
           this.rrItem.openPop(this, oArgs, function(item){
                console.log("item>>>> " , item);
           });

        },

        /**
        * @description participating row 추가 
        * @param {*} data 
        */
        _addMoldItemTable: function (data) {
            var oTable = this.byId("moldRecepitTable"),
                oModel = this.getModel("mdRecepit"),
                mstModel = this.getModel("appMaster");
            ;
            /** add record 시 저장할 model 과 다른 컬럼이 있을 경우 submit 안됨 */  
            var approval_number = mstModel.oData.approval_number;
            oModel.addRecord({
                "tenant_id": this.getSessionUserInfo().TENANT_ID,
                "mold_id": String(data.mold_id),
                "approval_number": approval_number,
                "model": data.model,
                "mold_number": data.mold_number,
                "mold_sequence": data.mold_sequence,
                "spec_name": data.spec_name,
                "mold_item_type_code": data.mold_item_type_code,
                "mold_item_type_code_nm": data.mold_item_type_code_nm,
                "currency_code": data.currency_code,
                "currency_code_nm": data.currency_code_nm,
                "receiving_amount": data.receiving_amount,
                "book_currency_code": data.book_currency_code,
                "provisional_budget_amount": data.provisional_budget_amount,
                "supplier_code": data.supplier_code,
                "supplier_local_name": data.supplier_local_name,
                "supplier_code_nm": data.supplier_code_nm,
                "production_supplier_code": data.production_supplier_code,
                "production_supplier_code_nm": data.production_supplier_code_nm,
                "project_code": data.project_code,
                "acq_department_code": data.acq_department_code,
                "acq_department_code_nm": data.acq_department_code_nm,
                "drawing_consent_plan": data.drawing_consent_plan,
                "drawing_consent_result": data.drawing_consent_result,
                "production_plan": data.production_plan,
                "production_result": data.production_result,
                "completion_plan": data.completion_plan,
                "completion_result": data.completion_result,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/MoldRecepit"); 

            if(oModel.getProperty("/entityName") == undefined){ // 신규시 entityName 없어서 행삭제를 못하고 있음 
                oModel.setProperty("/entityName","MoldRecepit");
            }

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

            if(this.validator.validate( this.byId('detailSpecForm') ) !== true){
                MessageToast.show( this.getModel('I18N').getText('/ECM01002') );
                return;
            }

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

            console.log(oTransactionManager.aDataModels);

            MessageBox.confirm( this.getModel('I18N').getText('/NCM00001') || 'NCM00001', {
                title : "Draft",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        
                        me.getModel('asset').setProperty('/mold_spec_status_code', 'D'); //21.01.07 안쓸듯
                        me.getModel("master").setProperty('/mold_progress_status_code', 'DTL_ENT');

						oTransactionManager.submit({
						// oView.getModel("master").submitChanges({
							success: function(ok){
								me._toShowMode();
								oView.setBusy(false);
                                MessageToast.show( me.getModel('I18N').getText('/NCM01001') || 'NCM01001' );
							}
						});
					};
				}
			});

        },

        checkChange: function(){
            var omMaster = this.getModel('master');
            var omSchedule = this.getModel('schedule');
            var omSpec = this.getModel('asset');

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
                
            MessageBox.confirm(this.getModel('I18N').getText('/NDP10001') || 'NDP10001', {
                title : "Comfirmation",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        
                        me.getModel('asset').setProperty('/mold_spec_status_code', 'C'); //21.01.07 안쓸듯
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
                                MessageToast.show(me.getModel('I18N').getText('/NDP10002') || 'NDP10002');

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
			this._sTenantId = this.getSessionUserInfo().TENANT_ID;
			this._sMoldId = oArgs.moldId;

			if(oArgs.moldId === "new"){
				//It comes Add button pressed from the before page.
				var oMasterModel = this.getModel("master");
				/*oMasterModel.setData({
					tenant_id: this._sTenantId
				});*/
                this._toEditMode();
                var oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/newFlag", true);
			}else{

				this._bindView("/MoldMasters(tenant_id='" + this._sTenantId + "',mold_id='" + this._sMoldId + "')", "master", [], function(oData){
                    this._toShowMode();
                }.bind(this));
/*
                this._bindView("/MoldMasterSpec(tenant_id='" + this._sTenantId + "',mold_id='" + this._sMoldId + "')", "repairMstAssetView", [], function(oData){
                    
                });

                var schFilter = [
                                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                                    new Filter("mold_id", FilterOperator.EQ, this._sMoldId)
                                ];
                this._bindView("/MoldSchedule", "schedule", schFilter, function(oData){
                    
                });

                this._bindView("/MoldSpec(tenant_id='" + this._sTenantId + "',mold_id='"+this._sMoldId+"')", "asset", [], function(oData){
                    
                });*/
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
            //this._showFormFragment('MainObject_Edit');
			var oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", true);
		},

		_toShowMode: function(){
			//this._showFormFragment('MainObject_Show');
            
            var oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", false);
		},

		_oFragments: {},
		_showFormFragment : function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection.removeAllBlocks();
				oPageSubSection.addBlock(oFragment);
            });

            var oPageSubSection2 = this.byId("pageSubSection2");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection2.removeAllBlocks();
				oPageSubSection2.addBlock(oFragment);
            });

            var oPageSubSection3 = this.byId("pageSubSection3");
            this._loadFragment(sFragmentName, function(oFragment){
                oPageSubSection3.removeAllBlocks();
				oPageSubSection3.addBlock(oFragment);
            });
/*
            var mode = sFragmentName.split('_')[1];

            //development plan
            var oPageSubSection2 = this.byId("pageSubSection2");
            this._loadFragment("MainObjectDevelopmentPlan_"+mode, function(oFragment){
				oPageSubSection2.removeAllBlocks();
				oPageSubSection2.addBlock(oFragment);
            });  

            var master = this.getModel("master");
            var budgetType = master.oData.investment_ecst_type_code;

            //ship plan
            var oPageSubSectionSP = this.byId("pageSubSectionSP");
            oPageSubSectionSP.removeAllBlocks();
            if(budgetType == 'S'){
                this._loadFragment("MainObjectShipPlan_"+mode, function(oFragment){
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
                this._loadFragment("MainObjectDetailSpecPress_"+mode, function(oFragment){
                    oPageSubSection4.addBlock(oFragment);
                })  
            }else{
                this._loadFragment("MainObjectDetailSpecMold_"+mode, function(oFragment){
                    oPageSubSection3.addBlock(oFragment);
                })  
            }*/
        },
        _loadFragment: function (sFragmentName, oHandler) {
			if(!this._oFragments[sFragmentName]){
				Fragment.load({
					id: this.getView().getId(),
					name: "dp.md.remodelRepairMgt.view." + sFragmentName,
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
                                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId ),
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