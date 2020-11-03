using {User} from '@sap/cds/common';	
	
entity Mi_Item_Category_Lng {	
  key tenant_id : String(5)  not null  @title: '테넌트ID';	
  key category_code : String(40)  not null  @title: 'Category Code';	
  key language_code : String(30)  not null  @title: '언어코드';	
    category_name : String(240)  not null  @title: 'Category 명';	
    local_create_date : DateTime  ;	
    local_update_date : DateTime  ;	
    create_user_id : User not null @cds.on.insert: $user  ;	
    update_user_id : User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID'  ;	
    system_create_date : DateTime not null @cds.on.insert: $now @title: '시스템등록시간'  ;	
    system_update_date : DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간'  ;
}	
