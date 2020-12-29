namespace pg;	
 
@cds.persistence.exists
entity Vp_Vendor_Pool_Manager_Type {	
  key tenant_id : String(5)   @title: '테넌트ID';
  key company_code : String(10)   @title: '회사코드';
  key org_type_code : String(2)   @title: '운영조직유형코드';
  key org_code : String(10)   @title: '운영조직코드';
  key vendor_pool_code : String(20)   @title: '협력사풀코드';
  key vendor_pool_person_empno : String(30)   @title: '협력사풀담당자사번';
    vendor_pool_person_role_text : String(50)   @title: '협력사풀담당자역할텍스트';
    vendor_pool_mapping_use_flag : Boolean   @title: '협력사풀매핑사용여부';
    register_reason : String(50)   @title: '등록사유';
    approval_number : String(50)   @title: '품의번호';
    crud_type_code : String(2)     @title: 'CRUD유형';
}