sap.ui.define([
	    "./BaseController",					
        "sap/ui/model/Filter",						
        "sap/ui/model/Sorter",			
        "sap/m/MessageBox",
        "ext/lib/util/Multilingual",
        "sap/ui/core/ListItem",
        "sap/m/SegmentedButtonItem",
        "sap/suite/ui/commons/CalculationBuilderVariable"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Filter, Sorter, MessageBox, Multilingual, ListItem, SegmentedButtonItem, CalculationBuilderVariable) {
        "use strict";
        
		return Controller.extend("sp.se.evaluationItemMngt.controller.Detail", {

			onInit: function () {
                var oView,oMultilingual;
                
                oView = this.getView();
                oMultilingual = new Multilingual();
                oView.setModel(oMultilingual.getModel(), "I18N");

                this._setBindComboNBtnItems();
                this.getOwnerComponent().getRouter().getRoute("Detail").attachPatternMatched(this._onPatternMatched, this);
                
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
            , _setBindComboNBtnItems : function(){
                var oUserInfo;
                oUserInfo = this._getUserSession();

                this._setBindItems({
                    id : "btnEvaluExeMode",
                    path : "common>/Code",
                    template : new SegmentedButtonItem({ key : "{common>code}", text : "{common>code_name}" }),
                    filters : [
                        new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                        new Filter("group_code", "EQ", "SP_SE_EVAL_ARTICLE_TYPE_CODE")
                    ]
                });
                
                this._setBindItems({
                    id : "btnEvaluArtType",
                    path : "common>/Code",
                    template : new SegmentedButtonItem({ key : "{common>code}", text : "{common>code_name}" }),
                    filters : [
                        new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                        new Filter("group_code", "EQ", "SP_SE_EVAL_ARTICLE_TYPE_CODE")
                    ]
                });
                
                this._setBindItems({
                    id : "comboEvaluDisScrType",
                    path : "common>/Code",
                    template : new ListItem({ key : "{common>code}", text : "{common>code_name}", additionalText : "{common>code}" }),
                    filters : [
                        new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                        new Filter("group_code", "EQ", "SP_SE_EVAL_DISTRB_SCR_TYPE_CD")
                    ]
                });
                
                this._setBindItems({
                    id : "comboEvaluResultInputType",
                    path : "common>/Code",
                    template : new ListItem({ key : "{common>code}", text : "{common>code_name}", additionalText : "{common>code}" }),
                    filters : [
                        new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                        new Filter("group_code", "EQ", "SP_SE_EVAL_SCALE_TYPE_CD")
                    ]
                });

                this._setBindItems({
                    id : "comboQttItemUom",
                    path : "common>/Code",
                    template : new ListItem({ key : "{common>code}", text : "{common>code_name}", additionalText : "{common>code}" }),
                    filters : [
                        new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                        new Filter("group_code", "EQ", "SP_SE_QTTIVE_UOM_CODE")
                    ]
                });


                
            }

            , _setBindItems : function(oParam){

                this.byId(oParam.id).bindItems({
                    path : oParam.path,
                    filters : oParam.filters,
                    template : oParam.template
                });
            }

            , _onPatternMatched: function (e) {
                var oArgs, oComponent, oViewModel, oHeader;

                oArgs = e.getParameter("arguments");
                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");
                oHeader = oViewModel.getProperty("/Detail/Header");

                if( oArgs.new === "Y" ){
                    oViewModel.setProperty("/App/layout", "TwoColumnsBeginExpanded");
                }else{
                    oViewModel.setProperty("/App/layout", "TwoColumnsMidExpanded");
                    oViewModel.setProperty("/App/EditMode", false);
                }

                oViewModel.setProperty("/Args", oArgs);

                if(!oHeader){
                    return;
                }

                this.byId("calculationBuilder").bindAggregation("variables",{
                    path : "/QttiveItemCode",
                    template : new CalculationBuilderVariable({ key : "{qttive_item_code}", label : "{qttive_item_name}" }),
                    filters : [
                        new Filter("tenant_id", "EQ", oHeader.tenant_id),
                        new Filter("company_code", "EQ", oHeader.company_code),
                        new Filter("org_type_code", "EQ", oHeader.org_type_code),
                        new Filter("org_code", "EQ", oHeader.org_code),
                        new Filter("evaluation_operation_unit_code", "EQ", oHeader.evaluation_operation_unit_code)
                    ],
                    sorter : [
                        new Sorter("sort_sequence")
                    ]
                });

                this._readItem();
            }

            , _readItem : function(){
                var oComponent, oView, oViewModel, oODataModel, aFilters, oHeader;
                
                oComponent = this.getOwnerComponent();
                oView = this.getView();
                oViewModel = oComponent.getModel("viewModel");
                oODataModel = oComponent.getModel();
                oHeader = oViewModel.getProperty("/Detail/Header");
                aFilters = [
                    new Filter({ path:"tenant_id", operator:"EQ", value1 : oHeader.tenant_id }),
                    new Filter({ path:"company_code", operator:"EQ", value1 : oHeader.company_code }),
                    new Filter({ path:"org_type_code", operator:"EQ", value1 : oHeader.org_type_code }),
                    new Filter({ path:"org_code", operator:"EQ", value1 : oHeader.org_code }),
                    new Filter({ path:"evaluation_operation_unit_code", operator:"EQ", value1 : oHeader.evaluation_operation_unit_code }),
                    new Filter({ path:"evaluation_type_code", operator:"EQ", value1 : oHeader.evaluation_type_code }),
                    new Filter({ path:"evaluation_article_code", operator:"EQ", value1 : oHeader.evaluation_article_code })
                ];

                oViewModel.setProperty("/Detail/Item", []);
                oView.setBusyIndicatorDelay(0);
                oView.setBusy(true);
                oODataModel.read("/EvalItemScle",{
                    filters : aFilters,
                    sorter : [
                        new Sorter("sort_sequence")
                    ],
                    success : function(oData){
                        oViewModel.setProperty("/Detail/Item", oData.results);
                        oView.setBusy(false);
                    },
                    error : function(){
                        oView.setBusy(false);
                    }
                });
            }
            , onPressPageNavBack : function(){
                
                this.getOwnerComponent().getRouter().navTo("Master");
            }

            , onPressSave : function(){

            }

            
            , onPressModeChange : function(){
                var oView, oViewModel, bEditFlg;

                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                bEditFlg = oViewModel.getProperty("/App/EditMode");

                oViewModel.setProperty("/App/EditMode", !bEditFlg);
            }

		});
	});
