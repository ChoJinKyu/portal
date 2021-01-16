namespace dp;	
using util from '../../cm/util/util-model';  	
// using {1 as (5)} from '테넌트ID/DP_PD_PART_ACTIVITY-model';	
	
entity Pd_Part_Activity {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key activity_code : String(40)  not null @title: 'Activity코드' ;	
    parent_activity_code : String(40)   @title: '상위Activity코드' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Part_Activity with util.Managed;	
