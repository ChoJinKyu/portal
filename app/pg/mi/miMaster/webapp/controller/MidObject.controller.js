sap.ui.define([
    "./BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/ValueState",
    "ext/lib/util/Validator"
], function (BaseController, Multilingual, JSONModel, DateFormatter, Filter, FilterOperator,  MessageBox, MessageToast, ValueState, Validator) {
    "use strict";

    return BaseController.extend("pg.mi.miMaster.controller.MidObject", {

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

        _m : { 
            page : "page",
            groupID : "pgGroup",
            tableItem : {
                items : "items" //or rows
            },
            tableName : "midTable",
            fragementPath : {
                reqmQuantityUnit : "pg.mi.miMaster.view.ReqmQuantityUnit",
                categoryValueHelp : "pg.mi.miMaster.view.CategoryValueHelp"
            },            
            fragementId : {
                reqmQuantityUnit : "ReqmQuantityUnit_ID",
                categoryValueHelp : "CategoryValueHelp_ID"
            },            
            filter : {  
                tenant_id : "",
                material_code : "",
                mi_material_code : ""
            },
            serviceName : {
                marketIntelligenceService : "pg.marketIntelligenceService", //main Service
                orgCodeView : "/orgCodeView", //관리조직 View
                mICategoryView : "/MICategoryView",
                mIMaterialCodeList : "/MIMaterialCodeList",
                mIMatListView : "/MIMatListView",
                mIMaterialCode : "/MIMaterialCode",
                mIMaterialCodeText : "/MIMaterialCodeText", 
                languageView : "/LanguageView",
                mICategoryHierarchyStructure : "/MICategoryHierarchyStructure",
                mIMaterialCodeBOMManagementView : "/MIMaterialCodeBOMManagementView",
                mIMaterialCodeBOMManagementItem : "/MIMaterialCodeBOMManagementItem",
                mIMaterialPriceManagement : "/MIMaterialPriceManagement"
            },
            processMode : {
                create : "C", //신규, 
                read : "R",   //보기
                edit : "E"    //수정
            },
            itemMode : {
                create : "C",  //테이블 아이템 신규등록 ㅂ -> 한자
                read : "R",    //테이블 아이템 기존 존재 데이타 로드 ㄱ->한자 공백
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
                tenant_id : "L2100"
            }          
        },

        /**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            //console.group("[midObjectPage] onInit");

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
                        
            // Attaches validation handlers
            sap.ui.getCore().attachValidationError(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.Error);
            });
            sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.None);
            });

            //header title hide
            $("#__xmlview1--page-intHeader-BarPH").hide();

            //pageMode C Create, V View, E Edit
            var oUi = new JSONModel({
                busy: false,
                delay: 0,
                materialCheck : false,
                readMode : true,
                editMode : false,
                createMode : false
            });

            var  _deleteItem = new JSONModel({oData:[]});

            //text, number ValidatorUtil
            var _oUiData = new JSONModel({
                tenant_name:"",
                string:null,
                number:0
            });

            this.setModel(_deleteItem, "_deleteItem");
            this.setModel(_oUiData, "_oUiData");
            this.setModel(oUi, "oUi");

            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._Page = this.getView().byId("page");
            this._Page.setFloatingFooter(true);

            //console.groupEnd();
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
                bCreate = false;
                bEdit = false;
            }else if(mode === "create"){
                bRead = false;
                bCreate = true;
                bEdit = false;
            }else if(mode === "edit"){
                bRead = false;
                bCreate = false;
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

            oFormFragment = sap.ui.xmlfragment(sFragmentName + "_id", "pg.mi.miMaster.view." + sFragmentName, this);

            this._formFragments[sFragmentName] = oFormFragment;

            return this._formFragments[sFragmentName];

            //console.groupEnd();
        },

        _showFormFragment: function (sFragmentName) {
            //console.group("_showFormFragment");

            var oPage = this.byId("page"),
                oUiData = this.getModel("oUiData"),
                oUi = this.getModel("oUi");

            this.getView().setBusy(true);

            oPage.removeAllContent();

            oPage.insertContent(this._getFormFragment(sFragmentName));

            this.getView().setBusy(false);

            //console.groupEnd();
        },

        /**
         * 자재코드 확인
         * @public
         */
        onMaterialCodeCheck: function () {
            //console.group("onMaterialCodeCheck");

            var oUiData = this.getModel("oUiData"),
                oUi = this.getModel("oUi"),
                oModel = this.getOwnerComponent().getModel(),
                sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
                input_mi_material_code = this.getView().byId("input_mi_material_code");

            var bMaterialCode = false;

            if (this._isNull(input_mi_material_code)) {

                this._showMessageToast(this.getModel("I18N").getText("/NPG00011"));

                return;
            }
            else {
                var omIMatListViewFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
                    new Filter("mi_material_code", FilterOperator.EQ, input_mi_material_code.getValue())
                ];

                var sServiceUrl = this._m.serviceName.mIMatListView;
                var itemLength = 0;
                oModel.read(sServiceUrl, {
                    async: false,
                    filters: omIMatListViewFilters,
                    success: function (rData, reponse) {

                        //console.log(sServiceUrl + " - 자재건수 :" + reponse.data.results.length);

                        itemLength = reponse.data.results.length;

                        if (itemLength < 1) {
                            oUi.setProperty("/materialCheck", true);
                            input_mi_material_code.setValueState("None");//success
                            input_mi_material_code.setValueStateText(this.getModel("I18N").getText("/NPG00003"));
                            MessageToast.show(this.getModel("I18N").getText("/NPG00003"));
                            input_mi_material_code.openValueStateMessage();
                        } else {
                            input_mi_material_code.setValueState("Error");
                            input_mi_material_code.setValueStateText(this.getModel("I18N").getText("/ECM00004"));
                            input_mi_material_code.openValueStateMessage();
                        }
                    }
                });
            }
            //console.groupEnd();
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
            //console.group("onPageNavBackButtonPress");
            var sNextLayout = this.getOwnerComponent().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");

            this._onExit();
            this.getRouter().navTo("mainPage", { layout: sNextLayout });
            //console.groupEnd();
        },

        /**
         * jsoon model data null initial
         * @private
         */
        _initialModel : function() {

            var arrayModel = [
                "mIMaterialCodeText",
                "oUiData",
                "_oUiData",
                "languageView",
                "_deleteItem",
                "_deleteItemOdata",
                "mICategoryHierarchyStructure",
                "oUi"
            ];

            this.setArrayModelNullAndUpdateBindings(arrayModel);
        },

        _initialControlValue : function(){
            //$("#__xmlview1--combobox_category_code-inner").val("");
            this.getView().byId("combobox_category_code").setSelectedItemId("");
            this.getView().byId("input_mi_material_code").setValue("");
            this.validator.clearValueState(this.byId("page"));
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            console.log("[mid] _onRoutedThisPage");
        
            this._initialModel();
            this._initialControlValue();
            this._onPageClearValidate();

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
                new Filter("mi_material_code", FilterOperator.EQ, oArgs.mi_material_code)
            ];

            this.getView().setBusy(true);

            //필터 사용을 위한 등록 
            this._m.filter.tenant_id = oArgs.tenant_id;
            this._m.filter.mi_material_code = oArgs.mi_material_code;

 
            if (oArgs.mi_material_code == "new") {
                console.log("---------- New Create item ----------");

                //수정대상 상위 정보가 없으므로 임시 데이타 등록 
 
                this._m.filter.tenant_id = this._sso.dept.tenant_id;
                
                this._fnSetCreateMode();

            } else {

                this._fnSetReadMode();
            }

            sServiceUrl = this._m.serviceName.mIMatListView;
            var oUiData = new JSONModel();
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {

                    oUiData.setData(reponse.data.results[0]);
                    that.getOwnerComponent().setModel(oUiData, "oUiData");

                }
            });
            
            var mIMaterialCodeText = new JSONModel();
            this.getOwnerComponent().setModel(new JSONModel(), "mIMaterialCodeTextOriginal");

            sServiceUrl = this._m.serviceName.mIMaterialCodeText;
            oModel.read(sServiceUrl, {
                async: false,
                filters: aFilters,
                success: function (rData, reponse) {
                    //console.log(sServiceUrl + "-- to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
                    if(rData.results.length>0){
                        mIMaterialCodeText.setData(reponse.data.results);

                        for(var i=0;i<reponse.data.results.length;i++){
                            mIMaterialCodeText.oData[i].itemMode = that._m.itemMode.read;
                            mIMaterialCodeText.oData[i].odataMode = that._m.odataMode.yes;
                            mIMaterialCodeText.oData[i].org_language_code = reponse.data.results[i].language_code;
                        }

                        that.getOwnerComponent().setModel(mIMaterialCodeText, "mIMaterialCodeText");
                        that.getOwnerComponent().getModel("mIMaterialCodeTextOriginal").setData(JSON.parse(JSON.stringify(mIMaterialCodeText.getData())));
                    }
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

            // var mICategoryHierarchyStructure = new JSONModel();
            // var miFilters = [
            //     new Filter("tenant_id", FilterOperator.EQ, oArgs.tenant_id),
            //     new Filter("use_flag", true)
            // ];

            // //"/MICategoryHierarchyStructure
            // sServiceUrl = this._m.serviceName.mICategoryHierarchyStructure;
            // oModel.read(sServiceUrl, {
            //     async: false,
            //     filters: miFilters,
            //     success: function (rData, reponse) {
            //         // console.log(sServiceUrl + " -- to json oData~~~~~~~" + JSON.stringify(reponse.data.results[0]));
            //         mICategoryHierarchyStructure.setData(reponse.data.results);

            //         that.getOwnerComponent().setModel(mICategoryHierarchyStructure, "mICategoryHierarchyStructure");
            //     }
            // });
            this._initialMidTableCreate();
            this.getView().setBusy(false);
            //console.groupEnd();
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
            // var oBinding = this.getView().byId("midTable").getBinding("items");

			// if (oBinding.hasPendingChanges()) {
			// 	MessageBox.error("변경내역 없음");
			// 	return;
            // }
                        
            // if(this.getView().getModel("mIMaterialCodeText").hasPendingChanges())
            // {
            //     console.log("mIMaterialCodeText model hasPendingChanges");
            // }else{
            //     console.log("not mIMaterialCodeText model hasPendingChanges");
            // }


            var bCreateMode = this.getModel("oUi").getProperty("/createMode");
           
            var mTitle = this.getModel("I18N").getText("/CANCEL") + " " + this.getModel("I18N").getText("/CONFIRM");	
            MessageBox.confirm(this.getModel("I18N").getText("/NPG00013"), {
                title : mTitle,
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                         if(bCreateMode){
                            that._onExit();
                            that.getRouter().navTo("mainPage", { layout: sNextLayout });
                         }else{
                            var oOriginalData = that.getOwnerComponent().getModel("mIMaterialCodeTextOriginal").getData();
                            that.getOwnerComponent().getModel("mIMaterialCodeText").setData(oOriginalData);
                            this._fnSetReadMode();
                         }
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

            var oModel = this.getModel("mIMaterialCodeText"),
                _deleteItem = this.getModel("_deleteItem"),
                _removeItem = [],
                oTable = this.getView().byId(this._m.tableName),
                that = this;

                
            var oSelected = oTable.getSelectedContexts();
            
            if (oSelected.length > 0) {
                
                var _deleteItemOdata = _deleteItem.getProperty("/oData");
                var bContinue = true;
                for (var i = 0; i < oSelected.length; i++) {
                    var idx = parseInt(oSelected[i].sPath.substring(oSelected[i].sPath.lastIndexOf('/') + 1));

                    if(oModel.oData[idx].itemMode == that._m.itemMode.read){
                        if(oModel.oData[idx].language_code=="KO"){
                            bContinue = false;
                        }else{
                            _deleteItemOdata.push(oModel.oData[idx]);
                            _removeItem.push(idx); 
                        }
                    }else{
                        _removeItem.push(idx);
                    }
                } 

                if(bContinue){
                    _removeItem.sort(function(a, b) { // 내림차순
                        return b - a;
                        // 11, 10, 4, 3, 2, 1
                    });

                    _removeItem.forEach(function(idx){
                        oModel.oData.splice(idx, 1);
                    });

                    _deleteItem.setProperty("/oData", _deleteItemOdata);
                    that.getView().setBusy(false);
                    oTable.removeSelections();
                    oTable.getBinding("items").refresh();
                    oModel.refresh(true);    
                }else{
                    this._showMessageToast(this.getModel("I18N").getText("/NPG00004"));
                }

            } else {

                this._showMessageToast(this.getModel("I18N").getText("/NCM01010"));
                return;
            }
        },

      /**
         * Create 신규 생성 첫화면에서 KO 를 먼저 등록한다. 
         */
        _initialMidTableCreate: function () {
            console.log()
            
            var oUi = this.getModel("oUi");
            if(!oUi.getProperty("/createMode")) return;

            //var oModel = this.getOwnerComponent().getModel("mIMaterialCodeText");
            
            var input_mi_material_code = this.getView().byId("input_mi_material_code").getValue();
            var items = {
                "tenant_id": this._sso.dept.tenant_id,
                "mi_material_code": input_mi_material_code,
                "language_code": "KO",
                "mi_material_name": "",
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": this._sso.user.id,
                "update_user_id": this._sso.user.id,
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date(),
                "itemMode": this._m.itemMode.create,
                "odataMode": this._m.odataMode.no
            };
            var oModel = new JSONModel([items]);
            this.getOwnerComponent().setModel(oModel, "mIMaterialCodeText");

            //oModel.oData.push(items);
            //oModel.refresh(true);
        }, 

        _setValueState : function(controlId, message){
            console.log("_setValueState");
            controlId.setValueState("Error");
            controlId.setValueStateText(message);
            controlId.openValueStateMessage();   
        },

        /**
         * category value help
         */
        onValueHelpCategorySearchDialog : function () {
            console.log("_valueHelpCategorySearchDialog");
			// create value help dialog
			if (!this._vHelpCategorySearchDialog) {

                this._vHelpCategorySearchDialog = sap.ui.xmlfragment(
                    this._m.fragementId.categoryValueHelp, 
                    this._m.fragementPath.categoryValueHelp,this
                );

                this.getView().addDependent(this._vHelpCategorySearchDialog);
            }  

            this._openValueHelpCategoryCodeDialog();
        },

        _findFragmentControlId : function (fragmentID, controlID) {
            return sap.ui.core.Fragment.byId(fragmentID, controlID);
        },
        
        //수정사항 대기 
        onComboBoxLanguageChange : function (oEvent){
            console.log("onComboBoxLanguageChange");
            var oTable = this.getView().byId(this._m.tableName);
            var e = oEvent;
            var oModel = this.getModel("mIMaterialCodeText");

            var itmes = e.getSource().getItems(),
                selectKey = e.getSource().getSelectedKey(),
                nCound = 0;

                var mData = {
					"items": [
						{
							"key": "",
							"text": ""
                        }]
                    };

                                        
            var vLanguage = "";
            for(var i=0; i<oModel.oData.length; i++){
                if(oModel.oData[i].language_code == selectKey){
                    if(nCound>0){                                                
                        //e.getSource().setSelectedKey("");
                    }
                    nCound++;
                }else{
                    if(oModel.oData[i].language_code!="KO"){
                        vLanguage = oModel.oData[i].language_code;
                    }
                }
            }
            if(nCound>1){
                this._showMessageToast(this.getModel("I18N").getText("/NPG10017"));
            }

        },
        /**
         * MIMaterialCodeText create
         * Note : 언어 추가  midTable 행을 추가 저장한다. 
         * 이미 저장되어 있는 키를 확인하여 업데이트 한다. 
         */
        onMidTableCreate: function () {
            //console.group("onMidTableCreate");

            var oUiData = this.getModel("oUiData"),
                oUi = this.getModel("oUi"),
                languageView = this.getModel("languageView"),
                oTable = this.getView().byId(this._m.tableName),
                oModel = this.getOwnerComponent().getModel("mIMaterialCodeText"),
                bFlag = false;

            if(oTable.getItems().length < languageView.oData.length){
                bFlag = true;
            }

            if(!bFlag){
                this._showMessageToast(this.getModel("I18N").getText("/NPG00002"));
                return;
            }
            //입력값을 사용한다. 
            var sTenant_id = oUiData.getProperty("/tenant_id");
            var input_mi_material_code = this.getView().byId("input_mi_material_code").getValue();
            var items = {
                "tenant_id": sTenant_id !== undefined ? sTenant_id : this._sso.dept.tenant_id,
                "mi_material_code": input_mi_material_code,
                "language_code": "KO",
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

            if(oModel !== undefined){
                var oData = oModel.getData();
                oData !== null && oData !== undefined ? oData.push(items) : oModel.setData([items]);
                oModel.refresh(true);
            }else{
                var oModel = new JSONModel([items]);
                this.getOwnerComponent().setModel(oModel, "mIMaterialCodeText");
            }

            
            
            //oModel.refresh(true);

            //console.groupEnd();
        },
         /**
          * 버튼 액션 저장
          */
         onSaveAction : function(){

            console.log("call function ==================== onMidSave ====================");
             var oUi = this.getModel("oUi");
             var bCreateFlag = oUi.getProperty("/createMode");
             var bOkActionFlag = false;

             if(!this._checkData())return; //!this._onPageValidate() || 

             var mTitle = this.getModel("I18N").getText("/ADDITION") + " " + this.getModel("I18N").getText("/CONFIRM");	 
             if(bCreateFlag){

                //if(this.validator.validate(this.byId("input_mi_material_code")) !== true) return;
                //if(this.validator.validate(this.byId("combobox_category_code")) !== true) return;

                //if(!this._onPageValidate()){ 에서 이미 validate 체크완료 2021.01.28 ValidatorUtil 제거
                // if(ValidatorUtil.isValid(this.getView(),"requiredField")){
                     MessageBox.confirm(this.getModel("I18N").getText("/NPG00014"), {
                         title : mTitle,
                         initialFocus : sap.m.MessageBox.Action.CANCEL,
                         onClose : function(sButton) {
                             if (sButton === MessageBox.Action.OK) {
                                 this._onSave();
                             }else{
                                 return;
                             }
                         }.bind(this)
                     });
                 //}else{
                 //    console.log("checkRequire")
                // }
             }else{
                var mTitle = this.getModel("I18N").getText("/UPDATE") + " " + this.getModel("I18N").getText("/CONFIRM");
                 MessageBox.confirm(this.getModel("I18N").getText("/NPG00007"), {
                     title : mTitle,
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
        //전부 입력하고 수정하기로...
        onMiMaterialCodeCheck : function(e) {
            //var oView = this.getView();
            //var input_mi_material_code = this.getView().byId("input_mi_material_code");

            var oSource = e.getSource();
            var sMiMaterialCode =  oSource.getValue().replace(/\s/gi, "");
            oSource.setValue(sMiMaterialCode);
            this.getModel("oUi").setProperty("/materialCheck", false);

            if(sMiMaterialCode.length > 0){
                var regExp = /^[A-Za-z0-9-]{1,}$/; //영어와 숫자 그리고 특수문자"-"만 사용가능!!
                var bRegExp = regExp.test(sMiMaterialCode);

                if(bRegExp){
                    oSource.setValue(sMiMaterialCode.toUpperCase());// 소문자 -> 대문자 변환
                    this._inputMartetial(oSource);
                }else{
                    oSource.setValueState("Error");
                    oSource.setValueStateText("영문/숫자/특수문자('-'만 가능)");//this.getModel("I18N").getText("/NDP60002"));
                    //MessageToast.show("영문/숫자/특수문자('-'만 가능)");//this.getModel("I18N").getText("/NDP60002"));
                    oSource.openValueStateMessage();
                }
            }else{
                //oSource.setValueState("None");
                //oSource.setValueStateText("");

                oSource.setValueState("Error");
                oSource.setValueStateText(this.getModel("I18N").getText("/ECM01002"));
            }
            
        },

        /**
         * 업데이트
         */
        _onTableItemUpdate : function () {
            console.log("_onTableItemUpdate");
        },

        /**
         * 필수값 체크
         * @private
         */
        _checkData : function(){


            console.log("call function ==================== _checkData ====================");
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
                    bValidator = false;
                    this._setValueState( 
                        this.getView().byId("input_mi_material_code"), 
                        this.getModel("I18N").getText("/ECM01002")
                    );
                }else if(materialCheck==false){
                    bValidator = false;
                    this._setValueState( 
                        this.getView().byId("input_mi_material_code"), 
                        this.getModel("I18N").getText("/NPG00012")
                    );
                }

                var combobox_category_code = this.getView().byId("combobox_category_code").getSelectedKey();
                if (this._isNull(combobox_category_code)) {
                     bValidator = false;
                     this._setValueState( 
                        this.getView().byId("combobox_category_code"), 
                        this.getModel("I18N").getText("/ECM01001")
                    );
                 } 
            }


            bValidator = this._onPageValidate();

            //language table check
            var oTableLength = oTable.getItems().length;
            if (oTableLength < 1) {

                this._showMessageToast(this.getModel("I18N").getText("/NPG00009"));
                return false;
            }

            var input_mi_material_code = this.getView().byId("input_mi_material_code").getValue();
            
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

            var arrLanguage =[];
            var kolanguageCount = 0;
            for(var i=0;i<omIMaterialCodeText.oData.length;i++){
                
                if(omIMaterialCodeText.oData[i].language_code=="KO"){
                    kolanguageCount++;
                }
                arrLanguage.push(omIMaterialCodeText.oData[i].language_code);
            }
            
            if(kolanguageCount<1){
                this._showMessageToast(this.getModel("I18N").getText("/NPG00019"));
                return false;
            }

            var languageSet = new Set(arrLanguage);
            //console.log(arrLanguage.length);
            //console.log(languageSet.size);
            // duplicate
            if(arrLanguage.length !== languageSet.size) {
                bValidator = false;
                this._showMessageToast(this.getModel("I18N").getText("/NPG10017"));
                return;
            }
            
            // if(!bNullCheck){ 이미처리하고 있다...
            //     this._showMessageToast(this.getModel("I18N").getText("/NPG00010"));
            //     return false;
            // }
            return bValidator;
        },

        /**
         * 자재 중복 체크 
         * @param {*} input_mi_material_code 
         */
        _inputMartetial : function(input_mi_material_code){
            var oUi = this.getModel("oUi");
            var oModel = this.getModel();
            var that = this;

            var oMIMatListViewFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this._m.filter.tenant_id),
                new Filter("mi_material_code", FilterOperator.EQ, input_mi_material_code.getValue())
            ];

            var sServiceUrl = this._m.serviceName.mIMatListView;
            var itemLength = 0;
            oModel.read(sServiceUrl, {
                async: false,
                filters: oMIMatListViewFilters,
                success: function (rData, reponse) {

                    itemLength = reponse.data.results.length;

                    if (itemLength < 1) {
                        oUi.setProperty("/materialCheck", true);
                        input_mi_material_code.setValueState("None");//Success
                        input_mi_material_code.setValueStateText(that.getModel("I18N").getText("/NDP60001"));//NPG00003
                        //MessageToast.show(that.getModel("I18N").getText("/NDP60001"));
                        input_mi_material_code.openValueStateMessage();
                    } else {
                        oUi.setProperty("/materialCheck", false);
                        input_mi_material_code.setValueState("Error");
                        input_mi_material_code.setValueStateText(that.getModel("I18N").getText("/NDP60002"));
                        //MessageToast.show(that.getModel("I18N").getText("/NDP60002"));
                        input_mi_material_code.openValueStateMessage();
                    }
                }
            });
        },

        /**
         * Validate
         * @private 
         */
        _onPageValidate: function(){
            var _oUi = this.getModel("oUi"),
                bCheckValidate = true;

            if(_oUi.getProperty("/createMode")){
                bCheckValidate =  this.validator.validate(this.byId("mid_simpleForm"));
                if(bCheckValidate) {
                    this.validator.clearValueState(this.byId("mid_simpleForm"));
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
            //}
        },

        /**
         * Clear Validate
         * @private 
         */
        _onPageClearValidate: function(){
            this.validator.clearValueState(this.byId("mid_simpleForm"));
            this.validator.clearValueState(this.byId("midTable"));
        },

        /**
         * new Save
         */
        _onSave : function () {

            console.log("call function ==================== onSaveAction ====================");

 
            var omIMaterialCodeText = this.getOwnerComponent().getModel("mIMaterialCodeText"),
                oUiData = this.getModel("oUiData"),
                _deleteItem = this.getModel("_deleteItem"),                
                odataMode, o_mi_material_code,
                oUi = this.getModel("oUi"),
                oTable = this.getView().byId(this._m.tableName),
                oModel = this.getOwnerComponent().getModel(),
                materialCheck = oUi.getProperty("/materialCheck");

            if (materialCheck==false && oUi.getProperty("/createMode") == true) {
               // return;
            } else {

                var input_mi_material_code,
                    combobox_category_code,
                    segmentedbutton_use_flag = this.getView().byId("segmentedbutton_use_flag").getSelectedKey(),
                    msg = "";

                var bSegmentedbutton_use_flag = segmentedbutton_use_flag=="true"? true:false;

                if(oUi.getProperty("/createMode")){

                    input_mi_material_code = this.getView().byId("input_mi_material_code").getValue();
                    combobox_category_code = this.getView().byId("combobox_category_code").getSelectedKey();            
                    
                } else if (oUi.getProperty("/editMode")){

                    input_mi_material_code = oUiData.getProperty("/mi_material_code");
                    combobox_category_code = oUiData.getProperty("/category_code");
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

                var oMIMaterialCodeTextModel = this.getModel("mIMaterialCodeText");
                var _deleteItemOdata = _deleteItem.getProperty("/oData");

                var updateTableItem = 0;
                var createTableItem = 0;
                var deleteTableItem = 0;
                var updateItem = 0;
                var createItem = 0;

                for(var i=0; i<oMIMaterialCodeTextModel.oData.length; i++){

                    var itemMode = oMIMaterialCodeTextModel.oData[i].itemMode;
                    var org_language_code = oMIMaterialCodeTextModel.oData[i].org_language_code;
                    var language_code = oMIMaterialCodeTextModel.oData[i].language_code;
                    var mi_material_name = oMIMaterialCodeTextModel.oData[i].mi_material_name;
                 
                    if(itemMode==this._m.itemMode.create){
                        //언어키를 삭제 했다가 동일한 언어키를 다시 등록할경우
                        for(var idx=0;idx<_deleteItemOdata.length;idx++){
                            if(_deleteItemOdata[idx].language_code == language_code){
                                itemMode=this._m.itemMode.update; //Delete-> Insert보다 수정모드로 변경하여 처리 함
                                org_language_code = language_code;
                                _deleteItemOdata.splice(idx, 1);
                                break;
                            }
                        }
                    }

                    if(itemMode==this._m.itemMode.read){

                        //로드한 언어키를 변경하여 저장할경우 
                        if(org_language_code != language_code){                            
                            //키 변경 delete 등록 
                            //삭제를 위한 등록 
                            oMIMaterialCodeTextModel.oData[i].language_code = org_language_code;
                            _deleteItemOdata.push(oMIMaterialCodeTextModel.oData[i]);

                            //모드 변경으로 산규상태로 변경
                            itemMode=this._m.itemMode.create;
                        }
                    }

                    // MIMaterialCodeText table key : update delete 
                    var oMIMaterialCodeTextKey = {
                        tenant_id : oUiData.getProperty("/tenant_id"),
                        mi_material_code: oUiData.getProperty("/mi_material_code"),
                        language_code: language_code,
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
                        console.log(oMIMaterialCodeTextParameters+"--createEntry table item");
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

                } //for end 
                    

                /**delete MIMaterialCodeText table item  */
                var _deleteItemOdata = _deleteItem.getProperty("/oData");
                
                
                //table item delete action _deleteItem odata push data
                if(_deleteItemOdata.length>0){
                    var oDeleteMIMaterialCodeTextKey, oDeleteMIMaterialCodeTextPath;
                    
                    //적재 할때 신규는 담지 않는다. (수정이나 신규시 아이템 추가는 바로 삭제)
                    for(var i=0;i<_deleteItemOdata.length;i++){
                        oDeleteMIMaterialCodeTextKey = {
                            tenant_id : _deleteItemOdata[i].tenant_id,
                            mi_material_code: _deleteItemOdata[i].mi_material_code,
                            language_code:  _deleteItemOdata[i].language_code
                        }
        
                        oDeleteMIMaterialCodeTextPath = oModel.createKey(
                                this._m.serviceName.mIMaterialCodeText,
                                oDeleteMIMaterialCodeTextKey
                        );

                        oModel.remove(
                            oDeleteMIMaterialCodeTextPath, 
                            { 
                                groupId: this._m.groupID 
                            }
                        );

                        deleteTableItem++;    
                    }
                    _deleteItem.setProperty("/oData",[]);
                }
   
                //MIMaterialCode ---------------------------------------------------------------------------
                //대표자재가 지정 및 변경될경우 -----------------------------------------

                var oMIMaterialCodeParameters;

                //MIMaterialCode db key : update delete 
                var oMIMaterialCodeKey = {
                    tenant_id : oUiData.getProperty("/tenant_id"),
                    category_code: oUiData.getProperty("/category_code"),                    
                    mi_material_code: o_mi_material_code
                }
                

                var oMIMaterialCodePath = oModel.createKey(
                    this._m.serviceName.mIMaterialCode, 
                    oMIMaterialCodeKey
                );


              
                if (oUi.getProperty("/editMode")) {
                    console.log(oMIMaterialCodePath+" -- editMode");    

                    //사용여부를 변경했을때에만 수정
                    if(bSegmentedbutton_use_flag !=oUiData.getProperty("/use_flag")){
                        oMIMaterialCodeParameters = {
                            "use_flag": bSegmentedbutton_use_flag,
                            "local_create_dtm": new Date(),
                            "local_update_dtm": new Date(),
                            "create_user_id": this._sso.user.id,
                            "update_user_id": this._sso.user.id,
                            "system_create_dtm": new Date(),
                            "system_update_dtm": new Date()
                        };
                        console.log(oMIMaterialCodePath+" -- update");
                        oModel.update(oMIMaterialCodePath, 
                            oMIMaterialCodeParameters, { 
                                groupId: this._m.groupID 
                            }
                        );  
                        updateItem++;
                    }

                } else if (oUi.getProperty("/createMode")){
         
                    if(vMi_material_name==""){
                        vMi_material_name = mi_material_name;
                    }
                    oMIMaterialCodeParameters = {
                        "groupId": this._m.groupID ,
                        "properties": {
                            "tenant_id": this._sso.dept.tenant_id,
                            "mi_material_code": input_mi_material_code,
                            "category_code": combobox_category_code,
                            "use_flag": bSegmentedbutton_use_flag,
                            "local_create_dtm": new Date(),
                            "local_update_dtm": new Date(),
                            "create_user_id": this._sso.user.id,
                            "update_user_id": this._sso.user.id,
                            "system_create_dtm": new Date(),
                            "system_update_dtm": new Date()
                        }
                    };
                
                    console.log(this._m.serviceName.mIMaterialCode+" -- createEntry");
                    oModel.createEntry(this._m.serviceName.mIMaterialCode, oMIMaterialCodeParameters);
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

               // oModel.refresh(true);
                
            }
        },
        
        onChangeCombobox : function(oEvent){
            var oSource = oEvent.getSource();
           if(!oEvent.mParameters.itemPressed && oSource.getSelectedItemId() === "")oSource.setValue("");
        },

        /**
         * MIMatListView delete button action
         * @public
         */
        onDeleteAction : function () {
            console.log("onDeleteAction");
            var mTitle = this.getModel("I18N").getText("/DELETE") + " " + this.getModel("I18N").getText("/CONFIRM");

            if(!this._checkData())return; //!this._onPageValidate() || 

            //if(ValidatorUtil.isValid(this.getView(),"requiredField")){
                MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
                    title : mTitle,
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            this._deleteAction();
                        }else{
                            return;
                        }
                    }.bind(this)
                });
            //}else{
            //    console.log("onDeleteAction checkRequire")
            //}              
        },

        /**
         * MIMatListView delete action
         * @private
         */
        _deleteAction : function () {
            console.log("_deleteAction");
            var oModel = this.getOwnerComponent().getModel(),            
                oMIMaterialCodeText = this.getOwnerComponent().getModel("mIMaterialCodeText"),
                that = this,
                oUi = this.getModel("oUi"),
                oUiData = this.getModel("oUiData"),
                bEditFlag = oUi.getProperty("/editMode");
  
            
            //삭제전 BOM에서 사용되거나 가격관리 테이블에서 사용되는 시황자재 인지 확인한다. 
            /* tenant_id, mi_material_code 의 존재 유무로 확인(김종현 2020-12-23) */
     
            
            if(oMIMaterialCodeText==undefined){
                MessageToast.show(this.getModel("I18N").getText("/NCM01007"));  
                return;                 
            } 

            if(oMIMaterialCodeText.oData==null){
                MessageToast.show(this.getModel("I18N").getText("/NCM01007"));  
                return;                 
            }

            for(var i=0;i<oMIMaterialCodeText.oData.length;i++){
                var oMIMaterialCodeTextKey = {
                    tenant_id : oMIMaterialCodeText.oData[i].tenant_id,
                    mi_material_code: oMIMaterialCodeText.oData[i].mi_material_code,
                    language_code: oMIMaterialCodeText.oData[i].language_code,
                }

                var oMIMaterialCodeTextPath = oModel.createKey(
                    this._m.serviceName.mIMaterialCodeText,
                    oMIMaterialCodeTextKey
                );
    
                console.log(oMIMaterialCodeTextPath+"--delete");
                oModel.remove(oMIMaterialCodeTextPath, { groupId: this._m.groupID });                    
            }
            
            var oFilter = [
                new Filter("tenant_id", FilterOperator.EQ, oUiData.getProperty("/tenant_id")),
                new Filter("mi_material_code", FilterOperator.EQ, oUiData.getProperty("/mi_material_code"))
            ];
         
            if(bEditFlag){
                Promise.all([   that._readCheckBOMEntity(oFilter),
                                that._readCheckPriceEntity(oFilter)
                ]).then(that.deleteCheckAction.bind(that),
                        that.deleteChecklistError.bind(that));
            }
            
            //console.log("oDeleteActionMIMaterialCodeKey : "+oDeleteActionMIMaterialCodeKey+" --delete");
            // oModel.remove(oDeleteActionMIMaterialCodePath);
            //MIMaterialCodeText(tenant_id='L2100',mi_material_code='ALU-001-01',language_code='EN')"

            // oModel.setUseBatch(true);
            // oModel.submitChanges({
            //     groupId: this._m.groupID,
            //     success: this._handleDeleteSuccess.bind(this),
            //     error: this._handleDeleteError.bind(this)
            // });

            //this.onRefresh();

            //oModel.refresh();  
        },
        
       
        _readCheckBOMEntity : function(oFilter) {
            console.log("_readCheckBOMEntity");
            var that = this;
            return new Promise(function(resolve, reject) {
                that.getModel().read(that._m.serviceName.mIMaterialCodeBOMManagementItem, {
                    filters: oFilter,
                    success: function(oData) {		
                        console.log(">>_readCheckBOMEntity success");
                        resolve(oData);
                    },
                    error: function(oResult) {
                        reject(oResult);
                    }
                });
            });
        },

        _readCheckPriceEntity : function(oFilter) {
            console.log("_readCheckPriceEntity");
            
            var that = this;
            return new Promise(function(resolve, reject) {
                that.getModel().read(that._m.serviceName.mIMaterialPriceManagement, {
                    filters: oFilter,
                    success: function(oData) {		
                        console.log(">>_readCheckPriceEntity success");
                        resolve(oData);
                    },
                    error: function(oResult) {
                        reject(oResult);
                    }
                });
            });
        },

        deleteCheckAction: function(values) {
            var oBomCount  = values[0].results.length;
            var oPriceCount = values[1].results.length;
            var that = this;
            var oUiData = that.getModel("oUiData");
            var oModel = that.getModel();
            

            if(oBomCount>0 || oPriceCount>0){
                MessageToast.show(this.getModel("I18N").getText("/NPG00017"));
            }else{

                var oDeleteMIMaterialCodeKey = {
                    tenant_id : oUiData.getProperty("/tenant_id"),
                    mi_material_code: oUiData.getProperty("/mi_material_code"),
                    category_code:  oUiData.getProperty("/category_code")
                }                

                var deleteOdataPath = oModel.createKey(
                    this._m.serviceName.mIMaterialCode,
                    oDeleteMIMaterialCodeKey);

                oModel.remove(deleteOdataPath,{ 
                        groupId: this._m.groupID
                    }
                );   
                setTimeout(that._setUseBatch(), 1000);
                //that._setUseBatch(); 
                this._fnSetReadMode();   
                
                var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");

                setTimeout(that._onExit(), 1000);
                //that._onExit();

                that.getRouter().navTo("mainPage", { layout: sNextLayout });
             
            }
        },

        _setUseBatch : function() {
            console.log("_setUseBatch");
            
            var oModel = this.getModel();
            var that = this;
            
            oModel.setUseBatch(true);
           
            oModel.submitChanges({
                groupId: this._m.groupID,
                success: that._handleDeleteSuccess.bind(this),
                error: that._handleDeleteError.bind(this)
            });


            oModel.refresh(true);
        },

        deleteChecklistError: function(reason) {
            console.log(" deleteChecklistError reason : " + reason)		
        },

        /**
         * Exit
         * @private
         */
        _onExit: function () {    
            console.log("_onExit");
            this._initialModel();
            this._initialControlValue();
           

            for (var sPropertyName in this._formFragments) {
                if (!this._formFragments.hasOwnProperty(sPropertyName) || this._formFragments[sPropertyName] == null) {
                    return;
                }
               

                this._formFragments[sPropertyName].destroy();
                this._formFragments[sPropertyName] = null;
            }
        },

        onRefresh : function () {
            console.log("onRefresh");
            var oBinding = this.byId("midTable").getBinding("rows");
            this.getView().setBusy(true);
            oBinding.refresh();
            this.getView().setBusy(false);
        },

        _handleCreateSuccess: function (oData) {
            var that = this;
            var mTitle = that.getModel("I18N").getText("/SAVE") + " " + that.getModel("I18N").getText("/SUCCESS");	
            MessageBox.show(this.getModel("I18N").getText("/NCM01001"), {
                icon: MessageBox.Icon.SUCCESS,
                title: mTitle,
                actions: [MessageBox.Action.OK], 
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var sNextLayout = that.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
                        that._onExit();
                        that.getRouter().navTo("mainPage", { layout: sNextLayout });
                    }
                }
            });

            //var sNextLayout = this.getView().getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            //this._onExit();
            //this.getRouter().navTo("mainPage", { layout: sNextLayout });
         
        },
        _handleCreateError: function (oError) {
            var mTitle = this.getModel("I18N").getText("/SAVE") + " " + this.getModel("I18N").getText("/FAILURE");
            this._showMessageBox(
                mTitle,
                this.getModel("I18N").getText("/EPG00003"),
                this._m.messageType.Error,
                function(){return;}
            );
        },
        _handleUpdateSuccess: function (oData) {
            var that = this;
            var mTitle = that.getModel("I18N").getText("/UPDATE") + " " + that.getModel("I18N").getText("/SUCCESS");
            MessageBox.show(this.getModel("I18N").getText("/NPG00008"), {
                icon: MessageBox.Icon.SUCCESS,
                title: mTitle,
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
            var mTitle = this.getModel("I18N").getText("/UPDATE") + " " + this.getModel("I18N").getText("/FAILURE");
            this._showMessageBox(
                mTitle,
                this.getModel("I18N").getText("/EPG00002"),
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
            var mTitle = that.getModel("I18N").getText("/DELETE") + " " + that.getModel("I18N").getText("/SUCCESS");
            MessageBox.show(this.getModel("I18N").getText("/NCM01002"), {
                icon: MessageBox.Icon.SUCCESS,
                title: mTitle,
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
            var mTitle = this.getModel("I18N").getText("/DELETE") + " " + this.getModel("I18N").getText("/FAILURE");
            this._showMessageBox(
                mTitle,
                this.getModel("I18N").getText("/EPG00001"),
                this._m.messageType.Error,
                function(){return;}
            );
        },
        _setBusy : function (bIsBusy) {
			var oModel = this.getView().getModel("oUi");
			oModel.setProperty("/busy", bIsBusy);
		}	
    });
});