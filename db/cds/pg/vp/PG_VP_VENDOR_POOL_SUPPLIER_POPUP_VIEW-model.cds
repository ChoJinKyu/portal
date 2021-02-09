namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Supplier_Popup_View(p_language_code: String, p_tenant_id: String, p_company_code: String) {
    key language_cd: String(2) @title: '언어코드';
    key temp_type: String(20) @title: '변경여부';
    key tenant_id: String(5)  @title: '테넌트ID'; 
    key company_code: String(10) @title: '회사코드';
    key org_type_code: String(2) @title: '운영조직유형코드'; 
    key org_code: String(10) @title: '운영조직코드'; 
    key vendor_pool_code: String(20) @title: '협력사풀코드';
    key supplier_code: String(15) @title: '공급업체코드';
    org_type_name      : String(240) @title: '운영조직유형명'; 
    supplier_local_name: String(240) @title: '공급업체로컬명'; 
    supplier_english_name: String(240) @title: '공급업체영문명'; 
    supplier_company_code: String(10) @title: '공급업체 회사코드';
    supplier_company_name: String(240) @title: '공급업체회사명';  
    inactive_status_code: String(30) @title: '공급업체상태코드';    
    supeval_control_flag: Boolean   @title: '공급업체평가통제여부'; 
    supeval_control_start_date: Date   @title: '공급업체평가통제시작일자'; 
    supeval_control_end_date: Date   @title: '공급업체평가통제종료일자'; 
    supplier_rm_control_flag: Boolean   @title: '공급업체위험관리제어여부'; 
    supplier_base_portion_rate: Decimal   @title: '공급업체기준분배비율'; 
    vendor_pool_level1_code: String(20) @title: '협력사풀레벨1코드';
    vendor_pool_level2_code: String(20) @title: '협력사풀레벨2코드';
    vendor_pool_level3_code: String(20) @title: '협력사풀레벨3코드';
    vendor_pool_level4_code: String(20) @title: '협력사풀레벨4코드';
    vendor_pool_level5_code: String(20) @title: '협력사풀레벨5코드';
    vendor_pool_level1_name: String(240) @title: '협력사풀레벨1명';
    vendor_pool_level2_name: String(240) @title: '협력사풀레벨2명';
    vendor_pool_level3_name: String(240) @title: '협력사풀레벨3명';
    vendor_pool_level4_name: String(240) @title: '협력사풀레벨4명';
    vendor_pool_level5_name: String(240) @title: '협력사풀레벨5명';
    supplier_flag: String(5) @title: '공급업체여부';
    maker_flag: String(5) @title: '메이커여부';
    supplier_old_supplier_code: String(15) @title: '공급업체OLD코드';
    maker_old_supplier_code: String(15) @title: '메이커OLD코드';
    vendor_pool_mapping_use_flag: Boolean   @title: '협력사풀매핑사용여부';
    register_reason: String(50)   @title: '등록사유'; 
    approval_number: String(50)   @title: '품의번호';
    local_update_dtm: DateTime @title: '로컬수정시간';
    update_user_id: String(255) @title: '변경자';
}