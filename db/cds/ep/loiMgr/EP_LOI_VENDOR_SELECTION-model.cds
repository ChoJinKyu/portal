namespace ep;	

using util from '../../util/util-model'; 
using { ep as dtl } from './EP_LOI_DTL-model';

entity Loi_Vendor_Selection {	
    key tenant_id : String(5)  not null;	
    key company_code : String(10)  not null;	
    key loi_selection_number : String(100)  not null;	

    item : Association[*] to dtl.Loi_Dtl
        on item.tenant_id = tenant_id 
        and item.company_code = company_code        
        and item.loi_selection_number = loi_selection_number;  

    loi_selection_title : String(100)  ;	
    progress_status_code : String(30)  ;	
    attachment_group_number : String(100)  ;	
    approve_number : String(50)  ;	
    purchasing_person_id : String(50)  ;	
    purchasing_department_code : String(30)  ;	
    vendor_selection_date : Date  ;	
    remark : String(3000)  ;	
    org_type_code : String(30)  ;	
    org_code : String(30)  ;	
}	
extend  Loi_Vendor_Selection with util.Managed;	