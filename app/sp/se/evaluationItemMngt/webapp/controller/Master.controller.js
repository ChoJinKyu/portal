sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/f/library",						
    "sap/ui/model/Filter",					
    "sap/ui/model/Sorter",						
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "sap/ui/core/ListItem",
    "sap/m/SegmentedButtonItem"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * 2021-01-20 개발시작
     * A61987
     */
	function (Controller, fioriLibrary, Filter, Sorter, MessageBox, Multilingual, ListItem, SegmentedButtonItem) {
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
                    EQ : {}
                });
                
                this._bindOrgCodeComboItem();
                this._setEvaluExecuteModeItem();

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

                oViewModel.setProperty("/App/layout", "OneColumn");
            }
            /***
             * 세션 유저정보를 가져온다.
             */
            , _getUserSession : function(){
                var oUserInfo;
                
                oUserInfo = {
                    loginUserId : "TestUser",
                    tenantId : "L2100",
                    companyCode : "LGCKR",
                    orgTypeCode : "BU",
                    orgCode : "BIZ00100",
                    evalPersonEmpno : "5706"
                };

                return oUserInfo;
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
                    new Filter("org_code", "EQ", sOrgCode)
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
                    new Filter("group_code", "EQ", "SP_SE_EVAL_ARTICLE_TYPE_CODE")
                ];

                oBtnEvaluExecuteMode.destroyItems();
                this.getOwnerComponent().getModel("common").read("/Code",{
                    filters : aFilters,
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
                                    key : item.sort_no
                                })
                            );
                        });
                        oBtnEvaluExecuteMode.setSelectedKey("");
                    }.bind(this),
                    error : function(){
                        
                    }
                });
            }
            /***
             * 신규 생성 이벤트
             * @param oEvent - 이벤트 객체
             * @param sBtnGubun - 버튼 구분자
             */
            , onPressCreate : function(oEvent, sBtnGubun){
                var oNavParam;

                oNavParam = {};
                oNavParam.new = "Y";

                if(sBtnGubun === "SameLevel"){
                    oNavParam.level = "same";
                }else if(sBtnGubun === "LowLevel"){
                    oNavParam.level = "low";
                }
                //leaf
                this.getOwnerComponent().getRouter().navTo("Detail", oNavParam);
            }

            , onPressSearch : function(){
                var oTable, aFilters, oUserInfo, oViewModel, oCondData;

                oTable = this.byId("treeTable");
                oUserInfo = this._getUserSession();
                oViewModel = this.getView().getModel("viewModel");
                oCondData = oViewModel.getProperty("/cond");
                aFilters = [
                    new Filter({ path:"tenant_id", operator : "EQ", value1 : oUserInfo.tenantId }),
                    new Filter({ path:"company_code", operator:"EQ", value1 : oUserInfo.companyCode }),
                    new Filter({ path:"org_type_code", operator:"EQ", value1 : oUserInfo.orgTypeCode }),

                ]

                for(var operator in oCondData){
                    if(oCondData.hasOwnProperty(operator)){
                        for(var field in oCondData[operator]){
                            if(oCondData[operator].hasOwnProperty(field) && oCondData[operator][field]){
                                aFilters.push(
                                    new Filter({ path : field, operator : operator, value1 : oCondData[operator][field] })
                                );
                            }
                        }
                    }
                }

                // new Filter({ path:"org_code", operator:"EQ", value1 : oUserInfo.orgCode }),
                // new Filter({ path:"evaluation_operation_unit_code", operator:"EQ", value1 : "RAW_MATERIAL" }),
                // new Filter({ path:"evaluation_type_code", operator:"EQ", value1 : "EVAL002" }),
                // // new Filter({ path:"evaluation_execute_mode_code", operator:"EQ", value1 : "" }),
                // // new Filter({ path:"evaluation_article_name", operator:"Contains", value1 : ""  })

                oTable.bindRows({
                    path : "/EvalItemListView",
                    filters : aFilters,
                    sorter : [
                        new Sorter("evaluation_article_path_sequence")
                    ],
                    parameters : {
                        countMode: 'Inline',
                        treeAnnotationProperties : {
                            hierarchyLevelFor : 'hierarchy_level',
                            hierarchyNodeFor : 'evaluation_article_code',
                            hierarchyParentNodeFor : 'parent_evaluation_article_code',
                            hierarchyDrillStateFor : 'drill_state'
                        }
                    }
                });
            }
		});
	});
