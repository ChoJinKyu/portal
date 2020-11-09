namespace pg;
 
using util from '../../util/util-model';
	
entity Vp_Vendor_Pool_Request_Supplier_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key operation_org_type_code : String(2)  not null @title: '운영조직유형코드';	
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
  key approval_request_number : String(50)  not null @title: '승인요청번호';	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';	
  key before_after_type_val : String(100)  not null @title: '전후유형값';	
  key vendor_code : String(15)  not null @title: '협력사코드';	
    before_vendor_code : String(15)   @title: '전협력사코드';	
}	

extend Vp_Vendor_Pool_Request_Supplier_Dtl with util.Managed;