namespace pg;	
 
using { User } from '@sap/cds/common';	
	
entity Vp_Vendor_Pool_Mst {	
    key tenant_id : String(5)  not null @title: '테넌트ID';	
    key company_code : String(10) not null @title: '회사코드';
    key operation_org_type_code : String(30) not null @title: '운영조직유형코드';
    key operation_org_code : String(30) not null @title: '운영조직코드';
    key vendor_pool_code : String(30) not null @title: '협력사풀코드';
    vendor_pool_local_name : String(240) @title: '협력사풀로칼명';
    vendor_pool_english_name : String(240) @title: '협력사풀영문명';
    repr_department_code : String(40) @title: '대표부서코드';
    evaluation_operation_unit_code : String(30) @title: '평가운영단위코드';
    inp_type_code : String(30) @title: 'I&P유형코드';
    mtlmob_basic_code : String(30) @title: '물동기준코드';
    regular_evaluation_flag : Boolean @title: '정기평가여부';
    industry_class_code : String(30) @title: '산업분류코드';
    sd_exception_flag : Boolean @title: '공급업체발굴예외여부';
    vendor_pool_exception_flag : Boolean @title: '협력사풀예외여부';
    site_internal_rate : Decimal @title: '사이트내부비율';
    site_external_rate : Decimal @title: '사이트외부비율';
    equipment_grade_code : String(30) @title: '장비등급코드';
    equipment_type_code : String(30) @title: '장비유형코드';
    vendor_pool_use_flag : Boolean @title: '협력사풀사용여부';
    vendor_pool_desc : String(1000) @title: '협력사풀설명';
    vendor_pool_history_desc : String(1000) @title: '협력사풀이력설명';
    parent_vendor_pool_code : String(30) @title: '상위협력사풀코드';
    leaf_flag : Boolean @title: '리프여부';
    level_number : Decimal @title: '레벨번호'; 
    display_sequence : Decimal @title: '표시순번';
    register_reason_text : String(300) @title: '등록사유텍스트';
    approval_request_number : String(50) @title: '승인요청번호';
    local_create_dtm: DateTime not null @title: '로컬등록시간';
    local_update_dtm: DateTime not null @title: '로컬수정시간';
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}