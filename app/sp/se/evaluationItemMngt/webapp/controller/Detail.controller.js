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
    function ( Controller, Filter, Sorter, MessageBox, 
        Multilingual, ListItem, SegmentedButtonItem, 
        CalculationBuilderVariable ) {
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
             * 콤보박스, 버튼들에 공통코드 바인딩
             */
            , _setBindComboNBtnItems : function(){
                var oUserInfo, aFilters;
                oUserInfo = this._getUserSession();

                this._setBindItems({
                    id : "btnEvaluExeMode",
                    path : "common>/Code",
                    template : new SegmentedButtonItem({ key : "{common>code}", text : "{common>code_name}", additionalText : "{common>code}" }),
                    filters : [
                        new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                        new Filter("group_code", "EQ", "SP_SE_EVAL_ARTICLE_TYPE_CODE")
                    ]
                });
                this._setBindItems({
                    id : "btnEvaluArtType",
                    path : "common>/Code",
                    template : new SegmentedButtonItem({ key : "{common>code}", text : "{common>code_name}", additionalText : "{common>code}" }),
                    filters : [
                        new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                        new Filter("group_code", "EQ", "SP_SE_EVAL_ARTICLE_TYPE_CODE")
                    ]
                });

                this._setBindCommonItems({
                    id : "comboEvaluDisScrType",
                    groupCode : "SP_SE_EVAL_DISTRB_SCR_TYPE_CD"
                });
                
                this._setBindCommonItems({
                    id : "comboEvaluResultInputType",
                    groupCode : "SP_SE_EVAL_SCALE_TYPE_CD"
                });
                
                this._setBindCommonItems({
                    id : "comboQttItemUom",
                    groupCode : "SP_SE_QTTIVE_UOM_CODE"
                });

                this._setBindCommonItems({
                    id : "comboNodeType",
                    groupCode : "SP_SE_EVAL_NODE_TYPE_CD"
                });
                
            }
            /***
             * 공통 코드 BindItems
             * 
             * @param id            컨트롤 아이디
             * @param groupCode     호출할 공통 그룹 코드
             */
            , _setBindCommonItems : function(oParam){
                var oUserInfo, aFilters;
                oUserInfo = this._getUserSession();
                aFilters = [];

                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("group_code", "EQ", oParam.groupCode)
                ];

                this._setBindItems({
                    id : oParam.id,
                    path : "common>/Code",
                    template : new ListItem({ key : "{common>code}", text : "{common>code_name}", additionalText : "{common>code}" }),
                    filters : aFilters
                });
            }
            /**
             * Detail PatternMatched
             */
            , _onPatternMatched: function (e) {
                var oArgs, oComponent, oViewModel, oHeader,
                    oView, aControls;

                oArgs = e.getParameter("arguments");
                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");
                oHeader = oViewModel.getProperty("/Detail/Header");
                oView = this.getView();

                if( oArgs.new === "Y" ){
                    // 신규건인지 확인
                    oViewModel.setProperty("/App/layout", "TwoColumnsBeginExpanded");
                    aControls = oView.getControlsByFieldGroupId("newRequired");
                    this._clearValueState(aControls);

                }else{
                    oViewModel.setProperty("/App/layout", "TwoColumnsMidExpanded");
                    oViewModel.setProperty("/App/EditMode", false);
                }

                oViewModel.setProperty("/Args", oArgs);

                if(!oHeader){
                    // 잘못된 접근
                    return;
                }
                /***
                 * 계산식 변수들 바인딩
                 * 조회조건 evaluation_operation_unit_code 에따라 다름
                 * 
                 */
                var oCalculationBuilder;
                oCalculationBuilder = this.byId("calculationBuilder");
                oCalculationBuilder.bindAggregation("variables",{
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
            /**
             * scale 데이터 조회
             */
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
                        oViewModel.setProperty("/Detail/Item", 
                            oData.results.map(function(oRowData){
                                oRowData.rowEditable = false;
                                return oRowData;
                            })
                        );
                        oView.setBusy(false);
                    },
                    error : function(){
                        oView.setBusy(false);
                    }
                });
            }
            /**
             * scale 선택시 edit mode 변경
             */
            , onSelectTableItem : function(oEvent){
                var sEvaluResultInType, oHeader, oView, oViewModel, oSelectItem,
                    oBindContxtPath, oRowData, bSeletFlg, bEditMode;

                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                bEditMode = oViewModel.getProperty("/App/EditMode");

                if(!bEditMode){
                    return;
                }

                oSelectItem = oEvent.getParameter("listItem");
                oBindContxtPath = oSelectItem.getBindingContextPath();
                oRowData = oViewModel.getProperty(oBindContxtPath);
                bSeletFlg = oEvent.getParameter("selected");

                if(oRowData.crudFlg === "D"){
                    return;
                }else if(oRowData.crudFlg === "C"){
                    oRowData.rowEditable = bSeletFlg;
                    oViewModel.setProperty(oBindContxtPath, oRowData);
                    return;
                }

                oRowData.rowEditable = bSeletFlg;
                oRowData.crudFlg = "U";
                oRowData.transaction_code = "U";

                oViewModel.setProperty(oBindContxtPath, oRowData);
            }
            /**
             * scale 라인 삭제
             */
            , onPressItemDelete : function(){
                var oTable, oView, oViewModel, aSelectedItems, aContxtPath, aScaleListData;
                
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                oTable = this.byId("tblEvalItemScle");
                aScaleListData = oViewModel.getProperty("/Detail/Item");
                aSelectedItems = oTable.getSelectedItems();
                aContxtPath = oTable.getSelectedContextPaths();

                for(var i = aContxtPath.length - 1; i >= 0; i--){
                    var idx = aContxtPath[i].split("/")[3];

                    if( aScaleListData[idx].crudFlg === "C" ){
                        aScaleListData.splice(idx, 1);
                    }else{
                        aScaleListData[idx].crudFlg = "D";
                        aScaleListData[idx].transaction_code = "D"
                        aScaleListData[idx].rowEditable = false;
                    }
                }

                oTable.removeSelections();
                oViewModel.setProperty("/Detail/Item", aScaleListData);

                // aSelectedItems.forEach(function(oItem){
                //     var sItemPath, oItemData;
                //     sItemPath = oItem.getBindingContextPath();
                //     oItemData = oViewModel.getProperty(sItemPath);
                    
                //     oItemData.crudFlg = "D";
                //     oItemData.transaction_code = "D"
                    
                //     oViewModel.setProperty(sItemPath, oItemData);
                // })
            }
            /***
             * scale 라인 추가
             */
            , onPressItemAdd : function(){
                var oView, oViewModel, oHeader, aItems, oNewData, aFields;
                
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                oHeader = oViewModel.getProperty("/Detail/Header");
                aItems = oViewModel.getProperty("/Detail/Item");
                aFields = [
                    "tenant_id",
                    "company_code",
                    "org_type_code",
                    "org_code",
                    "evaluation_operation_unit_code",
                    "evaluation_type_code",
                    "evaluation_article_code",
                    "option_article_number"
                ];

                oNewData = {
                    crudFlg : "C",
                    rowEditable : true,
                    transaction_code : "I"
                };
                aFields.forEach(function(sField){
                    if(oHeader[sField]){
                        oNewData[sField] = oHeader[sField];
                    }
                });
                
                aItems.unshift(oNewData);
                oViewModel.setProperty("/Detail/Item", aItems);
            }
            /***
             * scale 재조회
             */
            , onPressItemCancle : function(){
                var oI18NModel, oView;

                oView = this.getView();
                oI18NModel = oView.getModel("I18N");
                MessageBox.warning(oI18NModel.getProperty("/NPG00013"),{
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.CANCEL){
                            return;
                        }
                        this._readItem();
                        this.byId("tblEvalItemScle").removeSelections(true);
                    }.bind(this)
                });

            }
            /**
             * detail 페이지 종료
             */
            , onPressPageNavBack : function(){
                
                this.getOwnerComponent().getRouter().navTo("Master");
            }
            /**
             * 해당 상세 평가 삭제
             */
            , onPressDelete : function(){
                var sURLPath, oSaveData, oView, oViewModel, oArgs, oComponent,
                    oI18NModel;

                oView = this.getView();
                oI18NModel = oView.getModel("I18N");
                oViewModel = oView.getModel("viewModel");
                oArgs = oViewModel.getProperty("/Args");
                oComponent = this.getOwnerComponent();
                sURLPath = "srv-api/odata/v4/sp.evaluationItemMngtV4Service/EvalItemSaveProc";

                if(oArgs.new === "Y"){
                    return;
                }

                MessageBox.confirm(oI18NModel.getProperty("/NCM00003"),{
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.CANCEL){
                            return;
                        }
                        
                        oSaveData = this._getSaveData("D");
                        oView.setBusy(true);
                        $.ajax({
                            url: sURLPath,
                            type: "POST",
                            data: JSON.stringify(oSaveData),
                            contentType: "application/json",
                            success: function (data) {
                                MessageBox.success(oI18NModel.getProperty("/NCM01002"), {
                                    onClose : function (sAction) {
                                        oView.setBusy(false);
                                        oComponent.getRouter().navTo("Master",{
                                            search : true
                                        });
                                    }
                                });
                            },
                            error: function (e) {
                                var sDetails;

                                sDetails = "";
                                try{
                                    sDetails += "<p><strong>" + e.responseJSON.error.code + "</strong></p>\n" +
                                    "<ul>" +
                                        "<li>" + e.responseJSON.error.message + "</li>" +
                                    "</ul>";
                                }catch(error){
                                    
                                }

                                MessageBox.error(e.status + " - " + e.statusText,{
                                    title: "Error",
                                    details : sDetails
                                })
                                oView.setBusy(false);
                            }
                        });
                    }.bind(this)
                });
            }
            /***
             * 해당 상세 평가 저장
             */
            , onPressSave : function(){
                var sURLPath, oSaveData, oView, oViewModel, oArgs, oComponent,
                    oI18NModel;

                oView = this.getView();
                oI18NModel = oView.getModel("I18N");
                oViewModel = oView.getModel("viewModel");
                oArgs = oViewModel.getProperty("/Args");
                oComponent = this.getOwnerComponent();

                MessageBox.confirm(oI18NModel.getProperty("/NCM00001"),{
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.CANCEL){
                            return;
                        }
                        if(!this._checkValidation()){
                            return;
                        }
                        if(oArgs.new === "Y"){
                            sURLPath = "srv-api/odata/v4/sp.evaluationItemMngtV4Service/CreateEvalItemSaveProc";
                        }else{
                            sURLPath = "srv-api/odata/v4/sp.evaluationItemMngtV4Service/EvalItemSaveProc";
                        }
                        
                        oSaveData = this._getSaveData("U");
                        oView.setBusy(true);
                        $.ajax({
                            url: sURLPath,
                            type: "POST",
                            data: JSON.stringify(oSaveData),
                            contentType: "application/json",
                            success: function (data) {
                                MessageBox.success(oI18NModel.getProperty("/NCM01001"), {
                                    onClose : function (sAction) {
                                        oView.setBusy(false);
                                        oComponent.getRouter().navTo("Master",{
                                            search : true
                                        });
                                    }
                                });
                            },
                            error: function (e) {
                                var sDetails;

                                sDetails = "";
                                try{
                                    sDetails += "<p><strong>" + e.responseJSON.error.code + "</strong></p>\n" +
                                    "<ul>" +
                                        "<li>" + e.responseJSON.error.message + "</li>" +
                                    "</ul>";
                                }catch(error){
                                    
                                }

                                MessageBox.error(e.status + " - " + e.statusText,{
                                    title: "Error",
                                    details : sDetails
                                })
                                oView.setBusy(false);
                            }
                        });
                    }.bind(this)
                });
            }
            /**
             * 저장시 Validation 필수값 확인
             * 
             */
            , _checkValidation : function(){
                var bValid, oView, oViewModel, oArgs, aControls;
                
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                oArgs = oViewModel.getProperty("/Args");
                bValid = false;

                if(oArgs.new === "Y"){
                    aControls = oView.getControlsByFieldGroupId("newRequired");
                    bValid = this._isValidControl(aControls);
                }else{
                    aControls = oView.getControlsByFieldGroupId("detailRequired");
                    bValid = this._isValidControl(aControls);
                }

                return bValid;
            }
            /***
             * 저장시 데이터 구조 맞추기
             */
            , _getSaveData : function(sTransactionCode){
                var oSaveData, oUserInfo, oView, oViewModel,
                    aItemFields, aScleFields, oHeader, oItemType,
                    sHeadField, aScleItem, oNewHeader, sLevel, oArgs;

                oUserInfo = this._getUserSession();
                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                oHeader = oViewModel.getProperty("/Detail/Header");
                oArgs = oViewModel.getProperty("/Args");
                
                if(oArgs.new === "Y"){
                    //신규 건일때
                    oNewHeader = oViewModel.getProperty("/Detail/NewHeader");
                    sLevel = oArgs.level;
                    oSaveData = {
                        "tenant_id" : oHeader.tenant_id,
                        "company_code" : oHeader.company_code,
                        "org_type_code" : oHeader.org_type_code,
                        "org_code" : oHeader.org_code,
                        "evaluation_operation_unit_code" : oHeader.evaluation_operation_unit_code,
                        "evaluation_type_code" : oHeader.evaluation_type_code,
                        "parent_evaluation_article_code" : "",
                        "evaluation_article_name" : oNewHeader.evaluation_article_name,
                        "evaluation_article_lvl_attr_cd" : oNewHeader.evaluation_article_lvl_attr_cd,
                        "user_id" : oUserInfo.loginUserId
                    };

                    if(sLevel === "same"){
                        oSaveData.parent_evaluation_article_code = oHeader.parent_evaluation_article_code;
                    }else if(sLevel === "low"){
                        oSaveData.parent_evaluation_article_code = oHeader.evaluation_article_code;
                    }

                    return oSaveData;
                }


                aItemFields = [
                    "transaction_code", "tenant_id", "company_code",
                    "org_type_code", "org_code", "evaluation_operation_unit_code",
                    "evaluation_type_code", "evaluation_article_code",
                    "evaluation_execute_mode_code", "evaluation_article_type_code",
                    "evaluation_distrb_scr_type_cd", "evaluation_result_input_type_cd",
                    "qttive_item_uom_code", "qttive_eval_article_calc_formula",
                    "evaluation_article_desc", "sort_sequence",
                ];
                aScleFields = [
                    "transaction_code", "tenant_id", "company_code",
                    "org_type_code", "org_code", "evaluation_operation_unit_code",
                    "evaluation_type_code", "evaluation_article_code",
                    "option_article_number", "option_article_name",
                    "option_article_start_value", "option_article_end_value",
                    "evaluation_score", "sort_sequence"
                ];

                oSaveData = {
                    ItemType : [],
                    ScleType : [],
                    user_id : oUserInfo.loginUserId
                };

                oItemType = {};

                for(sHeadField in oHeader){
                    if(
                        oHeader.hasOwnProperty(sHeadField) && 
                        aItemFields.indexOf(sHeadField) > -1 && 
                        oHeader[sHeadField]
                    ){
                        oItemType[sHeadField] = oHeader[sHeadField];
                    }
                }

                oItemType.sort_sequence = parseInt(oItemType.sort_sequence) || null;
                oItemType.transaction_code = sTransactionCode;

                oSaveData.ItemType.push(oItemType);

                aScleItem = oViewModel.getProperty("/Detail/Item");
                aScleItem.forEach(function(oRowData){
                    var oNewRowData, sScleField;
                    oNewRowData = {};

                    if(!oRowData.transaction_code){
                        return;
                    }

                    for(sScleField in oRowData){
                        if(
                            oRowData.hasOwnProperty(sScleField) && 
                            aScleFields.indexOf(sScleField) > -1 && 
                            oRowData[sScleField]
                        ){
                            oNewRowData[sScleField] = oRowData[sScleField];
                        }
                    }

                    oNewRowData.evaluation_score = parseInt(oNewRowData.evaluation_score) || null;
                    oNewRowData.sort_sequence = parseInt(oNewRowData.sort_sequence) || null;

                    oSaveData.ScleType.push(oNewRowData);
                });


                return oSaveData;
            }
            /***
             * 수정 변경모드 
             */
            , onPressModeChange : function(oEvent, sGubun){
                var oView, oViewModel, bEditFlg, oComponent, oMasterPage, oTreeTable,
                    aSelectedIdices, oContext, oRowData, oI18NModel;

                oView = this.getView();
                oViewModel = oView.getModel("viewModel");
                bEditFlg = oViewModel.getProperty("/App/EditMode");

                if(sGubun === "CANCEL"){
                    oI18NModel = oView.getModel("I18N");
                    MessageBox.warning(oI18NModel.getProperty("/NPG00013"),{
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        onClose: function (sAction) {
                            if(sAction === MessageBox.Action.CANCEL){
                                return;
                            }

                            oComponent = this.getOwnerComponent();
                            oMasterPage = oComponent.byId("Master");
                            
                            if(oMasterPage){
                                oTreeTable = oMasterPage.byId("treeTable");
                                aSelectedIdices = oTreeTable.getSelectedIndices();
                                oContext = oTreeTable.getContextByIndex(aSelectedIdices[0]);
                                oRowData = this._deepCopy( oContext.getObject() );
        
                                oViewModel.setProperty("/Detail/Header", oRowData);
                            }
                            oViewModel.setProperty("/App/EditMode", !bEditFlg);
                            this._readItem();
                        }.bind(this)
                    });
                }else{
                    oViewModel.setProperty("/App/EditMode", !bEditFlg);
                }
            }

		});
	});
