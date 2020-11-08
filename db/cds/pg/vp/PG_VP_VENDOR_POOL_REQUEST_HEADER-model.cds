namespace pg;	
 
using util from '../../util/util-model';

entity Vp_Vendor_Pool_Request_Header {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key operation_org_type_code : String(2)  not null @title: '운영조직유형코드';	
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
  key approval_request_number : String(50)  not null @title: '승인요청번호';	
    approval_request_kind_code : String(30)   @title: '승인요청종류코드';	
    approval_request_reason_text : String(3000)   @title: '승인요청사유텍스트';	
    approval_request_desc : LargeBinary   @title: '승인요청설명';	
}

extend Vp_Vendor_Pool_Request_Header with util.Managed;