namespace pg;
 
using util from '../../util/util-model';	
	
entity Vp_Vendor_Pool_Manager_Tmp {	
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key company_code : String(10)  not null @title: '회사코드';
  key org_type_code : String(2)  not null @title: '운영조직유형코드';
  key org_code : String(10)  not null @title: '운영조직코드';
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';
  key changer_empno : String(30)  not null @title: '변경자사번';
  key vendor_pool_person_empno : String(30)  not null @title: '협력사풀담당자사번';
    vendor_pool_person_role_text : String(50)   @title: '협력사풀담당자역할텍스트';
    department_code : String(50)   @title: '부서코드';
    bf_vendor_pool_person_empno : String(30)   @title: '이전협력사풀담당자사번';
    bf_vendor_pool_person_role_txt : String(50)   @title: '이전협력사풀담당자역할텍스트';
    before_department_code : String(50)   @title: '이전부서코드';
    approval_number : String(50)   @title: '품의번호';
}

extend Vp_Vendor_Pool_Manager_Tmp with util.Managed;