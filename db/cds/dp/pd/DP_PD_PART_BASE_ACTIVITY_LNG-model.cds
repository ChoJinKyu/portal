namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as DpBaseActivityLng} from '../pd/DP_PD_PART_BASE_ACTIVITY_LNG-model';	
	
entity Pd_Part_Base_Activity_Lng {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key activity_code : String(40)  not null @title: '활동코드' ;	
  key language_cd : String(30)  not null @title: '언어코드' ;	
    code_name : String(240)   @title: '코드명' ;	
}	
extend Pd_Part_Base_Activity_Lng with util.Managed;	
