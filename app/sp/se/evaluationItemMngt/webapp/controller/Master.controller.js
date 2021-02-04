sap.ui.define([
	"./BaseController",
	"sap/f/library",						
    "sap/ui/model/Filter",					
    "sap/ui/model/Sorter",						
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "sap/ui/core/ListItem",
    "sap/m/SegmentedButtonItem",
    "ext/lib/util/ExcelUtil",
    "sap/ui/table/TablePersoController",
	"./MainListPersoService"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * 2021-01-20 개발시작
     * A61987
     */
    function (Controller, fioriLibrary, Filter, Sorter, MessageBox, Multilingual, ListItem, SegmentedButtonItem, ExcelUtil, 
        TablePersoController, MainListPersoService) {
        "use strict";
        
		return Controller.extend("sp.se.evaluationItemMngt.controller.Master", {
            /***
             * 최초 한번 Init 설정
             */
			onInit: function () {
                var oView,oMultilingual, oComponent, oViewModel;
                
                oView = this.getView();
                oComponent = this.getOwnerComponent();
                oMultilingual = new Multilingual();
                oViewModel = oComponent.getModel("viewModel");

                oView.setModel(oMultilingual.getModel(), "I18N");
                oViewModel.setProperty("/cond",{
                    EQ : {},
                    Contains : {}
                });
                oViewModel.setProperty("/Tree",{
                    "nodes": [],
                    "list": []
                });
                
                this._bindOrgCodeComboItem();
                this._setEvaluExecuteModeItem();
                this._doInitTablePerso();

                oComponent.getRouter().getRoute("Master").attachPatternMatched(this._onProductMatched, this);
            }
            /***
             * Master Pattern Matched Evnet
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

                oViewModel.setProperty("/App/layout", "OneColumn");

                this.byId("page").setHeaderExpanded(true);
            }
            /***
             * 평가조직 (orgCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindOrgCodeComboItem : function(){
                var oComboOrgCode, aFilters, oUserInfo;

                oComboOrgCode = this.byId("orgCode");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("company_code", "EQ", oUserInfo.companyCode),
                    new Filter("evaluation_op_unt_person_empno", "EQ", oUserInfo.evalPersonEmpno)
                ];

                oComboOrgCode.bindItems({
                    path : "/UserEvalOrgView",
                    filters : aFilters,
                    template : new ListItem({ text : "{org_name}", key : "{org_code}", additionalText : "{org_code}" })
                });

                this.getOwnerComponent().getModel().read("/UserEvalOrgView",{
                    filters : aFilters,
                    urlParameters : {
                        $top : 1
                    },
                    success : function(oData){
                        var aResults, sOrgCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            return;
                        }
                        sOrgCode = aResults[0].org_code;

                        oComboOrgCode.setSelectedKey(sOrgCode);
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

                oComboUnitCode.bindItems({
                    path : "/UserEvalUnitView",
                    filters : aFilters,
                    template : new ListItem({ 
                        text : "{evaluation_operation_unit_name}", 
                        key : "{evaluation_operation_unit_code}", 
                        additionalText : "{evaluation_operation_unit_code}" 
                    })
                });

                this.getOwnerComponent().getModel().read("/UserEvalUnitView",{
                    filters : aFilters,
                    urlParameters : {
                        $top : 1
                    },
                    success : function(oData){
                        var aResults, sEvalOperationUnitCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            return;
                        }
                        sEvalOperationUnitCode = aResults[0].evaluation_operation_unit_code;

                        oComboUnitCode.setSelectedKey(sEvalOperationUnitCode);
                        this._bindEavluTypeItem(sOrgCode, sEvalOperationUnitCode);
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
            , _bindEavluTypeItem : function(sOrgCode, sEvaluOperationUnitCode ){
                var oBtnEavluType, aFilters, oUserInfo;

                oBtnEavluType = this.byId("evaluType");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("company_code", "EQ", oUserInfo.companyCode),
                    new Filter("evaluation_operation_unit_code", "EQ", sEvaluOperationUnitCode),
                    new Filter("org_code", "EQ", sOrgCode),
                    new Filter("use_flag", "EQ", true)
                ];

                oBtnEavluType.bindItems({
                    path : "/UserEvalType",
                    filters : aFilters,
                    template : new SegmentedButtonItem({ 
                        text : "{evaluation_type_name}", 
                        key : "{evaluation_type_code}"
                    })
                });

                this.getOwnerComponent().getModel().read("/UserEvalType",{
                    filters : aFilters,
                    urlParameters : {
                        $top : 1
                    },
                    success : function(oData){
                        var aResults, sEvaluTypeCode;

                        aResults = oData.results;
                        if(!aResults.length){
                            return;
                        }
                        sEvaluTypeCode = aResults[0].evaluation_type_code;

                        oBtnEavluType.setSelectedKey(sEvaluTypeCode);
                    },
                    error : function(){
                        
                    }
                });
            }
            /***
             * 평가조직 (orgCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _setEvaluExecuteModeItem : function(){
                var oBtnEvaluExecuteMode, aFilters, oUserInfo;

                oBtnEvaluExecuteMode = this.byId("evaluExecuteMode");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("group_code", "EQ", "SP_SE_EVAL_ARTICLE_TYPE_CODE"),
                    new Filter("language_cd", "EQ", "KO")
                ];

                oBtnEvaluExecuteMode.destroyItems();
                this.getOwnerComponent().getModel("common").read("/Code",{
                    filters : aFilters,
                    sorters : [
                        new Sorter("sort_no")
                    ],
                    success : function(oData){
                        var aResults, sOrgCode;

                        aResults = oData.results;
                        oBtnEvaluExecuteMode.addItem(
                            new SegmentedButtonItem({ 
                                text : "All", 
                                key : ""
                            })
                        );
                        if(!aResults.length){
                            return;
                        }
                        aResults.forEach(function(item){
                            oBtnEvaluExecuteMode.addItem(
                                new SegmentedButtonItem({ 
                                    text : item.code_name, 
                                    key : item.code
                                })
                            );
                        });
                        oBtnEvaluExecuteMode.setSelectedKey("");
                    }.bind(this),
                    error : function(){
                        
                    }
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
                var sOrgCode, sEvalOperationUnitCode, oControl, oComboOrgCode;
                
                oControl = oEvent.getSource();
                oComboOrgCode = this.byId("orgCode");
                sOrgCode = oComboOrgCode.getSelectedKey();
                sEvalOperationUnitCode = oControl.getSelectedKey();

                if(!sEvalOperationUnitCode){
                    return;
                }

                this._bindEavluTypeItem(sOrgCode, sEvalOperationUnitCode);
            }
            /***
             * 신규 생성 이벤트
             * @param oEvent - 이벤트 객체
             * @param sBtnGubun - 버튼 구분자
             */
            , onPressCreate : function(oEvent, sBtnGubun){
                var oNavParam, oTreeTable, aSelectedIdx, oContext, oRowData, oViewModel,
                    oView, oI18NModel;

                oTreeTable = this.byId("treeTable");
                aSelectedIdx = oTreeTable.getSelectedIndices();

                if(!aSelectedIdx.length){
                    MessageBox.warning("선택된 데이터가 없습니다.");
                    return;
                }

                oNavParam = {};
                oNavParam.new = "Y";

                if(sBtnGubun === "SameLevel"){
                    oNavParam.level = "same";
                }else if(sBtnGubun === "LowLevel"){
                    oNavParam.level = "low";
                }
                oContext = oTreeTable.getContextByIndex(aSelectedIdx[0]);
                oRowData = this._deepCopy( oContext.getObject() );
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");

                oRowData.evaluation_execute_mode_code = oRowData.evaluation_execute_mode_code || "QLTVE_EVAL";
                oRowData.evaluation_article_type_code = oRowData.evaluation_article_type_code || "QLTVE_EVAL";
                oRowData.qttive_eval_article_calc_formula = oRowData.qttive_eval_article_calc_formula || "";

                if(oRowData.leaf_flag === "Y" && sBtnGubun === "LowLevel"){
                    oI18NModel = oView.getModel("I18N");
                    MessageBox.warning(oI18NModel.getProperty("/ESP00001"));
                    return;
                }

                oViewModel.setProperty("/Detail", {
                    Header : oRowData,
                    NewHeader : {}
                });

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
                    var aTableFilter = [
                    new Filter({ path:"tenant_id", operator : "EQ", value1 : oUserInfo.tenantId }),
                    new Filter({ path:"company_code", operator:"EQ", value1 : oUserInfo.companyCode }),
                    new Filter({ path:"org_type_code", operator:"EQ", value1 : oUserInfo.orgTypeCode })
                ];

                if(oCondData.EQ.org_code){
                    aTableFilter.push(
                        new Filter({ path:"org_code", operator:"EQ", value1 : oCondData.EQ.org_code })
                    );
                }
                if(oCondData.EQ.evaluation_operation_unit_code){
                    aTableFilter.push(
                        new Filter({ path:"evaluation_operation_unit_code", operator:"EQ", value1 : oCondData.EQ.evaluation_operation_unit_code })
                    );
                }
                if(oCondData.EQ.evaluation_type_code){
                    aTableFilter.push(
                        new Filter({ path:"evaluation_type_code", operator:"EQ", value1 : oCondData.EQ.evaluation_type_code })
                    );
                }
                oView.setBusy(true);
                oView.setBusyIndicatorDelay(0);
                this.read(this.getModel(), "/EvalItemListView", {
                    filters: aFilters,
                    sorters: [new Sorter("hierarchy_rank")]
                }, aTableFilter)
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

                    //2021-02-04 Odata Tree 구조에서 Json Tree 구조로 변경
                // if(!oCondData.EQ.evaluation_article_type_code && !oCondData.Contains.evaluation_article_name){
                    /*** 
                     * Tree 구조에선 상위 0 level 만 조건으로 걸린다.
                     * 평가항목구분과 평가항목명은 하위 항목에 대한 데이터 이므로 
                     * 별다른 작업없이 호출
                     */
                    // oTable.bindRows({
                    //     path : "/EvalItemListView",
                    //     filters : aFilters,
                    //     sorter : [
                    //         new Sorter("hierarchy_rank")
                    //     ],
                    //     parameters : {
                    //         countMode: 'Inline',
                    //         treeAnnotationProperties : {
                    //             hierarchyLevelFor : 'hierarchy_level',
                    //             hierarchyNodeFor : 'evaluation_article_code',
                    //             hierarchyParentNodeFor : 'parent_evaluation_article_code',
                    //             hierarchyDrillStateFor : 'drill_state',
                    //             numberOfExpandedLevels : 5
                    //         }
                    //     },
                    //     events : {
                    //         dataRequested : function(){
                    //             oView.setBusy(true);
                    //         },
                    //         dataReceived : function(){
                    //             oView.setBusy(false);
                    //         }
                    //     }
                    // });
                //     return;
                // }
                /***
                 * Tree 구조에선 상위 0 level 만 조건으로 걸린다.
                 * 하위 항목에 대한 평가항목구분과 평가항목명에 대한 조건은
                 * Odata 를 level 조건 없이 조회한후 
                 * 해당 상위 level을 읽어온다.
                 * 
                 */
                // oView.setBusy(true);
                // this._readOdata({
                //     model : oODataModel,
                //     entity : "/EvalItemListView",
                //     param : {
                //         path : "/EvalItemListView", 
                //         filters : aFilters,
                //         error : function(){
                //             oView.setBusy(false);
                //         },
                //         success : function(oData){
                //             var aDataKeys, aDummyFilters, aTableFilter, aResults;
                //             aDataKeys = [];
                //             aDummyFilters = [];
                //             aTableFilter = [];
                //             aResults = oData.results;

                //             aResults.forEach(function(oRowData){
                //                 for(var i = 1, len = 5; i < 6; i++){
                //                     var sCode = oRowData["evaluation_article_level" + i + "_code"];
                //                     if(!sCode){
                //                         continue;
                //                     }
                //                     if(aDataKeys.indexOf(sCode) === -1){
                //                         aDataKeys.push(sCode);
                //                         aDummyFilters.push(
                //                             new Filter({ path : "evaluation_article_code", operator : "EQ", value1 : sCode })
                //                         );
                //                     }
                //                 }
                //             });
                            
                //             aTableFilter = [
                //                 new Filter({ path:"tenant_id", operator : "EQ", value1 : oUserInfo.tenantId }),
                //                 new Filter({ path:"company_code", operator:"EQ", value1 : oUserInfo.companyCode }),
                //                 new Filter({ path:"org_type_code", operator:"EQ", value1 : oUserInfo.orgTypeCode })
                //             ];

                //             aTableFilter.push(
                //                 new Filter({ filters : aDummyFilters, and : false })
                //             );
                            
                //             if(oCondData.EQ.org_code){
                //                 aTableFilter.push(
                //                     new Filter({ path:"org_code", operator:"EQ", value1 : oCondData.EQ.org_code })
                //                 );
                //             }
                //             if(oCondData.EQ.evaluation_operation_unit_code){
                //                 aTableFilter.push(
                //                     new Filter({ path:"evaluation_operation_unit_code", operator:"EQ", value1 : oCondData.EQ.evaluation_operation_unit_code })
                //                 );
                //             }
                //             if(oCondData.EQ.evaluation_type_code){
                //                 aTableFilter.push(
                //                     new Filter({ path:"evaluation_type_code", operator:"EQ", value1 : oCondData.EQ.evaluation_type_code })
                //                 );
                //             }

                //             oTable.bindRows({
                //                 path : "/EvalItemListView",
                //                 filters : aTableFilter,
                //                 sorter : [
                //                     new Sorter("hierarchy_rank")
                //                 ],
                //                 parameters : {
                //                     countMode: 'Inline',
                //                     treeAnnotationProperties : {
                //                         hierarchyLevelFor : 'hierarchy_level',
                //                         hierarchyNodeFor : 'evaluation_article_code',
                //                         hierarchyParentNodeFor : 'parent_evaluation_article_code',
                //                         hierarchyDrillStateFor : 'drill_state',
                //                         numberOfExpandedLevels : 5
                //                     }
                //                 },
                //                 events : {
                //                     dataRequested : function(){
                //                         oView.setBusy(true);
                //                     },
                //                     dataReceived : function(){
                //                         oView.setBusy(false);
                //                     }
                //                 }
                //             });
                //         }
                //     }
                // });

            }
            
            , onPressCollapseAll : function(){
                var oTreeTable;
                oTreeTable = this.byId("treeTable");
                oTreeTable.collapseAll();
            }

            , onPressExpandAll : function(){
                var oTreeTable;
                oTreeTable = this.byId("treeTable");
                oTreeTable.expandToLevel(5);
            }

            , onRowSelectionChange : function(oEvent){
                var oNavParam, oTable, aSelectedIdx, oContext, oRowData, oViewModel;
                
                oNavParam = {};
                oNavParam.new = "N";

                oTable = oEvent.getSource();
                aSelectedIdx = oTable.getSelectedIndices();

                if(!aSelectedIdx.length){
                    // MessageBox.warning("선택된 데이터가 없습니다.");
                    return;
                }

                oContext = oTable.getContextByIndex(aSelectedIdx[0]);
                oRowData = oContext.getObject();
                oViewModel = this.getView().getModel("viewModel");

                // oNavParam.evaluArticleCode = oRowData.evaluation_article_code;
                oNavParam.leaf = oRowData.leaf_flag;
                oNavParam.refKey = oRowData.ref_key;

                // oRowData.evaluation_execute_mode_code = oRowData.evaluation_execute_mode_code || "QLTVE_EVAL";
                // oRowData.evaluation_article_type_code = oRowData.evaluation_article_type_code || "QLTVE_EVAL";
                // oRowData.qttive_eval_article_calc_formula = oRowData.qttive_eval_article_calc_formula || "";
                
                // oViewModel.setProperty("/Detail", {
                //     Header : oRowData
                // });
                this.getOwnerComponent().getRouter().navTo("Detail", oNavParam);
            }

            , onExcelExport : function(){
                // var oTable, oView, aFilters, oUserInfo, oViewModel, oCondData, oODataModel;

                // oTable = this.byId("treeTable");
                // oView = this.getView();
                // oUserInfo = this._getUserSession();
                // oViewModel = oView.getModel("viewModel");
                
                // oODataModel = oView.getModel();
                // //조회용 데이터
                // oCondData = oViewModel.getProperty("/cond");
                // aFilters = [
                //     new Filter({ path:"tenant_id", operator : "EQ", value1 : oUserInfo.tenantId }),
                //     new Filter({ path:"company_code", operator:"EQ", value1 : oUserInfo.companyCode }),
                //     new Filter({ path:"org_type_code", operator:"EQ", value1 : oUserInfo.orgTypeCode }),

                // ];

                // //필수입력체크
                // var aControls = oView.getControlsByFieldGroupId("searchRequired"),
                //     bValid = this._isValidControl(aControls);

                // if(!bValid){
                //     return;
                // }

                // //미리 세팅해둔 경로를 바탕으로 Filter를 생성한다.
                // /**
                //  * EQ {
                //  *    Field
                //  * }
                //  * Contains {
                //  *    Field
                //  * }
                //  */
                // for(var operator in oCondData){
                //     if(oCondData.hasOwnProperty(operator)){
                //         for(var field in oCondData[operator]){
                //             if(oCondData[operator].hasOwnProperty(field) && oCondData[operator][field]){
                //                 aFilters.push(
                //                     new Filter({ path : field, operator : operator, value1 : oCondData[operator][field] })
                //                 );
                //             }
                //         }
                //     }
                // }


                // var oI18nModel = oView.getModel("i18n"),
                //     oResourceBundle = oI18nModel.getResourceBundle();

                /***
                 * 
                 */
                // oView.setBusy(true);
                // this._readOdata({
                //     model : oODataModel,
                //     entity : "/EvalItemListView",
                //     param : {
                //         path : "/EvalItemListView", 
                //         filters : aFilters,
                //         error : function(){
                //             oView.setBusy(false);
                //         },
                //         success : function(oData){
                //             oView.setBusy(false);
                //             ExcelUtil.fnExportExcel({
                //                 fileName : oResourceBundle.getText("appTitle"),
                //                 table : oTable,
                //                 data : oData.results
                //             });
                //         }
                //     }
                // });
                var oTable, oView, oViewModel, oI18nModel, oResourceBundle, aTreeData;

                oTable = this.byId("treeTable");
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                oI18nModel = oView.getModel("i18n");
                oResourceBundle = oI18nModel.getResourceBundle();
                aTreeData = oViewModel.getProperty("/Tree/list");

                ExcelUtil.fnExportExcel({
                    fileName : oResourceBundle.getText("appTitle"),
                    table : oTable,
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
