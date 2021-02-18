/**
 * 작성일 : 2020.11.11
 * 화면ID : 
 */


// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    'sap/m/MessageStrip',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, FilterOperator, FilterType, MessageStrip, MessageBox, MessageToast, BaseController, Multilingual, Validator) {
        "use strict";

        return BaseController.extend("pg.tm.tmMonitoring.controller.Main", {
            //Validator
            validator: new Validator(),

            onInit: function () {
                var oMultilingual = new Multilingual();
                this.setModel(oMultilingual.getModel(), "I18N");
                this.getView().byId("smartFilterBar")._oSearchButton.setText("조회");
                this.getView().byId("tenant_combo").fireSelectionChange();
            },

            /** table excel export
             * @public
             */
            onBeforeExport: function (oEvt) {
                var mExcelSettings = oEvt.getParameter("exportSettings");
                // Disable Worker as Mockserver is used in Demokit sample
                mExcelSettings.worker = false;
                for (var i = 7; i < 11; i++) {
                    mExcelSettings.workbook.columns[i].falseValue = "No";
                    mExcelSettings.workbook.columns[i].trueValue = "Yes";
                }


            },

            /** table sort dialog 
             * @public
             */

            onSort: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Sort");
                }
            },

            /** table filter dialog 
            * @public
            */
            onFilter: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Filter");
                }
            },

            /** table columns dialog
             * @public 
             */
            onColumns: function () {
                var oSmartTable = this._getSmartTable();
                if (oSmartTable) {
                    oSmartTable.openPersonalisationDialog("Columns");
                }
            },

            /** table columns dialog
            */
            _getSmartTable: function () {
                if (!this._oSmartTable) {
                    this._oSmartTable = this.getView().byId("MonitorList");
                }
                return this._oSmartTable;
            },


            /** smart table 'beforeRebindTable' event(table filter)
             * smart table Search 기능
             *  @public
             */
            onSearchTable: function (oEvent) {
                var mBindingParams = oEvent.getParameter("bindingParams");
                var oSmtFilter = this.getView().byId("smartFilterBar");
                var tenant_combo = this.getView().byId("tenant_combo"),         //회사 콤보박스
                    tenant_name = tenant_combo.getValue(),
                    company_combo = this.getView().byId("company_combo"),       //법인 콤보박스
                    company_name = company_combo.getSelectedItems(),
                    bizunit_combo = this.getView().byId("bizunit_combo"),           //사업본부 콤보박스
                    bizunit_name = bizunit_combo.getSelectedItems();

                var aSearchFilters = [];
                if (tenant_name.length > 0) {
                    aSearchFilters.push(new Filter("tenant_name", FilterOperator.Contains, tenant_name));
                }
                if (company_name.length > 0) {
                    for (var i = 0; i < company_name.length; i++) {
                        aSearchFilters.push(new Filter("company_name", FilterOperator.Contains, company_name[i].getProperty("text")));
                    }
                }
                if (bizunit_name.length > 0) {
                    for (var a = 0; a < bizunit_name.length; a++) {
                        aSearchFilters.push(new Filter("bizunit_name", FilterOperator.Contains, bizunit_name[a].getProperty("text")));
                    }
                }
                if (tenant_name.length === 0 && company_name.length === 0 && bizunit_name.length === 0) {
                    mBindingParams.filters.push(new Filter([]));
                }
                mBindingParams.filters.push(new Filter(aSearchFilters, true));

            },



            /** Detail view로 Navigate 기능 
            * @public
            */
            onNavToDetail: function (oEvent) {
                // @ts-ignore
                var itemPath = oEvent.getSource().getBindingContext().getPath();
                // var masterObj = this.getView().getModel().getProperty(itemPath);
                // /MonitoringMasterView(scenario_number=1l,tenant_id='L2100',company_code='LGCKR',bizunit_code='L210000000')
                this.getModel().read(itemPath, {
                    success: function (oData, response) {
                        var masterObj = oData;
                        this.getRouter().navTo("detail", {
                            scenario_number: masterObj.scenario_number,
                            tenant_id: masterObj.tenant_id,
                            company_code: masterObj.company_code,
                            bizunit_code: masterObj.bizunit_code,
                            manager: masterObj.manager === '' ? ' ' : masterObj.manager,
                            manager_local_name: masterObj.manager_local_name === '' ? ' ' : masterObj.manager_local_name
                        });
                    }.bind(this)
                });
            },


            /** 회사(tenant_id)값으로 법인, 사업본부 combobox item filter 기능
            * @public
            */
            onChangeTenant: function (oEvent) {
                var oSelectedkey = oEvent.getSource().getSelectedKey();
                var company_combo = this.getView().byId("company_combo");                   //법인 
                var business_combo = this.getView().byId("bizunit_combo");                  //사업본부
                // var oBindingComboBox = company_combo.getBinding("items");
                var aFiltersComboBox = [];
                var oFilterComboBox = new sap.ui.model.Filter("tenant_id", "EQ", oSelectedkey);
                aFiltersComboBox.push(oFilterComboBox);
                // oBindingComboBox.filter(aFiltersComboBox);
                var corpSorter = new sap.ui.model.Sorter("company_name", false);            //sort Ascending
                var businessSorter = new sap.ui.model.Sorter("bizunit_name", false);        //sort Ascending
                company_combo.bindAggregation("items", {
                    path: "/OrgCompanyView",
                    sorter: corpSorter,
                    filters: aFiltersComboBox,
                    // @ts-ignore
                    template: new sap.ui.core.Item({
                        key: "{company_code}",
                        text: "{company_name}"
                    })
                });


                business_combo.bindAggregation("items", {
                    path: "/OrgUnitView",
                    sorter: businessSorter,
                    filters: aFiltersComboBox,
                    // @ts-ignore
                    template: new sap.ui.core.Item({
                        key: "{bizunit_code}",
                        text: "{bizunit_name}"
                    })
                });
            },

            /** Create 버튼 기능
            * 시나리오 생성 화면으로 이동 
            * @public
            */
            onCreateDetail: function (oEvent) {
                this.getRouter().navTo("detail", {
                    scenario_number: "New",
                    tenant_id: " ",
                    company_code: " ",
                    bizunit_code: " ",
                    manager: " ",
                    manager_local_name: " "
                });

            }


        });
    });
