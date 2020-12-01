namespace dp;	
using util from '../../cm/util/util-model'; 	
// using {dp as activityMapping} from '../pd/DP_PD_ACTIVITY_MAPPING-model';	
	
entity Pd_Activity_Mapping {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key part_activity_code : String(50)  not null @title: '부품활동코드' ;	
  key product_activity_code : String(50)  not null @title: '제품활동코드' ;	
    activity_dependence : Boolean   @title: '활동의존(선후행)' ;	
    status_code : String(10)   @title: '상태 코드' ;	
}	
extend Pd_Activity_Mapping with util.Managed;