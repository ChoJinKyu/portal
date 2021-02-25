sap.ui.define([
    "./App.controller",
    //"ext/lib/util/SppUserSessionUtil",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    
],
    function (
        BaseController,
        //SppUserSessionUtil,
        ManagedListModel,
        TransactionManager,
        Validator,
        Formatter,
        DateFormatter,
        JSONModel,
        ODataModel,
        MessageBox,
        Fragment,
        Filter,
        FilterOperator,
        MessageToast
    ) {
        "use strict";

        var sTenantId, oOpenDialog;
        var that;
        return BaseController.extend("sp.np.netPriceMgt.controller.NetPriceMgtBasePriceCreate", {
            dateFormatter: DateFormatter,
            formatter: Formatter,

            /*========================================= Init : Start ===============================*/

            onInit: function () {
                that = this;
                // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("NetPriceMgtBasePriceCreate").attachPatternMatched(this._onRoutedThisPage, this);

                //마스터정보 리스트
                this.setModel(new JSONModel(), "masterInfoList");
                //일반정보 리스트, 기준단가목록 같이 사용할수 없어서 나눔
                this.setModel(new ManagedListModel(), "generalInfoList");
                
            },

            /**
             * Base Price Detail 데이터 조회
            */
            _onRoutedThisPage: function (oEvent) {
                this.fnLoadData(oEvent.getParameter("arguments"));
            },
            /*========================================= Init : End ===============================*/

            /*========================================= oData : Start ===============================*/
            fnLoadData: function(args) {
                var oView = this.getView();
                this.pAppNum = args.pAppNum;
            },

             /**
             * OData 호출
             */
            _readData: function (sModelParam, sCallUrlParam, aFiltersParam, oUrlParametersParam, fCallbackParam) {
                var oModel = this.getModel(sModelParam);
                var oView = this.getView();

                oModel.read(sCallUrlParam, {
                    filters: aFiltersParam,
                    urlParameters: oUrlParametersParam,
                    success: fCallbackParam,
                    error: function (data) {
                        oView.setBusy(false);
                        console.log("error", data);
                    }
                });
            },

            _bindView: function (sObjectPath, sModel, aFilter, callback) {
                var oView = this.getView(),
                    oModel = this.getModel(sModel);
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read(sObjectPath, {
                    filters: aFilter,
                    success: function (oData) {
                        oView.setBusy(false);
                        callback(oData);
                    }
                });
            },
            /*========================================= oData : End ===============================*/

            onBack: function () {
                this.getRouter().navTo("NetPriceMgtDetail", {
                    "pMode" : "R",
                    "pAppNum":  that.pAppNum
                });
            },
        });
    }
);
