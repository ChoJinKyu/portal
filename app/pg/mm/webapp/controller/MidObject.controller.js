/**
* 1. 화면 레이아웃 추가 작성
* 2. 데이타 로드 및 테이블 모두 확인
* 3. 보기 페이지 완성
* 4. 수정 페이지 테이블 컨트롤 및 Fragment 화면 컨트롤 
* 5. Fragment 에 대한 리스트 및 연동 작업 
* 6. 데이타 프로세스 진행 
* 7. 테스트 데이타 삭제
* 8. tenant_id org_code등은 등록화면에서 선택해야한다. 
* 9. 기획서 점검 
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

		formatter: (function(){
			return {
				toYesNo: function(oData){
					return oData === true ? "YES" : "NO"
				},
			}
        })(),

        dataPath : "resources",
        _m : {
            page : "page",
            fragementPath : {
                create : "pg.mm.view.Create",
                change : "pg.mm.view.Change",
                display : "pg.mm.view.Display",
                materialDetail : "pg.mm.view.MaterialDetail",
                materialDialog : "pg.mm.view.MaterialDialog",
                supplierDialog : "pg.mm.view.SupplierDialog"
            },            
            fragementId : {
                create : "Create_ID",
                change : "Change_ID",
                display : "Display_ID",
                materialDetail : "MaterialDetail_ID",
                materialDialog : "MaterialDialog_ID",
                supplierDialog : "SupplierDialog_ID"
            },
            input : {
                inputMultiInput : "multiInput",
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
            filter : {   //마스터에서 전달 받음값
                tenant_id : "L2100",
                company_code : "*",
                org_type_code : "BU",
                org_code : "BIZ00100",
                material_code : "ERCA00006AA",
                supplier_code : "KR00008",
                mi_material_code : "COP-001-01"
            },
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService",
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
            midObjectData : { //mid 페이지에서 새롭게 부여받은값
                tenant_id: "L2100",
                company_code: "*",
                org_type_code: "BU",
                org_code: "BIZ00100",
                material_code: "ERCA00006AA", //자재코드 (시황자재코드와 다름 값이 있다면 View Mode)
                create_user_id: "Admin",
                system_create_dtm: "Admin"
            },
            processMode : {
                create : "C", //신규, 
                show : "R",   //보기
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
            }
        },
        _sso : {
            user : {
                id : "Admin",
                name : "Hong Gil-dong"
            },
            dept : {
                team_name : "구매팀",
                team_code : "0000",
                tenant_id : "L2100",
                tenant_name : "LG 화확"  
            }          
        },

        /**
         * Mode : Dev, Qa, Prd  
         * @private
         */
        _controllerMode : function (sMode) {
            
            if(sMode == "Dev"){
                console.log("Dev =======================================")
                /**
                 * Note 사용자 세션이나 정보에 다음값이 셋팅 되어 있다는 가정 Test
                 * Data를 전달 받았을때에는 변경한다. 
                 */
                var oUiData = new JSONModel({
                    tenant_name: "LG화학",
                    create: "Admin",
                    createdata: "2020-12-02",
                    material_code :"",
                    material_description :"",
                    supplier_code :"",
                    supplier_local_name :"",
                    processing_cost :"",
                    pcst_currency_unit :""               
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

            
            //xml 과의 bindingpath를 사용하는 모델 생성 

            //pageMode C Create, V View, E Edit
            var oUi = new JSONModel({
                busy: true,
                delay: 0,
                pageMode: this._m.processMode.show
            });

            this.setModel(oUi, "oUi");

            //개발일때. 
            this._controllerMode("Dev");
            

            console.groupEnd();
        },

        isValNull: function (p_val) {
            if (!p_val || p_val == "" || p_val == null) {
                return true
            } else {
                return false;
            }
        },

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

        _showFormFragment: function (oProcessMode) {
            console.group("_showFormFragment");

            var oPage = this.byId(this._m.page);

            this.getView().setBusy(true);

            oPage.removeAllContent();

            oPage.insertContent(this._getFormFragment(oProcessMode));

            this.getView().setBusy(false);

            console.groupEnd();
        },
       
		handleValueHelpMaterial: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			// create value help dialog
			if (!this._valueHelpMaterialDialog) {

                this._valueHelpMaterialDialog = sap.ui.xmlfragment(this._m.fragementId.materialDialog, this._m.fragementPath.materialDialog,this);
                this.getView().addDependent(this._valueHelpMaterialDialog);

			}                
			this._openValueHelpMaterialDialog();
		},

		_openValueHelpMaterialDialog: function () {
			// open value help dialog filtered by the input value
			this._valueHelpMaterialDialog.open();
		},

		_handleValueHelpMaterialSearch: function (evt) {

		},

		_handleValueHelpMaterialClose: function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems"),
				oMultiInput = this.byId(this._m.input.inputMultiInput);

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

            var oTableBinding = this._midTable.getBinding("items"),
                midObjectData = this.getModel("midObjectData");

            // oTableBinding.filter([                
            //     new Filter("tenant_id", FilterOperator.EQ, midObjectData.getProperty("/tenant_id")),
            //     new Filter("company_code", FilterOperator.EQ, midObjectData.getProperty("/company_code")),
            //     new Filter("org_type_code", FilterOperator.EQ, midObjectData.getProperty("/org_type_code")),
            //     new Filter("org_code", FilterOperator.EQ, midObjectData.getProperty("/org_code")),
            //     new Filter("mi_material_code", FilterOperator.EQ, midObjectData.getProperty("/mi_material_code"))
            // ]);
        },


        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        test_onRoutedThisPage : function() {

            console.group("TEST[test_onRoutedThisPage]  _onRoutedThisPage");

            /*
            tenant_name 이름을 가져오기위한 필터 master 페이지에서 전달 받은 파라메터를 할당한다. 
            Note : 파라메터 전달 전 개별 페이지로 테스트
            oArgs = oEvent.getParameter("arguments")
            수정모드와 신규 모드 모두  
            선택할수 있는 콤보박스 노출과 저장시
            */
            var oUiData = this.getModel("oUiData"),
                oUi = this.getModel("oUi"),
                oView = this.getView(),
                that = this,
                oModel = this.getOwnerComponent().getModel(),
                newTenant_id, 
                oTenant_id;

            // oTenant_id = "new"; //전달 받은 값이 신규라면. 

            //버튼 비활성화
            // this.getView().byId("buttonMidEdit").setEnabled(true);
            // this.getView().byId("buttonMidDelete").setEnabled(true);
            // this.getView().byId("buttonSave").setEnabled(true);

           //View Test
            var oProcessMode = this._m.processMode.show;

            //oArgs tenant_id 를 할당하는 영역.
            //this._m.midObjectData.tenant_id = oArgs.tenant_id;

            /* Note : oEvent.getParameter값을 필터에 등록해준다. 
            var this_m.filter.tenant_id = oArgs tenant_id;
            var this_m.filter.company_code = oArgs company_code;
            var this_m.filter.org_type_code = oArgs org_type_code;
            var this_m.filter.org_code = oArgs org_code;
            var this_m.filter.material_code = oArgs material_code;
            var this_m.filter.supplier_code = oArgs supplier_code;
            var this_m.filter.mi_material_code = oArgs mi_material_code;
            */

            // //신규
            // if(oTenant_id.length > 4){
            //     oProcessMode = this._m.processMode.create;
            // } else {
            //     oProcessMode = this._m.processMode.show;
            // }

            //var oFragmentMode = this._m.pageMode.show;


            //기본 보기 화면을 할당 
            var oMode = this._m.processMode.show;
            
            // if (oArgs.tenant_id == "new") {
            if (this._m.filter.material_code == "new") {
                //신규등록일때 tenant_id, org_code, org_type 를 선택해야한다. 
                console.log("new item===============");

                //신규라면 
                oMode = this._m.processMode.create;
                oUi.setProperty("/pageMode", this._m.processMode.create);

                this._m.midObjectView.pageMode = oMode;
                this._m.midObjectData.tenant_id =  oTenant_id;
                //버튼 감추기 
                // this.getView().byId(this._m.buton.buttonMidEdit).setEnabled(false);
                // this.getView().byId(this._m.buton.buttonMidDelete).setEnabled(false);

            } else if(this._m.filter.material_code.length>0){

                //보기 모드(수정화면 진입전 보기화면을 반드시 거쳐야 한다.)                
                oMode = this._m.processMode.show;
                oUi.setProperty("/pageMode", this._m.processMode.oMode);

                //초기 display
                // this.getView().byId("buttonMidEdit").setEnabled(true);
                // this.getView().byId("buttonMidEdit").setText(this._m.pageModeText.edit);
                // this.getView().byId("buttonMidDelete").setEnabled(true);
                // this.getView().byId("buttonSave").setEnabled(true);
             } 
             else {

            //     oMode = this._m.processMode.edit;
            //     //수정모드
            //     this._m.midObjectView.pageMode = oMode;

            //     this.getView().byId("buttonMidEdit").setEnabled(true);
            //     this.getView().byId("buttonMidEdit").setText(this._m.pageModeText.show);
            //     this.getView().byId("buttonMidDelete").setEnabled(false);
            //     this.getView().byId("buttonSave").setEnabled(false);
             }

            that._onPageMode(oMode);

            this.getView().setBusy(true);

            //자재정보 MIMaterialCodeBOMManagement (master page 뷰와 같음)
            var oMidList = new JSONModel();
            var sServiceUrl = this._m.serviceName.mIMaterialCodeBOMManagement;
            var aFilters = [
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
                    }

                    oMidList.setData(reponse.data.results);

                    for(var i=0;i<reponse.data.results.length;i++){
                       oMidList.oData[i].itemMode = that._m.itemMode.read;
                       oMidList.oData[i].odataMode = that._m.odataMode.yes;
                    }
                    that.getOwnerComponent().setModel(oMidList, "midList");
                }
            });


            //관리조직 이름 가져오기 
            sServiceUrl = this._m.serviceName.orgTenantView;
            var bFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id)
            ];
            oModel.read(sServiceUrl, {
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

            //시황자재 선택시 사용되는 리스트  
            // sServiceUrl = this._m.serviceName.orgTenantView;
            // var bFilters = [
            //     new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id)
            // ];
            // oModel.read(sServiceUrl, {
            //     async: false,
            //     filters: bFilters,
            //     success: function (rData, reponse) {

            //         console.log("json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
            //         var oData = reponse.data.results[0];

            //         if(oData.length>0){
            //             oUiData.setProperty("/tenant_name", reponse.data.results[0].tenant_name);
            //         }
            //     }
            // });

            this.getView().setBusy(false);
            
            console.groupEnd();            
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            console.group("[mid] _onRoutedThisPage");

            var oArgs = oEvent.getParameter("arguments"),
                midObjectData = this.getModel("midObjectData"),
                midObjectView = this.getModel("midObjectView"),
                oView = this.getView(),
                that = this;

            var oModel = this.getOwnerComponent().getModel();

            //보기 화면과 수정화면에서 발생할수 있는 오류 방지를 위해 강제 셋팅             
            // midObjectData.setProperty("/category_code", "");
            // midObjectData.setProperty("/mi_material_code", "");

             var aFilters = [
                 new Filter("tenant_id", FilterOperator.EQ, oArgs.tenant_id)
             ];


            //버튼 비활성화
            // this.getView().byId("buttonMidEdit").setEnabled(true);
            // this.getView().byId("buttonMidDelete").setEnabled(true);
            // this.getView().byId("buttonSave").setEnabled(true);

            //바쁜척..
            this.getView().setBusy(true);
            
            //신규 등록 
            var bNew = false;
            if (oArgs.tenant_id == "new") {
                console.log("new item===============");
                midObjectView.setProperty("/pageMode", "C");
                bNew = true;

                midObjectData.setProperty("/tenant_id", oArgs.tenant_id);

                //버튼 감추기 
                this.getView().byId("buttonMidEdit").setEnabled(false);
                this.getView().byId("buttonMidDelete").setEnabled(false);

                that._onPageMode(true);

                var oData = {
                    text: null,
                    number: 0,
                    date: null
                };
                var jsonoModel = new JSONModel();
                    jsonoModel.setData(oData);
                this.getView().setModel(jsonoModel);

            } else {

                midObjectView.setProperty("/pageMode", "E");

                //초기 display
                // this.getView().byId("buttonMidEdit").setEnabled(true);
                // this.getView().byId("buttonMidEdit").setText("Edit");
                // this.getView().byId("buttonMidDelete").setEnabled(false);
                // this.getView().byId("buttonSave").setEnabled(false);

                that._onPageMode(false);
            }
            var sServiceUrl = "/MIMaterialCodeList";

            var addButtonEnabled = false;
            var deleteButtonEnabled = false;

            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {

                    console.log("MIMaterialCodeList to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    var oData = reponse.data.results[0];

                    //신규가 아닐때만 진행
                    if (!bNew) {

                        midObjectData.setData(reponse.data.results[0]);
                        that.setModel(midObjectData, "midObjectData");
                    }
                    //showsss
                }
            });

            var jCodeText = new JSONModel();
            //var jModel = this.getOwnerComponent().getModel("jdata");

            sServiceUrl = "/MIMaterialCodeText";
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {
                    console.log("MIMaterialCodeText to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    //"http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeText(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='LED-001-01',language_code='AA')"
                    var arrData = [];
                    jCodeText.setData(reponse.data.results);


                    for(var i=0;i<reponse.data.results.length;i++){
                       jCodeText.oData[i].op_mode = "R";
                    }
                    that.getModel("midObjectView").setProperty("textDataLength", reponse.data.results.length)
                    that.getOwnerComponent().setModel(jCodeText, "jCodeText");
                }
            });

            var jLanguageView = new JSONModel();
            var lFilters = [
                new Filter("tenant_id", FilterOperator.EQ, oArgs.tenant_id)
            ];
            sServiceUrl = "/LanguageView";
            oModel.read(sServiceUrl, {
                async: false,
                filters: lFilters,
                success: function (rData, reponse) {
                    console.log("LanguageView to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    jLanguageView.setData(reponse.data.results);
                    that.getOwnerComponent().setModel(jLanguageView, "jLanguageView");
                    that.getModel("midObjectView").setProperty("languageLength", reponse.data.results.length)
                }
            });


            var jMICategoryView = new JSONModel();
            var lFilters = [
                new Filter("tenant_id", FilterOperator.EQ, oArgs.tenant_id),
                new Filter("company_code", FilterOperator.EQ, oArgs.company_code),
                new Filter("org_type_code", FilterOperator.EQ, oArgs.org_type_code),
                new Filter("org_code", FilterOperator.EQ, oArgs.org_code)
            ];
            sServiceUrl = "/MICategoryView";
            oModel.read(sServiceUrl, {
                async: false,
                filters: lFilters,
                success: function (rData, reponse) {
                    console.log("MICategoryView to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    jMICategoryView.setData(reponse.data.results);
                    that.getOwnerComponent().setModel(jMICategoryView, "jMICategoryView");
                }
            });

            this.getView().setBusy(false);

            console.groupEnd();
        },

        /**
         * Show, Edit 버튼 토글 
         * @public
         */
        onEdit: function () {
            var oView = this.getView(),            
                oUi = this.getModel("oUi");
            
            //보기화면
            if (this._m.processMode.show == oUi.pageMode) {

                this._onPageMode(this._m.processMode.show);

                // oView.byId("buttonMidEdit").setEnabled(true);
                // oView.byId("buttonMidEdit").setText(this._m.pageModeText.edit);
                // oView.byId("buttonMidDelete").setEnabled(true);
                // oView.byId("buttonSave").setEnabled(true);

            } else {
                this._onPageMode(this._m.processMode.edit);

                // oView.byId("buttonMidEdit").setEnabled(true);
                // oView.byId("buttonMidEdit").setText(this._m.pageModeText.show);
                // oView.byId("buttonMidDelete").setEnabled(false);
                // oView.byId("buttonSave").setEnabled(false);

            }
        },

        /**
         * 초기 실행과 버튼이벤트 구분을 위한 function
         * @param {*}   this._m.processMode
         */
        _onPageMode: function (pageMode) {

            if (pageMode==this._m.processMode.show) {
                this._toShowMode();            
            }
            else if (pageMode==this._m.processMode.edit) {
                this._toEditMode();
            }
            else if (pageMode==this._m.processMode.create) {
                this._toCreateMode();
            }
        },

        /**
         * 등록화면 처리
         */
        _toCreateMode : function () {
            console.group("_toCreateMode");
            this._showFormFragment(this._m.processMode.create);
            console.groupEnd();
        },
        /**
         * 수정화면 처리
         * @private
         */
        _toEditMode: function () {
            console.group("_toEditMode");
            this._showFormFragment(this._m.processMode.edit);

            // //오브젝트 셋팅
            // var comboBoxCurrencyUnit = sap.ui.core.Fragment.byId(this._m.fragementId.display, "comboBoxCurrencyUnit");
            // var oBindingComboBox = comboBoxCurrencyUnit.getBinding("items");

            // var aFiltersComboBox = [];
            // var oFilterComboBox = new Filter("tenant_id", "EQ", this._m.filter.tenant_id);
            // aFiltersComboBox.push(oFilterComboBox);
            // oBindingComboBox.filter(aFiltersComboBox);  
          
            console.groupEnd();
        },

        /**
         * 보기화면 처리
         * @private
         */
        _toShowMode: function () {
            console.group("_toShowMode");
            this._showFormFragment(this._m.processMode.show);
            console.groupEnd();
        },

        /**
         * MIMaterialCodeText Row Item 삭제 Json Verson
         * @public
         */
        onMidTableDelete: function (oEvent) {
            console.group("onMidTableDelete");

            var oModel = this.getOwnerComponent().getModel("jCodeText"),
                oTable = sap.ui.core.Fragment.byId("Change_id", "midTableChange"),
                that = this;

            var oSelected = oTable.getSelectedContexts();

            //Edit 작업시 진행할 삭제된 행 정보를 담는다. 
            var deleteOModel = new JSONModel();
            deleteOModel = {
                item: [],
                flag: false
            };

            if (oSelected.length > 0) {

                for (var i = 0; i < oSelected.length; i++) {
                    var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));

                    /*행을 바로 삭제한다. sapui5.ui.table 사용시 rows 표현 다양. */
                    //property

                    //신규 등록했다가 삭제 하는거라면. 
                    if(oModel.oData[idx].op_mode=="C"){

                        //op_mode를 표시하는거라면 
                        //oModel.oData[idx].op_mode="D";
                        oModel.oData.splice(idx, 1);

                    }else{

                        //등록되어 있는 항목 삭제라면 
                        //모드 표현시 사용
                        oModel.oData[idx].op_mode="D";
                 
                    }

                    oModel.refresh();
                }

                this.getOwnerComponent().setModel(deleteOModel, "deleteOModel");

                that.getView().setBusy(false);
                oTable.removeSelections();
                oModel.refresh(true);

            } else {

                MessageToast.show("삭제가 취소 되었습니다.");
                // MessageBox.show(this.errorDeleteRowChooice, {
                //     icon: MessageBox.Icon.ERROR,
                //     title: this.errorCheckChangeCopyRowTitle,
                //     actions: [MessageBox.Action.OK],
                //     styleClass: "sapUiSizeCompact"
                // });
            }

            console.groupEnd();
        },

        /**
          * 행 삭제 Odata v2 Verson
          * Note :행삭제
          */
        xonMidTableDelete: function () {
            console.group("[mid] onMidTableDelete");

            var oModel = this.getOwnerComponent().getModel("jCodeText"),
                oView = this.getView(),
                oTable = oView.byId("midTableChange"),
                oData = oModel.getData(),
                oPath,
                that = this;

            var oSelected = oTable.getSelectedContexts();
            if (oSelected.length > 0) {

                MessageBox.confirm("선택한 항목을 삭제 하시겠습니까?", {
                    title: "삭제 확인",
                    onClose: this._deleteAction.bind(this),
                    actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                    textDirection: sap.ui.core.TextDirection.Inherit
                });

            }
            console.groupEnd();
        },

        /**
          * table 삭제 액션 Odata v2 Version 
          * @param {sap.m.MessageBox.Action} oAction 
          */
        _deleteAction: function (oAction) {
            console.group("_deleteAction");
            var oView = this.getView(),
                oTable = oView.byId("midTableChange");

            if (oAction === sap.m.MessageBox.Action.DELETE) {
                oTable.getSelectedItems().forEach(function (oItem) {
                    var sPath = oItem.getBindingContextPath();

                    var mParameters = { "groupId": "deleteGroup" };
                    oItem.getBindingContext().getModel().remove(sPath, mParameters);
                });

                var oModel = this.getView().getModel();
                oModel.submitChanges({
                    groupId: "deleteGroup",
                    success: this._handleDeleteSuccess,
                    error: this._handleDeleteError
                });
            }
            console.groupEnd();
        },

        onMaterialDetail : function () {
            console.log("call funtion onMaterialDetail");

		    //var sInputValue = oEvent.getSource().getValue();

			if (!this._valueHelpMaterialDetail) {
                this._valueHelpMaterialDetail = sap.ui.xmlfragment(this._m.fragementId.materialDetail, this._m.fragementPath.materialDetail, this);
                this.getView().addDependent(this._valueHelpMaterialDetail);
			}                
			this._openValueHelpMaterialDetail();
        },

        // 작업중 : detail fragment 수정해야함
        _openValueHelpMaterialDetail : function () {
            this._valueHelpMaterialDetail.open();
        },

        /**
         * MIMaterialCodeText create
         * Note : 언어 추가  midTable 행을 추가 저장한다. 
         * 이미 저장되어 있는 키를 확인하여 업데이트 한다. 
         */
        onMidTableCreate: function () {
            console.group("onMidTableCreate");

            var midObjectData = this.getModel("midObjectData"),
                midObjectView = this.getModel("midObjectView"),
                jLanguageView = this.getModel("jLanguageView"),
                oTable = sap.ui.core.Fragment.byId("Change_id", "midTableChange"),
                oModel = this.getOwnerComponent().getModel("jCodeText");

            var oMi_material_code = midObjectData.getProperty("/mi_material_code");
            
            var bFlag = false;
            if(oTable.getItems().length<jLanguageView.oData.length){
                bFlag = true;
            }

            if(!bFlag){
                MessageBox.show("더이상 추가 할수 없습니다.", {
                    icon: MessageBox.Icon.WARNING,
                    title: "언어 확인",
                    actions: [MessageBox.Action.OK],
                    styleClass: "sapUiSizeCompact"
                });  

                return;
            }

            //신규
            var mode = "U";
            if (!midObjectView.getProperty("/pageMode")) {

                //입력값을 사용한다. 
                oMi_material_code = sap.ui.core.Fragment.byId("Change_id", "inputMaterialCode");
                mode = "C";
            }

            var items = {
                "tenant_id": midObjectData.getProperty("/tenant_id"),
                "company_code": midObjectData.getProperty("/company_code"),
                "org_type_code": midObjectData.getProperty("/org_type_code"),
                "org_code": midObjectData.getProperty("/org_code"),
                "mi_material_code": oMi_material_code,
                "language_code": "",
                "mi_material_code_name": "",
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": "Admin",
                "update_user_id": "Admin",
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date(),
                "op_mode" : "C"
            };

            oModel.oData.push(items);
            oModel.refresh(true);

            console.groupEnd();
        },


       
        /**
         * Exit
         * @private
         */
        _onExit: function () {

            return;
            for (var sPropertyName in this._formFragments) {
                if (!this._formFragments.hasOwnProperty(sPropertyName) || this._formFragments[sPropertyName] == null) {
                    return;
                }
                 var midObjectData = this.getModel("midObjectData");
                 //보기 화면과 수정화면에서 발생할수 있는 오류 방지를 위해 강제 셋팅
                midObjectData.setProperty("/category_code", "");
                midObjectData.setProperty("/mi_material_code", "");

                this._formFragments[sPropertyName].destroy();
                this._formFragments[sPropertyName] = null;
            }
        },


        _handleCreateSuccess: function (oData) {
            var that = this;
            MessageBox.show("저장 확인", {
                icon: MessageBox.Icon.SUCCESS,
                title: "저장에 성공 하였습니다.",
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
            //var fCategory = oEvent.oSource.getItems()[0].getCells()[2].mProperties.text;

            // entity MI_Material_Cost_Info_View {
            //     key tenant_id             : String(40)    @title : '회사코드';
            //     key company_code          : String(240)   @title : '법인코드';
            //     key org_type_code         : String(40)    @title : '조직유형코드';
            //     key org_code              : String(240)   @title : '조직코드';
            //     key mi_material_code      : String(30)    @title : '시황자재코드';
            //         mi_material_code_name : String(10)    @title : '시황자재코드명';
            //     key currency_unit         : Date          @title : '통화단위';
            //     key quantity_unit         : Decimal(17, 3)@title : '수량단위';
            //     key exchange              : Decimal(17, 3)@title : '거래소';
            //     key termsdelv             : Decimal(17, 3)@title : '인도조건';
            //     key mi_date               : Decimal(17, 3)@title : '시황일자';
            //         amount                : Decimal(17, 3)@title : '금액';
            // }

            //Note 확인 통화 단위 이상함 
            
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
         * 시황자재 > 가격정보
         * @param {Event} oEvent  아이템 선택
         */
        onSelectedRightTableItem : function (oEvent) {
            console.log("onSelectedRightTableItem");

            //선택된 시황자재를 midtable에 추가한다. 
            this.onMidListItemAdd(oEvent);

            this.onMaterialDetail_close();
        },
        /**
         * Note : 테이블을 확인할수 없으 므로 임시 
         * 시황재재 선택 및 가격정보 선택 페이지 close
         * @public
         */
        onMaterialDetail_close : function() {
            this._valueHelpMaterialDetail.close();
        },

        /**
         * 시황자재 리스트 아이템 추가. 
         * @param {Event} oEvent 
         */
        onMidListItemAdd : function(oEvent){
            
            var oMidList = this.getOwnerComponent().getModel("midList");
               
            var currency_unit = oEvent.oSource.getItems()[0].getCells()[0].mProperties.text,
                quantity_unit = oEvent.oSource.getItems()[0].getCells()[1].mProperties.text,
                exchange = oEvent.oSource.getItems()[0].getCells()[1].mProperties.text,
                termsdelv = oEvent.oSource.getItems()[0].getCells()[1].mProperties.text,
                mi_date = oEvent.oSource.getItems()[0].getCells()[1].mProperties.text,
                amount = oEvent.oSource.getItems()[0].getCells()[1].mProperties.text;

            //CostinformationView에 나머지 MIMaterialCodeBOMManagement 동일한 필요 컬럼이 있어야 한다.
            var items = {
                "tenant_id": this._m.filter.tenant_id,
                "company_code": this._m.filter.company_code,
                "org_type_code": this._m.filter.org_type_code,
                "org_code": this._m.filter.org_code,
                "material_code": this._m.filter.material_code,
                "material_description": "니켈",
                "supplier_code": "KR00008",
                "supplier_local_name": "이지금",
                "supplier_english_name": "IU",
                "base_quantity": "1",
                "processing_cost": "45000",
                "pcst_currency_unit": "JPY",
                "mi_material_code": "COP-001-01",
                "mi_material_code_name": "니켈1",
                "category_code": "Non-Ferrous Metal",
                "category_name": "비철금속",
                "reqm_quantity_unit": "MT",
                "reqm_quantity": "20",
                "currency_unit": "USD", //currency_unit
                "mi_base_reqm_quantity": "1",
                "quantity_unit": "MT", //quantity_unit
                "exchange": "Platts", //exchange
                "termsdelv": "FOB KOR", //termsdelv
                "use_flag": false,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": this._sso.user.id,
                "update_user_id": this._sso.user.id,
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date()
            };

            oMidList.oData.push(items);
            oMidList.refresh(true);
        },

        /**
         * Odata Create, Update, Delete  ============================================================ 
         */
        /**
         * MESSAGE
         * @param {String} title 
         * @param {String} content 
         * @param {String} type 
         * @param {function} closeEvent 
         */
        _showMessageBox : function(title, content, type, closeEvent){
            MessageBox.show(content, {
                icon: type,
                title: title,
                actions: [MessageBox.Action.OK],
                styleClass: "sapUiSizeCompact",
                onClose: function (sButton) {
                    //closeEvent
                },
            });
        },
         /**
          * 저장
          */
         onMidSave: function () {

            console.log("call function ==================== onMidSave ====================");

            // var validator = new Validator();
            // validator.validate(this.byId("page"));
			//this.getView().getModel().setUseBatch(true);
			this.getView().getModel().setDeferredGroups(["pgGroup","deleteGroup"]);
            
            this.getView().getModel().setChangeGroups({
			  "MIMaterialCodeBOMManagement": {
			    groupId: "pgGroup",
			    changeSetId: "pgGroup"
              }
            });            
           

           // this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
            
            
            var oTable = this._findFragmentControlId(this._m.fragementId.change, "midTableChange"),
                comboBoxCurrencyUnit=this._findFragmentControlId(this._m.fragementId.change, "comboBoxCurrencyUnit").getSelectedKey(),
                oModel = this.getOwnerComponent().getModel(),
                oUiData = this.getModel("oUiData"),
                midList = this.getOwnerComponent().getModel("midList"),
                bFlag = false,
                SERVICENAME = this._m.serviceName.mIMaterialCodeBOMManagement,
                groupID = "pgGroup";
            
                oModel

            var updateItem = 0;
            for (var idx = 0; idx < oTable.getItems().length; idx++) {

                var items = oTable.getItems()[idx],
                    itemMode = items.getCells()[0].mProperties.text,
                    imputReqm_quantity = items.getCells()[4].mProperties.value,
                    comboboxUse_flag = items.getCells()[5].mProperties.selectedKey,
                    mi_material_code = items.getCells()[1].mProperties.text,
                    bFalse = true,
                    odataMode= this._m.odataMode.no,
                    uri="", sUrl="",
                    arrS=[];
              
                if(imputReqm_quantity.length<1){

                    this._showMessageBox(
                        "소요량 확인",
                        "소요량 을 입력 하여 주십시요.",
                        function(){return;}
                    );

                    bFalse = false;
                    return;
                }

                if(comboboxUse_flag.length<1){

                    this._showMessageBox(
                        "Use Flag 확인",
                        "Use Flag 를 선택하여 주십시요.",
                        function(){return;}
                    );


                    bFalse = false;
                    return;
                }

                if(!bFalse) return;

                //update
                //MIMaterialCodeBOMManagement
                // (tenant_id='L2100',company_code='%2A',
                // org_type_code='BU',org_code='BIZ00100',
                // material_code='ERCA00006AA',
                // supplier_code='KR00008',mi_material_code='COP-001-01')

                //midList.oData 아이템 정확성, odataMode 구함
                for(var i=0;i<midList.oData.length;i++){
                    if(midList.oData[i].mi_material_code == mi_material_code){
                        odataMode =  midList.oData[i].odataMode;
                        // uri = midList.oData[i].__metadata.uri;                       
                        // arrS = uri.split(this._m.serviceName.marketIntelligenceService),
                        // sUrl = arrS[1];

                        //update 시 not null 다 넣어주어야 함.
                        //한번에 안되면 하나씩 추가하면서 하는게 편함
                        //값을 넣지 않고 저장하면 null 인 곳은 null이 된다.
                        //key값은 key set 해서 저장한다.
                        if((itemMode==this._m.itemMode.read || itemMode==this._m.itemMode.update)
                        && odataMode == this._m.odataMode.yes)
                        {
                            var oKey = {
                                tenant_id : midList.oData[i].tenant_id,
                                company_code : midList.oData[i].company_code,
                                org_type_code : midList.oData[i].org_type_code,
                                org_code: midList.oData[i].org_code,
                                material_code : midList.oData[i].material_code,
                                supplier_code : midList.oData[i].supplier_code,
                                mi_material_code : midList.oData[i].mi_material_code
                            }

                            var uParameters = {
                                "pcst_currency_unit": comboBoxCurrencyUnit,
                                "mi_base_reqm_quantity" : midList.oData[i].mi_base_reqm_quantity,
                                "reqm_quantity" : midList.oData[i].reqm_quantity,
                                "reqm_quantity_unit" : midList.oData[i].reqm_quantity_unit,
                                "base_quantity" : midList.oData[i].base_quantity,
                                "supplier_local_name" : midList.oData[i].supplier_local_name,
                                "supplier_english_name" : midList.oData[i].supplier_english_name,
                                "mi_material_code_name" : midList.oData[i].mi_material_code_name,
                                "category_code" : midList.oData[i].category_code,
                                "category_name" : midList.oData[i].category_name,
                                "currency_unit" : midList.oData[i].currency_unit,
                                "exchange" : midList.oData[i].exchange,
                                "quantity_unit" : midList.oData[i].quantity_unit,
                                "processing_cost" : midList.oData[i].processing_cost,
                                "use_flag" : comboboxUse_flag == "true" ? true : false, 
                                "termsdelv" : midList.oData[i].termsdelv,
                                "local_create_dtm" : new Date(),
                                "local_update_dtm" : new Date()
                            }
    
                            //if(midList.oData[i].mi_material_code =="NIC-001-01"){

                            //    oModel.update("/MIMaterialCodeBOMManagement(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',material_code='ERCA00006AA',supplier_code='KR00008',mi_material_code='NIC-001-01')", 
                            //        uParameters,
                            //        { groupId: groupID }); 

                                var sCreatePath = oModel.createKey("/MIMaterialCodeBOMManagement", oKey);
                                oModel.update(sCreatePath, 
                                    uParameters, 
                                    { groupId: groupID } );

                                updateItem++;    
                            // }
                        }
                    
                    }            
               
                } //for end
            } //for end

            if( updateItem>0){
                console.log("updateItem", updateItem);
                //에러확인 최종에 실행
                oModel.setUseBatch(true);
                oModel.submitChanges({
                    groupId: groupID,
                    success: this._handleCreateSuccess.bind(this),
                    error: this._handleCreateError.bind(this)
                });

                oModel.refresh(); 
            }           
        }
    });
});
