sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",    
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
    "ext/lib/util/Validator"
], function (BaseController, Multilingual, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, Validator) {
     "use strict";
    
    var oTransactionManager;
  
    /**
     * @description 구매요청 Create 화면 
     * @author OhVeryGood
     * @date 2020.12.01
     */
	return BaseController.extend("op.pu.prMgt.controller.MidViewObject", {

        dateFormatter: DateFormatter,
        
        
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 


			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });                


            // view에서 사용할 메인 Model
            this.setModel(new JSONModel(), "detailModel"); 
            this.setModel(new JSONModel(), "viewModel"); 
            
            
            var oMultilingual = new Multilingual();            
            this.setModel(oMultilingual.getModel(), "I18N");

            this.getRouter().getRoute("midView").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "midObjectView");
            
            this.setModel(new ManagedModel(), "mst");
            

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("mst"));
            // oTransactionManager.addDataModel(this.getModel("dtl"));
            // oTransactionManager.addDataModel(this.getModel("account"));
            // oTransactionManager.addDataModel(this.getModel("service"));
        },
        
        onBeforeRendering : function(){            
        },

        onAfterRendering: function () {
        },

        /**
		 * Binds the view to the data path.
		 */
		_onObjectMatched : function (oEvent) { 
            var oArgs = oEvent.getParameter("arguments");
            var sTenantId = oArgs.tenantId;
            
            // 초기 데이터 설정
            if(sTenantId && sTenantId === "new") {
                this._fnSetCreateData(oArgs);
            }else{
                this._fnGetMasterData(oArgs);
            }

            //this._createViewBindData(oArgs); 
			//this._onLoadApprovalRow();
            //this.oSF = this.getView().byId("searchField");

            // 템플릿 리스트 조회
            //this._fnGetPrTemplateList();

            // 텍스트 에디터
            //this.setRichEditor();	
        },
        
        /**
         * 신규 생성 시 초기 데이터 세팅  
         */
        _fnSetCreateData : function(oArgs){          
        },


         /**
         * 기존 데이터 조회  
         */
        _fnGetMasterData : function(oArgs){

            var oViewModel = this.getModel('viewModel');
            var oDetailModel = this.getModel('detailModel');
            var that = this;

            var aFilters = [
                    new Filter("tenant_id"      , FilterOperator.EQ, oArgs.tenantId),
                    new Filter("company_code"   , FilterOperator.EQ, oArgs.company_code),
                    new Filter("pr_number"      , FilterOperator.EQ, oArgs.pr_number)
                ];           

            var oServiceModel = this.getModel();
                oServiceModel.read("/Pr_MstView",{
                    filters : aFilters,
                    success : function(data){
                        //oDetailModel.setProperty(data.results[0], "detailModel"); 
                        oDetailModel.setProperty("/mst" , data.results[0]);    
                        oDetailModel.setProperty("/pr_number", oArgs.pr_number);                       
                        oDetailModel.setProperty("/company_code", oArgs.company_code);
                        oDetailModel.setProperty("/tenantId", oArgs.tenantId);
          
                        //oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        //oCodeMasterTable.setBusy(false);
                    }
                });


            // this._bindView("/MoldMasters('" + this._sMoldId + "')", "master", [], function(oData){
            //     self._toShowMode();
            // });
           
            // this._bindView("/Pr_Mst", "mst", aFilters, function(oData){
            //      oMstViewModel.setProperty("/CodeMasters", data.results);
            // });
            
            //oTransactionManager.setServiceModel(this.getModel());

        },
        _setUI : function (oCreate_status_code){
            switch (oCreate_status_code) {
              case "10":    // 임시저장..
                  
                break;
              
            }          

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

        
        /**
         * List 화면으로 이동
         */
        onNavigationBackPress: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
                //history.go(-1);
                this.getRouter().navTo("mainPage", {}, true);
			} else {
				this.getRouter().navTo("mainPage", {}, true);
			}
        },
        onPageEditButtonPress: function () {
            var oDetailModel = this.getModel('detailModel');
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
               
            this.getRouter().navTo("midModify", {
                layout: oNextUIState.layout,
                tenantId: oDetailModel.getProperty("/tenantId"),
                company_code: oDetailModel.getProperty("/company_code"),
                pr_number: oDetailModel.getProperty("/pr_number")
            });

            // if (oNextUIState.layout === 'TwoColumnsMidExpanded') {
            //     this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
            // }

            //var oItem = oEvent.getSource();
            //oItem.setNavigated(true);
            //var oParent = oItem.getParent();
            // store index of the item clicked, which can be used later in the columnResize event
            //this.iIndex = oParent.indexOfItem(oItem);
        },
       
       


      

	});
});