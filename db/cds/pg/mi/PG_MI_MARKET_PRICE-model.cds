namespace pg;	
using {User} from '@sap/cds/common';	
using {pg as mst} from './PG_MI_ITEM_MASTER-model';	
	
entity Mi_Market_Price {	
  key tenant_id : String(5)  not null  @title: '테넌트ID';	
  key mi_item_code : String(40)  not null  @title: '시황품목번호';	
  key currency : String(10)  not null  @title: '통화단위';	
  key unit : String(10)  not null  @title: '수량단위';	
  key info_site : String(10)  not null  @title: '정보지';	
  key terms : String(10)  not null  @title: '인도조건(FK)';	
  key mi_date : Date  not null  @title: '시황일자';	
    mi_amt : Decimal(10,10)  not null  @title: '시황금액';	
  ref: Association to mst.Mi_Item_Master on ref.tenant_id = tenant_id and 	
                                            ref.mi_item_code = mi_item_code;			
    local_create_date : DateTime  ;	
    local_update_date : DateTime  ;	
    create_user_id : User not null @cds.on.insert: $user  ;	
    update_user_id : User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID'  ;	
    system_create_date : DateTime not null @cds.on.insert: $now @title: '시스템등록시간'  ;	
    system_update_date : DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간'  ;
}	
