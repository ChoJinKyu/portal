namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Tree_Lng_View (p_language_code: String){
    key language_cd : String(2) @title: '언어코드';
    key tenant_id : String(5)  not null @title: '테넌트ID';
    key company_code : String(10)  not null @title: '회사코드';
    key org_type_code : String(2)  not null @title: '운영조직유형코드';
    key org_code : String(10)  not null @title: '운영조직코드';
    key operation_unit_code : String(30) @title: '운영단위코드';
    key vendor_pool_code : String(20) @title: '협력사풀코드';
    vendor_pool_local_name : String(240) @title: '협력사풀로컬명';
    vendor_pool_english_name : String(240) @title: '협력사풀영문명';
    parent_vendor_pool_code : String(20) @title: '상위협력사풀코드';
    higher_level_path : String @title: '상위레벨경로';
    level_path : String @title: '현재레벨경로';
    repr_department_code : String(50)   @title: '대표부서코드';
    department_local_name : String(240)   @title: '대표부서명';
    inp_type_code : String(30)   @title: '상벌유형코드';
    inp_type_name : String(240)   @title: '상벌유형명';
    mtlmob_base_code : String(30)   @title: '물동기준코드';
    mtlmob_base_name : String(240)   @title: '물동기준명';
    regular_evaluation_flag : Boolean   @title: '정기평가여부';
    industry_class_code : String(30)   @title: '산업분류코드'; 
    industry_class_name : String(240)   @title: '산업분류명';
    sd_exception_flag : Boolean   @title: '공급업체발굴예외여부';
    temp_type : String(1) @title: '공급업체변경여부(Y/N)';
    node_id : String @title: 'node id';
    parent_id : String @title: 'parent node id';
    path : String @title: 'path';
    hierarchy_rank : Integer64;
    hierarchy_tree_size : Integer64;
    hierarchy_parent_rank : Integer64;
    hierarchy_level : Integer;
    hierarchy_root_rank : Integer64;
    drill_state : String @title: 'expanded/leaf';
    child_drill_state : String @title: 'expanded/leaf';
    vendor_pool_path_code: String(240) @title: 'VP Code Chain';
    vendor_pool_path_name: String(400) @title: 'VP Code Name Chain';
}