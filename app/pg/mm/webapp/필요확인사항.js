1. 질문 내역 초기 실행시 
초기 Create의 정보는 어떻게 선택할것인가.? (mi, mm )
onMainTableCreate


maint list view 화면 작성
수정 예정====

mi, mm 모두 수정해야함 
-mi 메인에서 항목 삭제시 언어도 삭제해야함 
-

--controller



--view

controll 파일 작업
자재별 시황자재 BOM 등록 view ,.controller 작업
참조 삭제시 json등록 데이타라도 바로 삭제 하지 않는다. 

https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$filter=

$filter=Alias eq 'random' 
---data
자재명 뷰 
MaterialView
sap.m.PopinDisplay.Block Inside the table popin, header is displayed at the first line and cell content is displayed at the next line.
sap.m.PopinDisplay.Inline Inside the table popin, cell content is displayed next to the header in the same line.
sap.m.PopinDisplay.WithoutHeader Inside the table popin, only the cell content will be visible.

테이블 리스트 
https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$filter=material_description eq 'Cathode Active Material LCH20D' 

material_code,material_description,supplier_code,base_quantity,processing_cost,mi_material_code,mi_material_code_name,category_name,reqm_quantity_unit,reqm_quantity,currency_unit,mi_base_reqm_quantity,quantity_unit,exchange,termsdelv,use_flag
entity MI_Material_Code_Bom_Mngt {
    key tenant_id             : String(5) not null  @title : '회사코드';
    key company_code          : String(10) not null @title : '법인코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key material_code         : String(40) not null @title : '자재코드';
        material_description  : String(300)         @title : '자재내역';
    key supplier_code         : String(15) not null @title : '공급업체코드';
        supplier_local_name   : String(240)         @title : '공급업체로컬명';
        supplier_english_name : String(240)         @title : '공급업체영문명';
        base_quantity         : Decimal not null    @title : '기준수량';
        processing_cost       : Decimal not null    @title : '가공비';
        pcst_currency_unit    : String(30) not null @title : '가공비통화단위';
    key mi_material_code      : String(40) not null @title : '시황자재코드';
        mi_material_code_name : String(240)         @title : '시황자재코드명';
        category_code         : String(40)          @title : '카테고리코드';
        category_name         : String(240)         @title : '카테고리명';
        reqm_quantity_unit    : String(3) not null  @title : '소요수량단위';
        reqm_quantity         : Decimal not null    @title : '소요수량';
        currency_unit         : String(30) not null @title : '통화단위';
        mi_base_reqm_quantity : Decimal not null    @title : '시황기준소요수량';
        quantity_unit         : String(3) not null  @title : '수량단위';
        exchange              : String(10) not null @title : '거래소';
        termsdelv             : String(10) not null @title : '인도조건';
        use_flag              : Boolean not null    @title : '사용여부';


https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$format=json