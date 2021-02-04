sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/Component",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/ComponentContainer",
    "ext/lib/util/Multilingual",  
    "ext/lib/util/SppUserSession",  
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
], function (
    BaseController, Component, HashChanger, ComponentContainer, Multilingual, SppUserSession,
    History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter, 
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

            var oSppUserSession = new SppUserSession();            
            this.setModel(oSppUserSession.getModel(), "USER_SESSION");

            //임시
            this.getModel("USER_SESSION").setProperty("/TENANT_ID", "L2100");
            this.getModel("USER_SESSION").setProperty("/USER_TYPE_CODE", "B");

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

        _initControlData : function(bEnbaled){
            var oModel = this.getModel("mainPageView"),
            oI18nModel = this.getModel("I18N"),
            oCallByAppModel = this.getModel("callByAppModel"),
            bBizNoCheck = oCallByAppModel.getProperty("/bizNoCheck"),
            bEditable = oCallByAppModel.getProperty("/isEditable"),
            sGubun = oCallByAppModel.getProperty("/gubun"),
            sMode = oCallByAppModel.getProperty("/mode"),
            sProgress = oCallByAppModel.getProperty("/progress");

            //var isEditable = (sMode !== "R") && bEdit; //수정이나 생성인 경우만 input visible
            
            //title 설정
            var sTitleMode = oI18nModel.getText("/DETAIL");
            if(sMode === "C")sTitleMode = oI18nModel.getText("/REGISTER");
            else if(sMode === "U")sTitleMode = oI18nModel.getText("/EDIT");
            var sTitle = oI18nModel.getText("/MAKER_MASTER") + " " + sTitleMode;
            oModel.setProperty("/title", sTitle);
            
            //활성화 설정
            oModel.setProperty("/visible", {
                vbox_maker_code : true,
                vbox_vat_number : true, //false : visible 처리할때...단, false로 할경우 영역을 없앨수없다.
                maker_code : sGubun === "MA", //타모듈일 경우만 input visible
                tax_id : sGubun === "MA", //타모듈일 경우만 input visible
                country_code : bEditable && (sMode === "C"), //생성일때만 
                isEditable :  bEditable && sMode !== "R", //R이고 U가 아닐때는 input.비활성화
                btn_list : sMode === "R",
                btn_cancel : sMode !== "R", 
                btn_request : sMode !== "R", 
                btn_edit : sMode === "R" && sGubun === "MA", // "MR"에서 오는 경우는 edit 기능 없음.
                section_bizno_chk : (sGubun === "MM" && sMode === "C") || (sGubun === "MR" && sProgress == "REQUEST"),
                section_approval_line : sGubun !== "MA" && sMode !== "R",
                section_change_history : sMode === "R",
                message_strip_biz_chk : sMode === "C" && bBizNoCheck,
                message_strip : sMode === "R" && !bEditable
            });

            //if(sMode !== "U"){ //생성이나 상세보기로 넘어왔을때 데이터 모델 초기화를 위한...
                oModel.setProperty("/enabled", {
                    vat_number : false ,
                    btn_request : bBizNoCheck && bEnbaled,
                    btn_edit : bBizNoCheck && bEnbaled,
                    btn_check : sGubun !== "MR",
                    tax_id_chk : sGubun !== "MR"
                });
            //}

        },

        _initMasterData : function(){
            var oWriteModel = this.getModel("writeModel");

            oWriteModel.setProperty("/businessNoCheck", {
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
            var oCallByAppModel = this.getOwnerComponent().getModel("callByAppModel");
            var sGubun = oCallByAppModel.getProperty("/gubun");
            var sMode = oCallByAppModel.getProperty("/mode");

            //임시
            if(this.getModel("USER_SESSION").getProperty("/USER_TYPE_CODE") !== "B"){
                oCallByAppModel.getProperty("/mode", "R");
                sMode = "R";
            }

            oCallByAppModel.setProperty("/isEditable", sGubun === "MA");
            oCallByAppModel.setProperty("/bizNoCheck", sGubun === "MA"); //타모듈등록 외엔 business no check를 해주어야 한다.
            this.setModel(oCallByAppModel, "callByAppModel");

            this._initControlData(false);
            if(sMode === "R"){
                this._CheckTaxIDFunction();
            }

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
                oCallByAppModel.setProperty("/isEditable", false);
                oCallByAppModel.setProperty("/bizNoCheck",false);
                this._initControlData(false);
                this._fnGetMasterData();
            }else{
                this.onNavigationBackPress();
            }
        },

        /**
         * 저장 데이터 세팅  
         */
        _fnSetRequestData : function(oArgs){          
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
                        if(data && data.results.length > 0){
                            var oResultData = data.results[0];
                            oViewModel.setProperty("/generalInfo" , oResultData);   
                            oWriteModel.setProperty("/generalInfo" , oResultData); 
                            oCallByAppModel.setProperty("/bizNoCheck", false);
                        
                            that._setVisiableVatNumber(oResultData.eu_flag);
                        }else{
                            alert("조회된 내역이 없습니다.");

                            //조회가 안된경우 수정이나 요청 불가.
                            oViewModel.setProperty("/generalInfo" , oWriteModel.getProperty("/generalInfo"));  
                            that._initControlData(false)
                        }

                        //oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        //oCodeMasterTable.setBusy(false);
                    }
                });

        },

        _setVisiableVatNumber : function(sEuFlag){
            
            var oMainPageModel = this.getModel("mainPageView");
            var oWriteModel = this.getModel("writeModel");

            var bEuFlag = (sEuFlag !== undefined) ? (sEuFlag === "Y") : (oWriteModel.getProperty("/generalInfo/eu_flag") === "Y");
            
            oMainPageModel.setProperty("/enabled/vat_number", bEuFlag); //enabled 상태만 변경할때...
            if(!bEuFlag)oWriteModel.setProperty("/generalInfo/vat_number", ""); //유럽국가인 경우만 입력 가능하므로 아닌경우 초기화
            //oMainPageModel.setProperty("/visible/vbox_vat_number", bEuFlag); //영역은 남겨둘때...
            //영역 자체를 없앨때...
            //if(bEuFlag)$($("#"+this.byId("vbox_vat_number").getId()).parent()).show();
            //else $($("#"+this.byId("vbox_vat_number").getId()).parent()).hide();
        },

        _controlViewAfterCheckTaxId : function(){
            var oModel = this.getModel("mainPageView"),
            oCallByAppModel = this.getModel("callByAppModel"),
            oWriteModel = this.getModel("writeModel"),
            oViewModel = this.getModel("viewModel");
            var checkResult = oWriteModel.getProperty("/businessNoCheckList/0");
            var bSupplierRole = checkResult.supplier_role === "Y";
            var bMakerRole = checkResult.maker_role === "Y";
            var sGubun = oCallByAppModel.getProperty("/gubun");
            var sMode = oCallByAppModel.getProperty("/mode");
            var sProgress = oCallByAppModel.getProperty("/progress");
            var sMessageStripType ="Success";

            if(sMode === "C"){
                if(bMakerRole)sMessageStripType = "Warning";
                oWriteModel.setProperty("/businessNoCheckList/0/messageStripType", sMessageStripType);
                oCallByAppModel.setProperty("/isEditable", !bSupplierRole && !bMakerRole); //입력가능

                this._initControlData(!bMakerRole);

                if(!bSupplierRole && !bMakerRole){
                    this._setVisiableVatNumber();
                    oCallByAppModel.setProperty("/bizNoCheck", false); //체크 초기화...필요한가??
                    
                    oWriteModel.setProperty("/generalInfo/tax_id", oCallByAppModel.getProperty("/taxId"));
                    oViewModel.setProperty("/generalInfo" , oWriteModel.getProperty("/generalInfo"));
                }else{
                    oCallByAppModel.setProperty("/makerCode", checkResult.business_partner_code);
                    this._fnGetMasterData();
                }

            }else{

                if(sGubun == "MM"){
                    //수정은 무조건 bMakerRole == true 임. 고려안해도 된다. 그래도 테스트는 해보자..
                    var bFlag = !bSupplierRole && bMakerRole;
                    oCallByAppModel.setProperty("/isEditable", bFlag);
                    this._initControlData(bFlag);
                }else if(sGubun == "MR"){
                    var bFlag = !bSupplierRole && !bMakerRole && sProgress === "REQUEST";

                    if(sProgress === "REQUEST"){
                        oCallByAppModel.setProperty("/mode", "U");
                    }

                    oCallByAppModel.setProperty("/isEditable", bFlag);
                    this._initControlData(bFlag);
                }
                
                this._fnGetMasterData();
            }
            
        },

        

        _CheckTaxIDFunction: function () {

            var oWriteModel = this.getModel("writeModel"),
            oCallByAppModel = this.getModel("callByAppModel"),
            that = this;

            this._initMasterData();

            var tenant_id =  oCallByAppModel.getProperty("/tenantId");
            var tax_id = oCallByAppModel.getProperty("/taxId");

            var url = "/sp/sm/makerMasterCreate/webapp/srv-api/odata/v4/sp.supplierManagementV4Service/CheckTaxIDFunction(tenant_id='"+tenant_id+"',tax_id='"+tax_id+"')/Set";
			$.ajax({
				url: url,
				type: "GET",
				datatype: "json",
				contentType: "application/json",
				success: function(data){
                    oWriteModel.setProperty("/businessNoCheckList", data.value);
                    oCallByAppModel.setProperty("/bizNoCheck", true);
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
            oCallByAppModel.setProperty("/isEditable", true);
            this._initControlData(true);

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