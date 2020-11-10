namespace dp;	
using util from '../../util/util-model'; 	
using {dp.Sc_Part_Class_Spec_Name as Class_Spec_Name} from '../standardCommon/DP_SC_PART_CLASS_SPEC_NAME-model';	
	
entity Sc_Part_Class_Spec_Name {	
  key tenant_id : String(5)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key class_code : String(200)  not null;	
  key spec_code : String(200)  not null;	
    seq : Decimal default 0 ;	
    status_code : String(10)  ;	
    local_create_date : DateTime  ;	
    local_update_date : DateTime  ;	
    create_user_id : User not null @cds.on.insert: $user  ;	
    update_user_id : User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID'  ;	
    system_create_date : DateTime not null @cds.on.insert: $now @title: '시스템등록시간'  ;	
    system_update_date : DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간'  ;	
}	
extend Control_Option_Dtl with util.Managed;	
