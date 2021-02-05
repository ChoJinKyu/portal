sap.ui.define([
	"./BaseController",
	"sap/f/library",						
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",					
    "sap/ui/model/Sorter",						
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "sap/ui/core/ListItem",
    "sap/m/SegmentedButtonItem",
    "ext/lib/util/ExcelUtil",
    "sap/ui/table/TablePersoController",
    "./MainListPersoService",
    "./SupplierWithOrgDialog",
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * 2021-02-03 개발시작
     * A59956
     */
	function (Controller, fioriLibrary, Filter, FilterOperator, Sorter, MessageBox, Multilingual, ListItem, SegmentedButtonItem, ExcelUtil, TablePersoController, MainListPersoService, SupplierWithOrgDialog) {
        "use strict";
        
		return Controller.extend("sp.sf.fundingStatus.controller.Master", {
            /***
             * 최초 한번 Init 설정
             */
			onInit: function () {
                var oView,oMultilingual, oComponent, oViewModel;
                
                oView = this.getView();
                oComponent = this.getOwnerComponent();
                oMultilingual = new Multilingual();
                oViewModel = oComponent.getModel("viewModel");

                oViewModel.setProperty("/list", []);

                oView.setModel(oMultilingual.getModel(), "I18N");
                oViewModel.setProperty("/cond",{
                    EQ : {},
                    BT : {
                        funding_appl_date:{}
                    },
                    Contains : {}
                });
                
                this._bindStepComboItem();
                // this._setEvaluExecuteModeItem();
                // this._doInitTablePerso();

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
             * 단계 (stepCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             */
            , _bindStepComboItem : function(){
                var oComboStepCode, aFilters, oUserInfo;

                oComboStepCode = this.byId("stepCode");
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("group_code", "EQ", "SP_SF_FUNDING_STEP_CODE"),
                    new Filter("language_cd", "EQ", "KO")
                ];

                oComboStepCode.bindItems({
                    path : "common>/Code",
                    filters : aFilters,
                    template : new ListItem({ text : "{common>code_name}", key : "{common>code}", additionalText : "{common>code}" })
                });
            }

            /***
             * 상태 (statusCode) 콤보박스 아이템 바인딩
             * 1. 세션유저 정보를 가지고 아이템을 구성한다.
             * 2. 첫번째 아이템으로 선택해준다.
             */
            , _bindStatusComboItem : function(sOrgCode){
                var oStatusCodeCode, aFilters, oUserInfo;
                
                oStatusCodeCode = this.byId("statusCode");
                // @ts-ignore
                oUserInfo = this._getUserSession();
                aFilters = [
                    new Filter("tenant_id", "EQ", oUserInfo.tenantId),
                    new Filter("group_code", "EQ", "SP_SF_FUNDING_STATUS_CODE"),
                    new Filter("language_cd", "EQ", "KO"),
                    new Filter("parent_code", "EQ", sOrgCode)
                ];

                oStatusCodeCode.bindItems({
                    path : "common>/Code",
                    filters : aFilters,
                    template : new ListItem({ text : "{common>code_name}", key : "{common>code}", additionalText : "{common>code}" })
                });
            }

            , onInputSupplierWithOrgValuePress: function () {
                if (!this.oSupplierWithOrgValueHelp) {
                    this.oSupplierWithOrgValueHelp = new SupplierWithOrgDialog({
                        //title: "Supplier",
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L1100")
                            ],
                            sorters: [new Sorter("company_code", true)]
                        },
                        multiSelection: false

                    });

                    this.oSupplierWithOrgValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_supplierwithorg_code").setValue(oEvent.getParameter("item").supplier_local_name);
                        this.byId("input_supplierwithorg_code").data("code", oEvent.getParameter("item").supplier_code);
                        
                    }.bind(this));
                }
                
                this.oSupplierWithOrgValueHelp.open();
            }
            , onSelectionChangeOrgCode : function(oEvent){
                var sOrgCode, oControl;

                oControl = oEvent.getSource();
                sOrgCode = oControl.getSelectedKey();

                if(!sOrgCode){
                    return;
                }

                this._bindStatusComboItem(sOrgCode);
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
             * 데이터 조회
             */
            , onPressSearch : function(){
                var oTable, oView, aFilters, oUserInfo, oViewModel, oCondData, oODataModel, aSorter;

                oTable = this.byId("treeTable");
                oView = this.getView();
                oUserInfo = this._getUserSession();
                oViewModel = oView.getModel("viewModel");
                oODataModel = oView.getModel(),
                aSorter = [];

                //조회용 데이터
                oCondData = oViewModel.getProperty("/cond");
                aFilters = [
                    // new Filter({ path:"tenant_id", operator : "EQ", value1 : oUserInfo.tenantId }),
                    // new Filter({ path:"company_code", operator:"EQ", value1 : oUserInfo.companyCode }),
                    // new Filter({ path:"org_type_code", operator:"EQ", value1 : oUserInfo.orgTypeCode }),
                ];

                //필수입력체크
                // var aControls = oView.getControlsByFieldGroupId("searchRequired"),
                //     bValid = this._isValidControl(aControls);

                // if(!bValid){
                //     return;
                // }

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
                                }else if(operator === "BT" ){
                                    if(oCondData[operator][field].value1 || oCondData[operator][field].value2){
                                        aFilters.push(
                                            new Filter({ path : field, operator : operator, value1 : oCondData[operator][field].value1, value2 : new Date(oCondData[operator][field].value2.toString())})
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
                
                oView.setBusyIndicatorDelay(0);
                
                aSorter.push(new Sorter("funding_appl_number", true));
                
                //모델 조회
                oODataModel.read("/FundingApplListView", {
                    filters: aFilters,
                    sorters : aSorter,
                    success: function (oData) {
                        oViewModel.setProperty("/list", oData.results);
                        oView.setBusy(false);
                    }.bind(this)
                });

                

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
                // oNavParam.new = "N";

                oTable = oEvent.getSource();
                aSelectedIdx = oTable.getSelectedIndices();

                if(!aSelectedIdx.length){
                    // MessageBox.warning("선택된 데이터가 없습니다.");
                    return;
                }

                oContext = oTable.getContextByIndex(aSelectedIdx[0]);
                oRowData = oContext.getObject();
                oViewModel = this.getView().getModel("viewModel");
                
                oNavParam.fundingApplNumber = oRowData.funding_appl_number;
                oNavParam.supplierCode = oRowData.supplier_code;

                this.getOwnerComponent().getRouter().navTo("Detail", oNavParam);
            }

            // , onExcelExport : function(){
            //     var oTable, oView, aFilters, oUserInfo, oViewModel, oCondData, oODataModel;

            //     oTable = this.byId("treeTable");
            //     oView = this.getView();
            //     oUserInfo = this._getUserSession();
            //     oViewModel = oView.getModel("viewModel");
                
            //     oODataModel = oView.getModel();
            //     //조회용 데이터
            //     oCondData = oViewModel.getProperty("/cond");
            //     aFilters = [
            //         new Filter({ path:"tenant_id", operator : "EQ", value1 : oUserInfo.tenantId }),
            //         new Filter({ path:"company_code", operator:"EQ", value1 : oUserInfo.companyCode }),
            //         new Filter({ path:"org_type_code", operator:"EQ", value1 : oUserInfo.orgTypeCode }),

            //     ];

            //     //필수입력체크
            //     var aControls = oView.getControlsByFieldGroupId("searchRequired"),
            //         bValid = this._isValidControl(aControls);

            //     if(!bValid){
            //         return;
            //     }

            //     //미리 세팅해둔 경로를 바탕으로 Filter를 생성한다.
            //     /**
            //      * EQ {
            //      *    Field
            //      * }
            //      * Contains {
            //      *    Field
            //      * }
            //      */
            //     for(var operator in oCondData){
            //         if(oCondData.hasOwnProperty(operator)){
            //             for(var field in oCondData[operator]){
            //                 if(oCondData[operator].hasOwnProperty(field) && oCondData[operator][field]){
            //                     aFilters.push(
            //                         new Filter({ path : field, operator : operator, value1 : oCondData[operator][field] })
            //                     );
            //                 }
            //             }
            //         }
            //     }


            //     var oI18nModel = oView.getModel("i18n"),
            //         oResourceBundle = oI18nModel.getResourceBundle();

            //     /***
            //      * 
            //      */
            //     oView.setBusy(true);
            //     this._readOdata({
            //         model : oODataModel,
            //         entity : "/EvalItemListView",
            //         param : {
            //             path : "/EvalItemListView", 
            //             filters : aFilters,
            //             error : function(){
            //                 oView.setBusy(false);
            //             },
            //             success : function(oData){
            //                 oView.setBusy(false);
            //                 ExcelUtil.fnExportExcel({
            //                     fileName : oResourceBundle.getText("appTitle"),
            //                     table : oTable,
            //                     data : oData.results
            //                 });
            //             }
            //         }
            //     });
            // }

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
