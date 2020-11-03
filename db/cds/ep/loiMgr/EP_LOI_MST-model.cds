namespace ep;	

using { ep as dtl } from './EP_LOI_DTL-model';

entity Loi_Mst {	
    key tenant_id : String(5)  not null;	
    key company_code : String(10)  not null;	
    key loi_write_number : String(100)  not null;

    item : Association[*] to dtl.Loi_Dtl
        on item.tenant_id = tenant_id 
        and item.company_code = company_code 
        and item.loi_write_number = loi_write_number;  

    loi_number : String(100)  ;	
    loi_request_ttl : String(100)  ;	
    progress_status_code : String(30)  ;	
    purpose_desc : String(1000)  ;	
    investment_review_number : String(100)  ;	
    investment_review_date : String(8)  ;	
    attach_group_number : String(100)  ;	
    approve_number : String(100)  ;	
    requester_id : String(50)  ;	
    request_department_code : String(30)  ;	
    request_date : String(8)  ;	
    operation_org_type_code : String(30)  ;	
    operation_org_code : String(30)  ;	
    local_create_dtm : DateTime  not null;	
    local_update_dtm : DateTime  not null;	
    create_user_id : String(50)  not null;	
    update_user_id : String(50)  not null;	
    system_create_dtm : DateTime  not null;	
    system_update_dtm : DateTime  not null;	
}	