namespace ep;	

using util from '../../cm/util/util-model'; 
using { ep as dtl } from './EP_LOI_DTL-model';

entity Loi_Publish {	
    key tenant_id : String(5)  not null;	
    key company_code : String(10)  not null;	
    key loi_publish_number : String(50)  not null;	

    item : Association[*] to dtl.Loi_Dtl
        on item.tenant_id = tenant_id 
        and item.company_code = company_code        
        and item.loi_publish_number = loi_publish_number;  

    loi_publish_title : String(100)  ;	
    loi_publish_status_code : String(30)  ;	
    supplier_code : String(15)  ;	
    contract_format_id : String(100)  ;	
    offline_flag : Boolean  ;	
    contract_date : String(8)  ;	
    additional_condition_desc : String(1000)  ;	
    attch_group_number : String(100)  ;	
    approval_number : String(50)  ;	
    buyer_empno : String(30)  ;	
    purchasing_department_code : String(30)  ;	
    publish_date : Date  ;	
    remark : String(3000)  ;	
    org_type_code : String(2)  ;	
    org_code : String(10)  ;		
}	
extend Loi_Publish with util.Managed;		