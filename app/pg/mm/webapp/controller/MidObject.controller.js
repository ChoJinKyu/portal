/**
* 신규 등록 Fragment에서 값 던지고 받기 marteial supply Fragment 동일화면 처리 
-스크롤 되는부분 테이블만 스크롤 되도록 수정
-선택후 Apply 할때 테이블 등록 
화면 레이아웃 확인
-마스터 연결 진행 (Create Fragment 화면 진행) 
   시황자제 삭제 프로세스 진행 - 
-신규진행시 테이블 확인 준비되어야 하는곳 공지 김종현 [중요]
-수정 검색 확인 
-ValidatorUtil 내용 확인 
-전체 메세지 i18n 사용 확인 (공통 메일 확인)
-레이아웃 이동 확인해야함.
*/
sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/util/ValidatorUtil",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "./Validator",
    "sap/base/Log"
], function (BaseController, History, JSONModel, ManagedModel, ManagedListModel, DateFormatter, ValidatorUtil, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ValueState, Validator, Log) {
    "use strict";
    return BaseController.extend("pg.mm.controller.MidObject", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

		formatter: (function(){
			return {
				toYesNo: function(oData){
					return oData === true ? "YES" : "NO"
				},
			}
        })(),

        dataPath : "resources",
        _m : {  //수정대상 등록된 필터값들은 삭제한다. 
            page : "page",
            groupID : "pgGroup",
            fragementPath : {
                materialDetail : "pg.mm.view.MaterialDetail",
                materialDialog : "pg.mm.view.MaterialDialog",
                supplierDialog : "pg.mm.view.SupplierDialog"
            },            
            fragementId : {
                materialDetail : "MaterialDetail_ID",
                materialDialog : "MaterialDialog_ID",
                supplierDialog : "SupplierDialog_ID"
            },
            input : {
                multiInput_material_code : "multiInput",
            },
            button : {
                buttonMidTableCreate : "buttonMidTableCreate",
                buttonMidTableDelete : "buttonMidTableDelete",
                buttonMidDelete: "buttonMidDelete",
                buttonMidEdit: "buttonMidEdit",
                buttonSave: "buttonSave"
            },
            tableItem : {
                items : "items" //or rows
            },
            filter : {   //수정대상 테스트에서만 사용 마스터에서 전달 받음값
                tenant_id : "L2100",
                company_code : "*",
                org_type_code : "BU",
                org_code : "BIZ00100",
                material_code : "ERCA00006AA",
                supplier_code : "KR00008",
                mi_material_code : "COP-001-01"
            },
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                mIMaterialCodeBOMManagement: "/MIMaterialCodeBOMManagement",  //(main 동일 midTable )자재리스트                
                mIMaterialPriceManagement: "/MIMaterialPriceManagement",  //시황자재리스트
                mIMaterialPriceManagementView: "/MIMaterialPriceManagementView",  //X MIMaterialPriceManagementView
                orgTenantView: "/OrgTenantView", //관리조직 View
                currencyUnitView : "/CurrencyUnitView", //통화단위 View
                mIMaterialCodeList : "/MIMaterialCodeList", //자재코드 View(검색)
                unitOfMeasureView : "/UnitOfMeasureView", //수량단위 View
                enrollmentMaterialView : "/EnrollmentMaterialView", //서비스 안됨 자재코드  등록View
                enrollmentSupplierView : "/EnrollmentSupplierView", //공급업체  등록View
                mIMaterialCostInformationView : "/MIMaterialCostInformationView" //시황자재>가격정보 검색 리스트
            },
            jsonTestData : {
                values : [{
                    name : "tenant",
                    value : "/tenant.json"
                },{
                    name : "company",
                    value : "/company.json"
                }]
            },
            processMode : {
                create : "C", //신규, 
                read : "R",   //보기
                edit : "E"    //수정
            },
            pageModeText : {
                edit : "Edit", //Change Fragment 호출 상태
                show : "Show"  //Edit Fragment 호출 상태
            },
            itemMode : {
                create : "C",  //테이블 아이템 신규등록
                read : "R",    //테이블 아이템 기존 존재 데이타 로드
                update : "U",  //업데이트 상태
                delete : "D"   //삭제 상태 
            },
            odataMode : {
                yes : "Y",     //테이블 아이템 이 odata에서 load 한것
                no : "N"       //json 에서 임으로 생성한 아이템
            },
            messageType : {
                Warning : sap.ui.core.MessageType.Warning,
                Error : sap.ui.core.MessageType.Error,
                Information : sap.ui.core.MessageType.Information,
                None : sap.ui.core.MessageType.None,
                Success : sap.ui.core.MessageType.Success                
            },
            controlMode : {
                Dev : "Dev",
                Qa : "QA",
                Prd : "PRD",

            }            
        },
        _imsiData : {
            material_code : "ERCA00006AB",
            material_description : "ERCA00006AB",
            supplier_code : "KR00002600",
            supplier_local_name : "(주)네패스",
            supplier_english_name : "Ne"
        },
        _sso : { //수정대상 공통 사용자 정보 확인될시 //MaterialDialog
            user : {
                id : "Admin",
                name : "Hong Gil-dong"
            },
            dept : {
                tenant_id : "L2100",
                company_code : "*",
                org_type_code : "BU",
                org_code : "BIZ00100"
            }          
        },

        /**
         * Mode : Dev, Qa, Prd  
         * @private
         */
        _controlMode : function (sMode) {
            
            if(sMode == this._m.controlMode.Dev){
                console.log("=================== Dev ====================")
                /**
                 * 사용자 세션이나 정보에 다음값이 셋팅 되어 있다는 가정 Test
                 */
                var oUiData = new JSONModel({
                    tenant_name: "",
                    create: "",
                    createdata: "",
                    material_code :"",
                    material_description :"",
                    supplier_code :"",
                    supplier_local_name :"",
                    processing_cost :"",
                    pcst_currency_unit :"",
                    base_quantity : "",
                    radioButtonGroup : "",
                    multiInput_material_code : ""

                });
                
                this.setModel(oUiData, "oUiData");

                this.test_onRoutedThisPage(); 

            }else{
                this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            }

        },
        /**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            console.group("[mid] onInit");

            //var mModel = new JSONModel("m", this._settingsModel);
            //this.getView().setModel(mModel); 
            // Attaches validation handlers
            sap.ui.getCore().attachValidationError(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.Error);
            });
            sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.None);
            });

            // var validator = new Validator();
            // validator.validate(this.byId("page"));
            //this.getView().getModel().setUseBatch(true);
            //수정대상 mainList 연동시 제거 
			this.getView().getModel().setDeferredGroups(["pgGroup","deleteGroup"]);
            
            this.getView().getModel().setChangeGroups({
			  "MIMaterialCodeBOMManagement": {
			    groupId: "pgGroup",
			    changeSetId: "pgGroup"
              }
            });            

            //xml 과의 bindingpath를 사용하는 모델 생성 

            //pageMode C Create, V View, E Edit
            var oUi = new JSONModel({
                busy: true,
                delay: 0,
                readMode : true,
                editMode : false,
                createMode : false
            });

         
            this.setModel(oUi, "oUi");

            this._fnControlSetting();

            this._fnSetReadMode();
            
   
            //개발일때. 
            //수정대상
            this._controlMode(this._m.controlMode.Dev);
            

            console.groupEnd();
        },

        /**
         * control object filter 
         * @private
         */
        _fnControlSetting : function() {
            console.log("_fnControlSetting");
            var comboBox_pcst_currency_unit = this.getView().byId("comboBox_pcst_currency_unit");            
            var oBindingComboBox = comboBox_pcst_currency_unit.getBinding("items");

            //수정대상 사용자 언어에 대한 정의가 정해지면 아래 EN부분을 수정함 
            var aFiltersComboBox = [
                new Filter("tenant_id", "EQ", this._m.filter.tenant_id),
                new Filter("language_code", "EQ", "EN")
            ];
              
            oBindingComboBox.filter(aFiltersComboBox);  
        },

        /** display mode setting  */

        _fnSetReadMode : function(){
            this._fnSetMode("read");
        },

        _fnSetEditMode : function(){
            this._fnSetMode("edit");
        },

        _fnSetCreateMode : function(){
            this._fnSetMode("create");
        },

        _fnSetMode : function(mode){
            var bRead = false,
            bCreate = false,
            bEdit = false;

            if(mode === "read"){
                bRead = true;
                bCreate = false,
                bEdit = false;
            }else if(mode === "create"){
                bRead = false;
                bCreate = true,
                bEdit = false;
            }else if(mode === "edit"){
                bRead = false;
                bCreate = false,
                bEdit = true;
            }

            var oUi = this.getModel("oUi");
            oUi.setProperty("/readMode", bRead);
            oUi.setProperty("/createMode", bCreate);
            oUi.setProperty("/editMode", bEdit);
        },

        /**
         * _isNull Check
         * @private
         */        
        _isNull: function (p_val) {
            if (!p_val || p_val == "" || p_val == null) {
                return true
            } else {
                return false;
            }
        },

        /** Fragments control setting  */

        _formFragments: {},

        /**
         * Fragment 설정
         * @param {String} oProcessMode 
         */
        _getFormFragment: function (oProcessMode) {
            console.log("_getFormFragment : oProcessMode-> ", oProcessMode);
            
            var oFragementId = this._m.fragementId.display;
            var oFragementPath = this._m.fragementPath.display;
            switch(oProcessMode){
                case this._m.processMode.create:
                    oFragementPath = this._m.fragementPath.create;
                    oFragementId = this._m.fragementId.create;
                break;
                case this._m.processMode.edit:
                    oFragementPath = this._m.fragementPath.change;
                    oFragementId = this._m.fragementId.change;
                break;
                case this._m.processMode.display:
                    oFragementPath = this._m.fragementPath.display;
                    oFragementId = this._m.fragementId.display;
                break;                    
            }

            var oFormFragment = this._formFragments[oFragementId];

            if (oFormFragment) {
                return oFormFragment;
            }

            oFormFragment = sap.ui.xmlfragment(oFragementId, oFragementPath, this);

            this._formFragments[oFragementId] = oFormFragment;

            return this._formFragments[oFragementId];

            console.groupEnd();
        },

        /**
         * Fragment Show
         * @private
         */
        _showFormFragment: function (oProcessMode) {
            console.group("_showFormFragment");

            var oPage = this.byId(this._m.page);

            this.getView().setBusy(true);

            oPage.removeAllContent();

            oPage.insertContent(this._getFormFragment(oProcessMode));

            this.getView().setBusy(false);

            console.groupEnd();
        },
       
        /**
         * 자재정보 검색 MaterialDialog.fragment open
         * @public
         */
		handleValueHelpMaterial: function (oEvent) {

            //var sInputValue = oEvent.getSource().getValue();
            
            var oUiData = this.getModel("oUiData");
            oUiData.setProperty("/radioButtonGroup", this.getView().byId("radioButtonGroup").getSelectedIndex());

			// create value help dialog
			if (!this._valueHelpMaterialDialog) {

                this._valueHelpMaterialDialog = sap.ui.xmlfragment(
                    this._m.fragementId.materialDialog, 
                    this._m.fragementPath.materialDialog,this
                );
                this.getView().addDependent(this._valueHelpMaterialDialog);

			}                
			this._openValueHelpMaterialDialog();
		},

		_openValueHelpMaterialDialog: function (radioButtonGroup) {
			// open value help dialog filtered by the input value
			this._valueHelpMaterialDialog.open();
		},

        /**
         * MaterialDialog Search
         * @public 
         * @param {*} oEvent 
         */
		onValueHelpMaterialDialogSearch: function (oEvent) {

            console.log("_onValueHelpMaterialDialogSearch");

            //수정대상 comboBox_vendorView 준비되지 않음(20201206)
            //comboBox_vendorView=this._findFragmentControlId(this._m.materialDialog, "comboBox_vendorView").getSelectedKey(), 
            var oModel = this.getModel(),
                oUiData = this.getModel("oUiData"),
                oMaterialTableList = new JSONModel(),
                that = this,
                comboBox_materialView=this._findFragmentControlId(this._m.fragementId.materialDialog, "comboBox_materialView").getSelectedKey(),
                comboBox_supplierView=this._findFragmentControlId(this._m.fragementId.materialDialog, "comboBox_supplierView").getSelectedKey(),
                input_material_description=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_material_description").getValue(),
                input_supplier_local_name=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_supplier_local_name").getValue();
           
        
            //수정대상 데이타가 없음 사용자 로그인 정보 필터 등록해야함
             var sFilters = [];
                //new Filter("tenant_id", FilterOperator.EQ, this._sso.dept.tenant_id)                                
            //];


            if(oUiData.getProperty("/radioButtonGroup")==0){

                if(comboBox_materialView.length>0){
                    sFilters.push(new Filter("material_code", FilterOperator.Contains, comboBox_materialView));
                }
                if(comboBox_materialView.length>0){
                    sFilters.push(new Filter("material_description", FilterOperator.Contains, input_material_description));
                }

                oModel.read(this._m.serviceName.enrollmentMaterialView, {
                    async: false,
                    filters: sFilters,
                    success: function (rData, reponse) {
    
                        //console.log(that._m.serviceName.enrollmentMaterialView +"-- json oData~~~~~~~" + JSON.stringify(reponse.data.results));

                        //가격정보 Vendor 자재코드 자재명 공급업체 공급업체명
                        oMaterialTableList.setData(reponse.data.results); 

                        //등록 구분
                        for(var i=0;i<reponse.data.results.length;i++){
                            oMaterialTableList.oData[i].itemMode = that._m.itemMode.read;
                            oMaterialTableList.oData[i].odataMode = that._m.odataMode.yes;
                        }

                        that.getOwnerComponent().setModel(oMaterialTableList, "materialTableList");                                         
    
                    }
                });
            }else{

                if(comboBox_supplierView.length>0){
                    sFilters.push(new Filter("supplier_code", FilterOperator.Contains, comboBox_supplierView));
                }
                if(input_supplier_local_name.length>0){
                    sFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, input_supplier_local_name));
                }

                oModel.read(this._m.serviceName.enrollmentSupplierView, {
                    async: false,
                    filters: sFilters,
                    success: function (rData, reponse) {
    
                        console.log(that._m.serviceName.enrollmentSupplierView + "--json oData~~~~~~~" + JSON.stringify(reponse.data));
                        //var oData = reponse.data.results[0];
    
                    }
                });
            }



            // if(oUiData.getProperty("radioButtonGroup") == 0){

            // }
            //검색후 모델이 없으면 생성후 행추가  있으면 행추가.

            //자제 추가 할당시 자제가 가지고 있는 값 또는 세션 을 확인해야한다.
            // tenant_id company_code org_type_code org_code
            // var cParameters = {
            //         "tenant_id": "L2100",
            //         "company_code": "*",
            //         "org_type_code":  "BU",
            //         "org_code": "BIZ00100",
            //         "material_code": "",
            //         "material_description": oData.material_description,
            //         "supplier_code": "",
            //         "supplier_local_name": "",
            //         "supplier_english_name": "",
            //         "base_quantity": oData.base_quantity, //이 값들은?
            //         "processing_cost": oData.processing_cost,//이 값들은?
            //         "pcst_currency_unit": oData.pcst_currency_unit,//이 값들은?
            //         "mi_material_code": oData.mi_material_code,
            //         "mi_material_code_name": oData.mi_material_code_name,
            //         "category_code": oData.category_code,//이 값들은?
            //         "category_name": oData.category_name,//이 값들은?
            //         "reqm_quantity_unit": oData.reqm_quantity_unit,/이 값들은?
            //         "reqm_quantity": oData.reqm_quantity,/이 값들은?
            //         "currency_unit": oData.currency_unit,/이 값들은?
            //         "mi_base_reqm_quantity": "", //화폐단위
            //         "quantity_unit": "", //수량단위
            //         "exchange": "", //거래소
            //         "termsdelv": "", //인도조건
            //         "use_flag": "N",  //기본 사용안함 
            //         "local_create_dtm": new Date(),
            //         "local_update_dtm": new Date(),
            //         "create_user_id": "",
            //         "update_user_id": "",
            //         "system_create_dtm": new Date(),
            //         "system_update_dtm": new Date()                        
            // };            
            var oMaterialTableList = new JSONModel([]);
            this.getOwnerComponent().setModel(oMaterialTableList, "materialTableList");

           // 
		},

		_handleValueHelpMaterialClose: function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems"),
				oMultiInput = this.byId(this._m.input.multiInput_material_code);

			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new Token({
						text: oItem.getTitle()
					}));
				});
			}
		},
		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
        onPageEnterFullScreenButtonPress: function () {
            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.getRouter().navTo("midPage", {
                layout: sNextLayout,
                tenant_id: this._stenant_id,
                controlOptionCode: this._sControlOptionCode
            });
        },
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
        onPageExitFullScreenButtonPress: function () {
            var that = this;
            var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            that.getRouter().navTo("midPage", {
                layout: sNextLayout,
                tenant_id: that._stenant_id,
                controlOptionCode: that._sControlOptionCode
            });
        },
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            console.group("onPageNavBackButtonPress");
            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");

            this._onExit();

            this.getRouter().navTo("mainPage", { layout: sNextLayout });
            console.groupEnd();
        },

		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function () {
            console.group("onPageDeleteButtonPress");
            var oView = this.getView(),
                me = this;
            MessageBox.confirm("Are you sure to delete?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        me.getView().getBindingContext().delete('$direct').then(function () {
                            me.onNavBack();
                        }, function (oError) {
                            MessageBox.error(oError.message);
                        });
                    };
                }
            });
            console.groupEnd();
        },


        /**
         * midtable updateFinished
         */
        onMitTableUpdateFinished: function () {
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        test_onRoutedThisPage : function() {
            console.group("TEST[test_onRoutedThisPage]  _onRoutedThisPage");
            /*
            tenant_name 이름을 가져오기위한 필터 master 페이지에서 전달 받은 파라메터를 할당한다. 
            수정대상 : 파라메터 전달 전 개별 페이지로 테스트
            oArgs = oEvent.getParameter("arguments")
            수정모드와 신규 모드 모두  
            선택할수 있는 콤보박스 노출과 저장시
            */
            var oUiData = this.getModel("oUiData"),
                oModel = this.getOwnerComponent().getModel(),
                oTenant_id;

            this._m.filter.material_code = "new";

            if (this._m.filter.material_code == "new") {

                console.log("=============== new item ===============");
                //신규라면 
                this._fnSetCreateMode();

                //수정사항 파라메터로 전달받은 값을 할당한다.        
                //oUiData.tenant_id =  oTenant_id;
                //this._m.filter.tenant_id

            }else{

                this._onMidServiceRead();

                if(this._m.filter.material_code.length>0){
                //보기 모드(수정화면 진입전 보기화면을 반드시 거쳐야 한다.)
                    this._fnSetReadMode();
                }
                else {
                    this._fnSetEditMode();
                }
            } 
            
            //자재정보 MIMaterialCodeBOMManagement Read

            //관리조직 이름 
            var bFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id)
            ];

            oModel.read(this._m.serviceName.orgTenantView, {
                async: false,
                filters: bFilters,
                success: function (rData, reponse) {

                    console.log("json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    var oData = reponse.data.results[0];

                    if(oData.length>0){
                        oUiData.setProperty("/tenant_name", reponse.data.results[0].tenant_name);
                    }
                }
            });

            //this.getView().setBusy(false);
            
            console.groupEnd();            
        },

        /**
         * 자재정보 MIMaterialCodeBOMManagement Read
         * @private
         */
        _onMidServiceRead : function(){
            console.log("_onMidServiceRead");
            var oUiData = this.getModel("oUiData"),
                that = this,
                oModel = this.getOwnerComponent().getModel(),
                oMidList = new JSONModel(),
                sServiceUrl = this._m.serviceName.mIMaterialCodeBOMManagement,
                aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
                new Filter("company_code", FilterOperator.EQ, this._m.filter.company_code),
                new Filter("org_type_code", FilterOperator.EQ, this._m.filter.org_type_code),
                new Filter("org_code", FilterOperator.EQ, this._m.filter.org_code),
                new Filter("material_code", FilterOperator.EQ, this._m.filter.material_code),
                new Filter("supplier_code", FilterOperator.EQ, this._m.filter.supplier_code)
            ];

            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {

                    console.log( sServiceUrl + " json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));

                    var oData = reponse.data.results[0];

                    if(oData.material_code.length>0){
                        oUiData.setProperty("/material_code", oData.material_code); 
                        oUiData.setProperty("/material_description", oData.material_description); 
                        oUiData.setProperty("/supplier_code", oData.supplier_code); 
                        oUiData.setProperty("/supplier_local_name", oData.supplier_local_name); 
                        oUiData.setProperty("/processing_cost", oData.processing_cost);
                        oUiData.setProperty("/pcst_currency_unit", oData.pcst_currency_unit);
                        oUiData.setProperty("/create_user_id", oData.create_user_id);
                        oUiData.setProperty("/system_create_dtm", oData.system_create_dtm);
                        oUiData.setProperty("/base_quantity", oData.base_quantity);
                    }

                    oMidList.setData(reponse.data.results);

                    for(var i=0;i<reponse.data.results.length;i++){
                       oMidList.oData[i].itemMode = that._m.itemMode.read;
                       oMidList.oData[i].odataMode = that._m.odataMode.yes;
                    }
                    that.getOwnerComponent().setModel(oMidList, "midList");
                }
            });

        },     

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            console.log("_onRoutedThisPage");
        },

       /**
         * Read, Edit 버튼 토글 
         * @public
         */
        onRead : function () {
            this._fnSetReadMode(); 
        },

        /**
         * Read, Edit 버튼 토글 
         * @public
         */
        onEdit: function () {
            this._fnSetEditMode();         
        },


        /**
         * 시황자제 및 가격정보 선택
         * @public
         */
        onMaterialDetail : function () {
            console.log("call funtion onMaterialDetail");

		    //var sInputValue = oEvent.getSource().getValue();

			if (!this._valueHelpMaterialDetail) {
                this._valueHelpMaterialDetail = sap.ui.xmlfragment(this._m.fragementId.materialDetail, this._m.fragementPath.materialDetail, this);
                this.getView().addDependent(this._valueHelpMaterialDetail);
			}                
			this._openValueHelpMaterialDetail();
        },

        /**
         * 시황자재 선택, 시황자재 가겨정보 선택 Fragment open
         * @private
         */
        _openValueHelpMaterialDetail : function () {
            this._valueHelpMaterialDetail.open();
        },
       
        /**
         * Exit
         * @private
         */
        _onExit: function () {
  
            for (var sPropertyName in this._formFragments) {
                if (!this._formFragments.hasOwnProperty(sPropertyName) || this._formFragments[sPropertyName] == null) {
                    return;
                }
               

                this._formFragments[sPropertyName].destroy();
                this._formFragments[sPropertyName] = null;
            }
        },

        _handleCreateSuccess: function (oData) {
            var that = this;
            MessageBox.show("저장에 성공 하였습니다.", {
                icon: MessageBox.Icon.SUCCESS,
                title: "저장 확인",
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });
            //MessageToast.show("저장에 성공 하였습니다.");
        },

        _findFragmentControlId : function (fragmentID, controlID) {
            return sap.ui.core.Fragment.byId(fragmentID, controlID);
        },

        /**
         * Fragment  ============================================================ 
         */

        /**
         * 시황자재 선택 자재 이름 및 코드 검색
         * @param {Event} oEvent 
         */
        onMaterialDetailFilter : function (oEvent) {
            console.log("onMaterialDetailFilter");

            var oModel = this.getOwnerComponent().getModel(),
                aFilter = [],
                that = this,
                searchField_code = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_code").getValue(),
                searchField_category = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_category").getValue(),
                oTable = this._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable");
                
            //var sQuery = oEvent.getParameter("query");
           
            //하기 주석은 사용자 조직 과  자재 관리 마스터 권한에 따라 변경될수 있다. 
            aFilter.push(new Filter("tenant_id", FilterOperator.Contains, this._m.filter.tenant_id));
            aFilter.push(new Filter("company_code", FilterOperator.Contains, this._m.filter.company_code));
            aFilter.push(new Filter("org_type_code", FilterOperator.Contains, this._m.filter.org_type_code));
            aFilter.push(new Filter("org_code", FilterOperator.Contains, this._m.filter.org_code));

            if(searchField_category.length>0){
                aFilter.push(new Filter("mi_material_code", FilterOperator.Contains, searchField_code));
            }
            
            if(searchField_category.length>0){
                aFilter.push(new Filter("mi_material_code_name", FilterOperator.Contains, searchField_code));
            }
            
            if(searchField_category.length>0){
                aFilter.push(new Filter("mi_material_code", FilterOperator.Contains, searchField_category));
            }

            var sServiceUrl = this._m.serviceName.mIMaterialCodeList;

            var mIMaterialCodeList = new JSONModel();
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilter,
                success: function (rData, reponse) {

                    console.log( sServiceUrl + " json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    mIMaterialCodeList.setData(reponse.data.results);
                    that.getOwnerComponent().setModel(mIMaterialCodeList, "mIMaterialCodeList");
                }
            });

        },

        /**
         * 시황자재 > 가격정보 선택
         * @public
         */
        onSelectedLeftTableItem : function (oEvent) {
            console.log("onSelectedLeftTableItem");

            var oModel = this.getOwnerComponent().getModel(),
                aFilter = [],
                that = this;


            var fCode = oEvent.oSource.getItems()[0].getCells()[0].mProperties.text;
            var fName = oEvent.oSource.getItems()[0].getCells()[1].mProperties.text;
           
            //수정대상 확인 통화 단위 이상함             
            //하기 주석은 사용자 조직 과  자재 관리 마스터 권한에 따라 변경될수 있다. 
            aFilter.push(new Filter("tenant_id", FilterOperator.Contains, this._m.filter.tenant_id));
            aFilter.push(new Filter("company_code", FilterOperator.Contains, this._m.filter.company_code));
            aFilter.push(new Filter("org_type_code", FilterOperator.Contains, this._m.filter.org_type_code));
            aFilter.push(new Filter("org_code", FilterOperator.Contains, this._m.filter.org_code));
            
            aFilter.push(new Filter("mi_material_code", FilterOperator.Contains, fCode));
            aFilter.push(new Filter("mi_material_code_name", FilterOperator.Contains, fName));

            //시황자재 가격정보 
            var sServiceUrl = this._m.serviceName.mIMaterialCostInformationView;

            var mIMaterialCostInformationView = new JSONModel();
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilter,
                success: function (rData, reponse) {
                    console.log( sServiceUrl + " json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    mIMaterialCostInformationView.setData(reponse.data.results);
                    that.getOwnerComponent().setModel(mIMaterialCostInformationView, "mIMaterialCostInformationView");
                }
            });
        },
  
        /**
         * 수정대상 : 아이템 선택했는지 확인해야함. 
         * 시황자재 > 가격정보 에서 Apply 선택
         * @param {Event} oEvent  아이템 선택 후 등록 
         */
        onMaterialDetailApply : function () {
            console.log("onMaterialDetailApply");

            // 주석제거대상
            // if(oRightTable.getSelectedItems().length<1){
            //     this._showMessageBox(
            //         "선택 확인",
            //         "항목을 선택 하여 주십시요.",
            //         this._m.messageType.Warning,
            //         function(){return;}
            //     );
            //     return;
            // }

            //선택된 시황자재를 midtable에 추가한다. 
            this.onMidListItemAdd();

            this.onMaterialDetailClose();

        },

        /**
         * 자재코드 검색후 
         */
        onValueHelpMaterialDialogApply : function () {
            console.log("onValueHelpMaterialDialogApply");
            var oTable = this._findFragmentControlId(this._m.fragementId.materialDialog, "materialTable"),            
                oSelected = oTable.getSelectedContexts(),
                oModel = this.getModel("materialTableList");

            if(oSelected.length<1){
                this._showMessageBox(
                    "선택 확인",
                    "항목을 선택 하여 주십시요.",
                    this._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            //다수 일수 있는 경우를 대비. 현재 한건. 
            for(var i=0;i<oSelected.length;i++){

                var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));


                var odata = oModel.oData[idx];

                //수정대상 알수 없는 자재코드 및 서플라이로 인하여 임시로 할당 
                if(oModel.oData[idx].material_code.length>0){
                    odata.material_code = oModel.oData[idx].material_code;
                    odata.material_description = oModel.oData[idx].material_description;
                    
                } else {
                    odata.material_code = this._m._imsiData.material_code;
                    odata.material_description = this._m._imsiData.material_description;
                }

                if(oModel.oData[idx].material_code.length>0){
                    odata.supplier_code = oModel.oData[idx].supplier_code;
                    odata.supplier_local_name = oModel.oData[idx].supplier_local_name;
                    odata.supplier_english_name = this._m._imsiData.supplier_english_name;
                } else {
                    odata.supplier_code = this._m._imsiData.supplier_code;
                    odata.supplier_local_name = this._m._imsiData.supplier_local_name;
                    odata.supplier_english_name = this._m._imsiData.supplier_english_name;
                } 
                

				var oMultiInput = this.byId(this._m.input.inputMultiInput);

                // if (aSelectedItems && aSelectedItems.length > 0) {
                //     aSelectedItems.forEach(function (oItem) {
                //         oMultiInput.addToken(new Token({
                //             text: oItem.getTitle()
                //         }));
                //     });
                // }
                            
            }

            this.onMaterialDialog_close();
        },

        onMaterialDialog_close : function (){
            this._valueHelpMaterialDialog.close();
        },
        /**
         * 수정대상 : 테이블을 확인할수 없으 므로 임시 
         * 시황재재 선택 및 가격정보 선택 페이지 close
         * @public
         */
        onMaterialDetailClose : function() {
            console.log("onMaterialDetailClose");
            this._valueHelpMaterialDetail.close();
        },

        /**
         * 수정대상[중요] : CostinformationView에 나머지 MIMaterialCodeBOMManagement 동일한 필요 컬럼이 있어야 한다.
         * 시황자재 리스트 아이템 추가. 
         * @public
         */
        onMidListItemAdd : function(odata){
            
            var oMidListModel = this.getOwnerComponent().getModel("midList"),
                oRightTableModel = this.getOwnerComponent().getModel("mIMaterialCostInformationView");
            
             var items = {
                "tenant_id": odata.tenant_id,
                "company_code": odata.company_code,
                "org_type_code": odata.org_type_code,
                "org_code": odata.org_code,
                "material_code": odata.material_code,
                "material_description": odata.material_description,
                "supplier_code": odata.supplier_code,
                "supplier_local_name": odata.supplier_local_name,
                "supplier_english_name": odata.supplier_english_name,
                "base_quantity": odata.base_quantity,
                "processing_cost": odata.material_description,
                "pcst_currency_unit": odata.material_description,
                "mi_material_code": odata.mi_material_code,
                "mi_material_code_name": odata.mi_material_code_name,
                "category_code": odata.category_code,
                "category_name": odata.category_name,
                "reqm_quantity_unit": odata.reqm_quantity_unit,
                "reqm_quantity": odata.reqm_quantity,
                "currency_unit": odata.currency_unit,
                "mi_base_reqm_quantity": odata.mi_base_reqm_quantity,
                "quantity_unit": odata.quantity_unit,
                "exchange": odata.exchange,
                "termsdelv": odata.termsdelv,
                "use_flag": odata.use_flag,
                "local_create_dtm": odata.local_create_dtm,
                "local_update_dtm": odata.local_update_dtm,
                "create_user_id": odata.create_user_id,
                "update_user_id": odata.update_user_id,
                "system_create_dtm": odata.system_create_dtm,
                "system_update_dtm": odata.system_update_dtm,
                "itemMode" : odata.itemMode,
                "odataMode" : odata.odataMode
            };

            oMidListModel.oData.push(items);
            oMidListModel.refresh(true);
        },

        /**
         * midTable 항목(열) 삭제 
         * @public 
         */
        onMidListItemDelete : function () {
            console.log("onMidListItemDelete");
            var oModel = this.getOwnerComponent().getModel("midList"),
                that = this,
                oTable = this.getView().byId("midTableChange"),
                oSelected = oTable.getSelectedContexts();

            if(oSelected.length<1){
                this._showMessageBox(
                    "선택 확인",
                    "삭제할 항목을 선택 하여 주십시요.",
                    this._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            for(var i=0;i<oSelected.length;i++){

                var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
                oModel.oData[idx].itemMode=this._m.itemMode.delete;

            }

            
            oTable.removeSelections();
            oModel.refresh(true);            
        },

        /**
         * Odata Create, Update, Delete  ============================================================ 
         */
        /**
         * MESSAGE
         * @param {String} title 
         * @param {String} content 
         * @param {sap.ui.core.MessageType} type 
         * @param {function} closeEvent 
         */
        _showMessageBox : function(title, content, type, closeEvent){
            MessageBox.show(content, {
                icon: type,
                title: title,
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact",
                onClose: closeEvent,
            });
        },

        /**
          * 버튼 액션 저장
          */
        onSaveAction : function(){
            console.log("call function ==================== onMidSave ====================");
            // this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
             var oUi = this.getModel("oUi");
             var bCreateFlag = oUi.getProperty("/createMode");
             var bOkActionFlag = false;
 
             if(bCreateFlag){
                 if(ValidatorUtil.isValid(this.getView(),"requiredField")){
                     MessageBox.confirm("추가 하시 겠습니까?", {
                         title : "Create",
                         initialFocus : sap.m.MessageBox.Action.CANCEL,
                         onClose : function(sButton) {
                             if (sButton === MessageBox.Action.OK) {
                                 this._onSave();
                             }else{
                                 return;
                             }
                         }.bind(this)
                     });
                 }else{
                     console.log("checkRequire")
                 }
             }else{
                 MessageBox.confirm("수정 하시 겠습니까?", {
                     title : "Update",
                     initialFocus : sap.m.MessageBox.Action.CANCEL,
                     onClose : function(sButton) {
                         if (sButton === MessageBox.Action.OK) {
                             this._onSave();
                         }else{
                             return;
                         }
                     }.bind(this)
                 });
             }
        },
         /**
          * 저장
          */
         _onSave: function () {

            console.log("call function ==================== onMidSave ====================");
           // this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
            var oUi = this.getModel("oUi");
            var bCreateFlag = oUi.getProperty("/createMode");
            var bOkActionFlag = false;

            //comboBox_pcst_currency_unit=this._findFragmentControlId(this._m.fragementId.change, "comboBox_pcst_currency_unit").getSelectedKey(),
            //this._findFragmentControlId(this._m.fragementId.change, "midTableChange"),
            var oTable = this.getView().byId("midTableChange"),
                oModel = this.getOwnerComponent().getModel(),
                midList = this.getOwnerComponent().getModel("midList"),
                oUiData = this.getModel("oUiData"),
                comboBox_pcst_currency_unit=this.getView().byId("comboBox_pcst_currency_unit").getSelectedKey();

            var updateItem = 0;
            var createItem = 0;
            var deleteItem = 0;

            for (var idx = 0; idx < oTable.getItems().length; idx++) {

                //items.getCells()[4].mProperties.value,
                //comboboxUse_flag = items.getCells()[5].mProperties.selectedKey,
                var items = oTable.getItems()[idx],
                    itemMode = items.getCells()[0].mProperties.text,
                    mi_material_code = items.getCells()[1].mProperties.text,
                    imputReqm_quantity = items.getCells()[4].mAggregations.items[1].mProperties.value,
                    comboboxUse_flag = items.getCells()[5].mAggregations.items[1].mProperties.selectedKey,
                    bValueCheckFlag = true,
                    odataMode= this._m.odataMode.no;

                if(imputReqm_quantity.length<1){
                    this._showMessageBox(
                        "소요량 확인",
                        "소요량 을 입력 하여 주십시요.",
                        this._m.messageType.Warning,
                        function(){return;}
                    );

                    bValueCheckFlag = false;
                    return;
                }

                if(comboboxUse_flag.length<1){
                    this._showMessageBox(
                        "Use Flag 확인",
                        "Use Flag 를 선택하여 주십시요.",
                        function(){return;}
                    );


                    bValueCheckFlag = false;
                    return;
                }

                //수정사항 신규 자재 등록일때. 자재코드 및 정보를 추가 한다. 
                //mi_material_code 는 multiInput_material_code 값으로 대체 자재코드
                //input_base_quantity 기준수량
                if(!bValueCheckFlag) return;
                
                
                //midList.oData 아이템 정확성, odataMode 구함
                for(var i=0;i<midList.oData.length;i++){
                    if(midList.oData[i].mi_material_code == mi_material_code){
                        odataMode =  midList.oData[i].odataMode;

                        midList.oData[i].pcst_currency_unit = comboBox_pcst_currency_unit;
                        midList.oData[i].reqm_quantity = imputReqm_quantity;
                        midList.oData[i].use_flag = comboboxUse_flag == "true" ? true : false;
                                               

                        // update 시 not null 다 넣어주어야 함.
                        // 한번에 안되면 하나씩 추가하면서 하는게 편함
                        // 값을 넣지 않고 저장하면 null 인 곳은 null이 된다.
                        // key값은 key set 해서 저장한다.

                        //Crate
                        if(bCreateFlag){

                            if((itemMode==this._m.itemMode.create))
                            {
                                if(this._fnCreateItem(oModel, midList.oData[i])){
                                    createItem++;
                                }
                            }
                        }
                        else {  //Update

                            if((itemMode==this._m.itemMode.create))
                            {
                                if(this._fnCreateItem(oModel, midList.oData[i])){
                                    createItem++;
                                }
                            }

                            //아이템 추가 및 업데이트 삭제가 동시에 발생. 

                            //기존에 있는 데이타를 수정한다면. 
                            if((itemMode==this._m.itemMode.read || itemMode==this._m.itemMode.update)
                            && odataMode == this._m.odataMode.yes)
                            {
                                if(this._fnUpdateItem(oModel, midList.oData[i])){
                                    updateItem++;
                                }
                            }

                            // Delete
                            //기존데이타 삭제
                            if(itemMode == this._m.itemMode.delete && odataMode == this._m.odataMode.yes)
                            {
                                if(this._fnDeleteItem(oModel, midList.oData[i])){
                                    deleteItem++;
                                }
                            }
                            
                            //json 데이타는...따로 삭제 하지 않아도..페이지 이동하면 날라가는지 확인필요.
                        }                        
                                          
                    }          
               
                } //for end
            } //for end

            console.log("createItem : ", createItem);
            console.log("updateItem : ", updateItem);
            console.log("deleteItem : ", deleteItem);

            //실행건수가 있을때만 실행 
            if( createItem > 0 || updateItem > 0 || deleteItem>0){
                console.log("======================= setUseBatch =========================");
                
                oModel.setUseBatch(true);
                oModel.submitChanges({
                    groupId: this._m.groupID,
                    success: this._handleCreateSuccess.bind(this),
                    error: this._handleCreateError.bind(this)
                });

                oModel.refresh(true); 
                
                this._onMidServiceRead();
                //수정대상 : model refresh가..맘대로 안됨..
                //this.getOwnerComponent().getModel("midList").refresh(true);
                //this.getView().byId("midTableChange").getBinding("items").refresh();

                this._fnSetReadMode();
            }           
        },

        /*
        * MaterialDialog.fragment  에서 값을 받아 테이블에 등록 처리 
         */
        _fnMarteialCreateItem : function () {

            //this.onMidListItemAdd();
        },
        /**
         * Crate
         * @private
         */
        _fnCreateItem : function(oModel, oData) {

            var cParameters = {
                "groupId": this._m.groupID,
                "properties": {
                    "tenant_id": oData.tenant_id,
                    "company_code": oData.company_code,
                    "org_type_code":  oData.org_type_code,
                    "org_code": oData.org_code,
                    "material_code": oData.material_code,
                    "material_description": oData.material_description,
                    "supplier_code": oData.supplier_code,
                    "supplier_local_name": oData.supplier_local_name,
                    "supplier_english_name": oData.supplier_english_name,
                    "base_quantity": oData.base_quantity,
                    "processing_cost": oData.processing_cost,
                    "pcst_currency_unit": oData.pcst_currency_unit,
                    "mi_material_code": oData.mi_material_code,
                    "mi_material_code_name": oData.mi_material_code_name,
                    "category_code": oData.category_code,
                    "category_name": oData.category_name,
                    "reqm_quantity_unit": oData.reqm_quantity_unit,
                    "reqm_quantity": oData.reqm_quantity,
                    "currency_unit": oData.currency_unit,
                    "mi_base_reqm_quantity": oData.mi_base_reqm_quantity,
                    "quantity_unit": oData.quantity_unit,
                    "exchange": oData.exchange,
                    "termsdelv": oData.termsdelv,
                    "use_flag": oData.use_flag,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": this._sso.user.id,
                    "update_user_id": this._sso.user.id,
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()                        
                }
            };
            try{
                oModel.createEntry(this._m.serviceName.mIMaterialCodeBOMManagement, cParameters);
                return true;
            }catch(error){
                return false;
            }

        },

        /**
         * Update
         * @private
         */
        _fnUpdateItem : function( oModel, oData) {
            var oKey = {
                tenant_id : oData.tenant_id,
                company_code : oData.company_code,
                org_type_code : oData.org_type_code,
                org_code: oData.org_code,
                material_code : oData.material_code,
                supplier_code : oData.supplier_code,
                mi_material_code : oData.mi_material_code
            }

            var uParameters = {
                "pcst_currency_unit": oData.pcst_currency_unit,
                "mi_base_reqm_quantity" : oData.mi_base_reqm_quantity,
                "reqm_quantity" : oData.reqm_quantity,
                "reqm_quantity_unit" : oData.reqm_quantity_unit,
                "base_quantity" : oData.base_quantity,
                "supplier_local_name" : oData.supplier_local_name,
                "supplier_english_name" : oData.supplier_english_name,
                "mi_material_code_name" : oData.mi_material_code_name,
                "category_code" : oData.category_code,
                "category_name" : oData.category_name,
                "currency_unit" : oData.currency_unit,
                "exchange" : oData.exchange,
                "quantity_unit" : oData.quantity_unit,
                "processing_cost" : oData.processing_cost,
                "use_flag" : oData.use_flag,
                "termsdelv" : oData.termsdelv,
                "local_create_dtm" : new Date(),
                "local_update_dtm" : new Date()
            }

            try{
                var sUpdatePath = oModel.createKey(this._m.serviceName.mIMaterialCodeBOMManagement, oKey);
                oModel.update(sUpdatePath, 
                    uParameters, 
                    { groupId: this._m.groupID } );
                return true;
            }catch(error){
                return false;
            }
                      
        },

        /**
         * Delete
         * @private
         */
        _fnDeleteItem : function( oModel, oData) {
            var oKey = {
                tenant_id : oData.tenant_id,
                company_code : oData.company_code,
                org_type_code : oData.org_type_code,
                org_code: oData.org_code,
                material_code : oData.material_code,
                supplier_code : oData.supplier_code,
                mi_material_code : oData.mi_material_code
            }

            try{
                var sDeletePath = oModel.createKey(this._m.serviceName.mIMaterialCodeBOMManagement, oKey);
                oModel.remove(sDeletePath,{ groupId: this._m.groupID } );
                return true;
            }catch(error){
                return false;
            }            
        },   
        

        /**
         * mainTable Item Delete
         * @param {sap.ui.base.Event} oEvent 
         */
        onDeleteAction : function (oEvent){
            console.group("onMidDelete");

            var oModel = this.getOwnerComponent().getModel(),
                oData = oModel.getData(),
                oPath,
                that = this;
                  
            var oSelected = this._mainTable.getSelectedContexts();   
            if (oSelected.length > 0) { 
                            
                MessageBox.confirm("해당 항목을 삭제 하시겠습니까?", {
                    title: "삭제 확인",                                    
                    onClose: this._deleteAction.bind(this),                                    
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    textDirection: sap.ui.core.TextDirection.Inherit    
                });
              
            }
            console.groupEnd();
        },

        /**
         * mainTable Delete Action
         * @param {sap.m.MessageBox.Action} oAction 
         */
		_deleteAction: function(oAction) {
            console.log("_deleteAction");
            
			if(oAction === MessageBox.Action.DELETE) {

				// this._getSmartTableById().getTable().getSelectedItems().forEach(function(oItem){
                //     var sPath = oItem.getBindingContextPath();	
                //     var mParameters = {"groupId":"deleteGroup"};
                    
                //     oItem.getBindingContext().getModel().remove(sPath, mParameters);
                    
                // });
				
				var oModel = this.getView().getModel();
				oModel.submitChanges({
		      		groupId: "deleteGroup", 
		        	success: this._handleDeleteSuccess.bind(this),
		        	error: this._handleDeleteError.bind(this)
		     	});
            } 

        },

        _handleCreateError: function (oError) {
            MessageBox.error("저장에 실패 하였습니다.");
        },

        _handleUpdateSuccess: function (oData) {
            MessageBox.show("수정 확인", {
                icon: MessageBox.Icon.SUCCESS,
                title: "수정에 성공 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });
        },
        
        _handleUpdateError: function (oError) {
            MessageBox.show("수정 실패 확인", {
                icon: MessageBox.Icon.ERROR,
                title: "수정에 실패 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });
        },
        /**
         * 삭제 성공
         * @param {ODATA} oData 
         * @private
         */
        _handleDeleteSuccess: function (oData) {
            MessageBox.show("삭제 실패 확인", {
                icon: MessageBox.Icon.ERROR,
                title: "삭제가 실패 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });
            //this.getView().byId("buttonMainTableDelete").setEnabled(false);
        },

        /**
         * 삭제실패
         * @param {Event} oError 
         * @private
         */
        _handleDeleteError: function (oError) {
            MessageBox.show("삭제 실패 확인", {
                icon: MessageBox.Icon.ERROR,
                title: "삭제가 실패 하였습니다.",
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact"
            });
        }        
           
    });
});

