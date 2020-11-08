namespace pg;
 
using util from '../../util/util-model';

entity Vp_Vendor_Pool_Request_Re_Item_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key operation_org_type_code : String(2)  not null @title: '운영조직유형코드';	
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
  key approval_request_number : String(50)  not null @title: '승인요청번호';	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';	
  key item_code : String(40)  not null @title: '품목코드';	
    approval_request_kind_code : String(30)   @title: '승인요청종류코드';	
    spec_text : String(3000)   @title: '규격텍스트';	
    after_vendor_pool_code : String(20)   @title: '후협력사풀코드';	
}

extend Vp_Vendor_Pool_Request_Re_Item_Dtl with util.Managed;
