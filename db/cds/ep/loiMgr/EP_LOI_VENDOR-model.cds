namespace ep;	

using util from '../../util/util-model'; 
using { ep as dtl } from './EP_LOI_DTL-model';

entity Loi_Vendor {	
    key tenant_id : String(5)  not null;	
    key company_code : String(10)  not null;	
    key loi_write_number : String(100)  not null;	
    key loi_item_number : String(100)  not null;

    item : Association[1] to dtl.Loi_Dtl
        on item.tenant_id = tenant_id 
        and item.company_code = company_code 
        and item.loi_write_number = loi_write_number         
        and item.loi_item_number = loi_item_number;  

    key vendor_code : String(15)  not null;	
    vendor_pool_code : String(30)  ;	
    remark : String(3000)  ;	
}	
extend  Loi_Vendor with util.Managed;	