sap.ui.define([
	"./BaseController",
	"sap/f/library",						
    "sap/ui/model/Filter",					
    "sap/ui/model/Sorter",						
    "sap/m/MessageBox",
    "ext/lib/util/Multilingual",
    "ext/lib/util/ExcelUtil",
    "sap/ui/table/TablePersoController",
	"./MainListPersoService"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * 2021-01-20 개발시작
     * A61987
     */
    function (Controller, fioriLibrary, Filter, Sorter, MessageBox, Multilingual, ExcelUtil, 
        TablePersoController, MainListPersoService) {
        "use strict";
        
		return Controller.extend("sp.se.evalProgressList.controller.Master", {
            /***
             * 최초 한번 Init 설정
             */
			onInit: function () {
                var oView,oMultilingual, oComponent;
                
                oView = this.getView();
                oComponent = this.getOwnerComponent();
                oMultilingual = new Multilingual();

                oView.setModel(oMultilingual.getModel(), "I18N");
                
                this._setMasterViewModel();
                this._doInitTablePerso();

                oComponent.getRouter().getRoute("Master").attachPatternMatched(this._onProductMatched, this);
            }
            , _setMasterViewModel : function(){
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
