 요청 
2. 시황자재 > 가격정보 선택 - MIMaterialCostInformationView reqm_quantity_unit mi_base_reqm_quantity

onValueHelpMaterialDialogSearch 필터 하드코딩  L1100 다른자재가 없어서...
onValueHelpMaterialDialogApply
MIMaterialCostInformationView 데이타 확인되지 않고 있음

material_desc 확인해야함.. 96라인 initiallyVisibleFields 다시 추가해야함. 
자재명과 공급업체 명 검색 필드 있어서 추가 해야함. 
2020/12/11
material_desc 사라짐...
supplier_local_name 사라짐...
mi_material_name 사라짐...
category_name  사라짐...


작업 라인 - dev2111-1956
테이블이 준비되면 다 변경해야할듯 
자재 선택후 시황자재 리스트에서 add를 선택 가격정보 detail fragment 오픈 
가격정보 선택하고 시황자재 리스트에 추가. (use_flag, 화폐단위 선택하게끔함)
시황자재 리스트 등록, 수정, 삭제 테스트,
om 자재 등록 
http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/CurrencyUnitView/?$top=5
<d:tenant_id>L2100</d:tenant_id>
<d:currency_code>USD</d:currency_code>
<d:language_code>EN</d:language_code>
<d:currency_code_name>Dollar</d:currency_code_name>

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MaterialView/?$top=5
<m:properties>
<d:tenant_id>L1100</d:tenant_id>
<d:material_code>6910BLC0006</d:material_code>
<d:material_desc>Primary Cell Battery,Lithium</d:material_desc>
</m:properties>
http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/SupplierView/?$top=5
<m:properties>
<d:tenant_id>L1100</d:tenant_id>
<d:supplier_code>KR01818401</d:supplier_code>
<d:supplier_local_name>한국유나이티드제약(주)</d:supplier_local_name>
<d:supplier_english_name m:null="true"/>
</m:properties>
</content>

MIMaterialCostInformationView reqm_quantity_unit
<m:properties>
<d:tenant_id>L2100</d:tenant_id>
<d:company_code>*</d:company_code>
<d:org_type_code>BU</d:org_type_code>
<d:org_code>BIZ00100</d:org_code>
<d:mi_material_code>A001-01-01</d:mi_material_code>
<d:mi_material_name>원유(서부텍사스중질유)</d:mi_material_name>
<d:currency_unit>USD</d:currency_unit>
<d:quantity_unit>MT</d:quantity_unit>
<d:exchange>Platts</d:exchange>
<d:termsdelv>CFR China</d:termsdelv>
<d:mi_date>2020-07-21T00:00:00</d:mi_date>
<d:amount>632.600</d:amount>
</m:properties>

//UnitOfMeasureView 
수량단위 

            //자재정보 선택을 참조한다. 
            //supplier_code, supplier_local_name, hidden_supplier_local_name, supplier_english_name
            var material_code = this.getView().byId("input_hidden_material_code").getValue();
            var material_desc = this.getView().byId("input_hidden_material_desc").getValue();
            var supplier_code = this.getView().byId("input_hidden_supplier_code").getValue();
            var supplier_local_name = this.getView().byId("input_hidden_supplier_local_name").getValue();
            var supplier_english_name = this.getView().byId("input_hidden_supplier_english_name").getValue();

            //기준수량
            var base_quantity = this.getView().byId("input_base_quantity").getValue();
            //가공비
            var processing_cost = this.getView().byId("input_processing_cost").getValue();
            //가공비 통화 가공비통화단위
            var pcst_currency_unit = this.getView().byId("comboBox_pcst_currency_unit").getSelectedKey();
            
1. 수정사항 아래 함수 검색 부분 전체 수정 대상 



http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MaterialView/?$top=5&$filter=tenant_id eq 'L1100' and material_code eq '6910BLC0006'

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/?$format=json&$top=5

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$format=json&$top=5

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeList/?$format=json&$top=5

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/SupplierView/?$format=json&$top=5



MaterialDialog.fragment < --  Part (자재코드)  -> Masterial_Code 사용  ===============================

input getValue 반환 자재코드 

-사용테이블
MaterialView / SupplierView
materialView / supplierView

MaterialDetail.fragment.xml<-- 가격정보 확인==============================
materialTableList
code, name, category

팝업 닫기 버튼 필요 

KR00008	이지금
https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/OrgCodeView?$filter=org_code eq 'KR00008'
1. 질문 내역 초기 실행시 
초기 Create의 정보는 어떻게 선택할것인가.? (mi, mm )
onMainTableCreate

maint list view 화면 작성




    <Column hAlign="Center"  demandPopin="true" importance="High" popinDisplay="WithoutHeader">
    <customData>
    <core:CustomData key="p13nData"
    value='\{"columnKey": "material_code", "leadingProperty": "material_code", "sortProperty": "material_code", "filterProperty": "material_code", "columnIndex": 1}'/>
    </customData>
        <Text text="자재코드"></Text>
    </Column>
    <Column hAlign="Center" demandPopin="true" importance="High" >
        <customData>
    <core:CustomData key="p13nData"
    value='\{"columnKey": "material_desc", "leadingProperty": "material_desc", "sortProperty": "material_desc", "filterProperty": "material_desc", "columnIndex": 2}'/>
    </customData>
            <Text text="자재명"></Text>
    </Column>
_deleteCheck
_checkMIMaterialPriceManagement
_checkMIMaterialCodeBOMManagement

MIMaterialPriceManagement-------------------------------------
    key tenant_id           : String(5) not null  @title : '회사코드';
    key company_code        : String(10) not null @title : '법인코드';
    key org_type_code       : String(30) not null @title : '조직유형코드';
    key org_code            : String(10) not null @title : '조직코드';
    key mi_material_code    : String(40) not null @title : '시황자재코드';
    key category_code       : String(40) not null @title : '카테고리코드';
   
MIMaterialCodeBOMManagement-------------------------------------
문제점 : material_code, supplier_code 구할수 없음

entity MI_Material_Code_Bom_Mngt {
    key tenant_id             : String(5) not null  @title : '회사코드';
    key company_code          : String(10) not null @title : '법인코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key material_code         : String(40) not null @title : '자재코드';
    key supplier_code         : String(15) not null @title : '공급업체코드';
    key mi_material_code      : String(40) not null @title : '시황자재코드';
        category_code         : String(40)          @title : '카테고리코드';

}

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$top=5
MIMaterialCodeBOMManagement ==============================
<d:tenant_id>L2100</d:tenant_id>
<d:company_code>*</d:company_code>
<d:org_type_code>BU</d:org_type_code>
<d:org_code>BIZ00100</d:org_code>
<d:material_code>ERCA00007AA</d:material_code>
<d:supplier_code>KR01812701</d:supplier_code>
<d:base_quantity>1</d:base_quantity>
<d:processing_cost>75000</d:processing_cost>
<d:pcst_currency_unit>KRW</d:pcst_currency_unit>
<d:mi_material_code>A001-01-01</d:mi_material_code>
<d:reqm_quantity_unit>TON</d:reqm_quantity_unit>
<d:reqm_quantity>10</d:reqm_quantity>
<d:currency_unit>USD</d:currency_unit>
<d:mi_base_reqm_quantity>15</d:mi_base_reqm_quantity>
<d:quantity_unit>TON</d:quantity_unit>
<d:exchange>ICIS</d:exchange>
<d:termsdelv>CFR KOR</d:termsdelv>
<d:use_flag>true</d:use_flag>
<d:local_create_dtm>2020-11-30T15:29:00Z</d:local_create_dtm>
<d:local_update_dtm>2020-11-30T15:29:00Z</d:local_update_dtm>
<d:create_user_id>Admin</d:create_user_id>
<d:update_user_id>Admin</d:update_user_id>
<d:system_create_dtm>2020-11-30T15:29:00Z</d:system_create_dtm>
<d:system_update_dtm>2020-11-30T15:29:00Z</d:system_update_dtm>

http://127.0.0.1:8080/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagementView/?$top=5

---data
자재명 뷰 
MaterialView
sap.m.PopinDisplay.Block Inside the table popin, header is displayed at the first line and cell content is displayed at the next line.
sap.m.PopinDisplay.Inline Inside the table popin, cell content is displayed next to the header in the same line.
sap.m.PopinDisplay.WithoutHeader Inside the table popin, only the cell content will be visible.

OrgTenantView Tent정보 

테이블 리스트 
https://lgcommondev-workspaces-ws-k8gvf-app1.jp10.applicationstudio.cloud.sap/pg/mi/webapp/srv-api/odata/v2/pg.marketIntelligenceService/MIMaterialCodeBOMManagement/?$filter=material_desc eq 'Cathode Active Material LCH20D' 

material_code,material_desc,supplier_code,base_quantity,processing_cost,mi_material_code,mi_material_name,category_name,reqm_quantity_unit,reqm_quantity,currency_unit,mi_base_reqm_quantity,quantity_unit,exchange,termsdelv,use_flag
entity MI_Material_Code_Bom_Mngt {
    key tenant_id             : String(5) not null  @title : '회사코드';
    key company_code          : String(10) not null @title : '법인코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key material_code         : String(40) not null @title : '자재코드';
        material_desc  : String(300)         @title : '자재내역';
    key supplier_code         : String(15) not null @title : '공급업체코드';
        supplier_local_name   : String(240)         @title : '공급업체로컬명';
        supplier_english_name : String(240)         @title : '공급업체영문명';
        base_quantity         : Decimal not null    @title : '기준수량';
        processing_cost       : Decimal not null    @title : '가공비';
        pcst_currency_unit    : String(30) not null @title : '가공비통화단위';
    key mi_material_code      : String(40) not null @title : '시황자재코드';
        mi_material_name : String(240)         @title : '시황자재코드명';
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


var aSelectedItems = oTable.getSelectedItems();
var vendor = aSelectedItems[0].getCells()[0].getText(),
    vendor_name= aSelectedItems[0].getCells()[1].getText(),
    material_code= aSelectedItems[0].getCells()[2].getText(),
    material_desc= aSelectedItems[0].getCells()[3].getText(),
    supplier_code= aSelectedItems[0].getCells()[4].getText(),
    supplier_local_name= aSelectedItems[0].getCells()[5].getText();

//todo : 12122045    가격정보 Fragment 오픈후 Applay 할때 참조 
//_fnMarteialCreateItem(oModel, oData)     
var insertData = {
    "tenant_id": this._sso.dept.tenant_id,
    "company_code": this._sso.dept.company_code,
    "org_type_code":  this._sso.dept.org_type_code,
    "org_code": this._sso.dept.org_code,
    "material_code": material_code,
    "material_desc": material_desc,
    "supplier_code": supplier_code,
    "supplier_local_name": supplier_local_name,
    "supplier_english_name": supplier_local_name,
    "base_quantity": "0",
    "processing_cost": "0",
    "pcst_currency_unit": "0",
    "mi_material_code": oData.mi_material_code,
    "mi_material_name": oData.mi_material_name,
    "category_code": oData.category_code,
    "category_name": oData.category_name,
    "reqm_quantity_unit": oData.reqm_quantity_unit,
    "reqm_quantity": oData.reqm_quantity,
    "currency_unit": oData.currency_unit,
    "mi_base_reqm_quantity": oData.mi_base_reqm_quantity,
    "quantity_unit": oData.quantity_unit,
    "exchange": oData.exchange,
    "termsdelv": oData.termsdelv,
    "use_flag": oData.use_flag,
    "local_create_dtm": new Date(),
    "local_update_dtm": new Date(),
    "create_user_id": this._sso.user.id,
    "update_user_id": this._sso.user.id,
    "system_create_dtm": new Date(),
    "system_update_dtm": new Date(),
    "itemMode" : "C",
    "odataMode" : "N"                      
};            
