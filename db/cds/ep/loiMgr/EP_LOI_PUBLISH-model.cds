namespace ep;	

using util from '../../util/util-model'; 
using { ep as dtl } from './EP_LOI_DTL-model';

entity Loi_Publish {	
    key tenant_id : String(5)  not null;	
    key company_code : String(10)  not null;	
    key loi_publish_number : String(100)  not null;	

    item : Association[*] to dtl.Loi_Dtl
        on item.tenant_id = tenant_id 
        and item.company_code = company_code        
        and item.loi_publish_number = loi_publish_number;  

    loi_publish_title : String(100)  ;	
    progress_status_code : String(30)  ;	
    vendor_code : String(15)  ;	
    format_id : String(100)  ;	
    offline_flag : Boolean  ;	
    contract_date : Date  ;	
    additional_condition_desc : String(1000)  ;	
    attachment_group_number : String(100)  ;	
    approve_number : String(50)  ;	
    purchasing_person_id : String(50)  ;	
    purchasing_department_code : String(30)  ;	
    publish_date : Date  ;	
    remark : String(3000)  ;	
    org_type_code : String(30)  ;	
    org_code : String(30)  ;	
}	
extend  Loi_Publish with util.Managed;		