namespace ep;	

using { ep as mst } from './EP_LOI_MST-model';
using { ep as vdsel } from './EP_LOI_VENDOR_SELECTION-model';
using { ep as pub } from './EP_LOI_PUBLISH-model';

entity Loi_Dtl {	
    key tenant_id : String(5)  not null;	
    key company_code : String(10)  not null;	
    key loi_write_number : String(100)  not null;	

    header : Association[1] to mst.Loi_Mst
        on header.tenant_id = tenant_id 
        and header.company_code = company_code 
        and header.loi_write_number = loi_write_number;  

    key loi_item_number : String(100)  not null;	
    item_line_number : Integer64  ;	
    item_code : String(40)  ;	
    item_name : String(240)  ;	
    request_qty : Decimal  ;	
    unt : String(30)  ;	
    request_amt : Decimal  ;	
    currency_code : String(30)  ;	
    spec_desc : String(1000)  ;	
    plant_code : String(30)  ;	
    delivery_request_date : String(8)  ;	
    loi_selection_number : String(100)  ;
    loi_publish_number : String(100)  ;

    selection : Association[1] to vdsel.Loi_Vendor_Selection
        on selection.tenant_id = tenant_id 
        and selection.company_code = company_code     
        and selection.loi_selection_number = loi_selection_number;  

    publish : Association[1] to pub.Loi_Publish
        on publish.tenant_id = tenant_id 
        and publish.company_code = company_code     
        and publish.loi_publish_number = loi_publish_number;  

    rfq_number : String(100)  ;	
    rfq_item_number : String(100)  ;	
    contract_number : String(100)  ;	
    contract_item_number : String(100)  ;	
    po_number : String(100)  ;	
    po_item_number : String(100)  ;	
    rmks : String(3000)  ;	
    local_create_dtm : DateTime  not null;	
    local_update_dtm : DateTime  not null;	
    create_user_id : String(50)  not null;	
    update_user_id : String(50)  not null;	
    system_create_dtm : DateTime  not null;	
    system_update_dtm : DateTime  not null;	
}	