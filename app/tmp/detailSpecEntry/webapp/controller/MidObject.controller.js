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
    "tmp/util/controller/SupplierSelection"
], function (BaseController, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, Validator, SupplierSelection) {
    "use strict";
    
    var oTransactionManager;

	return BaseController.extend("tmp.detailSpecEntry.controller.MidObject", {

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
            this.setModel(new ManagedModel(), "tmpCcDpMdSpec");
            this.setModel(new ManagedModel(), "tmpCcDpMdSpecG");
            this.setModel(new ManagedListModel(), "tmpCcDpMdSpecExt");
            this.setModel(new ManagedModel(), "tmpCcDpMdSpecDisplay");

            oTransactionManager = new TransactionManager();
            oTransactionManager.aDataModels.length = 0;
            
			oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("schedule"));
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
                me = this,
                oModel = this.getModel("tmpCcDpMdSpec"),
                oModelExtSrc = this.getModel("tmpCcDpMdSpecDisplay"),
                oModelExt = this.getModel("tmpCcDpMdSpecExt");
            var param = {};


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

						
                        oModel.submitChanges({
                            success: function (oEvent) {
                                oView.setBusy(false);
                            }.bind(this)
                        });
                        console.log(oModelExt.getData());
                        param.data = oModelExtSrc.getData();
                        param.targetModel = oModelExt;
                        param.sourceModel = oModelExtSrc;
                        debugger
                        me._convertExtDataR2C(param);
                        console.log(oModelExt.getData());
                        oModelExt.submitChanges({
                            success: function (oEvent) {
                                debugger
                                oView.setBusy(false);
                            }.bind(this)
                        });
                        debugger
                        var idata = {};
                        //idata["tmpCcDpMdSpecExt"] = me._convertExtDataR2C(param);
                        
                        // var url = "tmp/detailSpecEntry/webapp/srv-api/odata/v4/tmp.Tmp1MgrService/tmpCcDpMdSpecExt";
                        // $.ajax({
                        //     url: url,
                        //     type: "PUT",
                        //     data : JSON.stringify(idata),
                        //     contentType: "application/json",
                        //     success: function(data){
                        //         MessageToast.show("Success");
                                
                        //     },
                        //     error: function(e){
                        //     }
                        // });
                        
                        oTransactionManager.submit({
							success: function(ok){
                                console.log('ok',ok);
								me._toShowMode();
								MessageToast.show(me.getModel('I18N').getText('/NCM01001') || 'NCM01001');
							}
                        });

                        //var data = oModelExt.getData();

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

                this._bindView("/tmpCcDpMdSpec('"+this._sMoldId+"')", "tmpCcDpMdSpec", [], function(oData){
                
                });
                
                //this._bindView("test/Message", "listT", [], function(oData){

                //});

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
            var templateId = "";
            var sectionId = "";

            //item type에 따른 템플릿 ID 분기
            if(itemType == 'P' || itemType == 'E'){
                if(mode == "Show"){
                    templateId = "SCTM001";
                }else if(mode == "Edit"){
                    templateId = "SCTM001";
                } 
                sectionId = "pageSubSection3";
            }else{
                if(mode == "Show"){
                    templateId = "SCTM001";
                }else if(mode == "Edit"){
                    templateId = "SCTM001";
                }
                sectionId = "pageSubSection4";
            }

            var tenantId = this._sTenantId;
            //debugger
            this._loadTemplate(tenantId, templateId, sectionId);
        },
        _loadTemplate: function(tenant_id, templateId, sectionId){
            var input = {};
            input.TENANT_ID = tenant_id;
            input.TEMPLATE_ID = templateId;
            var oPageSubSection = this.byId(sectionId);
            oPageSubSection.removeAllBlocks();
            var that = this;


            var appModel = this.getView().getModel("tmpCcDpMdSpec");
            appModel.setTransactionModel(this.getModel("tmpMgr"));
            appModel.read("/tmpCcDpMdSpec('"+this._sMoldId+"')", {
                
            });

            var extModel = this.getView().getModel("tmpCcDpMdSpecExt");
            this.getView().getModel("tmpCcDpMdSpecDisplay").setData({});
            
            var that = this;
            extModel.setTransactionModel(this.getModel("tmpMgr"));
            extModel.read("/tmpCcDpMdSpecExt", {
                filters: [new sap.ui.model.Filter("MOLD_ID", sap.ui.model.FilterOperator.EQ, this._sMoldId)],
                success: function(oData){
                    var data = oData.results
                    var param = {};
                    param.data = data;
                    //param.targetModel = that.getModel("tmpCcDpMdSpecExt");
                    param.key = "MOLD_ID";
                    param.targetModel = that.getModel("tmpCcDpMdSpecDisplay");

                    that._convertExtDataC2R(param);   
                    oData.results = param.data;
                }.bind(this)
            });

            //debugger

            // var gridModel = this.getView().getModel("tmpCcDpMdSpecG");
            // gridModel.setTransactionModel(this.getModel("tmpMgr"));
            // gridModel.read("/tmpCcDpMdSpec", {
            // });

            $.ajax({
                url: "tmp/SampleSolutionized/webapp/srv-api/odata/v4/tmp.TmpMgrService/RetrieveTemplateSample",
                type: "POST",
                data : JSON.stringify(input),
                contentType: "application/json",
                success: function(data){
                    var templatePath = data.TEMPLATE_PATH;
                    that._loadFragment(templatePath, function(oFragment){
                        oPageSubSection.addBlock(oFragment);
                    });
                },
                error: function(e){
                    
                }
            });

            oTransactionManager.setServiceModel(this.getView().getModel());

            
        },
        _showFormItemFragment: function (fragmentFileName) {
            this._showFormFragment();
            var oPageItemSection = this.byId("pageItemSection");
            oPageItemSection.removeAllBlocks();

            this._loadFragment(fragmentFileName, function (oFragment) {
                oPageItemSection.addBlock(oFragment);
            }.bind(this));

        },
        _loadFragment: function (sFragmentName, oHandler) {
			if(!this._oFragments[sFragmentName]){
				Fragment.load({
					id: this.getView().getId(),
					name: "tmp.detailSpecEntry.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
        },
        _convertExtDataC2R: function (param){
            var oModel = param.targetModel;
            var data = param.data;
            var key = param.key;
            var newData = {};
            var valueType = {};
            var metaData = {};
            var entity = {};
            if(data.size == 0 ){
                return;
            }
            //__entity
            for(var attr of data){
                metaData[attr["COL_ID"]] = attr["__metadata"];
                entity[attr["COL_ID"]] = attr["__entity"];
                if(attr["CHAR_VALUE"]){
                    newData[attr["COL_ID"]] = attr["CHAR_VALUE"];
                    valueType[attr["COL_ID"]] = "CHAR_VALUE";
                }else if(attr["NUM_VALUE"]){
                    newData[attr["COL_ID"]] = attr["NUM_VALUE"];
                    valueType[attr["COL_ID"]] = "NUM_VALUE";
                }else if(attr["DATE_VALUE"]){
                    newData[attr["COL_ID"]] = attr["DATE_VALUE"];
                    valueType[attr["COL_ID"]] = "DATE_VALUE";
                }else{
                    newData[attr["COL_ID"]] = null;
                    valueType[attr["COL_ID"]] = "null";
                }
            }
            newData["__metadata"] = metaData;
            newData["__entity"] = entity;
            newData["VALUE_TYPE"] =  valueType;
            newData["ID_KEY"] = key;
            newData["ID_VALUE"] = data[0][key];
            param.data = newData;
            oModel.setData(newData);
        },
        _convertExtDataR2C: function (param){
            var oModel = param.targetModel;
            var data = param.data;
            var idKey = data["ID_KEY"];
            var idValue = data["ID_VALUE"];
            var valueType = data["VALUE_TYPE"];
            var metaData = data["__metadata"];
            var entityName = oModel.getData()["entityName"];

            var newData = [];
            var temp = null;
            var state = data["_state_"] == "U"; 
            for(var key in data){
                if(key == "ID_KEY" || key == "ID_VALUE" || key == "VALUE_TYPE" || key == "__metadata" || key == "__entity" || key == "_state_"){
                    continue;
                }
                temp = {CHAR_VALUE:null, NUM_VALUE:null, DATE_VALUE:null};
                temp[idKey] = idValue;
                temp["COL_ID"] = key;
                temp[valueType[key]] = data[key];
                temp["__metadata"] = metaData[key];
                if(state){
                    temp["_row_state_"] = "U";
                }
    
                newData.push(temp);
            }
            //newData["__entity"] = data["__entity"];
            //newData["_state_"] = data["_state_"];

            //return newData;oModel
            var result = {};
            result[entityName] = newData;
            result["entityName"] = entityName;
            oModel.setData(newData);
            debugger
            
        }


	});
});