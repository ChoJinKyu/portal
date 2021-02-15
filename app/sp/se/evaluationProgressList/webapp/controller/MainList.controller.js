sap.ui.define([
	"./BaseController",
	"sap/f/library",						
    "sap/ui/model/Filter",					
    "sap/ui/model/Sorter",						
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "ext/lib/util/ExcelUtil",
    "sap/ui/table/TablePersoController",
    "./MainListPersoService",
    "sap/ui/core/ListItem",
    "sap/ui/core/Item"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * 2021-01-20 개발시작
     * A61987
     */
    function (Controller, fioriLibrary, Filter, Sorter, MessageBox, Multilingual, ExcelUtil, 
        TablePersoController, MainListPersoService, ListItem, Item) {
        "use strict";
        
		return Controller.extend("sp.se.evalProgressList.controller.MainList", {
            /***
             * 최초 한번 Init 설정
             */
			onInit: function () {
                var oView,oMultilingual, oComponent;
                
                oView = this.getView();
                oComponent = this.getOwnerComponent();
                oMultilingual = new Multilingual();

                oView.setModel(oMultilingual.getModel(), "I18N");
                
                this._bindOrgCodeComboItem();
                this._setMainListViewModel();
                this._doInitTablePerso();

                oComponent.getRouter().getRoute("MainList").attachPatternMatched(this._onProductMatched, this);
            }
            , _setMainListViewModel : function(){
                var oViewModel, oComponent;

                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");

                oViewModel.setProperty("/cond",{
                    EQ : {},
                    Contains : {}
                });
                oViewModel.setProperty("/Tree",{
                    "nodes": [],
                    "list": []
                });
                oViewModel.setProperty("/Btn",{});
            }
            /***
             * 평가조직 (orgCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindOrgCodeComboItem : function(){
                var oComboOrgCode, aFilters, oUserInfo;
                
                // 1.
                oComboOrgCode = this.byId("orgCode");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("company_code", "EQ", oUserInfo.companyCode),
                    new Filter("evaluation_op_unt_person_empno", "EQ", oUserInfo.evalPersonEmpno)
                ];
                oComboOrgCode.setSelectedKey();
                oComboOrgCode.bindItems({
                    path : "util>/UserEvalOrgView",
                    filters : aFilters,
                    template : new ListItem({ text : "{util>org_name}", key : "{util>org_code}", additionalText : "{util>org_code}" })
                });

                // 2.
                this.getOwnerComponent().getModel("util").read("/UserEvalOrgView",{
                    filters : aFilters,
                    urlParameters : { // odata 데이터중 한건만 가져오기
                        $top : 1
                    },
                    success : function(oData){
                        var aResults, sOrgCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            this._bindUnitComboItem(sOrgCode);
                            return;
                        }
                        sOrgCode = aResults[0].org_code;

                        oComboOrgCode.setSelectedKey(sOrgCode);

                        // 평가조직 값에따른 평가운영단위 콤보박스 설정
                        this._bindUnitComboItem(sOrgCode);
                            
                    }.bind(this),
                    error : function(){
                        
                    }
                });
            }
            /***
             * 평가운영단위 (unitCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindUnitComboItem : function(sOrgCode){
                var oComboUnitCode, aFilters, oUserInfo;

                oComboUnitCode = this.byId("unitCode");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("company_code", "EQ", oUserInfo.companyCode),
                    new Filter("evaluation_op_unt_person_empno", "EQ", oUserInfo.evalPersonEmpno),
                    new Filter("org_code", "EQ", sOrgCode)
                ];
                oComboUnitCode.setSelectedKeys();
                if(!sOrgCode){
                    // this._bindEavluTypeItem();
                    return;
                }
                oComboUnitCode.bindItems({
                    path : "util>/UserEvalUnitView",
                    filters : aFilters,
                    template : new ListItem({ 
                        text : "{util>evaluation_operation_unit_name}", 
                        key : "{util>evaluation_operation_unit_code}", 
                        additionalText : "{util>evaluation_operation_unit_code}" 
                    })
                });

                this.getOwnerComponent().getModel("util").read("/UserEvalUnitView",{
                    filters : aFilters,
                    urlParameters : {
                        $top : 1
                    },
                    success : function(oData){
                        var aResults, sEvalOperationUnitCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            // this._bindEavluTypeItem(sOrgCode, sEvalOperationUnitCode);
                            return;
                        }
                        sEvalOperationUnitCode = aResults[0].evaluation_operation_unit_code;

                        oComboUnitCode.setSelectedKeys(sEvalOperationUnitCode);
                        // this._bindEavluTypeItem(sOrgCode, sEvalOperationUnitCode);
                    }.bind(this),
                    error : function(){
                        
                    }
                });
            }
            /***
             * 평가유형 (eavluType) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindEavluTypeItem : function(sOrgCode, sEvaluOperationUnitCode, sSelectedKey ){
                var oBtnEavluType, aFilters, oUserInfo, oComponent, oViewModel;

                oBtnEavluType = this.byId("evaluType");
                oComponent = this.getOwnerComponent();
                oUserInfo = this._getUserSession();
                oViewModel = oComponent.getModel("viewModel");
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("company_code", "EQ", oUserInfo.companyCode),
                    new Filter("evaluation_operation_unit_code", "EQ", sEvaluOperationUnitCode),
                    new Filter("org_code", "EQ", sOrgCode),
                    new Filter("use_flag", "EQ", true)
                ];

                oBtnEavluType.setSelectedKey();
                oBtnEavluType.removeAllItems();
                // oViewModel.setProperty("/Btn/UserEvalType", false);
                // if(!sEvaluOperationUnitCode || !sOrgCode){
                //     return;
                // }
                oBtnEavluType.bindItems({
                    path : "util>/UserEvalTypeView",
                    filters : aFilters,
                    template : new SegmentedButtonItem({ 
                        text : "{util>evaluation_type_name}", 
                        key : "{util>evaluation_type_code}"
                    })
                });

                oComponent.getModel("util").read("/UserEvalTypeView",{
                    filters : aFilters,
                    // urlParameters : {
                    //     $top : 1
                    // },
                    success : function(oData){
                        var aResults, sEvaluTypeCode, bNewFlg;

                        aResults = oData.results;
                        bNewFlg = false;
                        if(!aResults.length){
                            oViewModel.setProperty("/Btn/UserEvalType", bNewFlg);
                            return;
                        }
                        if(aResults[0].new_flag === "Y"){
                            bNewFlg = true;
                        }
                        sEvaluTypeCode = aResults[0].evaluation_type_code;
                        
                        if(sSelectedKey){
                            oBtnEavluType.setSelectedKey(sSelectedKey);
                            aResults.some(function(item){
                                if(item.evaluation_type_code === sSelectedKey){
                                    if(item.new_flag === "Y"){
                                        bNewFlg = true;
                                    }else{
                                        bNewFlg = false;
                                    }
                                }
                                return item.evaluation_type_code === sSelectedKey;
                            });
                        }else{
                            oBtnEavluType.setSelectedKey(sEvaluTypeCode);
                        }

                        oViewModel.setProperty("/Btn/UserEvalType", bNewFlg);
                    },
                    error : function(){
                        
                    }
                });
            }
            /***
             * MainList Pattern Matched Evnet
             * 해당 패턴이 일치할때마다 이벤트 발생
             * @param e > Event 객체
             */
            , _onProductMatched: function (e) {
                var oArgs, oComponent, oViewModel;

                oArgs = e.getParameter("arguments");
                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");

                if(oArgs.search){
                    this.onPressSearch();
                }

                this._clearValueState(
                    this.getView().getControlsByFieldGroupId("searchRequired")
                );

                oViewModel.setProperty("/App/btnScreen", "sap-icon://full-screen");

                // this.byId("page").setHeaderExpanded(true);
            }
            /***
             * 신규 생성 이벤트
             * @param oEvent - 이벤트 객체
             * @param sBtnGubun - 버튼 구분자
             */
            , onPressCreate : function(oEvent, sBtnGubun){
                var oNavParam;
                oNavParam = {
                    new : "Y"
                };
                //leaf
                this.getOwnerComponent().getRouter().navTo("Detail", oNavParam);
            }
            /***
             * 데이터 조회
             */
            , onPressSearch : function(){
                var oTable, oView, aFilters, oUserInfo, oViewModel, oCondData, oODataModel;

                oTable = this.byId("treeTable");
                oView = this.getView();
                oUserInfo = this._getUserSession();
                oViewModel = oView.getModel("viewModel");
                oODataModel = oView.getModel();
                //조회용 데이터
                oCondData = oViewModel.getProperty("/cond");
                aFilters = [
                    new Filter({ path:"tenant_id", operator : "EQ", value1 : oUserInfo.tenantId }),
                    new Filter({ path:"company_code", operator:"EQ", value1 : oUserInfo.companyCode }),
                    new Filter({ path:"org_type_code", operator:"EQ", value1 : oUserInfo.orgTypeCode }),

                ];

                //필수입력체크
                var aControls = oView.getControlsByFieldGroupId("searchRequired"),
                    bValid = this._isValidControl(aControls);

                if(!bValid){
                    return;
                }

                //미리 세팅해둔 경로를 바탕으로 Filter를 생성한다.
                /**
                 * EQ {
                 *    Field
                 * }
                 * Contains {
                 *    Field
                 * }
                 */
                for(var operator in oCondData){
                    if(oCondData.hasOwnProperty(operator)){
                        for(var field in oCondData[operator]){
                            if(oCondData[operator].hasOwnProperty(field) && oCondData[operator][field]){
                                if(operator === "Contains" && typeof oCondData[operator][field] === "string"){
                                    aFilters.push(
                                        new Filter({ path : "tolower(" + field + ")", operator : operator, value1 : "'" + oCondData[operator][field].toLowerCase().replace("'","''") + "'" })
                                    );
                                    continue;
                                }else if(operator === "BT"){
                                    if(oCondData[operator][field].value1 || oCondData[operator][field].value2){
                                        aFilters.push(
                                            new Filter({ path : field, operator : operator, value1 : oCondData[operator][field].value1, value2 : oCondData[operator][field].value2 })
                                        );
                                    }
                                    continue;
                                }
                                aFilters.push(
                                    new Filter({ path : field, operator : operator, value1 : oCondData[operator][field] })
                                );
                            }
                        }
                    }
                }
                
                oViewModel.setProperty("/Tree",{
                    "nodes": [],
                    "list": []
                });

                oView.setBusy(true);
                oView.setBusyIndicatorDelay(0);
                this._readOdata({
                    model : this.getModel(),
                    path : "/EvalItemListView",
                    param : {
                        filters : aFilters,
                        sorters: [new Sorter("hierarchy_rank")]
                    }
                })
                // 성공시
                .then((function (jNodes) {

                    oViewModel.setProperty("/Tree",
                        {
                            "nodes": jNodes[0],
                            "list": jNodes[1].results
                        }
                    );
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                })
                // 모래시계해제
                .finally((function () {
                    this.getView().setBusy(false);
                }).bind(this));


            }

            , onExcelExport : function(){
                var oTable, oView, oViewModel, oI18nModel, oResourceBundle, aTreeData;

                oTable = this.byId("treeTable");
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                oI18nModel = oView.getModel("i18n");
                oResourceBundle = oI18nModel.getResourceBundle();
                aTreeData = oViewModel.getProperty("/Tree/list");

                ExcelUtil.fnExportGridTable({
                    fileName : oResourceBundle.getText("appTitle"),
                    column : oTable,
                    data : aTreeData
                });
            }

            , _doInitTablePerso: function () {
                // init and activate controller
                this._oTPC = new TablePersoController({
                    table: this.byId("treeTable"),
                    persoService: MainListPersoService
                });
            }
            ,  onMainTablePersoButtonPressed: function () {
                this._oTPC.openDialog({
                    contentHeight : "30em"
                });
            }

		});
	});
