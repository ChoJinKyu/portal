sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "ext/lib/util/ExcelUtil",
    "ext/lib/util/SppUserSession",
    "sap/ui/core/library"

], function (BaseController, Multilingual, JSONModel, DateFormatter, Filter, FilterOperator, Sorter, MessageBox, MessageToast, Component, ComponentContainer, ExcelUtil, SppUserSession, CoreLibrary) {
    "use strict";

    var ValueState = CoreLibrary.ValueState;
    return BaseController.extend("sp.sm.makerRegistrationRequest.controller.MainList", {

        dateFormatter: DateFormatter,

        onStatusColor: function (sStautsCodeParam) {
            var sReturnValue = 1;

            // AR: Approval Request, IA: In progress Approval, AP: Approved, RJ: Rejected
            if (sStautsCodeParam === "REQUEST") {
                sReturnValue = 9;
            } else if (sStautsCodeParam === "REJECT") {
                sReturnValue = 2;
            } else if (sStautsCodeParam === "APPROVAL") {
                sReturnValue = 8;
            } else if (sStautsCodeParam === "APPROVED") {
                sReturnValue = 6;
            }

            return sReturnValue;
        },
		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oView = this.getView(),
                oModel = this.getOwnerComponent().getModel(),
                oI18NModel = this.getOwnerComponent().getModel("I18N"),
                that = this;
            this.setModel(new JSONModel(), "progressModel");

            oModel.read("/MakerRegistrationRequestProgressTypeView", {
                filters: [new Filter("tenant_id", FilterOperator.EQ, "L2100")],
                sorters: [new Sorter("sort_no")],
                success: function (data) {
                    oView.setBusy(false);
                    var aRecords = data.results;
                    aRecords.unshift({ code: "", code_name: oI18NModel.getText("/ALL") });
                    oView.getModel("progressModel").setProperty("/progress", aRecords);
                }.bind(this),
                error: function (data) {
                    oView.setBusy(false);
                    console.log("error");
                }
            });
            //MakerRegistrationRequestView count
            this.setModel(new JSONModel(), "countModel");
            this._getListCount();

        },

        /**
        * Search 버튼 클릭(Filter 추출)
        */
        onSearch: function (oEvent) {
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, "L2100")],
                sProgress = this.byId("searchProgressSegmentButton").getSelectedKey(),
                sTaxId = this.byId("searchTaxId").getValue(),
                sRequestUser = this.byId("searchRequestUser").getValue(),
                sRequestDate = this.byId("searchRequestDate"),
                oDateValue = sRequestDate.getDateValue(),
                oSecondDateValue = sRequestDate.getSecondDateValue();


            if (sProgress) aFilters.push(new Filter("maker_progress_status_code", FilterOperator.Contains, sProgress));
            if (sTaxId) {
                sTaxId = sTaxId.toUpperCase();
                this.byId("searchTaxId").setValue(sTaxId);
                aFilters.push(new Filter("tax_id", FilterOperator.Contains, sTaxId));
            }
            if (sRequestUser) aFilters.push(new Filter("requestor_local_name", FilterOperator.Contains, sRequestUser));
            // if (sRequestDate) aFilters.push(new Filter("local_create_dtm", FilterOperator.Contains, sRequestDate));
            if (oDateValue) {
                aFilters.push(new Filter("local_create_dtm", FilterOperator.BT, this.dateFormatter.toDateString(oDateValue), this.dateFormatter.toDateString(oSecondDateValue)));
            }
            this.byId("mainTable").getBinding("items").filter(aFilters);
            this._getListCount(aFilters);
        },
        _getListCount: function (filtersParam) {
            var oView = this.getView(),
                oModel = this.getOwnerComponent().getModel();
            filtersParam = Array.isArray(filtersParam) ? filtersParam : [];
            oView.setBusy(true);

            oModel.read("/MakerRegistrationRequestView/$count", {
                filters: filtersParam,
                success: function (data) {
                    oView.setBusy(false);
                    oView.getModel("countModel").setProperty("/count", data);
                }
            });
        },
        onExcelExport: function (oEvent) {
            var sTableId = oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) {
                return;
            }

            var oTable = this.byId(sTableId);
            var sFileName = "MAKER REQUEST LIST";
            var oList = oTable.getBinding("items");

            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oList
            });
        },

        onGoDetail: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContextPath(),//getBindingContext().getPath(), oEvent.getSource().getBindingContext("list").getPath()
                oRecord = this.getModel().getProperty(sPath);//this.getModel("list").getProperty(sPath);

            var inputModel = new JSONModel();
            inputModel.setData({ gubun: "MR", mode: "R", tenantId: oRecord.tenant_id, taxId: oRecord.tax_id, progressCode: oRecord.maker_progress_status_code, makerCode: "" });
            this._fnMoveMakerMasterCreate(inputModel);
        },
        _fnMoveMakerMasterCreate: function (inputModel) {
            //portal에 있는 toolPage 
            var oToolPage = this.getView().getParent().getParent().getParent().oContainer.getParent();

            //이동하려는 app의 component name,url
            var sComponent = "sp.sm.makerMasterCreate",
                sUrl = "../sp/sm/makerMasterCreate/webapp";

            // 화면 구분 코드(MM : Maker Mater, MR : Maker Registration, MA : 타모듈  등록)  -> gubun
            // 생성/보기 모드 코드(C : 생성, R : 보기) -> mode

            Component.load({
                name: sComponent,
                url: sUrl
            }).then(function (oComponent) {
                var oContainer = new ComponentContainer({
                    name: sComponent,
                    async: true,
                    url: sUrl
                });
                oContainer.setPropagateModel(true);
                oContainer.setModel(inputModel, "callByAppModel");
                oToolPage.removeAllMainContents();
                oToolPage.addMainContent(oContainer);
            }).catch(function (e) {
                MessageToast.show("error");
            });
        },
        onhandleChangeDate: function (oEvent) {
            var bValid = oEvent.getParameter("valid"),
                oEventSource = oEvent.getSource();
            if (bValid) {
                oEventSource.setValueState(ValueState.None);
            } else {
                oEventSource.setValueState(ValueState.Error);
            }
        }



    });
});