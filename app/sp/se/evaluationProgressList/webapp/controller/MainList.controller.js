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
    "sap/ui/core/Item",
    "sap/m/SegmentedButtonItem"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * 2021-02-15 개발시작
     * A61788
     */
    function (Controller, fioriLibrary, Filter, Sorter, MessageBox, Multilingual, ExcelUtil, 
        TablePersoController, MainListPersoService, ListItem, Item, SegmentedButtonItem) {
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
                
                this._setMainListViewModel();

                this._bindOrgCodeComboItem();
                this._bindEvalYearComboItem();
                this._bindPeriodCodeItem();
                
                // this._doInitTablePerso();
                //this._bindMainListTable();

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
                //oComboOrgCode.setSelectedKey();
                oComboOrgCode.bindItems({
                    path : "util>/UserEvalOrgView",
                    filters : aFilters,
                    template : new ListItem({ text : "{util>org_name}", key : "{util>org_code}", additionalText : "{util>org_code}" })
                });

                // 2.
                // this.getOwnerComponent().getModel("util").read("/UserEvalOrgView",{
                //     filters : aFilters,
                //     urlParameters : { // odata 데이터중 한건만 가져오기
                //         $top : 1
                //     },
                //     success : function(oData){
                //         var aResults, sOrgCode;

                //         aResults = oData.results;
                //         if(!aResults.length){
                //             this._bindUnitComboItem(sOrgCode);
                //             return;
                //         }
                //         sOrgCode = aResults[0].org_code;

                //         oComboOrgCode.setSelectedKey(sOrgCode);

                //         // 평가조직 값에따른 평가운영단위 콤보박스 설정
                //         this._bindUnitComboItem(sOrgCode);
                            
                //     }.bind(this),
                //     error : function(){
                        
                //     }
                // });
            }
            /***
             * 평가운영단위 (unitCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindUnitComboItem : function(sOrgCode){
                var oComboUnitCode, aFilters, oUserInfo;

                //평가운영단위
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
                    this._bindEvalTypeMultiComboItem();
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

                // this.getOwnerComponent().getModel("util").read("/UserEvalUnitView",{
                //     filters : aFilters,
                //     urlParameters : {
                //         $top : 1
                //     },
                //     success : function(oData){
                //         var aResults, sEvalOperationUnitCode;

                //         aResults = oData.results;
                //         if(!aResults.length){
                //             this._bindEvalTypeMultiComboItem(sOrgCode, sEvalOperationUnitCode);
                //             return;
                //         }
                //         sEvalOperationUnitCode = aResults[0].evaluation_operation_unit_code;

                //         oComboUnitCode.setSelectedKeys(sEvalOperationUnitCode);
                //         this._bindEvalTypeMultiComboItem(sOrgCode, sEvalOperationUnitCode);
                //     }.bind(this),
                //     error : function(){
                        
                //     }
                // });
            }
            /***
             * 평가유형 (eavluType) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindEvalTypeMultiComboItem : function(sOrgCode, aEvaluOperationUnitCode){
                var oMultiComboTypeCode, aFilters, oUserInfo;

                    oMultiComboTypeCode = this.byId("evaluType");
                    oUserInfo = this._getUserSession();
                    aFilters = [
                        new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                        new Filter("company_code", "EQ", oUserInfo.companyCode),
                        new Filter("org_code", "EQ", sOrgCode),
                        //new Filter("evaluation_operation_unit_code", "EQ", aEvaluOperationUnitCode)
                    ];

                    if(aEvaluOperationUnitCode.length>0){
                       aEvaluOperationUnitCode.map(
                            function(item){
                            aFilters.push(
                                new Filter("evaluation_operation_unit_code", "EQ", item)
                            )}
                        );
                    }
                    

                    oMultiComboTypeCode.setSelectedKeys();
                    if(!sOrgCode){
                        // this._bindEvalTypeMultiComboItem();
                        return;
                    }
                    oMultiComboTypeCode.bindItems({
                        path : "util>/UserEvalTypeView",
                        filters : aFilters,
                        template : new ListItem({ 
                            text : "{util>evaluation_type_name}", 
                            key : "{util>evaluation_type_code}", 
                            additionalText : "{util>evaluation_type_code}" 
                        })
                    });

                    // this.getOwnerComponent().getModel("util").read("/UserEvalType",{
                    //     filters : aFilters,
                    //     urlParameters : {
                    //         $top : 1
                    //     },
                    //     success : function(oData){
                    //         var aResults, sEvalTypeCode;

                    //         aResults = oData.results;
                    //         if(!aResults.length){
                    //             this._bindEvalTypeMultiComboItem(sOrgCode, sEvalTypeCode);
                    //             return;
                    //         }
                    //         sEvalTypeCode = aResults[0].evaluation_operation_unit_code;

                    //         oMultiComboTypeCode.setSelectedKeys(sEvalTypeCode);
                    //         this._bindEvalTypeMultiComboItem(sOrgCode, sEvalTypeCode);
                    //     }.bind(this),
                    //     error : function(){
                            
                    //     }
                    // });
            }
             /***
             * 평가년도 (EvalYear) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * x 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindEvalYearComboItem : function(){
                var oComboUnitCode, aFilters, oUserInfo;

                //평가운영단위
                oComboUnitCode = this.byId("evalYear");
                
                oComboUnitCode.setSelectedKey();

                oComboUnitCode.bindItems({
                    path : "util>/YearView",
                    filters : aFilters,
                    template : new Item({ 
                        text : "{util>year_code}", 
                        key : "{util>year_name}"
                    })
                });
            }
             /***
             * 평가년도 (PeriodCode) 버튼 아이템 바인딩
             * 1. odata를 읽어 아이템을 구성한다.
             * x 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindPeriodCodeItem : function(){
                var oButtonPeriodCode, aFilters, oUserInfo;

                //평가운영단위
                oButtonPeriodCode = this.byId("periodCode");
                
                //oButtonPeriodCode.setSelectedKey();
                oButtonPeriodCode.destroyItems();
                oButtonPeriodCode.setSelectedKey();

                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("group_code", "EQ", "SP_SE_EVAL_PERIOD_CODE"),
                    new Filter("language_cd", "EQ", "KO")
                ];
                
                this.getOwnerComponent().getModel("common").read("/Code",{
                    filters : aFilters,
                    success : function(oData){
                        var aResults, sEvalOperationUnitCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            return;
                        }
                        aResults.map(
                            function(item){
                                oButtonPeriodCode.addItem(
                                     new SegmentedButtonItem({ 
                                        text : item.code_name, 
                                        key : item.code
                                    })
                                );
                            }
                        );

                    }.bind(this),
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
                    // this.onPressSearch();
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
                this.getOwnerComponent().getRouter().navTo("SheetMgt", oNavParam);
            }
            /***
             * 데이터 조회
             */
            , onPressSearch : function(){
                var oTable, oView, aFilters, oUserInfo, oViewModel, oCondData, oODataModel;

                oTable = this.byId("mainListTable");
                oView = this.getView();
                oUserInfo = this._getUserSession();
                oViewModel = oView.getModel("viewModel");
                oODataModel = oView.getModel();
                //조회용 데이터
                oCondData = oViewModel.getProperty("/cond");
                aFilters = [
                    new Filter({ path:"language_cd", operator : "EQ", value1 : "KO" }),
                    new Filter({ path:"tenant_id", operator : "EQ", value1 : oUserInfo.tenantId }),
                    new Filter({ path:"company_code", operator:"EQ", value1 : oUserInfo.companyCode })

                    // new Filter({ path:"evaluation_operation_unit_code", operator:"IN", value1:oViewModel.evaluation_operation_unit_code }),
                    // new Filter({ path:"evaluation_type_code", operator:"IN", value1:oViewModel.evaluation_type_code }),
                    // new Filter({ path:"regular_evaluation_year", operator:"EQ", value1:oViewModel.year_code }),
                    // new Filter({ path:"regular_evaluation_period_code", operator:"EQ", value1:oViewModel.code }),
                    // new Filter({ path:"regular.evaluation_name", operator:"LIKE",  value1:oViewModel.evaluation_name })
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
                
                // oViewModel.setProperty("/Tree",{
                //     "nodes": [],
                //     "list": []
                // });

                oView.setBusy(true);
                oView.setBusyIndicatorDelay(0);
                this._readOdata({
                    model : this.getModel(),
                    path : "/ListView",
                    param : {
                        filters : aFilters,
                        sorters: [new Sorter("regular_evaluation_id")]
                    }
                })
                // 성공시
                .then((function (oData) {
                        debugger;
                    // oViewModel.setProperty("/Tree",
                    //     {
                    //         "nodes": jNodes[0],
                    //         "list": jNodes[1].results
                    //     }
                    // );
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                    debugger;
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
            , onSelectionChangeOrgCode : function(oEvent){
                var sOrgCode, oControl;

                oControl = oEvent.getSource();
                sOrgCode = oControl.getSelectedKey();

                if(!sOrgCode){
                    return;
                }

                this._bindUnitComboItem(sOrgCode);
            }
            , onSelectionChangeUnitCode : function(oEvent){
                var sOrgCode, aEvalOperationUnitCode, oControl, oComboOrgCode;
                
                oControl = oEvent.getSource();
                oComboOrgCode = this.byId("orgCode");
                sOrgCode = oComboOrgCode.getSelectedKey();
                aEvalOperationUnitCode = oControl.getSelectedKeys();

                if(!aEvalOperationUnitCode){
                    return;
                }

                this._bindEvalTypeMultiComboItem(sOrgCode, aEvalOperationUnitCode);
            }

            // , onSelectionChangeEvaluTypeCode : function(oEvent){
            //     var oControl, oView, oViewModel, bUserEvalType, 
            //         oBinding, aContexts, oSeletedItem, sSelectedKey,
            //         oSeletedData;

            //     oControl = oEvent.getSource();
            //     oView = this.getView();
            //     oViewModel = oView.getModel("viewModel");
            //     bUserEvalType = false;
            //     oBinding = oControl.getBinding("items");
            //     aContexts = oBinding.getContexts();
            //     sSelectedKey = oControl.getSelectedKey();

            //     oSeletedItem = aContexts.filter(function(oContext){
            //         var oRowData = oContext.getObject();
            //         return sSelectedKey === oRowData.evaluation_type_code;
            //     })[0];

            //     if(oSeletedItem){
            //         oSeletedData = oSeletedItem.getObject();
            //         bUserEvalType = oSeletedData.new_flag === "Y" ? true : false;
            //     }

            //     oViewModel.setProperty("/Btn/UserEvalType", bUserEvalType);
            // }


		});
	});
