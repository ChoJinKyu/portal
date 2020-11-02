namespace ep;	

using { ep as dtl } from './EP_LOI_DTL-model';

entity Loi_Vendor_Selection {	
    key tenant_id : String(5)  not null;	
    key company_code : String(10)  not null;	
    key loi_selection_number : String(100)  not null;	

    item : Association[*] to dtl.Loi_Dtl
        on item.tenant_id = tenant_id 
        and item.company_code = company_code        
        and item.loi_selection_number = loi_selection_number;  

    loi_selection_ttl : String(100)  ;	
    progress_status_code : String(30)  ;	
    attach_group_number : String(100)  ;	
    approve_number : String(100)  ;	
    purchase_manager_id : String(50)  ;	
    purchase_department_code : String(30)  ;	
    vendor_selection_date : String(8)  ;	
    rmks : String(3000)  ;	
    operation_org_type_code : String(30)  ;	
    operation_org_code : String(30)  ;	
    local_create_dtm : DateTime  not null;	
    local_update_dtm : DateTime  not null;	
    create_user_id : String(50)  not null;	
    update_user_id : String(50)  not null;	
    system_create_dtm : DateTime  not null;	
    system_update_dtm : DateTime  not null;	
}	