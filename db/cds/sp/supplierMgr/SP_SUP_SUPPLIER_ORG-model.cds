namespace sp;   
using util from '../../cm/util/util-model';

entity Sup_Supplier_Org {   
  key tenant_id : String(5)  not null;  
  key company_code : String(10)  not null;  
  key org_type_code : String(2)  not null;  
  key org_code : String(10)  not null;  
  key supplier_type_code : String(30)  not null;    
  key supplier_code : String(10)  not null; 
    supplier_status_code : String(1)  ;  
    supplier_register_status_code : String(30)  ;    
    biz_request_reason : String(1000)  ; 
}   

extend Sup_Supplier_Org with util.Managed;