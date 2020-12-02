namespace sp;	
using util from '../../cm/util/util-model';

entity Sup_Supplier_Org {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key org_type_code : String(2)  not null;	
  key org_code : String(10)  not null;	
  key supplier_type_code : String(10)  not null;	
  key supplier_code : String(10)  not null;	
    status_code : String(1)  ;	
    progress_status_code : String(40)  ;	
    biz_request_reason : String(500)  ;	
    main_product_desc : String(500)  ;	
}	

extend Sup_Supplier_Org with util.Managed;