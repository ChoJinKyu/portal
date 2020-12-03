namespace pg;	
 
@cds.persistence.exists
entity Vp_Supplier_Mst_View {
    key bizunit_code: String(10) @title: 'BU Code';
    key language_cd: String(30) @title: '언어코드'; 
    key tenant_id: String(5) @title: '테넌트아이디';
    key company_code: String(10) @title: '회사코드';
    company_name: String(240) @title: '회사명';
    key org_type_code: String(30) @title: '조직유형코드'; 
    key org_code: String(10) @title: '조직코드';
    key supplier_code: String(10) @title: '공급업체코드';
    supplier_local_name: String(240) @title: '공급업체로컬명';
    supplier_english_name: String(240) @title: '공급업체영문명';
    supplier_type_code: String(30) @title: '공급업체유형코드(VP운영단위코드)';
    supplier_type_name: String(240) @title: '공급업체유형명';
    supplier_status_code: String(30) @title: '공급업체상태코드';
    supplier_status_name: String(240) @title: '공급업체상태명';
    supplier_register_status_code: String(30) @title: '공급업체등록상태코드';
    supplier_register_status_name: String(240) @title: '공급업체등록상태명';
    supplier_flag: Boolean @title: '공급업체여부';
    maker_flag: Boolean @title: '메이커여부';
    supplier_old_supplier_code: String(10) @title: '공급업체OLD코드';
    maker_old_supplier_code: String(10) @title: '메이커OLD코드';
}