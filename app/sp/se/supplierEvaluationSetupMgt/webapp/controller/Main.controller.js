/**
 * 작성일 : 2021.01.18
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
    "ext/lib/util/Validator",
    "sap/ui/core/Item"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment, Filter, 
        FilterOperator, FilterType, MessageStrip, MessageBox, MessageToast, BaseController, Multilingual, Validator, Item) {
        "use strict";

        return BaseController.extend("sp.se.supplierEvaluationSetupMgtMgt.controller.Main", {
            //Validator
            validator: new Validator(),
            onInit: function () {
                var oMultilingual = new Multilingual();
                this.setModel(oMultilingual.getModel(), "I18N");
                var i18nModel = this.getModel("I18N");
                
                this.getView().byId("smartFilterBar")._oSearchButton.setText(i18nModel.getText("/SEARCH"));

              //  this.getView().byId("tenant_combo").fireSelectionChange();


              // 로그인 세션 작업완료시 수정
              this.tenant_id = "L2100";
              this.company_code = "LGCKR";

              var aSearchFilters = [];                
                    aSearchFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                    aSearchFilters.push(new Filter("company_code", 'EQ', this.company_code));        

                 
              var oTenantCombo = this.byId("tenant_combo");
              
                  oTenantCombo.bindItems(
                  {
                  path:"/SupEvalOrgView",
                  filters:aSearchFilters,
                  template: new Item({
                      key:"{org_code}",
                      text:"{org_name}"
                  })
                }
              )
              //콤보박스 선택없을때 
            //   oTenantCombo.setRequired();
            //   sap.ui.getCore().byId("tenant_combo").setValueState("Error");


            },

            /** table excel export
             * @public
             */
            // onBeforeExport: function (oEvt) {
            //     var mExcelSettings = oEvt.getParameter("exportSettings");
            //     // Disable Worker as Mockserver is used in Demokit sample
            //     mExcelSettings.worker = false;
            // },

            /** table sort dialog 
             * @public
             */
            // onSort: function () {
            //     var oSmartTable = this._getSmartTable();
            //     if (oSmartTable) {
            //         oSmartTable.openPersonalisationDialog("Sort");
            //     }
            // },

            /** table filter dialog 
            * @public
            */
            // onFilter: function () {
            //     var oSmartTable = this._getSmartTable();
            //     if (oSmartTable) {
            //         oSmartTable.openPersonalisationDialog("Filter");
            //     }
            // },

            /** table columns dialog
             * @public 
             */
            // onColumns: function () {
            //     var oSmartTable = this._getSmartTable();
            //     if (oSmartTable) {
            //         oSmartTable.openPersonalisationDialog("Columns");
            //     }
            // },

            /** table columns dialog
            * @private 
            */
            // _getSmartTable: function () {
            //     if (!this._oSmartTable) {
            //         this._oSmartTable = this.getView().byId("MonitorList");
            //     }
            //     return this._oSmartTable;
            // },


            /** smart table 'beforeRebindTable' event(table filter)
             * smart table Search 기능
             *  @public
             */
            onSearchTable: function (oEvent) {
                this.byId("MonitorListTable").getModel().refresh(true);
                var mBindingParams = oEvent.getParameter("bindingParams");
                // var oSmtFilter = this.getView().byId("smartFilterBar");

                var tenant_combo = this.getView().byId("tenant_combo"),         //회사 콤보박스
                    tenant_name =  tenant_combo.getSelectedKey(); 
                //tenant_name = tenant_combo.getValue();

                

                    // company_combo = this.getView().byId("company_combo"),       //법인 콤보박스
                    // company_name = company_combo.getSelectedItems(),
                    // bizunit_combo = this.getView().byId("bizunit_combo"),           //사업본부 콤보박스
                    // bizunit_name = bizunit_combo.getSelectedItems();
                    
                var aSearchFilters = [];
                if (tenant_name.length > 0) {
                    aSearchFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                    aSearchFilters.push(new Filter("company_code", 'EQ', this.company_code));
                    aSearchFilters.push(new Filter("org_code", 'EQ', tenant_name));    
                    
                }
                // if (company_name.length > 0) {
                //     for (var i = 0; i < company_name.length; i++) {
                //         aSearchFilters.push(new Filter("company_name", FilterOperator.Contains, company_name[i].getProperty("text")));
                //     }
                // }
                // if (bizunit_name.length > 0) {
                //     for (var a = 0; a < bizunit_name.length; a++) {
                //         aSearchFilters.push(new Filter("bizunit_name", FilterOperator.Contains, bizunit_name[a].getProperty("text")));
                //     }
                // }
                // if (tenant_name.length === 0 && company_name.length === 0 && bizunit_name.length === 0) {
                //     mBindingParams.filters.push(new Filter([]));
                // }

                if (tenant_name.length === 0) {
                    mBindingParams.filters.push(new Filter([]));
                }

                mBindingParams.filters.push(new Filter(aSearchFilters, true));

                console.log(aSearchFilters);


            },



            /** Detail view로 Navigate 기능 
            * @public
            */
            // onNavToDetail: function (oEvent) {
            //     // @ts-ignore
            //     var itemPath = oEvent.getSource().getBindingContext().getPath();
            //     // /MonitoringMasterView(scenario_number=1l,tenant_id='L2100',company_code='LGCKR',bizunit_code='L210000000')
            //     // this.getModel().read(itemPath, {
            //     //     success: function (oData, response) {

            //     //     }.bind(this)
            //     // });
            //     var key = itemPath.substring(itemPath.indexOf("(") + 1, itemPath.indexOf(")"));
            //     var key_arr = key.split(",");
            //     var scenario_number = key_arr[0].substring(key_arr[0].indexOf("=") + 1).replaceAll("'", "")
            //     var tenant_id = key_arr[1].substring(key_arr[1].indexOf("=") + 1).replaceAll("'", "");
            //     var company_code = key_arr[2].substring(key_arr[2].indexOf("=") + 1).replaceAll("'", "");
            //     var bizunit_code = key_arr[3].substring(key_arr[3].indexOf("=") + 1).replaceAll("'", "");
            //     this.getRouter().navTo("detail", {
            //         scenario_number: scenario_number,
            //         tenant_id: tenant_id,
            //         company_code: company_code,
            //         bizunit_code: bizunit_code

            //     });
            // },


            /** 회사(tenant_id)값으로 법인, 사업본부 combobox item filter 기능
            * @public
            */
            // onChangeTenant: function (oEvent) {
            //     var oSelectedkey = oEvent.getSource().getSelectedKey();
            //     var company_combo = this.getView().byId("company_combo");                   //법인 
            //     var business_combo = this.getView().byId("bizunit_combo");                  //사업본부
            //     // var oBindingComboBox = company_combo.getBinding("items");
            //     var aFiltersComboBox = [];
            //     var oFilterComboBox = new sap.ui.model.Filter("tenant_id", "EQ", oSelectedkey);
            //     aFiltersComboBox.push(oFilterComboBox);
            //     // oBindingComboBox.filter(aFiltersComboBox);
            //     var corpSorter = new sap.ui.model.Sorter("company_name", false);            //sort Ascending
            //     var businessSorter = new sap.ui.model.Sorter("bizunit_name", false);        //sort Ascending
            //     company_combo.bindAggregation("items", {
            //         path: "/OrgCompanyView",
            //         sorter: corpSorter,
            //         filters: aFiltersComboBox,
            //         // @ts-ignore
            //         template: new sap.ui.core.Item({
            //             key: "{company_code}",
            //             text: "{company_name}"
            //         })
            //     });


            //     business_combo.bindAggregation("items", {
            //         path: "/OrgUnitView",
            //         sorter: businessSorter,
            //         filters: aFiltersComboBox,
            //         // @ts-ignore
            //         template: new sap.ui.core.Item({
            //             key: "{bizunit_code}",
            //             text: "{bizunit_name}"
            //         })
            //     });
            // },

            /** Create 버튼 기능
            * 시나리오 생성 화면으로 이동 
            * @public
            */
            onCreateDetail: function (oEvent) {
            
                var oTenantCombo = this.byId("tenant_combo");

                if(oTenantCombo.getSelectedItem()==null){
                    MessageToast.show("please Selected");
                    return;
                }
                else{
                    
                    var oSelectedData = oTenantCombo.getSelectedItem().getBindingContext().getModel().getProperty
                    (this.byId("tenant_combo").getSelectedItem().getBindingContext().getPath());

                    var tenant_id = oSelectedData.tenant_id,
                    company_code = oSelectedData.company_code,
                    org_code = oSelectedData.org_code ,
                    org_type_code = oSelectedData.org_type_code;
                
                    this.getRouter().navTo("detail", {
                        scenario_number: "New",
                        tenant_id: tenant_id,
                        company_code: company_code,
                        org_code: org_code,
                        org_type_code: org_type_code
                        // bizunit_code: bizunit_code

                });
                }

            }


        });
});