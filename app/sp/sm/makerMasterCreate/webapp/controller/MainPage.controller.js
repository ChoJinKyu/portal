sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/Component",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/ComponentContainer",
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
], function (BaseController, Component, HashChanger, ComponentContainer, Multilingual, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
                Filter, FilterOperator, Fragment, MessageBox, MessageToast, Validator) {
     "use strict";
    
    var oTransactionManager;
  
    /**
     * @description 구매요청 Create 화면 
     * @author OhVeryGood
     * @date 2020.12.01
     */
	return BaseController.extend("sp.sm.makerMasterCreate.controller.MainPage", {

        dateFormatter: DateFormatter,
        
        
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the MainPage controller is instantiated.
		 * @public
		 */
		onInit : function () { 

			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
                });                
       

            // view에서 사용할 메인 Model
            this.setModel(new JSONModel(), "viewModel"); 
            this.setModel(new JSONModel(), "writeModel"); 

            var oMultilingual = new Multilingual();            
            this.setModel(oMultilingual.getModel(), "I18N");

            //this.getView().getParent().oContainer
            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "mainPageView");
            this.setModel(oViewModel, "callByAppModel");
            
            this.setModel(new ManagedModel(), "mst");
            
            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("mst"));
            // oTransactionManager.addDataModel(this.getModel("dtl"));
            // oTransactionManager.addDataModel(this.getModel("account"));
            // oTransactionManager.addDataModel(this.getModel("service"));

            this._initMasterData();
        },
        
        onBeforeRendering : function(){            
        },

        onAfterRendering: function () {
            //$($("#"+this.byId("vbox_vat_number").getId()).parent()).hide(); //setTimeout필요..ㅠ.
        },

        /* =========================================================== */
        /* privet function                                            */
        /* =========================================================== */

        _initControlData : function(){
            var oModel = this.getModel("mainPageView"),
            oI18nModel = this.getModel("I18N"),
            oCallByAppModel = this.getModel("callByAppModel"),
            sGubun = oCallByAppModel.getProperty("/gubun"),
            sMode = oCallByAppModel.getProperty("/mode");

            var isEditable = sMode !== "R"; //수정이나 생성인 경우만 input visible
            
            //title 설정
            var sTitleMode = oI18nModel.getText("/DETAIL");
            if(sMode === "C")sTitleMode = oI18nModel.getText("/REGISTER");
            else if(sMode === "U")sTitleMode = oI18nModel.getText("/EDIT");
            var sTitle = oI18nModel.getText("/MAKER_MASTER") + " " + sTitleMode;
            oModel.setProperty("/title", sTitle);

            //활성화 설정
            oModel.setProperty("/visible", {
                vbox_maker_code : true,
                vbox_vat_number : false, //false로 할경우 영역을 없앨수없다.
                maker_code : sGubun === "MA", //타모듈일 경우만 input visible
                tax_id : sGubun === "MA", //타모듈일 경우만 input visible
                country_code : sMode === "C", //생성일때만 
                isEditable :  isEditable,
                btn_list : sMode === "R",
                btn_cancel : sMode !== "R", 
                btn_request : sMode !== "R", 
                btn_edit : sMode === "R",
                section_bizno_chk : sGubun !== "MA" && sMode === "C",
                section_approval_line : sGubun !== "MA" && sMode !== "R",
                section_change_history : sMode === "R",
                message_strip_biz_chk : false,
                message_strip : false
            });

            if(sMode !== "U"){ //생성이나 상세보기로 넘어왔을때 데이터 모델 초기화를 위한...
                oModel.setProperty("/enabled", {
                    vat_number : true ,
                    btn_request : true,
                    btn_edit : true
                });
            }

        },

        _initMasterData : function(){
            var oWriteModel = this.getModel("writeModel");

            oWriteModel.setProperty("/businessNoCheck", {
                tax_id : "",
                //messageStripType : "Success",
                list : []
            }); 

            oWriteModel.setProperty("/generalInfo", {
                affiliate_code: "Y",
                affiliate_name: "",
                company_class_code: "",
                company_class_name: "",
                company_email_address: "",
                company_tel_number: "",
                country_code: "",
                country_name: "",
                create_user_id: "",
                eu_flag: "",
                local_create_dtm: "",
                local_update_dtm: "",
                maker_code: "",
                maker_english_address: "",
                maker_english_city: "",
                maker_english_full_address: "",
                maker_english_name: "",
                maker_english_region: "",
                maker_local_address: "",
                maker_local_city: "",
                maker_local_full_address: "",
                maker_local_name: "",
                maker_local_region: "",
                maker_status_code: "",
                maker_status_name: "",
                old_maker_code: "",
                represent_name: "",
                system_create_dtm: "",
                system_update_dtm: "",
                tax_id: "",
                tenant_id: "",
                update_user_id: "",
                vat_number: "",
                zip_code: ""
            });

        },


        

        /**
		 * Binds the view to the data path.
		 */
		_onObjectMatched : function (oEvent) { 
            //var callByAppModel = this.getView().getParent().getParent().getParent().getParent().getModel("callByAppModel");
            var callByAppModel = this.getOwnerComponent().getModel("callByAppModel");
            this.setModel(callByAppModel, "callByAppModel");

            this._initControlData();

            if(callByAppModel.getProperty("/gubun") !== "MA"){
                this._fnGetMasterData();
            }

            /*
            var sArgs = oEvent.getParameter("arguments");
            oModel.setProperty("/arguments", oArgs);
            function looseJsonParse(obj){
                        return Function('"use strict";return ' + obj + ';')();
            }
            var oArgs = looseJsonParse(
                    sArgs
            );
            if(oArgs.gubun !== "MA" && oArgs.mode !== "C")this._fnGetMasterData();
            else this._initControlData();
            */
            
        },
        
        onChangeCountry : function(oEvent){
            var oSelectedItem = sap.ui.getCore().byId(oEvent.getSource().getSelectedItemId()).getBindingContext().getObject();
            this._setVisiableVatNumber(oSelectedItem["eu_flag"]);
        },

        onNavigationBackPress: function(e){

            //portal에 있는 toolPage 
            var oToolPage = this.getView().oParent.oParent.oParent.oParent.oParent.oContainer.oParent;;

            /* 
            //이동하려는 app의 component name,url
            if(oMode == "NW"){
                var sComponent = "sp.sc.scQBMgt",
                    sUrl = "../sp/sc/scQBMgt/webapp";
            }else{
                var sComponent = "sp.sc.scQBCreate",
                    sUrl = "../sp/sc/scQBCreate/webapp";
            } */

            var sComponent = "sp.sm.makerMasterList",
            sUrl = "../sp/sm/makerMasterList/webapp";
            
            Component.load({
                name: sComponent,
                url: sUrl
            }).then(function (oComponent) {
                var oContainer = new ComponentContainer({
                    name: sComponent,
                    async: true,
                    url: sUrl
                });
                oToolPage.removeAllMainContents();
                oToolPage.addMainContent(oContainer);
                
            }).catch(function (e) {
                MessageToast.show("error");
            });
        },

        onNavigationCancelPress : function(e){
            var oCallByAppModel = this.getModel("callByAppModel"),
            sMode = oCallByAppModel.getProperty("/mode");

            if(sMode === "U"){
                oCallByAppModel.setProperty("/mode", "R");
                this._initControlData();
                this._fnGetMasterData();
            }else{
                this.onNavigationBackPress();
            }
        },
        /**
         * 신규 생성 시 초기 데이터 세팅  
         */
        _fnSetCreateData : function(oArgs){          
        },


         /**
         * 기존 데이터 조회  
         */
        _fnGetMasterData : function(){

            var oCallByAppModel = this.getModel("callByAppModel"),
            oViewModel = this.getModel("viewModel"),
            oWriteModel = this.getModel("writeModel"),
            that = this;

            var aFilters = [
                new Filter("tenant_id"    , FilterOperator.EQ, oCallByAppModel.getProperty("/tenantId")),
                new Filter("maker_code"   , FilterOperator.EQ, oCallByAppModel.getProperty("/makerCode"))
            ];           
            
            var sExpand  = "dtls,tplm";

            var oServiceModel = this.getModel();
                oServiceModel.read("/MakerView",{
                    filters : aFilters,
                    //urlParameters : { "$expand" : sExpand },                    
                    success : function(data){
                        var oResultData = data.results[0];
                        oViewModel.setProperty("/generalInfo" , oResultData);   
                        oWriteModel.setProperty("/generalInfo" , oResultData); 
                        oWriteModel.setProperty("/businessNoCheck/tax_id" , oResultData.tax_id); 

                        that._setVisiableVatNumber(oResultData.eu_flag);
                        that._CheckTaxIDFunction();
                        //that._initControlData();
                        //oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        //oCodeMasterTable.setBusy(false);
                    }
                });

        },

        _setVisiableVatNumber : function(sEuFlag){
            var bEuFlag = sEuFlag === "Y";
            var oMainPageModel = this.getModel("mainPageView");
            var oWriteModel = this.getModel("writeModel");
            
            //oMainPageModel.setProperty("/enabled/vat_number", bEuFlag); //enabled 상태만 변경할때...
            if(!bEuFlag)oWriteModel.setProperty("/generalInfo/vat_number", ""); //유럽국가인 경우만 입력 가능하므로 아닌경우 초기화
            oMainPageModel.setProperty("/visible/vbox_vat_number", bEuFlag); //영역은 남겨둘때...
            //영역 자체를 없앨때...
            //if(bEuFlag)$($("#"+this.byId("vbox_vat_number").getId()).parent()).show();
            //else $($("#"+this.byId("vbox_vat_number").getId()).parent()).hide();
        },

        _controlViewAfterCheckTaxId : function(){
            var oModel = this.getModel("mainPageView"),
            oCallByAppModel = this.getModel("callByAppModel"),
            oWriteModel = this.getModel("writeModel");
            var checkResult = oWriteModel.getProperty("/businessNoCheck/list/0");
            var bSupplierRole = checkResult.supplier_role === "Y";
            var bMakerRole = checkResult.maker_role === "Y";
            var sMode = oCallByAppModel.getProperty("/mode");
            var sMessageStripType ="Success";

            oModel.setProperty("/visible/message_strip_biz_chk", sMode === "C");

            if(sMode === "C"){
                if(bMakerRole)sMessageStripType = "Warning";
                oWriteModel.setProperty("/businessNoCheck/list/0/messageStripType", sMessageStripType);
                oModel.setProperty("/enabled/btn_request", !bMakerRole); //maker role기 'N'이면  생성 불가.
                
            }else{
                oModel.setProperty("/visible/message_strip", bSupplierRole);
                oModel.setProperty("/enabled/btn_edit", !bSupplierRole && bMakerRole); //maker role만 'Y' 일때 수정 가능 == supplier role이 'Y'이면 수정 불가.
            }
            
        },

        _CheckTaxIDFunction: function () {

            var oWriteModel = this.getModel("writeModel");
            var oCallByAppModel = this.getModel("callByAppModel");
            var that = this;

            var tenant_id =  oCallByAppModel.getProperty("/tenantId");
            var tax_id = oWriteModel.getProperty("/businessNoCheck/tax_id");

            var url = "/sp/sm/makerMasterCreate/webapp/srv-api/odata/v4/sp.supplierManagementV4Service/CheckTaxIDFunction(tenant_id='"+tenant_id+"',tax_id='"+tax_id+"')/Set";
			$.ajax({
				url: url,
				type: "GET",
				datatype: "json",
				contentType: "application/json",
				success: function(data){
                    oWriteModel.setProperty("/businessNoCheck/list", data.value);
                    
                    that._controlViewAfterCheckTaxId();
				},
				error: function(req){
                    //console.log(req);
					alert("Ajax Error => "+req.status);
				}
            });
            
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

        
        onEditButtonPress: function () {

            var oCallByAppModel = this.getModel("callByAppModel");
            oCallByAppModel.setProperty("/mode", "U");

            this._initControlData();
           /* var oModel = this.getModel("mainPageView"),
            oI18nModel = this.getModel("I18N");

            var sTitle = oI18nModel.getText("/MAKER_MASTER") + " " + oI18nModel.getText("/EDIT");
            oModel.setProperty("/title", sTitle);
            oModel.setProperty("/visible/isEditable", true);
            oModel.setProperty("/visible/section_approval_line", true);
            oModel.setProperty("/visible/section_change_history", false);
            oModel.setProperty("/visible/btn_edit", false);
            oModel.setProperty("/visible/btn_request", true);*/

        },
        onPageCopyButtonPress: function () {
            var oWriteModel = this.getModel("writeModel");
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                oNextUIState.layout = "MidColumnFullScreen";

            this.getRouter().navTo("midModify", {
                layout: oNextUIState.layout,
                gubun : "MM",
                mode: "COPY",
                tenantId: oWriteModel.getProperty("/tenantId"),
                company_code: oWriteModel.getProperty("/company_code"),
                pr_number: oWriteModel.getProperty("/pr_number")

                
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

        onCheckBizNoButtonPress: function () {
            this._CheckTaxIDFunction();
        },

        onPageDeleteButtonPress: function () {

            var oWriteModel = this.getModel("writeModel");
            var oView = this.getView();
            var that = this;

            var sendData = {}, aInputData=[];


            var oDeletingKey = {
                tenant_id: oWriteModel.getProperty("/tenantId"),
                company_code:oWriteModel.getProperty("/company_code"),
                pr_number: oWriteModel.getProperty("/pr_number"),      
                pr_create_status_code: oWriteModel.getProperty("/pr_create_status_code")                
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
            var url = "/sp/sm/makerMasterCreate/webapp/srv-api/odata/v4/sp.supplierManagementV4Service/" + targetName;

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