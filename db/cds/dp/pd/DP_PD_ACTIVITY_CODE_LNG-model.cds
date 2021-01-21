namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as DpcodeMst} from '../pd/DP_PD_ACTIVITY_CODE_LNG-model';	
	
entity Pd_Activity_Code_Lng {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key activity_code : String(40)  not null @title: 'Activity코드' ;	
  key activity_type_code : String(30)  not null @title: '그룹코드' ;	
  key language_cd : String(30)  not null @title: '언어코드' ;	
    code_name : String(240)   @title: '코드명' ;	
}	
extend Pd_Activity_Code_Lng with util.Managed;	
