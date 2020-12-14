sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/util/ValidatorUtil",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "ext/lib/util/Validator"
], function (BaseController, JSONModel,   DateFormatter, ValidatorUtil, Filter, FilterOperator, MessageBox, MessageToast, ValueState, Validator) {
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
                materialDialog : "pg.mm.view.MaterialDialog"
            },            
            fragementId : {
                materialDetail : "MaterialDetail_ID",
                materialDialog : "MaterialDialog_ID"
            },
            input : {
                input_material_code : "input_material_code",
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
                mIMaterialCodeBOMManagementView: "/MIMaterialCodeBOMManagementView",  //Read (main 동일 midTable )자재리스트                
                mIMaterialCodeBOMManagement:"/MIMaterialCodeBOMManagement",//CUD 
                mIMaterialPriceManagement: "/MIMaterialPriceManagement",  //시황자재리스트
                mIMaterialPriceManagementView: "/MIMaterialPriceManagementView",  //CUD MIMaterialPriceManagementView
                orgTenantView: "/OrgTenantView", //관리조직 View
                currencyUnitView : "/CurrencyUnitView아 ㄴ", //통화단위 View
                mIMaterialCodeList : "/MIMaterialCodeList", //자재코드 View(검색)
                unitOfMeasureView : "/UnitOfMeasureView", //수량단위 View
                materialView : "/MaterialView", //서비스 안됨 자재코드  등록View
                supplierView : "/SupplierView", //공급업체  등록View
                mIMatCategListView : "/MIMatCategListView", //가격정보(1.시황자재 선택)
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
                read : "　",    //테이블 아이템 기존 존재 데이타 로드
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
            material_desc : "ERCA00006AB",
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
            console.log(" --------------- _controlMode");

            //_oUiData 사용자 지정
            //oUiData 메인에서 선택한 자재 정보 

            if(sMode == this._m.controlMode.Dev){
                console.log("=================== Dev ====================")
                /**
                 * 사용자 세션이나 정보에 다음값이 셋팅 되어 있다는 가정 Test
                 */

                var _oUiData = new JSONModel({
                    tenant_name: "",
                    create: "",
                    createdata: "",
                    material_code :"",
                    material_desc :"",
                    supplier_code :"",
                    supplier_local_name :"",
                    processing_cost :"",
                    pcst_currency_unit :"",
                    base_quantity : "",
                    radioButtonGroup : "",
                    input_material_code : "",
                    string:null,
                    create_user_id: this._sso.user.id,
                    system_create_dtm : new Date(),
                    number:0                    
                });

                
                this.setModel(_oUiData, "_oUiData");


            }else{
                var _oUiData = new JSONModel({
                    tenant_name: "",
                    radioButtonGroup:0,
                    material_code : "",
                    supplier_code : ""
                });
                
                this.setModel(_oUiData, "_oUiData");
                                
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

            //pageMode C Create, V View, E Edit
            var oUi = new JSONModel({
                busy: true,
                delay: 0,
                readMode : true,
                editMode : false,
                createMode : false
            });
            var  _deleteItem = new JSONModel({oData:[]});
            
            this.setModel(_deleteItem, "_deleteItem");
            this.setModel(oUi, "oUi");

            this._fnControlSetting();

            this._fnSetReadMode();
            
   
            //개발일때. 
            //수정대상
            this._controlMode(this._m.controlMode.Qa);
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
              
           // oBindingComboBox.filter(aFiltersComboBox);  
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
            var _oUiData = this.getModel("_oUiData"),
                materialTable = this.getModel("materialTable");
            _oUiData.setProperty("/radioButtonGroup", this.getView().byId("radioButtonGroup").getSelectedIndex());

			// create value help dialog
			if (!this._valueHelpMaterialDialog) {

                this._valueHelpMaterialDialog = sap.ui.xmlfragment(
                    this._m.fragementId.materialDialog, 
                    this._m.fragementPath.materialDialog,this
                );
                this.getView().addDependent(this._valueHelpMaterialDialog);

            }                
            
            //기존 검색 데이타 초기화
            this.setModelNullAndUpdateBindings(materialTable);

			this._openValueHelpMaterialDialog();
		},

        /**
         * 아이템 선택후 가격정보 선택
         * @param {*} radioButtonGroup 
         */
		_openValueHelpMaterialDialog: function (radioButtonGroup) {
            // open value help dialog filtered by the input value
            //기존 모델 초기화 
            this.setArrayModelNullAndUpdateBindings("materialTable");

			this._valueHelpMaterialDialog.open();
		},

        /**
         * MaterialDialog Search 자재코드 검색(자재, 공급)
         * @public 
         * @param {*} oEvent 
         */
		onValueHelpMaterialDialogSearch: function (oEvent) {

            console.log("_onValueHelpMaterialDialogSearch");

            //기존 검색된 모델 값이 존재할경우 삭제 
            //that.getOwnerComponent().setModel(rigthTable, "rigthTable"); 
            //comboBox_vendorView=this._findFragmentControlId(this._m.materialDialog, "comboBox_vendorView").getSelectedKey(), 
            var oModel = this.getModel(),
                _oUiData = this.getModel("_oUiData"),
                materialTable = new JSONModel(),
                that = this,

                //onValueHelpMaterialDialogApply
                comboBox_materialView=this._findFragmentControlId(this._m.fragementId.materialDialog, "comboBox_materialView").getSelectedKey(),
                comboBox_supplierView=this._findFragmentControlId(this._m.fragementId.materialDialog, "comboBox_supplierView").getSelectedKey(),
                input_material_desc=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_material_desc").getValue(),
                input_supplier_local_name=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_supplier_local_name").getValue();
                //input_hidden_supplier_english_name=this._findFragmentControlId(this._m.fragementId.materialDialog, "input_supplier_local_name").getValue();
        
            //수정대상 데이타가 없음 사용자 로그인 정보 필터 등록해야함
            //dev-2121-212 L1100 이것만 존재함. 
             var sFilters = [
                new Filter("tenant_id", FilterOperator.EQ, 'L1100')
            ];

            comboBox_materialView = "";
            if(_oUiData.getProperty("/radioButtonGroup")==0){

                if(comboBox_materialView.length>0){
                    sFilters.push(new Filter("material_code", FilterOperator.Contains, comboBox_materialView));
                }
                if(input_material_desc.length>0){
                    sFilters.push(new Filter("material_desc", FilterOperator.Contains, input_material_desc));
                }
  
                oModel.read(this._m.serviceName.materialView, {
                    async: false,
                    filters: sFilters,
                    success: function (rData, reponse) {
    
                        //console.log(that._m.serviceName.materialView +"-- json oData~~~~~~~" + JSON.stringify(reponse.data.results));

                        //가격정보 Vendor 자재코드 자재명 공급업체 공급업체명
                        materialTable.setData(reponse.data.results); 

                        //등록 구분
                        for(var i=0;i<reponse.data.results.length;i++){
                            materialTable.oData[i].itemMode = that._m.itemMode.read;
                            materialTable.oData[i].odataMode = that._m.odataMode.yes;

                            //dev12121715 강제 등록
                            materialTable.oData[i].vendor = "vendor";
                            materialTable.oData[i].vendor_name = "vendor_name";
                            materialTable.oData[i].supplier_code = "supplier_code";
                            materialTable.oData[i].supplier_local_name = "supplier_local_name";

                        }

                        that.getOwnerComponent().setModel(materialTable, "materialTable");                                         
    
                    }
                });
            }else{

                if(comboBox_supplierView.length>0){
                    sFilters.push(new Filter("supplier_code", FilterOperator.Contains, comboBox_supplierView));
                }
                if(input_supplier_local_name.length>0){
                    sFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, input_supplier_local_name));
                }

                oModel.read(this._m.serviceName.supplierView, {
                    async: false,
                    filters: sFilters,
                    success: function (rData, reponse) {
    
                   //가격정보 Vendor 자재코드 자재명 공급업체 공급업체명
                   materialTable.setData(reponse.data.results); 

                    //등록 구분
                    for(var i=0;i<reponse.data.results.length;i++){
                            materialTable.oData[i].itemMode = that._m.itemMode.read;
                            materialTable.oData[i].odataMode = that._m.odataMode.yes;

                            materialTable.oData[i].vendor = "vendor";
                            materialTable.oData[i].vendor_name = "vendor_name";
                            materialTable.oData[i].material_code = "material_code";
                            materialTable.oData[i].material_desc = "material_desc";

                        }

                        that.getOwnerComponent().setModel(materialTable, "materialTable");                                         
                    }
                });
            }
         
            var oMaterialTableList = new JSONModel([]);
            this.getOwnerComponent().setModel(oMaterialTableList, "materialTableList");

           // 
		},

		_handleValueHelpMaterialClose: function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems"),
				oInput_material_code = this.byId(this._m.input.input_material_code);

                oInput_material_code.setValue = oInput_material_code;

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

        /**
         * 자재정보 MIMaterialCodeBOMManagement Read dev121212
         * mIMaterialCodeBOMManagementView 동일하게 리스트에서 사용 mIMaterialCodeBOMManagement cud에서 사용
         * @private
         */
        _onMidServiceRead : function(){
            console.log("_onMidServiceRead");
            var that = this,
                oModel = this.getOwnerComponent().getModel(),
                oMidList = new JSONModel(),
                oUiData = new JSONModel(),
                sServiceUrl = this._m.serviceName.mIMaterialCodeBOMManagementView, //read는 master 페이지와 동일하게 사용한다. 
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

                    //console.log( sServiceUrl + " json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));

                    

                    for(var i=0;i< reponse.data.results.length;i++){

                        var oData = reponse.data.results[i];

                        if(i==0){
                            oUiData.setData(oData);
                            oUiData.tenant_name =  "";
                       
                            that.getOwnerComponent().setModel(oUiData, "oUiData");
                            
                        }
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
         * jsoon model data null initial
         * @private
         */
        _initialModel : function() {
              
                var arrayModel = [
                    "oUiData",
                    "_oUi",
                    "_oUiData",
                    "_deleteItem",
                    "midList",
                    "oUi",
                    "materialTable",
                    "mIMaterialCostInformationView",
                    "mIMatCategListView"

                ];
              
                this.setArrayModelNullAndUpdateBindings(arrayModel);

        },
		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            console.log("_onRoutedThisPage");

            this._initialModel();
            this._onPageClearValidate();

            var _oUiData = this.getModel("_oUiData"),
                oArgs = oEvent.getParameter("arguments"),
                oModel = this.getOwnerComponent().getModel(),
                oTenant_id;

            this._m.filter.material_code = oArgs.tenant_id;
            this._m.filter.company_code = oArgs.company_code;
            this._m.filter.org_type_code = oArgs.org_type_code;
            this._m.filter.org_code = oArgs.org_code;
            this._m.filter.material_code = oArgs.material_code;
            this._m.filter.supplier_code = oArgs.supplier_code;
            this._m.filter.mi_material_code = oArgs.mi_material_code;
    
            if (this._m.filter.material_code == "new") {

                console.log("=============== new item ===============");
                //신규라면 
                // var midList = new JSONModel({oData:[]});
                // this.getOwnerComponent().setModel(midList, "midList");
                //dev1444
                // var oUiData = new JSONModel(
                //     {
                //         "create_user_id" : this._sso.user.id,
                //         "system_create_dtm" : new Date()
                //     }
                // )
                // this.setModel(oUiData, "oUiData");
                this._fnSetCreateMode();

                //oUiData>/create_user_id}"  system_create_dtm

                //수정사항 파라메터로 전달받은 값을 할당한다.        
                //oUiData.tenant_id =  oTenant_id;
                //this._m.filter.tenant_id

            }else{

                if(this._m.filter.material_code.length>0){
                //보기 모드(수정화면 진입전 보기화면을 반드시 거쳐야 한다.)
                    this._onMidServiceRead();

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

                    //console.log("json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));

                    if(reponse.data.results.length>0){
                        _oUiData.setProperty("/tenant_name", reponse.data.results[0].tenant_name);
                    }
                }
            });

       //this.getView().setBusy(false);            
        },

       /**
         * Read, Edit 버튼 토글 
         * @public
         */
        onRead : function () {
            this._fnSetReadMode(); 
        },

        /**
         * 작업 취소? 리스트 이동..
         */
        onCancel : function () {
            var that = this;

            that._onExit();
            // MessageBox.show("리스트로 이동합니다.", {
            //     icon: MessageBox.Icon.SUCCESS,
            //     title: "저장 확인",
            //     actions: [MessageBox.Action.OK],
            //     onClose: function (sButton) {
            //         if (sButton === MessageBox.Action.OK) {
            //             var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            //             that._onExit();
            //             that.getRouter().navTo("mainPage", { layout: sNextLayout });
            //         }
            //     }
            // });
            // MessageBox.confirm("작업내용을 취소 하게 됩니다. 취소 하시 겠습니까?", {
            //     title : "Create",
            //     initialFocus : sap.m.MessageBox.Action.CANCEL,
            //     onClose : function(sButton) {
            //         if (sButton === MessageBox.Action.OK) {
            //             this._onExit();
            //         }else{
            //             return;
            //         }
            //     }.bind(this)
            // });            
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

            // var bValidate = this.validator.validate(this.byId("page"));

            // //dev12132202
            // if(!bValidate){
            //     return;
            // }            
            // else{
            //     this.validator.clearValueState(this.byId("page"));
            // }
  
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

            //기존 load 모델 초기화
            var arrayModel = [               
                "mIMaterialCostInformationView",
                "mIMatCategListView"
            ];
          
            this.setArrayModelNullAndUpdateBindings(arrayModel);
            
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
            MessageBox.show("저장 성공 하였습니다.", {
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
         * 시황자재 선택 자재 이름 및 코드 검색 / 카테고리 이름 검색
         * @param {Event} oEvent 
         */
        onMaterialSearch : function (oEvent) {
            console.log("onMaterialSearch");

            // if(ValidatorUtil.isValid(this.getView(),"requiredField")){
            //     console.log("ValidatorUtil true");
            // } else {
            //     console.log("ValidatorUtil false");
            // }

            var oModel = this.getOwnerComponent().getModel(),
                aFilter = [],
                that = this,
                searchField_material_code = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_material_code").getValue(),
                searchField_category_name = this._findFragmentControlId(this._m.fragementId.materialDetail, "searchField_category_name").getValue(),
                oTable = this._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable");
                
            //var sQuery = oEvent.getParameter("query");
           
            //하기 주석은 사용자 조직 과  자재 관리 마스터 권한에 따라 변경될수 있다. 
            //session 적용해야함
            aFilter.push(new Filter("tenant_id", FilterOperator.Contains, this._sso.dept.tenant_id));
            aFilter.push(new Filter("company_code", FilterOperator.Contains, this._sso.dept.company_code));
            aFilter.push(new Filter("org_type_code", FilterOperator.Contains, this._sso.dept.org_type_code));
            aFilter.push(new Filter("org_code", FilterOperator.Contains, this._sso.dept.org_code));

            if(searchField_material_code.length>0){
                aFilter.push(new Filter("mi_material_code", FilterOperator.Contains, searchField_material_code));
            }
            
            if(searchField_material_code.length>0){
                aFilter.push(new Filter("mi_material_name", FilterOperator.Contains, searchField_material_code));
            }
            
            if(searchField_category_name.length>0){
                aFilter.push(new Filter("category_name", FilterOperator.Contains, searchField_category_name));
            }

            //dev20201538
            var sServiceUrl = this._m.serviceName.mIMatCategListView;

            var mIMatCategListView = new JSONModel();
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilter,
                success: function (rData, reponse) {

                    //console.log( sServiceUrl + " json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    mIMatCategListView.setData(reponse.data.results);
                    
                    //dev20201538 데이타 강제 등록
                    for(var i=0;i<reponse.data.results.length;i++){
                        mIMatCategListView.oData[i].mi_material_name = "A001-01-01";
                        mIMatCategListView.oData[i].mi_material_code = "A001-01-01";
                    }     

                    that.getOwnerComponent().setModel(mIMatCategListView, "mIMatCategListView");               
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
                leftTable =  this._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable"),
                aFilter = [],
                that = this;
            
            var tenant_id = leftTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var company_code = leftTable.getSelectedItems()[0].getCells()[1].mProperties.text;
            var org_type_code = leftTable.getSelectedItems()[0].getCells()[2].mProperties.text;
            var org_code = leftTable.getSelectedItems()[0].getCells()[3].mProperties.text;
            var mi_material_code = leftTable.getSelectedItems()[0].getCells()[5].mProperties.text; 
            
            /**
             * dev20201538
             * mi_material_code= "A001-01-01"; 강제 
             * bom으로 테스트  MIMaterialCodeBOMManagement - > mIMaterialCostInformationView 변경해야함
             * //mi_date, amount 데이타 없어서 강제 등록
             */
            //var mi_material_code= "A001-01-01";
            //aFilter.push(new Filter("mi_material_name", FilterOperator.Contains, fName));

            aFilter.push(new Filter("tenant_id", FilterOperator.EQ, tenant_id));
            aFilter.push(new Filter("company_code", FilterOperator.EQ, company_code));
            aFilter.push(new Filter("org_type_code", FilterOperator.EQ, org_type_code));
            aFilter.push(new Filter("org_code", FilterOperator.EQ, org_code));
            aFilter.push(new Filter("mi_material_code", FilterOperator.EQ, mi_material_code));
            
            
            //시황자재 가격정보    dev20201538          
            //var sServiceUrl = this._m.serviceName.mIMaterialCostInformationView;
            var sServiceUrl = this._m.serviceName.mIMaterialCostInformationView;
            
            var mIMaterialCostInformationView = new JSONModel();
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilter,
                success: function (rData, reponse) {
                    //console.log( sServiceUrl + " json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    mIMaterialCostInformationView.setData(reponse.data.results);

                    //dev20201538 임시 강제 등록
                    // for(var i=0;i<reponse.data.results.length;i++){
                    //     mIMaterialCostInformationView.oData[i].mi_date = "2020/12/13";
                    //     mIMaterialCostInformationView.oData[i].amount = 500;
                    // }

                    that.getOwnerComponent().setModel(mIMaterialCostInformationView, "mIMaterialCostInformationView");
                }
            });
        },
  
        /**
         * 시황자재 > 가격정보 에서 Apply 선택
         * @param {Event} oEvent  아이템 선택 후 등록 
         */
        onMaterialDetailApply : function () {
            console.log("onMaterialDetailApply");
            var leftTable =  this._findFragmentControlId(this._m.fragementId.materialDetail, "leftTable"), 
                rightTable = this._findFragmentControlId(this._m.fragementId.materialDetail, "rightTable"),
                that = this;            

            if(rightTable.getSelectedItems().length<1){
                this._showMessageBox(
                    "선택 확인",
                    "항목을 선택 하여 주십시요.",
                    this._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            
            /** dev12131736 알수없는 컬럼 확인 필요
             * leftTable, rightTable 에서 선택된 데이타의 정보를 midTable 등록 
             */
                //테이블에 충분한 데이타가 있다면 Record로 찻는다. 
            
            var leftTablePath = leftTable.getSelectedItems();

            var tenant_id = leftTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var company_code = leftTable.getSelectedItems()[0].getCells()[1].mProperties.text;
            var org_type_code = leftTable.getSelectedItems()[0].getCells()[2].mProperties.text;
            var org_code = leftTable.getSelectedItems()[0].getCells()[3].mProperties.text;
            var category_code = leftTable.getSelectedItems()[0].getCells()[4].mProperties.text; 
            var mi_material_code = leftTable.getSelectedItems()[0].getCells()[5].mProperties.text; 
            var mi_material_name = leftTable.getSelectedItems()[0].getCells()[6].mProperties.text; //시황자재명
            var category_name = leftTable.getSelectedItems()[0].getCells()[7].mProperties.text; 

            var currency_unit = rightTable.getSelectedItems()[0].getCells()[0].mProperties.text;
            var quantity_unit = rightTable.getSelectedItems()[0].getCells()[1].mProperties.text;
            var exchange = rightTable.getSelectedItems()[0].getCells()[2].mProperties.text;
            var termsdelv = rightTable.getSelectedItems()[0].getCells()[3].mProperties.text;

            //자재정보 선택을 참조한다. 
            //supplier_code, supplier_local_name, hidden_supplier_local_name, supplier_english_name
            var material_code = this.getView().byId("input_hidden_material_code").getValue();
            var material_desc = this.getView().byId("input_hidden_material_desc").getValue(); //자재명
            var supplier_code = this.getView().byId("input_hidden_supplier_code").getValue();
            var supplier_local_name = this.getView().byId("input_hidden_supplier_local_name").getValue();
            var supplier_english_name = this.getView().byId("input_hidden_supplier_english_name").getValue();

            var items = {
                "tenant_id": tenant_id,
                "company_code": company_code,
                "org_type_code": org_type_code,
                "org_code": org_code,
                "material_code": material_code,
                "material_desc": material_desc,
                "supplier_code": supplier_code,
                "supplier_local_name": supplier_local_name,
                "supplier_english_name": supplier_english_name,
                "base_quantity": "-1",  
                "processing_cost": "-1", 
                "pcst_currency_unit": "-1",
                "mi_material_code": mi_material_code,
                "mi_material_name": mi_material_name,
                "category_code": category_code,
                "category_name": category_name,
                "reqm_quantity_unit": "0.0", //소요수량단위 
                "reqm_quantity": 0, //사용자 입력
                "currency_unit": currency_unit,
                "mi_base_reqm_quantity": "0.0",//시황기준소요수량
                "quantity_unit": quantity_unit,
                "exchange": exchange,
                "termsdelv": termsdelv,
                "use_flag": true, 
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": this._sso.user.id,
                "update_user_id": this._sso.user.id,
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date(),
                "itemMode" : that._m.itemMode.create,
                "odataMode" : that._m.odataMode.yes                 
            };
             
      

            this.onMidListItemAdd(items);
            
            this.onMaterialDetailClose();
        },

        
        /**
         * 자재코드/서플라이어 검색후 Dialog Apply 
         */
        onValueHelpMaterialDialogApply : function () {
            console.log("onValueHelpMaterialDialogApply");
            var oTable = this._findFragmentControlId(this._m.fragementId.materialDialog, "materialTable"),            
                oSelected = oTable.getSelectedContexts(),
                _oUiData = this.getModel("_oUiData"),                
                midTable = this.getModel("midTable");

                //테이블에 충분한 데이타가 있다면 Record로 찻는다. 
                //oRecord
            
            if(oSelected.length<1){
                this._showMessageBox(
                    "선택 확인",
                    "항목을 선택 하여 주십시요.",
                    this._m.messageType.Warning,
                    function(){return;}
                );
                return;
            }

            var aSelectedItems = oTable.getSelectedItems(),
                vendor = aSelectedItems[0].getCells()[0].getText(),
                vendor_name= aSelectedItems[0].getCells()[1].getText(),
                material_code= aSelectedItems[0].getCells()[2].getText(),
                material_desc= aSelectedItems[0].getCells()[3].getText(),
                supplier_code= aSelectedItems[0].getCells()[4].getText(),
                supplier_local_name= aSelectedItems[0].getCells()[5].getText();

            var sourceName = "[" + material_code + "] ";
            sourceName = sourceName.concat(material_desc);
            sourceName = sourceName.concat(" / ");
            sourceName = sourceName.concat(" [");
            sourceName = sourceName.concat(supplier_code);
            sourceName = sourceName.concat("] ");
            sourceName = sourceName.concat(supplier_local_name);

            var input_material_code = this.byId("input_material_code");
            input_material_code.setValue(sourceName);

            var input_hidden_material_code = this.byId("input_hidden_material_code");
            var input_hidden_material_desc = this.byId("input_hidden_material_desc");
            var input_hidden_supplier_code = this.byId("input_hidden_supplier_code");
            var input_hidden_supplier_local_name = this.byId("input_hidden_supplier_local_name");
            //var input_hidden_supplier_english_name = this.byId("input_hidden_supplier_english_name");                                                

            input_hidden_material_code.setValue(material_code);
            input_hidden_material_desc.setValue(material_desc);
            input_hidden_supplier_code.setValue(supplier_code);
            input_hidden_supplier_local_name.setValue(supplier_local_name);
            //input_hidden_supplier_english_name.setValue(material_code);

            this.onMaterialDialog_close();
        },

        /**
         * 자재 및 서플라이어 검색창 Close
         */
        onMaterialDialog_close : function (){
            this._valueHelpMaterialDialog.close();
        },
        /**     
         * 시황재재 선택 및 가격정보 선택 페이지 close
         * @public
         */
        onMaterialDetailClose : function() {
            this._valueHelpMaterialDetail.close();
        },

        /**
         * 
         * 시황자재 리스트 아이템 추가. 
         * @public
         */
        onMidListItemAdd : function(items){
            
            var midList = this.getModel("midList"),
                that = this;
            
            var bCheck = true;

            if(midList==null){
                var omidList = new JSONModel();
                omidList.setData([items]);
                this.setModel(omidList,"midList");
                return;
                
            }

       
            for(var i=0;i<midList.oData.length;i++){
                if(midList.oData[i].mi_material_code == items.mi_material_code){
                    bCheck = false;
                    this._showMessageToast("이미 추가된 항목 입니다.");
                    return;
                }
            }

            if(bCheck){
                midList.oData.push(items);
                midList.refresh(true);
            }
        },

        /**
         * midTable 항목(열) 삭제 
         * @public 
         */
        onMidListItemDelete : function () {
            console.log("onMidListItemDelete");
            var oModel = this.getOwnerComponent().getModel("midList"),
                _deleteItem = this.getModel("_deleteItem"),
                that = this,
                oTable = this.getView().byId("midTable"),
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
            var _deleteItemOdata = _deleteItem.getProperty("/oData");
            for(var i=0;i<oSelected.length;i++){

                var idx = parseInt(oSelected[i].sPath.substring(oSelected[i].sPath.lastIndexOf('/') + 1));
                
                //mode 표시 사용시 주석
                if(oModel.oData[idx].itemMode != this._m.itemMode.create){
                    _deleteItemOdata.push(oModel.oData[idx]);
                }

                //mode 표시 사용시 사용
                //oModel.oData[idx].itemMode =  this._m.itemMode.delete;

                //mode 표시 사용시 주석
                oModel.oData.splice(idx, 1);              
            }
            //mode 표시 사용시 주석
            _deleteItem.setProperty("/oData", _deleteItemOdata);
            
            that.getView().setBusy(false);
            oTable.removeSelections();
            oTable.getBinding("items").refresh();
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
         *MessageToast 
         * @param {*} content 
         */
        _showMessageToast : function(content){
            MessageToast.show(content);
        },        

        /**
         * Validate
         * @private 
         */
        _onPageValidate: function(){
            var _oUi = this.getModel("oUi"),
                bCheckValidate = true;

            if(_oUi.getProperty("/createMode")){
                bCheckValidate =  this.validator.validate(this.byId(this._m.page));
                if(bCheckValidate) {
                    this.validator.clearValueState(this.byId(this._m.page));
                }
            }
            
            bCheckValidate =  this.validator.validate(this.byId("midTable"));
            if(bCheckValidate){
                this.validator.clearValueState(this.byId("midTable"));
            }
            return bCheckValidate;

        },

        /**
         * midTable required live check
         */
        onRequiredCheckTable : function() {            
            //if(this.validator.validate(this.byId("midTable"))){
                this.validator.clearValueState(this.byId("midTable"));
           // }
        },
        /**
         * Clear Validate
         * @private 
         */
        _onPageClearValidate: function(){
            this.validator.clearValueState(this.byId("page"));
            this.validator.clearValueState(this.byId("midTable"));
        },
        

        /**
         * 필수값 체크
         * @private
         */
        _checkData : function(){
            console.log("call function ==================== _checkData : function(){====================");
            var oUi = this.getModel("oUi"),
                bValueCheckFlag = true;

            var oTable = this.getView().byId("midTable");

            for (var idx = 0; idx < oTable.getItems().length; idx++) {
                
                var items = oTable.getItems()[idx];

                //debugger;

                var imputReqm_quantity = items.getCells()[4].mAggregations.items[0].mProperties.value,
                    comboboxUse_flag = items.getCells()[5].mAggregations.items[0].mProperties.selectedKey;

                if(imputReqm_quantity.length<1){
                    this._showMessageBox(
                        "소요량 확인",
                        "소요량을 입력 하여 주십시요.",
                        this._m.messageType.Warning,
                        function(){return;}
                    );
                    bValueCheckFlag  =false;
                    return false;
                }

                if(comboboxUse_flag.length<1){
                    this._showMessageBox(
                        "Use Flag 확인",
                        "Use Flag 를 선택하여 주십시요.",
                        function(){return;}
                    );
                    bValueCheckFlag  =false;
                    return false;
                    
                }
            }
            return bValueCheckFlag;

        },
        /**
          * 버튼 액션 저장
          */
        onSaveAction : function(){
            console.log("call function ==================== onMidSave ====================");
            // this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
             var oUi = this.getModel("oUi");
             var bCreateFlag = oUi.getProperty("/createMode");
 
             if(!this._onPageValidate()){
                return;
             }

            if(!this._checkData()){
                return false;
            }

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
            //this._findFragmentControlId(this._m.fragementId.change, "midTable"),
            var oTable = this.getView().byId("midTable"),
                oModel = this.getOwnerComponent().getModel(),
                midList = this.getOwnerComponent().getModel("midList"),
                oUiData = this.getModel("oUiData"),
                _deleteItem = this.getModel("_deleteItem"),                
                comboBox_pcst_currency_unit=this.getView().byId("comboBox_pcst_currency_unit").getSelectedKey();

            var updateItem = 0;
            var createItem = 0;
            var deleteItem = 0;

            for (var idx = 0; idx < oTable.getItems().length; idx++) {

                var items = oTable.getItems()[idx],
                    itemMode = items.getCells()[0].mProperties.text,
                    mi_material_code = items.getCells()[1].mProperties.text,
                    imputReqm_quantity = items.getCells()[4].mAggregations.items[0].mProperties.value,
                    comboboxUse_flag = items.getCells()[5].mAggregations.items[0].mProperties.selectedKey,
                    odataMode= this._m.odataMode.no;

                //수정사항 신규 자재 등록일때. 자재코드 및 정보를 추가 한다. 
                
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

                            // // Delete
                            // //기존데이타 삭제
                            // if(itemMode == this._m.itemMode.delete && odataMode == this._m.odataMode.yes)
                            // {
                            //     if(this._fnDeleteItem(oModel, midList.oData[i])){
                            //         deleteItem++;
                            //     }
                            // }
                            
                        }                        
                                          
                    }          
               
                } //for end
            } //for end

            /**delete midTable (MIMaterialCodeBOMManagement) table item  */
            var _deleteItemOdata = _deleteItem.getProperty("/oData");
                            
            //table item delete action _deleteItem odata push data
            if(_deleteItemOdata.length>0){
                var oDeleteMIMaterialCodeBOMManagementKey, oDeleteMIMaterialCodeBOMManagementPath;
                
                //적재 할때 신규는 담지 않는다. (수정이나 신규시 아이템 추가는 바로 삭제)
                for(var i=0;i<_deleteItemOdata.length;i++){
                    oDeleteMIMaterialCodeBOMManagementKey = {
                        tenant_id : _deleteItemOdata[i].tenant_id,
                        company_code : _deleteItemOdata[i].company_code,
                        org_type_code : _deleteItemOdata[i].org_type_code,
                        org_code: _deleteItemOdata[i].org_code,
                        mi_material_code: _deleteItemOdata[i].mi_material_code,
                        language_code:  _deleteItemOdata[i].language_code
                    }
                 
                    oDeleteMIMaterialCodeBOMManagementPath = oModel.createKey(
                            this._m.serviceName.mIMaterialCodeText,
                            oDeleteMIMaterialCodeBOMManagementKey
                    );

                    oModel.remove(
                        oDeleteMIMaterialCodeBOMManagementPath, 
                        { 
                            groupId: this._m.groupID 
                        }
                    );
                    deleteItem++;    
                }
            }

            console.log("createItem==================================", createItem);
            console.log("updateItem =================================", updateItem);
            console.log("deleteItem =================================", deleteItem);

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
                // this._onMidServiceRead();
                // this._fnSetReadMode();
            }           
        },

        /*
        * MaterialDetail.fragment  에서 값을 받아 테이블에 등록 처리 
         */
        _fnMarteialCreateItem : function (oModel, oData) {
            console.log("_fnMarteialCreateItem");
            var createItemParameters = {
                    "tenant_id": oData.tenant_id,
                    "company_code": oData.company_code,
                    "org_type_code":  oData.org_type_code,
                    "org_code": oData.org_code,
                    "material_code": oData.material_code,
                    "material_desc": oData.material_desc,
                    "supplier_code": oData.supplier_code,
                    "supplier_local_name": oData.supplier_local_name,
                    "supplier_english_name": oData.supplier_english_name,
                    "base_quantity": oData.base_quantity,
                    "processing_cost": oData.processing_cost,
                    "pcst_currency_unit": oData.pcst_currency_unit,
                    "mi_material_code": oData.mi_material_code,
                    "mi_material_name": oData.mi_material_name,
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
                    "system_update_dtm": new Date(),
                    "itemMode" : "C",
                    "odataMode" : "N"                      
            };
            
            //midTable 모델에 추가. 

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
                    "material_desc": oData.material_desc,
                    "supplier_code": oData.supplier_code,
                    "supplier_local_name": oData.supplier_local_name,
                    "supplier_english_name": oData.supplier_english_name,
                    "base_quantity": oData.base_quantity,
                    "processing_cost": oData.processing_cost,
                    "pcst_currency_unit": oData.pcst_currency_unit,
                    "mi_material_code": oData.mi_material_code,
                    "mi_material_name": oData.mi_material_name,
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
                "mi_material_name" : oData.mi_material_name,
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
                
                this.getView().busy(true);
				var oModel = this.getView().getModel();
				oModel.submitChanges({
		      		groupId: "deleteGroup", 
		        	success: this._handleDeleteSuccess.bind(this),
		        	error: this._handleDeleteError.bind(this)
                 });
                 this.getView().busy(false);
            } 

        },

        _handleCreateError: function (oError) {
            this._showMessageBox(
                "저장 실패",
                "저장 실패 하였습니다.",
                this._m.messageType.Error,
                function(){return;}
            );
        },

        _handleUpdateSuccess: function (oData) {
            MessageBox.show("수정에 성공 하였습니다.", {
                icon: MessageBox.Icon.SUCCESS,
                title: "수정 성공",
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });
        },
        
        _handleUpdateError: function (oError) {
            this._showMessageBox(
                "수정 실패",
                "수정 실패 하였습니다.",
                this._m.messageType.Error,
                function(){return;}
            );
        },
        /**
         * 삭제 성공
         * @param {ODATA} oData 
         * @private
         */
        _handleDeleteSuccess: function (oData) {
            var that = this;
            MessageBox.show("삭제가 성공 하였습니다.", {
                icon: MessageBox.Icon.SUCCESS,
                title: "삭제 성공.",
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });
        },

        /**
         * 삭제실패
         * @param {Event} oError 
         * @private
         */
        _handleDeleteError: function (oError) {
            this._showMessageBox(
                "삭제 실패",
                "삭제 실패 하였습니다.",
                this._m.messageType.Error,
                function(){return;}
            );
        }        
           
    });
});