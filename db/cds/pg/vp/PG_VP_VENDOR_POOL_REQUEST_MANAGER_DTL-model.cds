namespace pg;

using util from '../../util/util-model';
 	
entity Vp_Vendor_Pool_Request_Manager_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key operation_org_type_code : String(2)  not null @title: '운영조직유형코드';	
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
  key approval_request_number : String(50)  not null @title: '승인요청번호';	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';	
  key before_after_type_val : String(100)  not null @title: '전후유형값';	
  key person_empno : String(30)  not null @title: '담당자사번';	
    role_text : String(500)   @title: '역할텍스트';	
    department_code : String(50)   @title: '부서코드';	
    before_person_empno : String(30)   @title: '전담당자사번';	
    before_role_text : String(500)   @title: '전역할텍스트';	
    before_department_code : String(50)   @title: '전부서코드';
}	

extend Vp_Vendor_Pool_Request_Manager_Dtl with util.Managed;