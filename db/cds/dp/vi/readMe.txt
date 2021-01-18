## LGCNS HANA DB 배포
cds deploy --to hana:sppDb_hdi_dev --no-save

## HANA FUNC 확인
select DP_APPROVAL_NUMBER_FUNC('L2100'), DP_ITEM_SEQUENCE_FUNC('L2100', '202004270010', 1) from dummy;

## JAVA 실행
mvn clean spring-boot:run

## 스키마 및 데이터 확인 주소 - v2
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/$metadata
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master?$format=json&$expand=details	
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master?$format=json&$expand=details/prices
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master?$format=json&$expand=details,details/material_code_fk
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Detail?$format=json
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Price?$format=json

## 스키마 및 데이터 확인 주소 - v4
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v4/dp.BasePriceArlService/Base_Price_Arl_Master?$expand=details($expand=prices)
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v4/dp.BasePriceArlService/Base_Price_Arl_Master?$expand=details($expand=material_code_fk)

## 공통코드
# 품의서유형코드(DP_VI_APPROVAL_TYPE) : VI10, VI20
# 품의상태코드(CM_APPROVE_STATUS) : DR / AR / IA / AP / RJ

## 데이터 CRUD
# 등록 : main
curl -X POST http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Main \
-H "Content-Type: application/json" \
-d '{
	"tenant_id": "L2100", "approval_number": "T202101160003", "chain_code": "DP", "approval_type_code": "VI10",	"approve_status_code": "DR",
	"approval_title": "개발VI 신규 품의서 제목", "approval_contents": "개발VI 신규 품의서 내용",
	"requestor_empno": "5454", "request_date": "20201210", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z"
}'

# 등록 : master-detail-prices
curl -X POST http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master \
-H "Content-Type: application/json" \
-d '{
	"tenant_id": "L2100", "approval_number": "T202101160003", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z",
	"details": [
        { "item_sequence": "1", "company_code": "LGCKR", "org_type_code": "PU", "org_code": "1000", "au_code": "10", "material_code": "1000211", "supplier_code": "KR00002600", "base_date": "2020-12-10T00:00:00", "base_price_ground_code": "10", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z", 
        "prices": [
            { "market_code": "1", "new_base_price": "120", "new_base_price_currency_code": "KRW", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z"}
        ]}         
    ]
}'

================================================================================================