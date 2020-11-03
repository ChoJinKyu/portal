namespace pg;	
 
using { User } from '@sap/cds/common';
using {pg as mst} from './PG_VP_VENDOR_POOL_MST-model';

entity Vendor_Pool_Item_Dtl {	
    key tenant_id : String(5) not null @title: '테넌트ID';
    key company_code : String(10) not null @title: '회사코드';
    key operation_org_type_code : String(30) not null @title: '운영조직유형코드';
    key operation_org_code : String(30) not null @title: '운영조직코드';
    key vendor_pool_code : String(30) not null @title: '협력사풀코드';
    
    ref : Association to mst.Vendor_Pool_Mst on ref.tenant_id = tenant_id and 
                                                ref.company_code = company_code and 
                                                ref.operation_org_type_code = operation_org_type_code and
                                                ref.operation_org_code = operation_org_code and
                                                ref.vendor_pool_code = vendor_pool_code;
                                                 	
    
    key item_code : String(40) not null @title: '품목코드';
    use_flag : Boolean @title: '사용여부';
    register_reason_text : String(300) @title: '등록사유텍스트';
    register_approval_request_number : String(50) @title: '등록승인요청번호';
    local_create_dtm: DateTime not null @title: '로컬등록시간';
    local_update_dtm: DateTime not null @title: '로컬수정시간';
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}