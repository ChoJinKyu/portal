namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as DpcodeMst} from '../pd/DP_PD_ACTIVITY_CODE-model';	
	
entity Pd_Activity_Code {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key activity_code : String(40)  not null @title: 'Activity코드' ;	
  key activity_type_code : String(30)  not null @title: '그룹코드' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    description : String(240)   @title: '설명' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Activity_Code with util.Managed;	
