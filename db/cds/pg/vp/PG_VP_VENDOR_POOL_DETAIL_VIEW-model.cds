namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Detail_View {
    key tenant_id: String(5)  not null @title: '테넌트ID';
    key company_code: String(10)  not null @title: '회사코드';
    key org_type_code: String(2)  not null @title: '운영조직유형코드';
    key org_code: String(10)  not null @title: '운영조직코드';
    operation_unit_code: String(30)   @title: '운영단위코드';
    operation_unit_name: String(240)   @title: '운영단위명';
    key vendor_pool_code: String(20)  not null @title: '협력사풀코드';
    key language_cd: String(30) @title: '언어코드'; 
    vendor_pool_local_name: String(240)   @title: '협력사풀로칼명';
    vendor_pool_english_name: String(240)   @title: '협력사풀영문명';
    repr_department_code: String(50)   @title: '대표부서코드';
    department_local_name: String(240)   @title: '대표부서명';
    parent_vendor_pool_code: String(20)   @title: '상위협력사풀코드';
    higher_level_path_name: String @title: '상위레벨경로(같은레벨)';
    inp_type_code: String(30)   @title: '상벌유형코드';
    inp_type_name: String(240)   @title: '상벌유형명';
    mtlmob_base_code: String(30)   @title: '물동기준코드';
    mtlmob_base_name: String(240)   @title: '물동기준명';
    regular_evaluation_flag: Boolean   @title: '정기평가여부';
    industry_class_code: String(30)   @title: '산업분류코드'; 
    industry_class_name: String(240)   @title: '산업분류명';
    sd_exception_flag: Boolean   @title: '공급업체발굴예외여부';
    vendor_pool_apply_exception_flag: Boolean   @title: '협력사풀적용예외여부';
    domestic_net_price_diff_rate: Decimal   @title: '국내단가차이비율';
    dom_oversea_netprice_diff_rate: Decimal   @title: '국내국외단가차이비율';
    equipment_grade_code: String(30)   @title: '장비등급코드';
    equipment_grade_name: String(240)   @title: '장비등급명';
    equipment_type_code: String(30)   @title: '장비유형코드';
    equipment_type_name: String(240)   @title: '장비유형명';
    vendor_pool_use_flag: Boolean   @title: '협력사풀사용여부';
    vendor_pool_desc: String(3000)   @title: '협력사풀설명';
    vendor_pool_history_desc: String(3000)   @title: '협력사풀이력설명';
    info_change_status: String(20)  @title: '공급업체변경상태';
}