## LGCNS HANA DB 배포
cds deploy --to hana:sppDb_hdi_dev --no-save

## JAVA 빌드
mvn clean install

## JAVA 실행
mvn clean spring-boot:run

## 스키마 및 데이터 확인 주소
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/$metadata
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master?$format=json&$expand=details	
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Detail?$format=json
https://lgcommondev-workspaces-ws-tkg9d-app1.jp10.applicationstudio.cloud.sap/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Price?$format=json

## 데이터 CRUD
# 등록
curl -X POST http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master \
-H "Content-Type: application/json" \
-d '{"tenant_id": "L2100", "approval_number": "B202012030001", "company_code": "LGEKR", "org_type_code": "PU", "org_code": "EKHQ", "approval_type_code": "10", "new_change_code": "10", "approval_status_code": "10", "approval_request_desc": "품의 테스트", "approval_requestor_empno": "15", "approval_request_date": "2020-12-10T00:00:00", "local_create_dtm": "2020-12-03T10:18:46Z", "local_update_dtm": "2020-12-03T10:18:46Z"}'

# 삭제
curl -X DELETE http://localhost:8080/odata/v2/dp.BasePriceArlService/Base_Price_Arl_Master\(tenant_id=\'L2100\',approval_number=\'B202012030001\'\)