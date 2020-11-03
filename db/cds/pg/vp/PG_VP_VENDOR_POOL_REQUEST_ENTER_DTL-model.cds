namespace pg;
 
using { User } from '@sap/cds/common';
	
entity Vendor_Pool_Request_Enter_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key operation_org_type_code : String(2)  not null @title: '운영조직유형코드';	
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
  key approval_request_number : String(50)  not null @title: '승인요청번호';	
  key vendor_code : String(15)  not null @title: '협력사코드';	
    vendor_name : String(240)   @title: '협력사명';	
    offer_kind_name : String(240)   @title: '제안종류명';	
    offer_name : String(240)   @title: '제안명';	
    offer_date : String(8)   @title: '제안일자';	
    offer_confirmed_date : String(8)   @title: '제안확정일자';	
    vendor_pool_code : String(20)   @title: '협력사풀코드';	
    technology_evaluation_main_dtl : String(3000)   @title: '기술평가주요내역';	
    deal_hope_id : String(100)   @title: '거래희망ID';	
    local_create_dtm: DateTime not null @title: '로컬등록시간';
    local_update_dtm: DateTime not null @title: '로컬수정시간';
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}	
