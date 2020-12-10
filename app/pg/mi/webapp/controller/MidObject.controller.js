/**
 * 자재 체크 변경  onMiMaterialCodeCheck 현재 다섯자 이상부터 검사 
 * 메인페이지 Delete 추가. 
 * 
 * 신규등록시 빈값을 전달
 * _sso로 등록페이지 사용
 * mm 참고 action 수정
 * bom에서 사용하는 자재는 삭제 할수 없다.
 * MIMaterialCodeBOMManagement(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',material_code='ERCA00006AA',supplier_code='KR00008',mi_material_code='COP-001-01')
 */
sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/ValidatorUtil",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "./Validator",
    "sap/base/Log"
], function (BaseController, History, JSONModel, ValidatorUtil, ManagedModel, ManagedListModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, ValueState, Validator, Log) {
    "use strict";

    return BaseController.extend("pg.mi.controller.MidObject", {

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
            tableItem : {
                items : "items" //or rows
            },
            tableName : "midTable",
            filter : {  
                tenant_id : "",
                company_code : "",
                org_type_code : "",
                org_code : "",
                material_code : "",
                mi_material_code : ""
            },
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                orgTenantView : "/OrgTenantView", //관리조직 View
                mIMaterialCodeList : "/MIMaterialCodeList",
                mIMaterialCodeText : "/MIMaterialCodeText", 
                languageView : "/LanguageView",
                mICategoryHierarchyStructure : "/MICategoryHierarchyStructure",
                mIMaterialCodeBOMManagement : ",MIMaterialCodeBOMManagement"
            },
            processMode : {
                create : "C", //신규, 
                read : "　",   //보기
                edit : "E"    //수정
            },
            itemMode : {
                create : "C",  //테이블 아이템 신규등록 ㅂ -> 한자
                read : "　",    //테이블 아이템 기존 존재 데이타 로드 ㄱ->한자 공백
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
                Qa  : "QA",
                Prd : "PRD",

            }            
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
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            console.group("[midObjectPage] onInit");

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
                materialCheck : false,
                readMode : true,
                editMode : false,
                createMode : false
            });

            var _oUiData = new JSONModel({tenant_name:""});
            this.setModel(_oUiData, "_oUiData");
            this.setModel(oUi, "oUi");

            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);

            console.groupEnd();
        },

        //-----------------------------new
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

        _formFragments: {},

        /**
         * Fragment 설정
         * @param {String} sFragmentName 
         */
        _getFormFragment: function (sFragmentName) {
            console.log("_getFormFragment");
            //https://sapui5.netweaver.ondemand.com/#/entity/sap.ui.layout.form.SimpleForm/sample/sap.ui.layout.sample.SimpleForm354/code/Page.controller.js

            var oFormFragment = this._formFragments[sFragmentName];

            if (oFormFragment) {
                return oFormFragment;
            }

            oFormFragment = sap.ui.xmlfragment(sFragmentName + "_id", "pg.mi.view." + sFragmentName, this);

            this._formFragments[sFragmentName] = oFormFragment;

            return this._formFragments[sFragmentName];

            console.groupEnd();
        },

        _showFormFragment: function (sFragmentName) {
            console.group("_showFormFragment");

            var oPage = this.byId("page"),
                oUiData = this.getModel("oUiData"),
                oUi = this.getModel("oUi");

            this.getView().setBusy(true);

            oPage.removeAllContent();

            oPage.insertContent(this._getFormFragment(sFragmentName));

            this.getView().setBusy(false);

            console.groupEnd();
        },

        /**
         * 자재코드 확인
         * @public
         */
        onMaterialCodeCheck: function () {
            console.group("onMaterialCodeCheck");

            var oUiData = this.getModel("oUiData"),
                oUi = this.getModel("oUi"),
                oModel = this.getOwnerComponent().getModel(),
                sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
                input_mi_material_code = this.getView().byId("input_mi_material_code");

            var bMaterialCode = false;

            if (this._isNull(input_mi_material_code)) {

                this._showMessageToast("자재코드를 먼저 입력 하셔야 합니다.");

                return;
            }
            else {
                var oMIMaterialCodeListFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
                    new Filter("company_code", FilterOperator.EQ, this._m.filter.company_code),
                    new Filter("org_type_code", FilterOperator.EQ, this._m.filter.org_type_code),
                    new Filter("org_code", FilterOperator.EQ, this._m.filter.org_code),
                    new Filter("mi_material_code", FilterOperator.EQ, input_mi_material_code.getValue())
                ];

                var sServiceUrl = this._m.serviceName.mIMaterialCodeList;
                var itemLength = 0;
                oModel.read(sServiceUrl, {
                    async: false,
                    filters: oMIMaterialCodeListFilters,
                    success: function (rData, reponse) {

                        console.log(sServiceUrl + " - 자재건수 :" + reponse.data.results.length);

                        itemLength = reponse.data.results.length;

                        if (itemLength < 1) {
                            oUi.setProperty("/materialCheck", true);
                            input_mi_material_code.setValueState("Success");
                            input_mi_material_code.setValueStateText("사용할수 있는 자재 코드 입니다.");
                            MessageToast.show("사용할수 있는 자재 코드 입니다.");
                            input_mi_material_code.openValueStateMessage();
                        } else {
                            input_mi_material_code.setValueState("Error");
                            input_mi_material_code.setValueStateText("중복된 자재코드 입니다.");
                            input_mi_material_code.openValueStateMessage();
                        }
                    }
                });
            }
            console.groupEnd();
        },
        /**
         * 컨트롤 셋팅
         * @public
         */
        _setControl: function () {
            console.log("[mid] _setControl");

            this.byId("input_mi_material_code").attachBrowserEvent('keypress', function (e) {
                if (e.which == 13) {
                    this.onMaterialCodeCheckOpen();
                }
            });
        },

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
         * MessageToast
         * @param {*} content 
         */
        _showMessageToast : function(content){
            MessageToast.show(content);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
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

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        /**
         * control object filter 
         * @private
         */
        _fnControlSetting : function() {
            console.log("_fnControlSetting");
            var comboBox_pcst_currency_unit = this.getView().byId("comboBoxCategory_code");            
            var oBindingComboBox = comboBox_pcst_currency_unit.getBinding("items");

            var aFiltersComboBox = [
                new Filter("tenant_id", "EQ", this._m.filter.tenant_id),
                new Filter("company_code", "EQ", this._m.filter.company_code),
                new Filter("org_type_code", "EQ", this._m.filter.org_type_code),
                new Filter("org_code", "EQ", this._m.filter.org_code)
            ];

            oBindingComboBox.filter(aFiltersComboBox);  
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            console.log("[mid] _onRoutedThisPage");
        
            this.getView().byId("input_mi_material_code").setValue("");
            this.getView().byId("comboBoxCategory_code").setSelectedKey("");

            var oArgs = oEvent.getParameter("arguments"),
                oUiData = this.getModel("oUiData"),
                _oUiData = this.getModel("_oUiData"),
                oUi = this.getModel("oUi"),
                oView = this.getView(),
                that = this,
                sServiceUrl;

            var oModel = this.getOwnerComponent().getModel();

            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, oArgs.tenant_id),
                new Filter("company_code", FilterOperator.EQ, oArgs.company_code),
                new Filter("org_type_code", FilterOperator.EQ, oArgs.org_type_code),
                new Filter("org_code", FilterOperator.EQ, oArgs.org_code),
                new Filter("mi_material_code", FilterOperator.EQ, oArgs.mi_material_code)
            ];

            this.getView().setBusy(true);

            //필터 사용을 위한 등록 
            this._m.filter.tenant_id = oArgs.tenant_id;
            this._m.filter.company_code = oArgs.company_code;
            this._m.filter.org_type_code = oArgs.org_type_code;
            this._m.filter.org_code = oArgs.org_code;
            this._m.filter.mi_material_code = oArgs.mi_material_code;
            
            //관리조직 명 확인
            //관리조직 이름 
            var orgTenantViewFilters = [
                new Filter("tenant_id", FilterOperator.EQ, oArgs.tenant_id)
            ];

            oModel.read(this._m.serviceName.orgTenantView, {
                async: false,
                filters: orgTenantViewFilters,
                success: function (rData, reponse) {

                    //console.log("json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    if(reponse.data.results.length>0){
                        _oUiData.setProperty("/tenant_name", reponse.data.results[0].tenant_name);
                    }
                }
            });

            if (oArgs.mi_material_code == "new") {
                console.log("---------- New Create item ----------");

                //수정대상 상위 정보가 없으므로 임시 데이타 등록 
 
                this._m.filter.tenant_id = this._sso.dept.tenant_id;
                this._m.filter.company_code = this._sso.dept.company_code;
                this._m.filter.org_type_code = this._sso.dept.org_type_code;
                this._m.filter.org_code = this._sso.dept.org_code;
                
                this._fnSetCreateMode();

            } else {

                this._fnSetReadMode();
            }

            sServiceUrl = this._m.serviceName.mIMaterialCodeList;
            var oUiData = new JSONModel();
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {

                    oUiData.setData(reponse.data.results[0]);
                    that.getOwnerComponent().setModel(oUiData, "oUiData");

                }
            });

            //Control Setting
            this._fnControlSetting();
            
            var mIMaterialCodeText = new JSONModel();

            sServiceUrl = this._m.serviceName.mIMaterialCodeText;
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {
                    //console.log(sServiceUrl + "-- to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    mIMaterialCodeText.setData(reponse.data.results);

                    for(var i=0;i<reponse.data.results.length;i++){
                        mIMaterialCodeText.oData[i].itemMode = that._m.itemMode.read;
                        mIMaterialCodeText.oData[i].odataMode = that._m.odataMode.yes;
                    }

                    that.getOwnerComponent().setModel(mIMaterialCodeText, "mIMaterialCodeText");
                }
            });

            var languageView = new JSONModel();
            var lFilters = [
                new Filter("tenant_id", FilterOperator.EQ, oArgs.tenant_id)
            ];
            sServiceUrl = this._m.serviceName.languageView;
            oModel.read(sServiceUrl, {
                async: false,
                filters: lFilters,
                success: function (rData, reponse) {
                    // console.log(sServiceUrl + "-- to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    languageView.setData(reponse.data.results);
                    that.getOwnerComponent().setModel(languageView, "languageView");
                }
            });

            var mICategoryHierarchyStructure = new JSONModel();
            var miFilters = [
                new Filter("tenant_id", FilterOperator.EQ, oArgs.tenant_id),
                new Filter("company_code", FilterOperator.EQ, oArgs.company_code),
                new Filter("org_type_code", FilterOperator.EQ, oArgs.org_type_code),
                new Filter("org_code", FilterOperator.EQ, oArgs.org_code)
            ];

            //"/MICategoryHierarchyStructure
            sServiceUrl = this._m.serviceName.mICategoryHierarchyStructure;
            oModel.read(sServiceUrl, {
                async: false,
                filters: miFilters,
                success: function (rData, reponse) {
                    // console.log(sServiceUrl + " -- to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    mICategoryHierarchyStructure.setData(reponse.data.results);

                    that.getOwnerComponent().setModel(mICategoryHierarchyStructure, "mICategoryHierarchyStructure");
                }
            });

            this.getView().setBusy(false);
            console.groupEnd();
        },
        /**
         * 수정사항 : Smart Table Filter 값 참조후 작업
         */
        onBeforeRebindTable: function (oEvent) {
            console.log("[mid] onBeforeRebindTable");
            var mBindingParams = oEvent.getParameter("bindingParams"),
                oUiData = this.getModel("oUiData");
                mBindingParams.filters.push(new Filter("tenant_id", FilterOperator.EQ, oUiData.getProperty("/tenant_id")));
        },

/**
         * 작업 취소? 리스트 이동..
         */
        onCancel : function () {
            console.log("onCancel");
            var that = this;
            var sNextLayout = this.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            
            
           
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
            MessageBox.confirm("작업내용을 취소 하게 됩니다. 취소 하시 겠습니까?", {
                title : "Cancel",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }else{
                        return;
                    }
                }.bind(this)
            });            
        },
                
        /**
         * 화면에서 Edit 버튼 이벤트 수정모드 전환
         * @public
         */
        onEdit: function () {
            this._fnSetEditMode();
        },

        /**
         * MIMaterialCodeText Row Item 삭제 Json Verson
         * @public
         */
        onMidTableDelete: function (oEvent) {
            console.log("onMidTableDelete");

            var oModel = this.getOwnerComponent().getModel("mIMaterialCodeText"),
                oTable = this.getView().byId(this._m.tableName),
                that = this;

            
            var oSelected = oTable.getSelectedContexts();
            var items = oTable.getSelectedItems();
            
            if (oSelected.length > 0) {
                
                for (var i = 0; i < oSelected.length; i++) {
                    var idx = parseInt(oSelected[0].sPath.substring(oSelected[0].sPath.lastIndexOf('/') + 1));
                        oModel.oData[idx].itemMode =  this._m.itemMode.delete;
                        //oTable.removeItem(item);
                }
               
                // for(var x=0; x < items.length; x++){
                //     var item=items[x];
                //     oTable.removeItem(item);
                // }
                
                oModel.refresh();
                that.getView().setBusy(false);
                oTable.removeSelections();
                oModel.refresh(true);

            } else {

                this._showMessageToast("삭제할 항목을 선택 하셔야 합니다.");
                return;
            }
        },

        _setValueState : function(controlId, message){
            console.log("_setValueState");
            controlId.setValueState("Error");
            controlId.setValueStateText(message);
            controlId.openValueStateMessage();   
        },
        /**
         * Bom 에서 사용하는 자재를 확인 
         */
        _checkBomMatialCode : function (oData) {
            //MIMaterialCodeBOMManagement(tenant_id='L2100',
            // company_code='%2A',
            // org_type_code='BU',
            // org_code='BIZ00100',
            // material_code='ERCA00006AA',
            // supplier_code='KR00008',
            // mi_material_code='COP-001-01')

            // var oMIMaterialCodeListFilters = [
            //     new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
            //     new Filter("company_code", FilterOperator.EQ, this._m.filter.company_code),
            //     new Filter("org_type_code", FilterOperator.EQ, this._m.filter.org_type_code),
            //     new Filter("org_code", FilterOperator.EQ, this._m.filter.org_code),
            //     new Filter("mi_material_code", FilterOperator.EQ, input_mi_material_code.getValue())
            // ];

            // var sServiceUrl = this._m.serviceName.mIMaterialCodeList;
            // var itemLength = 0;
            // oModel.read(sServiceUrl, {
            //     async: false,
            //     filters: oMIMaterialCodeListFilters,
            //     success: function (rData, reponse) {

            //         console.log(sServiceUrl + " - 자재건수 :" + reponse.data.results.length);

            //         itemLength = reponse.data.results.length;

            //         if (itemLength < 1) {
            //             oUi.setProperty("/materialCheck", true);
            //             input_mi_material_code.setValueState("Success");
            //             input_mi_material_code.setValueStateText("사용할수 있는 자재 코드 입니다.");
            //             MessageToast.show("사용할수 있는 자재 코드 입니다.");
            //             input_mi_material_code.openValueStateMessage();
            //         } else {
            //             input_mi_material_code.setValueState("Error");
            //             input_mi_material_code.setValueStateText("중복된 자재코드 입니다.");
            //             input_mi_material_code.openValueStateMessage();
            //         }
            //     }
            // });
        },

        /**
         * 시황자제 삭제
         */
        onMidDelete : function () {
            console.group("onMidDelete");
            //호출만 예제)
            //sap.ui.controller("pg.mi.controller.MainList").onMainTableDelete();
            var that = this, 
                oUiData = this.getOwnerComponent().getModel("oUiData"),
                mimaterialEntirySetName=this._m.serviceName.mIMaterialCodeList;
            
                MessageBox.confirm("선택한 항목을 삭제 하시겠습니까?", {
                    title: "삭제 확인",                                    
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.DELETE) {

                            //delete 오류 수정중
                            var sUrl = mimaterialEntirySetName + "(";                    
                            sUrl = sUrl.concat("tenant_id='"+oUiData.getProperty("/tenant_id")+"'");
                            sUrl = sUrl.concat(",company_code='"+oUiData.getProperty("/company_code")+"'");
                            sUrl = sUrl.concat(",org_type_code='"+oUiData.getProperty("/org_type_code")+"'");
                            sUrl = sUrl.concat(",org_code='"+oUiData.getProperty("/org_code")+"'");
                            sUrl = sUrl.concat(",mi_material_code='"+oUiData.getProperty("/mi_material_code")+"')");

                            console.log("sUrl : ", sUrl);

                            oModel.remove(sUrl, { groupId: "deleteGroup" });

                            var oModel = that.getOwnerComponent().getView().getModel();
                            oModel.submitChanges({
                                groupId: "deleteGroup", 
                                success: that._handleDeleteSuccess.bind(this),
                                error: this._handleDeleteError.bind(this)
                            });                            

                            that._onExit();
                            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
                            that.getRouter().navTo("mainPage", { layout: sNextLayout });
                        }
                    },                                    
                    actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                    textDirection: sap.ui.core.TextDirection.Inherit    
                });

            console.groupEnd();
        },

        
        //수정사항 대기 
        onComboBoxLanguageChange : function (oEvent){
            console.log("onComboBoxLanguageChange");
            var oTable = this.getView().byId(this._m.tableName);
            var e = oEvent;
            
            var nLength = e.getSource().getItems().length,
                itmes =e.getSource().getItems(),
                checkItemKey="",
                nItemCount=0,
                selectKey = e.getSource().getSelectedKey(),
                nCound = 0;

                for (var idx = 0; idx < oTable.getItems().length; idx++) {
                    var items = oTable.getItems()[idx];
                    if(items.getCells()[1].mAggregations.items[0].getSelectedKey()==selectKey){
                        nCound++;
                    }
                }                
                
                if(nCound>1)
                {
                    this._showMessageToast("고유한 언어를 선택하여 주십시요.");

                    items.getCells()[1].mAggregations.items[0].setSelectedKey("");

                    //console.log error message
                    items.getCells()[1].mAggregations.items[0].getSelectedItem().setText("");

                    return;
                }  
        },
        /**
         * MIMaterialCodeText create
         * Note : 언어 추가  midTable 행을 추가 저장한다. 
         * 이미 저장되어 있는 키를 확인하여 업데이트 한다. 
         */
        onMidTableCreate: function () {
            console.group("onMidTableCreate");

            var oUiData = this.getModel("oUiData"),
                oUi = this.getModel("oUi"),
                languageView = this.getModel("languageView"),
                oTable = this.getView().byId(this._m.tableName),
                oModel = this.getOwnerComponent().getModel("mIMaterialCodeText"),
                bFlag = false;

            if(oTable.getItems().length<languageView.oData.length){
                bFlag = true;
            }

            if(!bFlag){
                this._showMessageToast("더이상 추가 할수 없습니다.");
                return;
            }
            //입력값을 사용한다. 
            var input_mi_material_code = this.getView().byId("input_mi_material_code").getValue();
            //comboBox_language = 
            
            var items = {
                "tenant_id": oUiData.getProperty("/tenant_id"),
                "company_code": oUiData.getProperty("/company_code"),
                "org_type_code": oUiData.getProperty("/org_type_code"),
                "org_code": oUiData.getProperty("/org_code"),
                "mi_material_code": input_mi_material_code,
                "language_code": "",
                "mi_material_name": "",
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": "Admin",
                "update_user_id": "Admin",
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date(),
                "itemMode": this._m.itemMode.create,
                "odataMode": this._m.odataMode.no
            };

            oModel.oData.push(items);
            oModel.refresh(true);

            console.groupEnd();
        },
         /**
          * 버튼 액션 저장
          */
         onSaveAction : function(){

            console.log("call function ==================== onMidSave ====================");
             var oUi = this.getModel("oUi");
             var bCreateFlag = oUi.getProperty("/createMode");
             var bOkActionFlag = false;
 
             if(!this._onPageValidate()){
                return;
             }

             if(!this._checkData()){
                 return;
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
         * 대문자 및 중복 체크 
         * @param {*} e 
         */
        onMiMaterialCodeCheck : function(e) {
            var oView = this.getView();
            var input_mi_material_code = this.getView().byId("input_mi_material_code");
            // 소문자 -> 대문자 변환
            input_mi_material_code.setValue(input_mi_material_code.getValue().toUpperCase());

            if(input_mi_material_code.getValue().length > 5 ){
                this._inputMartetial(input_mi_material_code);
            }
        },

        /**
         * 업데이트
         */
        _onTableItemUpdate : function () {
            console.log("_onTableItemUpdate");
        },

        _checkData : function(){

            console.log("call function ==================== onSaveAction ====================");
            // if(!ValidatorUtil.isValid(this.getView(),"requiredField")){
            //     return;
            // }
            // var validator = new Validator();
            // validator.validate(this.byId("page"));

            var omIMaterialCodeText = this.getOwnerComponent().getModel("mIMaterialCodeText"),
                oUiData = this.getModel("oUiData"),
                odataMode,
                o_mi_material_code,
                oUi = this.getModel("oUi"),
                oTable = this.getView().byId(this._m.tableName),
                oModel = this.getOwnerComponent().getModel(),
                materialCheck = oUi.getProperty("/materialCheck"),
                bValidator = true;

            if(oUi.getProperty("/createMode")){
                if(this.getView().byId("input_mi_material_code").getValue().length<1){
                    this._setValueState( 
                        this.getView().byId("input_mi_material_code"), 
                        "자재코드는 필수 입니다."
                    );
                    return false;
                }
            }

            if (materialCheck==false && oUi.getProperty("/createMode") == true) {
                this._setValueState( 
                    this.getView().byId("input_mi_material_code"), 
                    "자재코드를 확인 해야 합니다.."
                );
                return false;
               
            } else {

                var input_mi_material_code,
                    comboBoxCategory_code="",
                    comboBoxCategory_name="",
                    switchUse_flag = this.getView().byId("switchUse_flag").getState(),
                    msg = "";

                if(oUi.getProperty("/createMode")){

                    input_mi_material_code = this.getView().byId("input_mi_material_code").getValue();
                    if(!this._isNull(this.getView().byId("comboBoxCategory_code").getSelectedItem())){
                        comboBoxCategory_code = this.getView().byId("comboBoxCategory_code").getSelectedItem().mProperties.key;
                        comboBoxCategory_name = this.getView().byId("comboBoxCategory_code").getSelectedItem().mProperties.text;
                    } else {

                    }
                    

                    if (this._isNull(comboBoxCategory_code)) {
                        this._showMessageToast("카테고리를 선택 해야 합니다.");
                        return false;
                    }
                  
                } 
            }
            //language table check
            var oTableLength = oTable.getItems().length;
            if (oTableLength < 1) {

                this._showMessageToast("언어정보를 등록 해야 합니다.");
                return false;
            }

            for(var i=0; i<oTableLength;i++) {
                if(oTable.getItems()[i].getCells()[2].mAggregations.items[0].getValue().length<1){
                    bValidator = false;
                    break;
                }
            }
            
            if(oUi.getProperty("/createMode")){
                o_mi_material_code =   input_mi_material_code; 
            }else{
                o_mi_material_code =   oUiData.getProperty("/mi_material_code");
            }

            for(var i=0;i<omIMaterialCodeText.oData.length;i++){

                if(omIMaterialCodeText.oData[i].mi_material_code == o_mi_material_code){
                    odataMode =  omIMaterialCodeText.oData[i].odataMode;
                    break;
                }                        
            }
            
            var bNullCheck = true;
            for(var i=0; i<oTableLength;i++) {
                if(oTable.getItems()[i].getCells()[2].mAggregations.items[0].getValue().length<1){
                    bNullCheck = false;
                    bValidator = false;
                    break;
                }
            }


            if(!bNullCheck && odataMode==this._m.odataMode.yes){

                this._showMessageToast("자재명은 빈값일수 없습니다.");
                return false;
            }

            var oldLanguage_code,
                newLanguage_code

            for (var idx = 0; idx < oTable.getItems().length; idx++) {
    
                var items = oTable.getItems()[idx],
                    language_code = items.getCells()[1].mAggregations.items[0].getSelectedKey(),
                    newLanguage_code = language_code;

                if(newLanguage_code==oldLanguage_code){

                    bValidator = false; 
                    this._showMessageToast("Language Code는 유일 해야합니다.");                    
                    return false;
                    break;  
                }
            }
            return bValidator;
        },

        /**
         * 자재 중복 체크 
         * @param {*} input_mi_material_code 
         */
        _inputMartetial : function(input_mi_material_code){
            var oUi = this.getModel("oUi");
            var oModel = this.getModel();
            var oMIMaterialCodeListFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
                new Filter("company_code", FilterOperator.EQ, this._m.filter.company_code),
                new Filter("org_type_code", FilterOperator.EQ, this._m.filter.org_type_code),
                new Filter("org_code", FilterOperator.EQ, this._m.filter.org_code),
                new Filter("mi_material_code", FilterOperator.EQ, input_mi_material_code.getValue())
            ];

            


            var sServiceUrl = this._m.serviceName.mIMaterialCodeList;
            var itemLength = 0;
            oModel.read(sServiceUrl, {
                async: false,
                filters: oMIMaterialCodeListFilters,
                success: function (rData, reponse) {

                    console.log(sServiceUrl + " - 자재건수 :" + reponse.data.results.length);

                    itemLength = reponse.data.results.length;

                    if (itemLength < 1) {
                        oUi.setProperty("/materialCheck", true);
                        input_mi_material_code.setValueState("Success");
                        input_mi_material_code.setValueStateText("사용할수 있는 자재 코드 입니다.");
                        MessageToast.show("사용할수 있는 자재 코드 입니다.");
                        input_mi_material_code.openValueStateMessage();
                    } else {
                        oUi.setProperty("/materialCheck", false);
                        input_mi_material_code.setValueState("Error");
                        input_mi_material_code.setValueStateText("중복된 자재코드 입니다.");
                        input_mi_material_code.openValueStateMessage();
                    }
                }
            });
        },
        _onPageValidate: function(){

            if(this.validator.validate(this.byId("mid_simpleForm")) !== true) {
                return false;
            }else{
                this.validator.clearValueState(this.byId("mid_simpleForm"));
                return true;
            }
            
    
        },
        

        /**
         * new Save
         */
        _onSave : function () {

            console.log("call function ==================== onSaveAction ====================");

 
            var omIMaterialCodeText = this.getOwnerComponent().getModel("mIMaterialCodeText"),
                oUiData = this.getModel("oUiData"),
                odataMode, o_mi_material_code,
                oUi = this.getModel("oUi"),
                oTable = this.getView().byId(this._m.tableName),
                oModel = this.getOwnerComponent().getModel(),
                materialCheck = oUi.getProperty("/materialCheck");

            if (materialCheck==false && oUi.getProperty("/createMode") == true) {
            } else {

                var input_mi_material_code,
                    comboBoxCategory_code,
                    comboBoxCategory_name,
                    switchUse_flag = this.getView().byId("switchUse_flag").getState(),
                    msg = "";

                if(oUi.getProperty("/createMode")){

                    input_mi_material_code = this.getView().byId("input_mi_material_code").getValue();
                    comboBoxCategory_code = this.getView().byId("comboBoxCategory_code").getSelectedItem().mProperties.key;
                    comboBoxCategory_name = this.getView().byId("comboBoxCategory_code").getSelectedItem().mProperties.text;
                  
                } else if (oUi.getProperty("/editMode")){

                    input_mi_material_code = oUiData.getProperty("/mi_material_code");
                    comboBoxCategory_code = oUiData.getProperty("/category_code");
                    comboBoxCategory_name = oUiData.getProperty("/category_name");                    
                }
                if(oUi.getProperty("/createMode")){
                    o_mi_material_code =   input_mi_material_code; 
                }else{
                    o_mi_material_code =   oUiData.getProperty("/mi_material_code");
                }


                                
                var mi_material_name,
                    oldLanguage_code,
                    newLanguage_code,
                    vMi_material_name = "";

                //자재명 선 취득을 위한 테이블 작업 우선      
                //MIMaterialCodeText create, update,  delete
                var blanguageCheck = false;
                var mIMaterialCodeText= this._m.serviceName.mIMaterialCodeText;

                for (var idx = 0; idx < oTable.getItems().length; idx++) {
      
                    var items = oTable.getItems()[idx],
                        itemMode = items.getCells()[0].mProperties.text,
                        language_code = items.getCells()[1].mAggregations.items[0].getSelectedKey(),
                        mi_material_name = items.getCells()[2].mAggregations.items[0].getValue(),
                        newLanguage_code = language_code;

                    var updateTableItem = 0;
                    var createTableItem = 0;
                    var deleteTableItem = 0;
                    var updateItem = 0;
                    var createItem = 0;

                    //자재명 등록을위한 할당 - 대표  KO
                    if (newLanguage_code == "KO") {
                        vMi_material_name = mi_material_name;
                    }

                    var o_mi_material_code;

                    //MIMaterialCodeText db key : update delete 
                    var oMIMaterialCodeTextKey = {
                        tenant_id : oUiData.getProperty("/tenant_id"),
                        company_code : oUiData.getProperty("/company_code"),
                        org_type_code : oUiData.getProperty("/org_type_code"),
                        org_code: oUiData.getProperty("/org_code"),
                        mi_material_code: o_mi_material_code,
                        language_code: language_code
                    }

                    var oMIMaterialCodeTextPath = oModel.createKey(
                            this._m.serviceName.mIMaterialCodeText,
                            oMIMaterialCodeTextKey
                    );
            

                    //MIMaterialCodeText  table item
                    if(itemMode==this._m.itemMode.create){
                        var oMIMaterialCodeTextParameters = {
                            "groupId": this._m.groupID,
                            "properties": {
                                "tenant_id": this._sso.dept.tenant_id,
                                "company_code": this._sso.dept.company_code,
                                "org_type_code": this._sso.dept.org_type_code,
                                "org_code": this._sso.dept.org_code,
                                "mi_material_code": o_mi_material_code,
                                "language_code": language_code,
                                "mi_material_name": mi_material_name,
                                "local_create_dtm": new Date(),
                                "local_update_dtm": new Date(),
                                "create_user_id": this._sso.user.id,
                                "update_user_id": this._sso.user.id,
                                "system_create_dtm": new Date(),
                                "system_update_dtm": new Date()

                            }
                        };

                        console.log(this._m.serviceName.mIMaterialCodeText+"--createEntry table item");
                        oModel.createEntry(this._m.serviceName.mIMaterialCodeText, oMIMaterialCodeTextParameters);
                        createTableItem++;
                    }

                    console.log("itemMode == this._m.itemMode.read");
                    //기존 게시물 업데이트를 위한 param 키 값은 제외 한다.
                    if(itemMode == this._m.itemMode.read || itemMode == this._m.itemMode.update){
                        
                        var mIMaterialCodeTextParameters = {
                            "mi_material_name": mi_material_name,
                            "local_create_dtm": new Date(),
                            "local_update_dtm": new Date(),
                            "create_user_id": this._sso.user.id,
                            "update_user_id": this._sso.user.id,
                            "system_create_dtm": new Date(),
                            "system_update_dtm": new Date()
                        };

                        console.log(oMIMaterialCodeTextPath+"--update");
                        oModel.update(
                            oMIMaterialCodeTextPath,
                            mIMaterialCodeTextParameters, 
                            { 
                                groupId: this._m.groupID 
                            }
                        ); 
                        updateTableItem++;               
                    }

                    console.log("itemMode==this._m.itemMode.delete");
                    for(var i=0;i<omIMaterialCodeText.oData.length;i++){

                        if(omIMaterialCodeText.oData[i].mi_material_code == o_mi_material_code){
                            odataMode =  omIMaterialCodeText.oData[i].odataMode;
                            break;
                        }                        
                    }
                    if(itemMode==this._m.itemMode.delete && odataMode == this._m.odataMode.yes){
                        console.log(oMIMaterialCodeTextPath+"--remove");
                        oModel.remove(
                            oMIMaterialCodeTextPath, 
                            { 
                                groupId: this._m.groupID 
                            }
                        );

                        deleteTableItem++;    
                    }

                    //신규자재명 할당을 위해 KO가 없다면 한건이라도 등록한다. 
                    //초기 KO는 필수로 정해야한다...
                    if (newLanguage_code == "") {
                        vMi_material_name = mi_material_name;
                    }
                } //end for


                //MIMaterialCodeList ---------------------------------------------------------------------------
                //대표자재가 지정 및 변경될경우 -----------------------------------------
                var oMIMaterialCodeListParameters;

                //수정대상 or 확인대상 imsi 데이타로 등록 진행중 (20201208 현재 상위 코드 정의되지 않았음.)
                //MIMaterialCodeList db key : update delete 
                var oMIMaterialCodeListKey = {
                    tenant_id : oUiData.getProperty("/tenant_id"),
                    company_code : oUiData.getProperty("/company_code"),
                    org_type_code : oUiData.getProperty("/org_type_code"),
                    org_code: oUiData.getProperty("/org_code"),
                    mi_material_code: o_mi_material_code
                }

                var oMIMaterialCodeListPath = oModel.createKey(
                    this._m.serviceName.mIMaterialCodeList, 
                    oMIMaterialCodeListKey
                );

                if (oUi.getProperty("/editMode")) {
                    console.log(oMIMaterialCodeListPath+" -- editMode");    
                    //널 수정대상 : 값을 넣지 않으면 null 할당
                    //"category_code": comboBoxCategory_code.getSelectedKey(),
                    //"category_name": comboBoxCategory_name,
                    oMIMaterialCodeListParameters = {
                        "category_code": oUiData.getProperty("/category_code"),
                        "category_name": oUiData.getProperty("/category_name"),           
                        "mi_material_name": vMi_material_name,
                        "use_flag": switchUse_flag,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date(),
                        "create_user_id": this._sso.user.id,
                        "update_user_id": this._sso.user.id,
                        "system_create_dtm": new Date(),
                        "system_update_dtm": new Date()
                    };
                    console.log(oMIMaterialCodeListPath+" -- update");
                    oModel.update(oMIMaterialCodeListPath, 
                        oMIMaterialCodeListParameters, { 
                            groupId: this._m.groupID 
                        }
                    );  
                    updateItem++;

                } else if (oUi.getProperty("/createMode")){
         
                    if(vMi_material_name==""){
                        vMi_material_name = mi_material_name;
                    }
                    
                    oMIMaterialCodeListParameters = {
                        "groupId": this._m.groupID ,
                        "properties": {
                            "tenant_id": this._sso.dept.tenant_id,
                            "company_code": this._sso.dept.company_code,
                            "org_type_code": this._sso.dept.org_type_code,
                            "org_code": this._sso.dept.org_code,
                            "mi_material_code": input_mi_material_code,
                            "mi_material_name": vMi_material_name,
                            "category_code": comboBoxCategory_code,
                            "category_name": comboBoxCategory_name,
                            "use_flag": switchUse_flag,
                            "local_create_dtm": new Date(),
                            "local_update_dtm": new Date(),
                            "create_user_id": this._sso.user.id,
                            "update_user_id": this._sso.user.id,
                            "system_create_dtm": new Date(),
                            "system_update_dtm": new Date()
                        }
                    };
                
                    console.log(this._m.serviceName.mIMaterialCodeList+" -- createEntry");
                    oModel.createEntry(this._m.serviceName.mIMaterialCodeList, oMIMaterialCodeListParameters);
                    createItem++;
                }            
                
                console.log("createItem==================================", createItem);
                console.log("updateItem =================================", updateItem);
                console.log("createTableItem ============================", createTableItem);
                console.log("updateTableItem ============================", updateTableItem);
                console.log("deleteTableItem ============================", deleteTableItem);

              
                oModel.setUseBatch(true);
                oModel.submitChanges({
                    groupId: this._m.groupID,
                    success: this._handleCreateSuccess.bind(this),
                    error: this._handleCreateError.bind(this)
                });

                oModel.refresh();
            }
        },
        
        /**
         * MIMaterialCodeList delete button action
         * @public
         */
        onDeleteAction : function () {
            console.log("onDeleteAction");
            if(ValidatorUtil.isValid(this.getView(),"requiredField")){
                MessageBox.confirm("삭제 하시 겠습니까?", {
                    title : "삭제 확인",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            this._deleteAction();
                        }else{
                            return;
                        }
                    }.bind(this)
                });
            }else{
                console.log("onDeleteAction checkRequire")
            }              
        },

        /**
         * MIMaterialCodeList delete action
         * @private
         */
        _deleteAction : function () {
            console.log("_deleteAction");
            var oModel = this.getOwnerComponent().getModel(),            
                oMIMaterialCodeText = this.getOwnerComponent().getModel("mIMaterialCodeText"),
                oUiData = this.getModel("oUiData");
            //MIMaterialCodeList(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='TIN-001-01')"    
            var oMIMaterialCodeListKey = {
                tenant_id : oUiData.getProperty("/tenant_id"),
                company_code : oUiData.getProperty("/company_code"),
                org_type_code : oUiData.getProperty("/org_type_code"),
                org_code: oUiData.getProperty("/org_code"),
                mi_material_code: oUiData.getProperty("/mi_material_code")
            }

            var oMIMaterialCodeListPath = oModel.createKey(
                this._m.serviceName.mIMaterialCodeList, 
                oMIMaterialCodeListKey
            );
                    
            console.log(oMIMaterialCodeListPath+"--delete");
            oModel.remove(oMIMaterialCodeListPath);

            //MIMaterialCodeText(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='ALU-001-01',language_code='EN')"
            for(var i=0;i<oMIMaterialCodeText.oData.length;i++){
 
                var oMIMaterialCodeTextKey = {
                    tenant_id : oMIMaterialCodeText.oData[i].tenant_id,
                    company_code : oMIMaterialCodeText.oData[i].company_code,
                    org_type_code : oMIMaterialCodeText.oData[i].org_type_code,
                    org_code: oMIMaterialCodeText.oData[i].org_code,
                    mi_material_code: oMIMaterialCodeText.oData[i].mi_material_code,
                    language_code: oMIMaterialCodeText.oData[i].language_code,
                }

                var oMIMaterialCodeTextPath = oModel.createKey(
                    this._m.serviceName.mIMaterialCodeText,
                    oMIMaterialCodeTextKey
                );
    
                console.log(oMIMaterialCodeTextPath+"--delete");
                oModel.remove(oMIMaterialCodeTextPath);                    
            }
            
        
            oModel.setUseBatch(true);
            oModel.submitChanges({
                groupId: this._m.groupID,
                success: this._handleDeleteSuccess.bind(this),
                error: this._handleDeleteError.bind(this)
            });

            this.onRefresh();

            oModel.refresh();  
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

        onRefresh : function () {
            var oBinding = this.byId("midTable").getBinding("rows");
            this.getView().setBusy(true);
            oBinding.refresh();
            this.getView().setBusy(false);
        },

        _handleCreateSuccess: function (oData) {
            var that = this;

            MessageBox.show("저장에 성공 하였습니다.", {
                icon: MessageBox.Icon.SUCCESS,
                title: "저장 성공",
                actions: [MessageBox.Action.OK],
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });

            var sNextLayout = this.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this._onExit();
            this.getRouter().navTo("mainPage", { layout: sNextLayout });
         
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
            var that = this;

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