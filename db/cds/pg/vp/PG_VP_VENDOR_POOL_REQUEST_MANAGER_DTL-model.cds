namespace pg;

using { User } from '@sap/cds/common';
 	
entity Vendor_Pool_Request_Manager_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key operation_org_type_code : String(2)  not null @title: '운영조직유형코드';	
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
  key approval_request_number : String(50)  not null @title: '승인요청번호';	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';	
  key before_after_type_val : String(100)  not null @title: '전후유형값';	
  key manager_empno : String(30)  not null @title: '담당자사번';	
    role_text : String(500)   @title: '역할텍스트';	
    department_code : String(50)   @title: '부서코드';	
    before_manager_empno : String(30)   @title: '전담당자사번';	
    before_role_text : String(500)   @title: '전역할텍스트';	
    before_department_code : String(50)   @title: '전부서코드';	
    local_create_dtm: DateTime not null @title: '로컬등록시간';
    local_update_dtm: DateTime not null @title: '로컬수정시간';
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}	
