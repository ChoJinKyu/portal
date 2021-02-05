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
        validator: new Validator(),
        _masterData : {
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
        },
        
        
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
            this.getModel().setSizeLimit(500);
            //$($("#"+this.byId("vbox_vat_number").getId()).parent()).hide(); //setTimeout필요..ㅠ.
        },

        /* =========================================================== */
        /* privet function                                            */
        /* =========================================================== */

        _initControlData : function(bEnbaled){
            var oModel = this.getModel("mainPageView"),
            oCallByAppModel = this.getModel("callByAppModel"),
            bBizNoCheck = oCallByAppModel.getProperty("/bizNoCheck"),
            bEditable = oCallByAppModel.getProperty("/isEditable"),
            sGubun = oCallByAppModel.getProperty("/gubun"),
            sMode = oCallByAppModel.getProperty("/mode"),
            sProgress = oCallByAppModel.getProperty("/progressCode");

            
            oModel.setProperty("/navButtonType", sGubun !== "MA" ? "Back" : "Unstyled");//Transparent , Default
            oModel.setProperty("/required", true);//sGubun !== "MA"

            //활성화 설정
            oModel.setProperty("/visible", {
                vbox_maker_code : true,
                vbox_vat_number : true, //false : visible 처리할때...단, false로 할경우 영역을 없앨수없다.
                maker_code : sGubun === "MA", //타모듈일 경우만 input visible
                tax_id : sGubun === "MA", //타모듈일 경우만 input visible
                country_code : bEditable && (sMode === "C") || (sGubun === "MR" && sProgress === "REQUEST" && bEditable), //생성일때만 
                isEditable :  bEditable && sMode !== "R", //R이고 U가 아닐때는 input.비활성화
                btn_list : sMode === "R",
                btn_cancel : sMode !== "R", 
                btn_request : sMode !== "R", 
                btn_reject : sMode !== "R" && sGubun === "MR", 
                btn_edit : sMode === "R" && sGubun !== "MR", // "MR"에서 오는 경우는 edit 기능 없음.
                section_bizno_chk : (sGubun === "MM" && sMode === "C") || (sGubun === "MR" && sProgress === "REQUEST"),
                section_approval_line : sGubun !== "MA" && sMode !== "R",
                section_change_history : sMode === "R",
                message_strip_biz_chk_info : !(sGubun === "MR" && sProgress === "REQUEST"),
                message_strip_biz_chk : sMode === "C" && bBizNoCheck || (sGubun === "MR" && sProgress === "REQUEST"),
                message_strip : sMode === "R" && !bEditable && sGubun !== "MR"//"MR"에서 오는 경우는 사용안함.
            });

            //if(sMode !== "U"){ //생성이나 상세보기로 넘어왔을때 데이터 모델 초기화를 위한...
                oModel.setProperty("/enabled", {
                    vat_number : false ,
                    btn_request : bBizNoCheck && bEnbaled,
                    btn_reject : bBizNoCheck && bEnbaled,
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

            oWriteModel.setProperty("/generalInfo", this._masterData);
        },


        

        /**
		 * Binds the view to the data path.
		 */
		_onObjectMatched : function (oEvent) { 
            //var callByAppModel = this.getView().getParent().getParent().getModel("callByAppModel");
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
            
            this._initControlData(sGubun === "MA");

            if(sMode === "R"){
                this._CheckTaxIDFunction();
            }

        },
        
        onChangeAddress : function(oEvent){
            var oWriteModel = this.getModel("writeModel");
            var oGeneralInfo = oWriteModel.getProperty("/generalInfo");
            var sFullAddress = "";
            //var sGubun = oEvent.getSource().getBindingPath("value").indexOf("local") > -1 ? "local" : "english";
            
            if(oEvent.getSource().getBindingPath("value").indexOf("local") > -1 ){ //local
                sFullAddress = oGeneralInfo["maker_local_city"]  + " " + oGeneralInfo["maker_local_region"] + " "+oGeneralInfo["maker_local_address"];
                oWriteModel.setProperty("/generalInfo/maker_local_full_address", sFullAddress);
            }else{ //english
                sFullAddress = oGeneralInfo["maker_english_address"]  + " " + oGeneralInfo["maker_english_region"] + " "+oGeneralInfo["maker_english_city"];
                oWriteModel.setProperty("/generalInfo/maker_english_full_address", sFullAddress);
            }
            
        },

        onChangeCountry : function(oEvent){
            var oSelectedItem = sap.ui.getCore().byId(oEvent.getSource().getSelectedItemId()).getBindingContext().getObject();
            this._setVisiableVatNumber(oSelectedItem["eu_flag"]);
            //this._setVisiableVatNumber();
        },

        onNavigationBackPress: function(e){

            //portal에 있는 toolPage 
            var oToolPage = this.getView().getParent().getParent().getParent().oContainer.getParent(),
            oCallByAppModel = this.getModel("callByAppModel"),
            sGubun = oCallByAppModel.getProperty("/gubun");

            if(sGubun !== "MA"){
                //이동하려는 app의 component name,url
                if(sGubun === "MM"){
                    var sComponent = "sp.sm.makerMasterList",
                        sUrl = "../sp/sm/makerMasterList/webapp";
                }else{
                    var sComponent = "sp.sm.makerRegistrationRequest",
                        sUrl = "../sp/sm/makerRegistrationRequest/webapp";
                } 
                
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
            }
        },

        
        onNavigationCancelPress : function(e){
            var oCallByAppModel = this.getModel("callByAppModel"),
            sGubun = oCallByAppModel.getProperty("/gubun"),
            sMode = oCallByAppModel.getProperty("/mode");

            if(sGubun === "MM"){
                if(sMode === "U"){
                    oCallByAppModel.setProperty("/mode", "R");
                    this._setTitle("R");
                    this._initControlData(false);
                    this._fnGetMasterData();
                }else{
                    this.onNavigationBackPress();
                }
            }else if(sGubun === "MA"){
                this._initMasterData();
                this._initControlData(true);
            }else{//"MR"
                this.onNavigationBackPress();
            }
        },

        /**
         * 저장 데이터 세팅  
         */
        _fnSetRequestData : function(sMakerProgressStatusCode){    
            
            var oWriteModel = this.getModel("writeModel"),
            oViewModel = this.getModel("viewModel"),
            oCallByAppModel = this.getModel("callByAppModel"),
            oUserSessionModel = this.getModel("USER_SESSION");
            
            var oGeneralInfo = oWriteModel.getProperty("/generalInfo"),
            checkResult = oWriteModel.getProperty("/businessNoCheckList/0"),
            bSupplierRole = checkResult.supplier_role === "Y",
            bMakerRole = checkResult.maker_role === "Y",
            sProgress = oCallByAppModel.getProperty("/progressCode"),
            sGubun = oCallByAppModel.getProperty("/gubun"),
            sMode = oCallByAppModel.getProperty("/mode");

            var sMakerRequestTypeCode = (sGubun === "MM" && sMode !== "C") ? "CHANGE" : "NEW";
            //sMakerProgressStatusCode = (sGubun === "MR" && sProgress === "REQUEST") ? "REQUEST" : "APPROVAL";
            var sRequestorEmpno = "3167";//oUserSessionModel.gtProperty("/EMPLOYEE_NUMBER");

            if(sMakerProgressStatusCode === "REQUEST" && sMode !== "MA")sMakerProgressStatusCode = "APPROVAL";


            var inputInfo = {
                InputData : { 
                    tenant_id : "L2100",
                    sourceMakerRestnReq: [
                        {
                            tenant_id: "L2100",					
                            maker_request_sequence: null,			
                            maker_request_type_code: sMakerRequestTypeCode,			 
                            maker_progress_status_code: sMakerProgressStatusCode,     	
                            requestor_empno: sRequestorEmpno,                	
                            tax_id: oGeneralInfo["tax_id"],                         	
                            supplier_code: oGeneralInfo["maker_code"],                  	
                            supplier_local_name: oGeneralInfo["maker_local_name"],            	
                            supplier_english_name: oGeneralInfo["maker_english_name"],          	
                            country_code: oGeneralInfo["country_code"],                   	
                            country_name: oGeneralInfo["country_name"],                   	
                            vat_number: oGeneralInfo["vat_number"],                   	
                            zip_code: oGeneralInfo["zip_code"],                       	
                            local_address_1: oGeneralInfo["maker_local_city"],                	
                            local_address_2: oGeneralInfo["maker_local_region"],                	
                            local_address_3: oGeneralInfo["maker_local_address"],                	
                            local_full_address: oGeneralInfo["maker_local_full_address"],             	
                            english_address_1: oGeneralInfo["maker_english_city"],              	
                            english_address_2: oGeneralInfo["maker_english_region"],              	
                            english_address_3: oGeneralInfo["maker_english_address"],              	
                            english_full_address: oGeneralInfo["maker_english_full_address"],           	
                            affiliate_code: oGeneralInfo["affiliate_code"],                 	
                            affiliate_code_name: oGeneralInfo["affiliate_code_name"],            	
                            company_class_code: oGeneralInfo["company_class_code"],             	
                            company_class_name: oGeneralInfo["company_class_name"],             	
                            repre_name: oGeneralInfo["represent_name"],                    	
                            tel_number: oGeneralInfo["company_tel_number"],                    	
                            email_address: oGeneralInfo["company_email_address"],                	
                            supplier_status_code: oGeneralInfo["maker_status_code"],          	
                            supplier_status_name: oGeneralInfo["maker_status_name"],          	
                            biz_certi_attch_number: null,       	
                            attch_number_2: null,               	
                            attch_number_3: null,               	
                            local_create_dtm: null,		//null 값 고정
                            local_update_dtm: null, 	//null 값 고정
                            create_user_id: null,             	//null 값 고정
                            update_user_id: null,             	//null 값 고정
                            system_create_dtm: null,	//null 값 고정
                            system_update_dtm: null 	//null 값 고정
                        }
                    ]
                }
            }

            return inputInfo;

        },

        _fnRequestMakerMaster : function(sAction){

            var that= this;
            var oCallByAppModel = this.getModel("callByAppModel");
            var sConfirmMsg = this.getModel("I18N").getText("/NCM00001");
            var sGubun = oCallByAppModel.getProperty("/gubun");
            var sMode = oCallByAppModel.getProperty("/mode");
            var sProgress = oCallByAppModel.getProperty("/progressCode");

            
            var sTitle = "Create";
            // || sProgress === "REQUEST"
            if(sAction === "REJECT"){
                sTitle = "Reject";
                sConfirmMsg = "반려하시겠습니까?";
            }else{
                if(sMode === "U" && sGubun === "MM"){
                    sTitle = "Modify";
                    sConfirmMsg = this.getModel("I18N").getText("/NPG00007");
                }
            }
            
            

           // this.validator.setModel(this.getModel("writeModel"), "writeModel");
            //if(this.validator.validate(this.byId("page")) === true) {

                var oRequestData = this._fnSetRequestData(sAction);
                MessageBox.confirm(sConfirmMsg, {
                    title : sTitle,
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            that._fnCallAjax(
                            oRequestData,
                            "upsertMakerRestnReqProc",
                            function(result){
                                debugger;
                                //oView.setBusy(false);
                                if(result && result.value && result.value.length > 0){// && result.value[0].return_code === "OK") {
                                    alert(result.value[0].returnmessage);
                                    //that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                    //that.onNavigationBackPress();
                                }
                            }
                        );
                        }
                    }.bind(this)
                });
           /* }else{
                 
                console.log("checkRequire");
                return;
            }*/
        },

         /**
         * 기존 데이터 조회  
         */
        _fnGetMasterData : function(){

            var oCallByAppModel = this.getModel("callByAppModel"),
            oModel = this.getModel("mainPageView"),
            oViewModel = this.getModel("viewModel"),
            oWriteModel = this.getModel("writeModel"),
            checkResult = oWriteModel.getProperty("/businessNoCheckList/0"),
            bSupplierRole = checkResult.supplier_role === "Y",
            bMakerRole = checkResult.maker_role === "Y",
            sProgress = oCallByAppModel.getProperty("/progressCode"),
            sGubun = oCallByAppModel.getProperty("/gubun"),
            sMode = oCallByAppModel.getProperty("/mode"),
            that = this;

            var oServiceModel = this.getModel();
            var sServiceName = "/MakerView";
            var sFilterName = "maker_code";
            
            if(bSupplierRole && !bMakerRole){
                oServiceModel = this.getModel("supplier");
                sServiceName = "/supplierWithoutOrgView"; //tenant_id, tax_id
                sFilterName = "supplier_code";
            }
            if(!bSupplierRole && !bMakerRole){
                sServiceName = "/MakerRegistrationRequestView"; //if(sGubun === "MR" && !bSupplierRole && !bMakerRole && sProgress === "REQUEST")s
            }

            var aFilters = [
                new Filter("tenant_id"    , FilterOperator.EQ, oCallByAppModel.getProperty("/tenantId")),
                new Filter(sFilterName   , FilterOperator.EQ, oCallByAppModel.getProperty("/makerCode"))
            ];   
                  
            
            var sExpand  = "dtls,tplm";

            //var oServiceModel = this.getModel();
            oServiceModel.read(sServiceName,{
                filters : aFilters,
                //urlParameters : { "$expand" : sExpand },                    
                success : function(data){
                    if(data && data.results.length > 0){
                        var oResultData = data.results[0];
                        
                        if(bSupplierRole && !bMakerRole){

                            oResultData["maker_code"] = oResultData["supplier_code"];
                            oResultData["maker_english_address"] = oResultData["supplier_english_address"];
                            oResultData["maker_english_city"] = oResultData["supplier_english_city"];
                            oResultData["maker_english_full_address"] = oResultData["supplier_english_full_address"];
                            oResultData["maker_english_name"] = oResultData["supplier_english_name"];
                            oResultData["maker_english_region"] = oResultData["supplier_english_region"];
                            oResultData["maker_local_address"] = oResultData["supplier_local_address"];
                            oResultData["maker_local_city"] = oResultData["supplier_local_city"];
                            oResultData["maker_local_full_address"] = oResultData["supplier_local_full_address"];
                            oResultData["maker_local_name"] = oResultData["supplier_local_name"];
                            oResultData["maker_local_region"] = oResultData["supplier_local_region"];
                            oResultData["maker_status_code"] = oResultData["supplier_status_code"];
                            oResultData["maker_status_name"] = oResultData["supplier_status_name"];
                            oResultData["old_maker_code"] = oResultData["old_supplier_code"];

                            delete oResultData["supplier_code"];
                            delete oResultData["supplier_english_address"];
                            delete oResultData["supplier_english_city"];
                            delete oResultData["supplier_english_full_address"];
                            delete oResultData["supplier_english_name"];
                            delete oResultData["supplier_english_region"];
                            delete oResultData["supplier_local_address"];
                            delete oResultData["supplier_local_city"];
                            delete oResultData["supplier_local_full_address"];
                            delete oResultData["supplier_local_name"];
                            delete oResultData["supplier_local_region"];
                            delete oResultData["supplier_status_code"];
                            delete oResultData["supplier_status_name"];
                            delete oResultData["old_supplier_code"];

                        }

                        oViewModel.setProperty("/generalInfo" , oResultData);   
                        oWriteModel.setProperty("/generalInfo" , oResultData); 


                        //체크가 화면에서 가능한 경우는 마스터 조회후 체크 초기화
                        if(oModel.getProperty("/visible/section_bizno_chk") && oModel.getProperty("/enabled/btn_check"))
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


        _setTitle : function(sMode){
            var sTitleMode = this.getModel("I18N").getText("/DETAIL");
            if(sMode === "U")sTitleMode = this.getModel("I18N").getText("/EDIT");
            if(sMode === "C")sTitleMode = this.getModel("I18N").getText("/REGISTER");
            var sTitle = this.getModel("I18N").getText("/MAKER_MASTER") + " " + sTitleMode;

            this.byId("mainPage").setTitle(sTitle);
        },


        _setVisiableVatNumber : function(sEuFlag){
            
            var oMainPageModel = this.getModel("mainPageView");
            var oWriteModel = this.getModel("writeModel");
            var bEuFlag = (sEuFlag !== undefined) ? (sEuFlag === "Y") : (oWriteModel.getProperty("/generalInfo/eu_flag") === "Y");

            //euFlag가 없는 경우 모델에서 가져오는 경우를 만들어 보자....
            /* sObjectPath() var aFilters = [
                new Filter("tenant_id"    , FilterOperator.EQ, "L2100"),
                new Filter("country_code"   , FilterOperator.EQ, "KR")
            ];

            oMasterModel.read(sObjectPath, {
				success: function(oData){
					oView.setBusy(false);
				}
			}); */

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
            var sProgress = oCallByAppModel.getProperty("/progressCode");
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
                    this._fnGetMasterData();
                }

            }else{

                if(sGubun === "MM"){
                    //수정은 무조건 bMakerRole === true 임. 고려안해도 된다. 그래도 테스트는 해보자..
                    var bFlag = !bSupplierRole && bMakerRole;
                    oCallByAppModel.setProperty("/isEditable", bFlag);
                    this._initControlData(bFlag);
                }else if(sGubun === "MR"){
                    /*
                    //A : maker, supplier role 모두 없는경우 등록진행가능.
                    var bFlag = !bSupplierRole && !bMakerRole && sProgress === "REQUEST";

                    if(sProgress === "REQUEST"){
                        if(!bSupplierRole && !bMakerRole)oCallByAppModel.setProperty("/mode", "U");  
                        else sMessageStripType = "Warning"; //둘중 하나만 N일때는...?? warning가 맞나>

                        oWriteModel.setProperty("/businessNoCheckList/0/messageStripType", sMessageStripType);                                           
                    }

                    oCallByAppModel.setProperty("/isEditable", bFlag);
                    this._initControlData(bFlag);
                    */

                    //B : m = N,S = Y일때 supplier정보를 가져와서 한다?? 21.02.05 전병훈책임...

                    if(sProgress === "REQUEST"){
                        if(!bSupplierRole && !bMakerRole){
                            oCallByAppModel.setProperty("/mode", "U");  
                        }else if(bSupplierRole && !bMakerRole){
                            oCallByAppModel.setProperty("/mode", "C");  
                        }

                        if(bMakerRole)sMessageStripType = "Warning";
                        oWriteModel.setProperty("/businessNoCheckList/0/messageStripType", sMessageStripType);
                        oCallByAppModel.setProperty("/isEditable", !bSupplierRole && !bMakerRole); //입력가능   
                        this._initControlData(!bMakerRole);                                      
                    }else{
                        oCallByAppModel.setProperty("/isEditable", false);
                        this._initControlData(false);
                    }
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
                    var resultData = data.value;
                    if(resultData.length > 0){
                        oWriteModel.setProperty("/businessNoCheckList", resultData);
                        oCallByAppModel.setProperty("/makerCode", resultData[0].business_partner_code);
                        oCallByAppModel.setProperty("/bizNoCheck", true);
                        that._controlViewAfterCheckTaxId();
                    }else{
                        alert("_CheckTaxIDFunction return data: " +resultData);
                    }
                    
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
            this._setTitle("U");

        },


        onCheckBizNoButtonPress: function () {
            this._CheckTaxIDFunction();
        },

        onRequestButtonPress : function(){
            this._fnRequestMakerMaster("REQUEST");
        },

        onRejectButtonPress : function(){
            this._fnRequestMakerMaster("REJECT");
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