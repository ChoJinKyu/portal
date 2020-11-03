namespace pg;
 
using { User } from '@sap/cds/common';

entity Vendor_Pool_Request_Re_Supplier_Dtl {	
  key tenant_id : String(5)  not null @title: '테넌트ID';	
  key company_code : String(10)  not null @title: '회사코드';	
  key operation_org_type_code : String(2)  not null @title: '운영조직유형코드';	
  key operation_org_code : String(10)  not null @title: '운영조직코드';	
  key approval_request_number : String(50)  not null @title: '승인요청번호';	
  key vendor_pool_code : String(20)  not null @title: '협력사풀코드';	
  key vendor_code : String(15)  not null @title: '협력사코드';	
    approval_request_kind_code : String(30)   @title: '승인요청종류코드';	
    vendor_name : String(240)   @title: '협력사명';	
    vendor_english_name : String(240)   @title: '협력사영문명';	
    after_vendor_pool_code : String(20)   @title: '후협력사풀코드';	
    evaluation_control_flag : Boolean   @title: '평가제어여부';	
    evaluation_control_start_date : String(8)   @title: '평가제어시작일자';	
    evaluation_control_end_date : String(8)   @title: '평가제어종료일자';	
    rm_control_flag : Boolean   @title: '위험관리제어여부';	
    local_create_dtm: DateTime not null @title: '로컬등록시간';
    local_update_dtm: DateTime not null @title: '로컬수정시간';
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}	
