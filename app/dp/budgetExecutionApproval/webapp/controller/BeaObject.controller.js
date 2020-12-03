sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/TransactionManager",
], function (BaseController, JSONModel, History, DateFormatter, Filter, FilterOperator, Fragment
            , MessageBox, MessageToast, ManagedListModel,ManagedModel, TransactionManager) {
    "use strict";
   
    /**
     * @description 예산집행품의 View 화면 
     * @author jinseon.lee
     * @date 2020.12.01
     */
    var mainViewName = "beaObjectView";
    var oTransactionManager;
	return BaseController.extend("dp.budgetExecutionApproval.controller.BeaObject", {

		dateFormatter: DateFormatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 
              console.log("BeaObject Controller 호출");
			// Model used to manipulate control states. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
            this.setModel(oViewModel, mainViewName);
         
            this.getView().setModel(new ManagedModel(), "appMaster");
			this.getView().setModel(new ManagedListModel(), "appDetail");
            
            oTransactionManager = new TransactionManager();
			oTransactionManager.addDataModel(this.getModel("appMaster"));
            oTransactionManager.addDataModel(this.getModel("appDetail"));

            this.getRouter().getRoute("beaObject").attachPatternMatched(this._onObjectMatched, this);
        
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the miainList route.
		 * @public
		 */
		onPageNavBackButtonPress : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("approvalList", {}, true);
			}
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
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
			var oView = this.getView(),
				me = this,
				oMessageContents = this.byId("inputMessageContents");

			if(!oMessageContents.getValue()) {
				oMessageContents.setValueState(sap.ui.core.ValueState.Error);
				return;
			}
			MessageBox.confirm("Are you sure ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oView.getModel().submitBatch("odataGroupIdForUpdate").then(function(ok){
							me._toShowMode();
							oView.setBusy(false);
                            MessageToast.show("Success to save.");
						}).catch(function(err){
                            MessageBox.error("Error while saving.");
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
		 * Binds the view to the data path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments"),
                approval_number = oArgs.approval_number;
                
            console.log("oArgs >>>>> ",  oArgs); 
            // ApprovalMasters(approval_number='218619-20B-00005') 
        //	this._loadApprovalInfo();
            this._onRoutedThisPage(oArgs);
		},
        _onRoutedThisPage: function(args){ 
            this._bindView("/ApprovalMasters('" + args.approval_number + "')", "appMaster" , [], function(oData){
                console.log("appMaster >>> " , oData);
            });

            var schFilter = [new Filter("approval_number", FilterOperator.EQ, args.approval_number)];
            this._bindView("/ApprovalDetails", "appDetail", schFilter, function(oData){
                   console.log("appDetail >>> " , oData);  
            });

            // mold_id 
            
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
        
		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel(mainViewName),
                oElementBinding = oView.getElementBinding(); 
                  
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("mainObjectNotFound");
				return;
			}
            oViewModel.setProperty("/busy", false);
            
console.log(" oViewModel >>> " , oViewModel);

		},

		_toEditMode: function(){
            this._showFormFragment('MainObject_Edit');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", true);
			this.byId("pageEditButton").setEnabled(false);
			this.byId("pageDeleteButton").setEnabled(false);
			this.byId("pageNavBackButton").setEnabled(false);
		},

		_toShowMode: function(){
			this._showFormFragment('MainObject_Show');
			this.byId("page").setSelectedSection("pageSectionMain");
			this.byId("page").setProperty("showFooter", false);
			this.byId("pageEditButton").setEnabled(true);
			this.byId("pageDeleteButton").setEnabled(true);
			this.byId("pageNavBackButton").setEnabled(true);
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
					name: "dp.budgetReport.view." + sFragmentName,
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