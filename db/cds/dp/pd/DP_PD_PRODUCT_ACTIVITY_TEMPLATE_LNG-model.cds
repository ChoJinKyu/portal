namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as productActivityTemplate} from '../pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE_LNG-model';	
	
entity Pd_Product_Activity_Template_Lng {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key product_activity_code : String(40)  not null @title: '제품Activity코드' ;	
  key language_cd : String(30)  not null @title: '언어코드' ;	
    code_name : String(240)   @title: '코드명' ;	
}	
extend Pd_Product_Activity_Template_Lng with util.Managed;	
