namespace sp;

@cds.persistence.exists

entity Sm_Supplier_Cal_View {
    key tenant_id             : String(5)  @title : '테넌트ID';
    key company_code          : String(10) @title : '회사코드';
    key org_code              : String(10) @title : '사업본부코드';
        org_name              : String(240)@title : '사업본부명';
        type_code             : String(30) @title : '공급업체유형코드';
        type_name             : String(240)@title : '공급업체유형명';
    key supplier_code         : String(10) @title : '공급업체코드';
        supplier_local_name   : String(240)@title : '공급업체로컬명';
        supplier_english_name : String(240)@title : '공급업체영문명';
        tax_id                : String(30) @title : '사업자등록번호';
        old_supplier_code     : String(15) @title : '구공급업체코드';
        supplier_status_code  : String(1)  @title : '공급업체상태코드';
        supplier_status_name  : String(240)@title : '공급업체상태명';
}
