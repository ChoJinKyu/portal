namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as productActivityTemplate} from '../pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';	
	
entity Pd_Product_Activity_Template {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key product_activity_code : String(30)  not null @title: '제품활동코드' ;	
    develope_event_code : String(30)   @title: '이벤트' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    product_activity_name : String(240)   @title: '제품활동명' ;	
    product_activity_english_name : String(240)   @title: '제품활동영문명' ;	
    milestone_flag : Boolean   @title: '마일스톤여부' ;	
    active_flag : Boolean   @title: '활성여부' ;	
}	
extend Pd_Product_Activity_Template with util.Managed;