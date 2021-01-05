## LGCNS HANA DB 배포
cds deploy --to hana:sppDb_hdi_dev --no-save

## JAVA 빌드
mvn clean install

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

## 데이터 CRUD
# 등록 : master
curl -X POST http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master \
-H "Content-Type: application/json" \
-d '{"tenant_id": "L2100", "approval_title": "개발VI 품의서 테스트", 
"approval_type_code": "10", "new_change_code": "10", "approval_status_code": "10", "approval_request_desc": "품의 테스트", 
"approval_requestor_empno": "15", "approval_request_date": "2020-12-10T00:00:00", 
"local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z",
"details": []}'

# 등록 : master-detail
curl -X POST http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master \
-H "Content-Type: application/json" \
-d '{"tenant_id": "L2100", "approval_title": "개발VI 품의서 테스트",
"approval_type_code": "10", "new_change_code": "10", "approval_status_code": "10", "approval_request_desc": "품의 테스트", 
"approval_requestor_empno": "15", "approval_request_date": "2020-12-10T00:00:00", 
"local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z",
"details": [ 
{ "company_code": "LGEKR", "org_type_code": "PU", "org_code": "EKHQ", "au_code": "10", "material_code": "1", "supplier_code": "KR00002600", "base_date": "2020-12-10T00:00:00", "base_price_ground_code": "10", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z"},
{ "company_code": "LGEKR", "org_type_code": "PU", "org_code": "EKHQ", "au_code": "10", "material_code": "2", "supplier_code": "KR00002600", "base_date": "2020-12-11T00:00:00", "base_price_ground_code": "10", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z"} 
]}'

# 등록 : master-detail-prices
curl -X POST http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master \
-H "Content-Type: application/json" \
-d '{"tenant_id": "L2100", "approval_title": "개발VI 품의서 테스트",
"approval_type_code": "10", "new_change_code": "10", "approval_status_code": "10", "approval_request_desc": "품의 테스트", 
"approval_requestor_empno": "15", "approval_request_date": "2020-12-10T00:00:00", 
"local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z",
"details": [ 
{ "company_code": "LGEKR", "org_type_code": "PU", "org_code": "EKHQ", "au_code": "10", "material_code": "2", "supplier_code": "KR00002600", "base_date": "2020-12-10T00:00:00", "base_price_ground_code": "10", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z", 
"prices": [
{ "market_code": "1", "new_base_price": "120", "new_base_price_currency_code": "KRW", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z"}
]} 
]}'

# 수정 : master-detail-prices
curl -X PATCH http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master\(tenant_id=\'L2100\',approval_number=\'202101040001\'\) \
-H "Content-Type: application/json" \
-d '{
    "approval_title": "개발VI 품의서 수정 테스트 중....",
    "approval_type_code": "10", "new_change_code": "10", "approval_status_code": "10", "approval_request_desc": "품의 수정 테스트 중....", 
    "approval_requestor_empno": "15", "approval_request_date": "2020-12-10T00:00:00", 
    "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2021-01-04T10:18:46Z",
    "details": [ 
        { 
            "company_code": "LGEKR", "org_type_code": "PU", "org_code": "EKHQ", "au_code": "10", "material_code": "2", "supplier_code": "KR00002600", "base_date": "2020-12-10T00:00:00", "base_price_ground_code": "10", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z", 
            "prices": [
                { "item_sequence": 1, "market_code": "2", "new_base_price": "150", "new_base_price_currency_code": "KRW", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z"}
            ]
        } 
    ]
}'

# 수정 : master
curl -X PATCH http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master\(tenant_id=\'L2100\',approval_number=\'202101040001\'\) \
-H "Content-Type: application/json" \
-d '{
    "approval_title": "개발VI 품의서 수정 테스트",
    "approval_type_code": "10", "new_change_code": "10", "approval_status_code": "10", "approval_request_desc": "품의 수정 테스트", 
    "approval_requestor_empno": "15", "approval_request_date": "2020-12-10T00:00:00", 
    "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2021-01-04T10:18:46Z"
}'


# 삭제
curl -X DELETE http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master\(tenant_id=\'L2100\',approval_number=\'202012180003\'\)

