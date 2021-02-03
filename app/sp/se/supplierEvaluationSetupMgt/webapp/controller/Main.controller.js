/**
 * 작성일 : 2021.01.18
 * 화면ID : 
 */
sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",    
    "ext/lib/util/Multilingual",
    "sap/ui/core/Item"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Filter, MessageBox, MessageToast,  Multilingual, Item) {
        "use strict";

        return BaseController.extend("sp.se.supplierEvaluationSetupMgt.controller.Main", {
          
            onInit: function () {

                var oMultilingual = new Multilingual();
                this.setModel(oMultilingual.getModel(), "I18N");
                var i18nModel = this.getModel("I18N");
                
                this.getView().byId("smartFilterBar")._oSearchButton.setText(i18nModel.getText("/SEARCH"));

                var oOwnerComponent = this.getOwnerComponent();
                this.oRouter = oOwnerComponent.getRouter();
                this.oRouter.getRoute("main").attachPatternMatched(this._onDetailMatched, this);


                // 로그인 세션 작업완료시 수정
                this.tenant_id = "L2100";
                this.company_code = "LGCKR";
                
                //콤보박스 선택없을때 
                //oTenantCombo.setRequired();
                //sap.ui.getCore().byId("tenant_combo").setValueState("Error");

            },

            _onDetailMatched: function (oEvent) {

                var aTenantComboFilters = [];                
                    aTenantComboFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                    aTenantComboFilters.push(new Filter("company_code", 'EQ', this.company_code));       
                 
                var oTenantCombo = this.byId("tenant_combo");
              
                    oTenantCombo.bindItems({
                        path:"/SupEvalOrgView",
                        filters:aTenantComboFilters,
                        template: new Item({
                            key:"{org_code}",
                            text:"{org_name}"
                        })
                    }
                    );

                // Detail View 조회&저장후 main View 전환시 재조회
                if(this.byId("tenant_combo").getSelectedKey()){
                  
                    var key = this.byId("tenant_combo").getSelectedKey();
                   
                              this.byId("MonitorList").rebindTable();
                    }

            },
            
            /** smart table 'beforeRebindTable' event(table filter)
             * smart table Search 기능
             *  @public
             */
            onSearchTable: function (oEvent) {

                var oView = this.getView();

                var mBindingParams = oEvent.getParameter("bindingParams");

                this.byId("MonitorListTable").getModel().refresh(true);

                // var oSmtFilter = this.getView().byId("smartFilterBar");

                 //회사 콤보박스
                var tenant_combo = oView.byId("tenant_combo"),        
                    tenant_name =  tenant_combo.getSelectedKey(); 
                    //tenant_name = tenant_combo.getValue();
                    
                var aSearchFilters = [];
                if (tenant_name.length > 0) {
                    aSearchFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                    aSearchFilters.push(new Filter("company_code", 'EQ', this.company_code));
                    aSearchFilters.push(new Filter("org_code", 'EQ', tenant_name));   
                    
                    mBindingParams.filters.push(new Filter(aSearchFilters, true));

                }else if (tenant_name.length === 0) {
                    mBindingParams.filters.push(new Filter([]));
                }
            },

            /** Detail view로 Navigate 기능 
            * @public
            */
            onNavToDetail: function (oEvent) {
               
                // 선택한 행의 정보
                var oEventContext = oEvent.getSource().getBindingContext();
                var oEventModel = oEventContext.getModel();
                var oEventItem = oEventModel.getProperty(oEventContext.getPath());                
                
                // 선택된 ComboBox정보
                var oTenantCombo = this.byId("tenant_combo");
                var oContext = oTenantCombo.getSelectedItem().getBindingContext();
                var oModel = oContext.getModel();
                var oItem = oModel.getProperty(oContext.getPath());

                //oModel.getProperty(oEvent.getSource().getBindingContext().getPath())
                var  tenant_id = oItem.tenant_id,
                     company_code = oItem.company_code,
                     org_code = oItem.org_code ,
                     org_type_code = oItem.org_type_code,
                     evaluation_operation_unit_code = oEventItem.evaluation_operation_unit_code,
                     evaluation_operation_unit_name = oEventItem.evaluation_operation_unit_name,
                     use_flag = oEventItem.use_flag;
                    
                
                    this.getRouter().navTo("detail", {
                        scenario_number: "Detail",
                        tenant_id: tenant_id,
                        company_code: company_code,
                        org_code: org_code,
                        org_type_code: org_type_code,
                        evaluation_operation_unit_code : evaluation_operation_unit_code,
                        evaluation_operation_unit_name : evaluation_operation_unit_name,
                        use_flag : use_flag
                    });

            },

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

                    var oContext = oTenantCombo.getSelectedItem().getBindingContext();
                    var oModel = oContext.getModel();
                    var oItem = oModel.getProperty(oContext.getPath());

                    var tenant_id = oItem.tenant_id,
                    company_code = oItem.company_code,
                    org_code = oItem.org_code ,
                    org_type_code = oItem.org_type_code;
                
                    this.getRouter().navTo("detail", {
                        scenario_number: "New",
                        tenant_id: tenant_id,
                        company_code: company_code,
                        org_code: org_code,
                        org_type_code: org_type_code,
                        evaluation_operation_unit_code : " ",
                        evaluation_operation_unit_name : " ",
                        use_flag : " "
                    });
                }

            }

        });
});
