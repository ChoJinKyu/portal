sap.ui.define([
    // "ext/lib/controller/BaseController",
    "op/util/controller/BaseController",
    "ext/lib/util/Multilingual",    
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
    "ext/lib/util/Validator",
    "op/util/controller/OPUi",
    "op/util/controller/UiControlSet",
    "sap/ui/richtexteditor/RichTextEditor"
], function (BaseController, Multilingual, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, NumberFormatter,
                Filter, FilterOperator, Fragment, MessageBox, MessageToast, Validator, OPUi, UiControlSet, RichTextEditor) {
     "use strict";
    
    var oTransactionManager;
  
    /**
     * @description 구매요청 Create 화면 
     * @author OhVeryGood
     * @date 2020.12.01
     */
	return BaseController.extend("op.pu.prMgt.controller.MidViewObject", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,
        uiControlSet: UiControlSet,
        
        
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 

             // call the base controller's init function
            BaseController.prototype["op.init"].apply(this, arguments);

			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });       
      
            // 템플릿 정보 모델.
            this.getView().setModel(new JSONModel(), "tModel");       

            // view에서 사용할 메인 Model    
            this.setModel(new JSONModel(), "viewModel"); 
            this.setModel(new JSONModel(), "detailModel");             
            
            var oMultilingual = new Multilingual();            
            this.setModel(oMultilingual.getModel(), "I18N");

            this.getRouter().getRoute("midView").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "midObjectView");
            
            this.setModel(new ManagedModel(), "mst");            

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("mst"));
              
        },
        
        onBeforeRendering : function(){            
        },

        onAfterRendering: function () {
        //    var oDetailModel = this.getModel('detailModel');
        //    this.oApprovalRichTextEditor.setValue(oDetailModel.getProperty("/mst/approval_contents") );
        },

        /**
		 * Binds the view to the data path.
		 */
		_onObjectMatched : function (oEvent) { 
            var oArgs = oEvent.getParameter("arguments");
           
            // 초기 데이터 설정
            if(oArgs.tenantId && oArgs.tenantId === "new") {
                this._fnSetCreateData(oArgs);
            }else{
                this._fnGetMasterData(oArgs);
            }
            // 텍스트 에디터
            //this.setRichEditor();	
            var oPage = this.getView().byId("page");     //Get Hold of page
            oPage._scrollTo(0);           
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


            oDetailModel.setProperty("/TenantId", oArgs.tenantId);  
            oDetailModel.setProperty("/CompanyCode", oArgs.company_code);  
            oDetailModel.setProperty("/XtnTypeCode", "CREATE"); 
            oDetailModel.setProperty("/PrNumber", oArgs.pr_number); 
           // oDetailModel.setProperty("/XtnTypeCode", oArgs.vMode );  
             

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
                        oDetailModel.setProperty("/PrCreateStatusCode", data.results[0].pr_create_status_code );
                        oDetailModel.setProperty("/PrTemplateNumber"  , data.results[0].pr_template_number );  
                        
                        that._setUI() ;
          
                        //oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        //oCodeMasterTable.setBusy(false);
                    }
                });

                oServiceModel.read("/Pr_DtlView",{
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

                oServiceModel.read("/Pr_AccountView",{
                    filters : aFilters,
                    success : function(data){
                        oDetailModel.setProperty("/account" , data.results);    
                        //oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        //oCodeMasterTable.setBusy(false);
                    }
                });


                oServiceModel.read("/Pr_Service",{
                    filters : aFilters,
                    success : function(data){
                        oDetailModel.setProperty("/service" , data.results);    
                        //oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        //oCodeMasterTable.setBusy(false);
                    }
                });

        },
        _setUI : function (){

            var oDetailModel = this.getModel('detailModel');
            var oOPUi = new OPUi({
                tenantId:   oDetailModel.getProperty("/TenantId"),
                txnType:    oDetailModel.getProperty("/XtnTypeCode"),
                templateNumber: oDetailModel.getProperty("/PrTemplateNumber")
            });
            this.setModel(oOPUi.getModel(), "OPUI");

            if (  oDetailModel.getProperty("/mst/approval_contents") === "&nbsp;"
                 || oDetailModel.getProperty("/mst/approval_contents") === "" )
                 {
                     this.byId('Hbox_approval_contents').setVisible(false);
                 }
            else
            {
                this.byId('Hbox_approval_contents').setVisible(true);
                this._fnSetRichEditor(oDetailModel.getProperty("/mst/approval_contents"));   
                //this.oApprovalRichTextEditor.setValue(oDetailModel.getProperty("/mst/approval_contents") );
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
                tenantId: oDetailModel.getProperty("/TenantId"),
                company_code: oDetailModel.getProperty("/CompanyCode"),
                pr_number: oDetailModel.getProperty("/PrNumber")

                
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
                tenantId: oDetailModel.getProperty("/TenantId"),
                company_code: oDetailModel.getProperty("/CompanyCode"),
                pr_number: oDetailModel.getProperty("/PrNumber")

                
            });

           
        },
         onPageDeleteButtonPress: function () {

            var oDetailModel = this.getModel('detailModel');
            var oView = this.getView();
            var that = this;

            var sendData = {}, aInputData=[];


            var oDeletingKey = {
                tenant_id: oDetailModel.getProperty("/TenantId"),
                company_code:oDetailModel.getProperty("/CompanyCode"),
                pr_number: oDetailModel.getProperty("/PrNumber"),      
                pr_create_status_code: oDetailModel.getProperty("/PrCreateStatusCode")                
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

       /**
         * 품의내용 폅집기 창 
         */
        _fnSetRichEditor : function (sHtmlValue){ 
            var that = this ;
                //sHtmlValue = "";            
            var oApprovalLayout = this.getView().byId("idApprovalContentsTextEditor");
            var oApprovalRTE = oApprovalLayout.getContent()[0];

            if(!that.oApprovalRichTextEditor){
                sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
                    function (RTE, EditorType) {
                        that.oApprovalRichTextEditor = new RTE("prCreateApprovalRTE", {
                            editorType: EditorType.TinyMCE4,
                            width: "100%",
                            height: "200px",
                            editable: false,
                            customToolbar: false,
                            showGroupClipboard: false,
                            showGroupFont: false,
                            showGroupFontStyle: false,
                            showGroupInsert: false,
                            showGroupLink: false,
                            showGroupStructure:false,
                            showGroupTextAlign: false,
                            showGroupUndo:false,
                            value: sHtmlValue,
                            // ready: function () {
                            //     this.addButtonGroup("styleselect").addButtonGroup("table");
                            // }
                        });
                        oApprovalLayout.addContent(that.oApprovalRichTextEditor);
                });
            } else {
                that.oApprovalRichTextEditor.setValue(sHtmlValue);
            }                
        },

       


      

	});
});