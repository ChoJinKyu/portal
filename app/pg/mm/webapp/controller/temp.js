
pg.monitor.controller.Main
main ===============================================

/MIMaterialCodeBOMManagement
(tenant_id='L2100',company_code='%2A',org_type_code='BU',org_code='BIZ00100',
material_code='ERCA00006AA',supplier_code='KR00008',mi_material_code='COP-001-01')",


https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/
srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$format=json

        "tenant_id": "L2100",
        "company_code": "*",
        "org_type_code": "BU",
        "org_code": "BIZ00100",
        "material_code": "ERCA00006AA",
        "material_description": "Cathode Active Material LCH20D",
        "supplier_code": "KR00008",
        "supplier_local_name": "이지금",
        "supplier_english_name": "IU",
        "base_quantity": "1",
        "processing_cost": "45000",
        "pcst_currency_unit": "KRW",
        "mi_material_code": "COP-001-01",
        "mi_material_code_name": "구리",
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

mid ===============================================================

MIMaterialPriceManagementView

        "__metadata": {
          "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/
          pg.marketIntelligenceService
          /MIMaterialPriceManagementView
          (mi_material_code='A2',currency_unit='A2',quantity_unit='A2',exchange='A2',termsdelv='A2',
          mi_date=datetime'2020-11-27T00%3A00%3A00')",
     
        },
        "mi_material_code": "A2",
        "mi_material_code_name": null,
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

관리조직
OrgTenantView/?$format=json
      {
        "__metadata": {
          "id": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/OrgTenantView('L1100')",
          "uri": "https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap:443/odata/v2/pg.marketIntelligenceService/OrgTenantView('L1100')",
          "type": "pg.marketIntelligenceService.OrgTenantView"
        },
        "tenant_id": "L2100",
        "tenant_name": "화학"
      },
        
pop

      MIMaterialCostInformationView