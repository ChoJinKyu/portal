sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/m/MessageToast",    
    "ext/lib/util/Multilingual",
    "sap/ui/core/Item",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel"
],

    function (BaseController, Filter, MessageToast,  Multilingual, Item, Sorter, JSONModel) {
        "use strict";

        return BaseController.extend("sp.se.supplierEvaluationSetupMgt.controller.Main", {
          
            onInit: function () {
                var oMultilingual, oOwnerComponent , i18nModel;
                var oViewModel;

                oMultilingual = new Multilingual();
                this.setModel(oMultilingual.getModel(), "I18N");
                i18nModel = this.getModel("I18N");
                
                // this.getView().byId("smartFilterBar")._oSearchButton.setText(i18nModel.getText("/SEARCH"));

                oOwnerComponent = this.getOwnerComponent();
                this.oRouter = oOwnerComponent.getRouter();
                this.oRouter.getRoute("main").attachPatternMatched(this._onDetailMatched, this);


                // 로그인 세션 작업완료시 수정
                this.tenant_id = "L2100";
                this.company_code = "LGCKR";
                

                oViewModel = new JSONModel();
                this.setModel(oViewModel, "mainModel");
                //콤보박스 선택없을때 
                //oTenantCombo.setRequired();
                //sap.ui.getCore().byId("tenant_combo").setValueState("Error");

            },

            _onDetailMatched: function (){
                var oTenantCombo, aTenantComboFilters;
            

                    oTenantCombo = this.byId("tenant_combo");

                    aTenantComboFilters = [];                
                    aTenantComboFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                    aTenantComboFilters.push(new Filter("company_code", 'EQ', this.company_code));  

                    oTenantCombo.bindItems({
                            path:"/SupEvalOrgView",
                            filters:aTenantComboFilters,
                            template: new Item({
                                key:"{org_code}",
                                text:"{org_name}"
                            })
                        }
                    );

                // Detail View -> Main View 전환시 재조회 추후 SmartTable -> m.table 변경예정
                if(this.byId("tenant_combo").getSelectedKey())
                this.onSearchTable();
                //    this.byId("MonitorList").rebindTable();

            },
            
            /** smart table 'beforeRebindTable' event(table filter)
             * smart table Search 기능
             *  @public
             */
            onSearchTable: function (oEvent) {
                var oView, oBindingParams;
                
                oView = this.getView();

                // oBindingParams = oEvent.getParameter("bindingParams");

                // this.byId("MonitorListTable").getModel().refresh(true);

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
                    
                    
                    oView.getModel().read("/SupEvalOpUnitListView", {
                    filters: aSearchFilters,
                    success: function (oData) {

                        oView.getModel("mainModel").setProperty("/mainListTable",oData.results);                    
                        //this.getView().getModel("DetailView").setData(oManager);            
                        
                        }.bind(this),
                        error: function () {
                        }

                        });


                    // oBindingParams.filters.push(new Filter(aSearchFilters, true));
                   

                }else if (tenant_name.length === 0) {
                    // oBindingParams.filters.push(new Filter([]));
                }
                    //정렬
                    // oBindingParams.sorter= [new Sorter("evaluation_operation_unit_code")];
            },
            _getComboItem : function (){
                var oTenantCombo, oContext, oModel, oItem

                    oTenantCombo = this.byId("tenant_combo");

                    if(oTenantCombo.getSelectedItem()===null){

                        return MessageToast.show("please Selected");

                    }else{
                        oContext = oTenantCombo.getSelectedItem().getBindingContext();
                        oModel = oContext.getModel();
                        oItem = oModel.getProperty(oContext.getPath()); 

                        return oItem;
                    }
            },
            /** Detail view로 Navigate 기능 
            * @public
            */
            onNavToDetail: function (oEvent) {
               
                // 선택한 테이블의 행의 정보
                // var oEventContext = oEvent.getSource().getBindingContext();
                // var oEventModel = oEventContext.getModel();
                // var oEventItem = oEventModel.getProperty(oEventContext.getPath());                
                
                var oSource = oEvent.getSource();
                var sPath = oSource.getBindingContextPath();
                var oModel = oSource.getModel("mainModel");
                var oEventItem = oModel.getProperty(sPath);   
                //oEvent.getSource().getModel("mainModel").getProperty("/mainListTable/1")


                // 선택된 ComboBox 정보
                // var oTenantCombo = this.byId("tenant_combo");
                // var oContext = oTenantCombo.getSelectedItem().getBindingContext();
                // var oModel = oContext.getModel();
                // var oItem = oModel.getProperty(oContext.getPath());

                var oComboItem = this._getComboItem();

                //oModel.getProperty(oEvent.getSource().getBindingContext().getPath())
                  
                this.getRouter().navTo("detail", {
                        scenario_number: "Detail",
                        tenant_id: oComboItem.tenant_id,
                        company_code: oComboItem.company_code,
                        org_code: oComboItem.org_code,
                        org_type_code: oComboItem.org_type_code,
                        evaluation_operation_unit_code : oEventItem.evaluation_operation_unit_code,
                        evaluation_operation_unit_name : oEventItem.evaluation_operation_unit_name,
                        use_flag : oEventItem.use_flag
                    });

            },

            /** Create 버튼 기능
            * 시나리오 생성 화면으로 이동 
            * @public
            */
            onCreateDetail: function (oEvent) {

                var oComboItem = this._getComboItem();
                
                    this.getRouter().navTo("detail", {
                        scenario_number: "New",
                        tenant_id: oComboItem.tenant_id,
                        company_code: oComboItem.company_code,
                        org_code: oComboItem.org_code,
                        org_type_code: oComboItem.org_type_code,
                        evaluation_operation_unit_code : " ",
                        evaluation_operation_unit_name : " ",
                        use_flag : " "
                    });
                }

        });
});
