namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as DpBaseActivity} from '../pd/DP_PD_PART_BASE_ACTIVITY-model';	
	
entity Pd_Part_Base_Activity {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key activity_code : String(40)  not null @title: '활동코드' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    description : String(240)   @title: '설명' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Part_Base_Activity with util.Managed;	