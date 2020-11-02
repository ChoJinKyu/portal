namespace pg;	
using {User} from '@sap/cds/common';	
using {pg as mst} from './PG_MI_ITEM_CATEGORY-model';	
	
entity Mi_Item_Master {	
  key tenant_id : String(5)  not null  @title: '테넌트ID';	
  key mi_item_code : String(40)  not null  @title: '시황품목번호';	
    category_code : String(40)  not null  @title: 'Category Code';	
    use_flag : Boolean default 'TRUE' not null  @title: '사용여부';	
  ref: Association to mst.Mi_Item_Category on ref.tenant_id = tenant_id and	
                                              ref.category_code = category_code;
    local_create_date : DateTime  ;	
    local_update_date : DateTime  ;	
    create_user_id : User not null @cds.on.insert: $user  ;	
    update_user_id : User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID'  ;	
    system_create_date : DateTime not null @cds.on.insert: $now @title: '시스템등록시간'  ;	
    system_update_date : DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간'  ;
}	
