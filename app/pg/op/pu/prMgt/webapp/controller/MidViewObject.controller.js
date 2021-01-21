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
], function (BaseController, Multilingual, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
                Filter, FilterOperator, Fragment, MessageBox, MessageToast, Validator) {
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

            this.getView().setModel(new ManagedListModel(), "PrMstView");
            this.getView().setModel(new ManagedListModel(), "PrMst");
            this.getView().setModel(new ManagedListModel(), "PrDtl");              

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
            
            var sExpand  = "dtls,tplm";

            var oServiceModel = this.getModel();
                oServiceModel.read("/Pr_MstView",{
                    filters : aFilters,
                    //urlParameters : { "$expand" : sExpand },                    
                    success : function(data){
                        //debugger;
                        //oDetailModel.setData( data.results[0]);
                        oDetailModel.setProperty("/mst" , data.results[0]);    
                        oDetailModel.setProperty("/pr_number", oArgs.pr_number);                       
                        oDetailModel.setProperty("/company_code", oArgs.company_code);
                        oDetailModel.setProperty("/tenantId", oArgs.tenantId);
                        oDetailModel.setProperty("/pr_create_status_code", data.results[0].pr_create_status_code );
          
                        //oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        //oCodeMasterTable.setBusy(false);
                    }
                });

                oServiceModel.read("/Pr_Dtl",{
                    filters : aFilters,
                    success : function(data){
                        //oDetailModel.setProperty(data.results[0], "detailModel"); 
                        oDetailModel.setProperty("/dtl" , data.results);    
                        //oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        //oCodeMasterTable.setBusy(false);
                    }
                });




            // this._bindView("/Pr_Mst", "mst", aFilters, function(oData){
            //      oDetailModel.setProperty("/dtl" , oData); 
            // });


            // this._bindView("/MoldMasters('" + this._sMoldId + "')", "master", [], function(oData){
            //     self._toShowMode();
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
                oNextUIState.layout = "MidColumnFullScreen";

            this.getRouter().navTo("midModify", {
                layout: oNextUIState.layout,
                vMode: "EDIT",
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
         onPageCopyButtonPress: function () {
            var oDetailModel = this.getModel('detailModel');
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                oNextUIState.layout = "MidColumnFullScreen";

            this.getRouter().navTo("midModify", {
                layout: oNextUIState.layout,
                vMode: "COPY",
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
         onPageDeleteButtonPress: function () {

            var oDetailModel = this.getModel('detailModel');
            var oView = this.getView();
            var that = this;

            var sendData = {}, aInputData=[];


            var oDeletingKey = {
                tenant_id: oDetailModel.getProperty("/tenantId"),
                company_code:oDetailModel.getProperty("/company_code"),
                pr_number: oDetailModel.getProperty("/pr_number"),      
                pr_create_status_code: oDetailModel.getProperty("/pr_create_status_code")                
            } ;


            aInputData.push(oDeletingKey);
            sendData.inputData = aInputData;


            MessageBox.confirm("Are you sure to delete?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						// me.getView().getBindingContext().delete('$direct').then(function () {
						// 		me.onNavBack();
						// 	}, function (oError) {
						// 		MessageBox.error(oError.message);
                        // 	});
                        
                         // Call ajax
                        that._fnCallAjax(
                            sendData,
                            "DeletePrProc",
                            function(result){
                                oView.setBusy(false);
                                if(result && result.value && result.value.length > 0 && result.value[0].return_code === "0000") {
                                    that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    that.onNavigationBackPress();
                                }
                            }
                        );
					};
				}
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

        _fnCallAjax: function (sendData, targetName , callback) {            
            var that = this;            
            var url = "/op/pu/prMgt/webapp/srv-api/odata/v4/op.PrDeleteV4Service/" + targetName;

            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(sendData),
                contentType: "application/json",
                success: function (result){                     
                    if(result && result.value && result.value.length > 0) {
                        if(result.value[0].return_code === "0000") {
                            MessageToast.show(that.getModel("I18N").getText("/" + result.value[0].return_code));
                        }
                        MessageToast.show(result.value[0].return_msg);                        
                    }
                    callback(result);
                },
                error: function(e){
                    MessageToast.show("Call ajax failed");
                    callback(e);
                }
            });
        },

       
       


      

	});
});