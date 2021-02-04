sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "ext/lib/util/ExcelUtil",
    "sap/ui/core/routing/HashChanger"

], function (BaseController, Multilingual, JSONModel, DateFormatter, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, MessageBox, MessageToast, Component, ComponentContainer, ExcelUtil, HashChanger) {
    "use strict";

    var sTenantId;
    var oServiceModel = ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/sp.makerViewService/");
    var oMultilingual = new Multilingual();

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
            //Multilingual Model
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            //Process filter model
            var oView = this.getView(),
                that = this;
            this.setModel(new JSONModel(), "progressModel");
            oServiceModel.read("/MakerRegistrationRequestProgressTypeView", {
                filters: [new Filter("tenant_id", FilterOperator.EQ, "L2100")],
                sorters: [new Sorter("sort_no")],
                success: function (data) {
                    oView.setBusy(false);
                    var aRecords = data.results;
                    aRecords.unshift({ code: "", code_name: "전체" });
                    oView.getModel("progressModel").setProperty("/progress", aRecords);
                }.bind(this),
                error: function (data) {
                    oView.setBusy(false);
                    console.log("error");
                }
            });

            this.setModel(new JSONModel(), "listModel");

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
            // this._getBasePriceList(aFilters);
        },
        _getBasePriceList: function (filtersParam) {
            var oView = this.getView();
            var oModel = this.getModel();
            filtersParam = Array.isArray(filtersParam) ? filtersParam : [];
            oView.setBusy(true);

            oModel.read("/MakerRegistrationRequestView", {
                filters: filtersParam,
                urlParameters: {
                    "$orderby": "maker_request_sequence"
                },
                success: function (data) {
                    oView.setBusy(false);

                    oView.getModel("listModel").setData(data);
                },
                error: function (data) {
                    oView.setBusy(false);
                    console.log("error", data);
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
            var oList = oTable.getModel("listModel").getProperty("/results");

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
            //portal에 있는 toolPage 
            var oToolPage = this.getView().oParent.oParent.oParent.oContainer.oParent;
            //이동하려는 app의 component name,url
            var sComponent = "sp.sm.makerMasterList",
                sUrl = "../sp/sm/makerMasterList/webapp";

            var changeHash = inputModel.getData();    //넘겨줄 hash 값
            // var changeHash = "{gubun : 'MR', mode : 'R', tenantId : '"+oRecord.tenant_id+"', taxId: '"+ oRecord.tax_id +"', progressCode: '"+ oRecord.maker_progress_status_code +"', makerCode: ''}";
            console.log(changeHash);
            HashChanger.getInstance().replaceHash("");

            Component.load({
                name: sComponent,
                url: sUrl
            }).then(function (oComponent) {
                var oContainer = new ComponentContainer({
                    name: sComponent,
                    async: true,
                    url: sUrl
                });
                oToolPage.removeAllMainContents();
                oToolPage.addMainContent(oContainer);
                //hash setting
                HashChanger.getInstance().setHash(changeHash);
            }).catch(function (e) {
                MessageToast.show("error");
            })
        }



    });
});