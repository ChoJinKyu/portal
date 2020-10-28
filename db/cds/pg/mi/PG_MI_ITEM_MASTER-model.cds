namespace pg;	
using {User} from '@sap/cds/common';	
using {pg as mst} from './PG_MI_ITEM_CATEGORY-model';	
	
entity Mi_Item_Master {	
  key tenant_id : String(5)  not null;	
  key mi_item_code : String(40)  not null;	
    mi_item_name : String(240)  not null;	
    use_flag : Boolean default 'TRUE' not null;	
    local_create_date : UTCDateTime  not null;	
    local_update_date : UTCDateTime  not null;	
    create_user_id : String(50)  not null;	
    update_user_id : String(50)  not null;	
    system_create_date : UTCDateTime  not null;	
    system_update_date : UTCDateTime  not null;	
  ref: Association to mst.Mi_Item_Category on ref.tenant_id = tenant_id and	
                                              ref.mi_category_code = category_code;	
}	