

            // var textMaterialCode = sap.ui.core.Fragment.byId("Display_id", "textMaterialCode");
            // var textcategoryName = sap.ui.core.Fragment.byId("Display_id", "textcategoryName");
            // var textUseflag = sap.ui.core.Fragment.byId("Display_id", "textUseflag");

            comboBox.bindItems({ 
              path: "/items", 
              template: itemTemplate, 
              templateShareable:true
              }); 
              
MIMaterialCodeBOMManagement
/*
"d": {
   "results": [
     {
       "__metadata": {
         "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',material_code='ERCA00006AA',supplier_code='KR00008',mi_material_code='COP-001-01')",
         "uri": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',material_code='ERCA00006AA',supplier_code='KR00008',mi_material_code='COP-001-01')",
         "type": "pg.marketIntelligenceService.MIMaterialCodeBOMManagement"
       },
       "tenant_id": "L2100",
       "company_code": "*",
       "org_type_code": "BU",
       "org_code": "BIZ00100",
       "material_code": "ERCA00006AA",
       "material_desc": "Cathode Active Material LCH20D",
       "supplier_code": "KR00008",
       "supplier_local_name": "이지금",
       "supplier_english_name": "IU",
       "base_quantity": "1",
       "processing_cost": "45000",
       "pcst_currency_unit": "KRW",
       "mi_material_code": "COP-001-01",
       "mi_material_name": "구리",
       "category_code": "Non-Ferrous Metal",
       "category_name": "비철금속",
       "reqm_quantity_unit": "MT",
       "reqm_quantity": "10",
       "currency_unit": "USD",
       "mi_base_reqm_quantity": "1",
       "quantity_unit": "MT",
       "exchange": "Platts",
       "termsdelv": "FOB KOR",
       "use_flag": true,
       "local_create_dtm": "/Date(1606750140000)/",
       "local_update_dtm": "/Date(1606750140000)/",
       "create_user_id": "Admin",
       "update_user_id": "Admin",
       "system_create_dtm": "/Date(1606750140000)/",
       "system_update_dtm": "/Date(1606750140000)/"
     },
     */
MIMaterialPriceManagement
/*
"d": {
   "results": [
     {
       "__metadata": {
         "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/MIMaterialPriceManagement(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='A2',category_code='A2',exchange='A2',currency_unit='A2',quantity_unit='A2',termsdelv='A2',mi_date=datetime'2020-11-27T00%3A00%3A00')",
         "uri": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/MIMaterialPriceManagement(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='A2',category_code='A2',exchange='A2',currency_unit='A2',quantity_unit='A2',termsdelv='A2',mi_date=datetime'2020-11-27T00%3A00%3A00')",
         "type": "pg.marketIntelligenceService.MIMaterialPriceManagement"
       },
       "tenant_id": "L2100",
       "company_code": "*",
       "org_type_code": "BU",
       "org_code": "BIZ00100",
       "mi_material_code": "A2",
       "mi_material_name": "A23",
       "category_code": "A2",
       "category_name": null,
       "use_flag": null,
       "exchange": "A2",
       "currency_unit": "A2",
       "quantity_unit": "A2",
       "exchange_unit": "A2",
       "termsdelv": "A2",
       "sourcing_group_code": "A2",
       "delivery_mm": "A2",
       "mi_date": "/Date(1606435200000)/",
       "amount": "20.000",
       "status": null,
       "local_create_dtm": "/Date(1606451289000)/",
       "local_update_dtm": "/Date(1606451302000)/",
       "create_user_id": "anonymous",
       "update_user_id": "anonymous",
       "system_create_dtm": "/Date(1606451289000)/",
       "system_update_dtm": "/Date(1606451302000)/"
     },

*/

MIMaterialPriceManagementView
/*
"d": {
   "results": [
     {
       "__metadata": {
         "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/MIMaterialPriceManagementView(mi_material_code='A2',currency_unit='A2',quantity_unit='A2',exchange='A2',termsdelv='A2',mi_date=datetime'2020-11-27T00%3A00%3A00')",
         "uri": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.
         cloud.sap:443/odata/v2/pg.marketIntelligenceService/
         MIMaterialPriceManagementView(
               mi_material_code='A2',
               currency_unit='A2',quantity_unit='A2',
               exchange='A2',termsdelv='A2',

         mi_date=datetime'2020-11-27T00%3A00%3A00')",
         "type": "pg.marketIntelligenceService.MIMaterialPriceManagementView"
       },
       "mi_material_code": "A2",
       "mi_material_name": null,
       "category_code": "A2",
       "category_name": null,
       "currency_unit": "A2",
       "quantity_unit": "A2",
       "exchange_unit": "A2",
       "exchange": "A2",
       "termsdelv": "A2",
       "sourcing_group_code": "A2",
       "delivery_mm": "A2",
       "mi_date": "/Date(1606435200000)/",
       "amount": "20.000"
     },
     */
OrgTenantView
/*
       "d": {
   "results": [
     {
       "__metadata": {
         "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/OrgTenantView('L1100')",
         "uri": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/OrgTenantView('L1100')",
         "type": "pg.marketIntelligenceService.OrgTenantView"
       },
       "tenant_id": "L1100",
       "tenant_name": "전자"
     },
     */
CurrencyUnitView
/*
 "d": {
   "results": [
     {
       "__metadata": {
         "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/CurrencyUnitView(tenant_id='L2100',currency_code='JPY',language_code='EN')",
         "uri": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/CurrencyUnitView(tenant_id='L2100',currency_code='JPY',language_code='EN')",
         "type": "pg.marketIntelligenceService.CurrencyUnitView"
       },
       "tenant_id": "L2100",
       "currency_code": "JPY",
       "language_code": "EN",
       "currency_code_name": "Yen"
     },

     */

MIMaterialCodeList
/*

      "d": {
   "results": [
     {
       "__metadata": {
         "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/MIMaterialCodeList(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='NIC-001-01')",
         "uri": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/MIMaterialCodeList(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',mi_material_code='NIC-001-01')",
         "type": "pg.marketIntelligenceService.MIMaterialCodeList"
       },
       "tenant_id": "L2100",
       "company_code": "*",
       "org_type_code": "BU",
       "org_code": "BIZ00100",
       "mi_material_code": "NIC-001-01",
       "mi_material_name": "니켈22222",
       "category_code": "Metal",
       "category_name": "금속",
       "use_flag": false,
       "local_create_dtm": "/Date(1606976324000)/",
       "local_update_dtm": "/Date(1606976324000)/",
       "create_user_id": "Admin",
       "update_user_id": "anonymous",
       "system_create_dtm": "/Date(1605629280000)/",
       "system_update_dtm": "/Date(1606976324000)/"
     },

     */
UnitOfMeasureView
/*
    {"d":{"results":[{
        "__metadata":{
            "id":"https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService
            /UnitOfMeasureView(
                tenant_id='L2600',
                uom_code='%25',
                language_code='EN')"
                */
/*
EnrollmentMaterialView

"d":{"results":[{"__metadata":{"id":
"https://lgcommondev-workspaces-ws-k8gvf-app1.
jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService

/EnrollmentMaterialView(tenant_id='L1100',material_code='6910BLC0006')

*/

EnrollmentSupplierView
/*
 "d": {
   "results": [
     {
       "__metadata": {
         "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/EnrollmentSupplierView(tenant_id='L2100',supplier_code='KR00002600')",
         "uri": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/EnrollmentSupplierView(tenant_id='L2100',supplier_code='KR00002600')",
         "type": "pg.marketIntelligenceService.EnrollmentSupplierView"
       },
       "tenant_id": "L2100",
       "supplier_code": "KR00002600",
       "supplier_local_name": "(주)네패스",
       "supplier_engligh_name": "nepes"
     },
     */