namespace dp;	
using util from '../../cm/util/util-model';  	
using {dp as DpProductActivityTemplateLng} from '../pd/DP_PD_PART_BASE_ACTIVITY_LNG-model';	
// using {dp as productActivityTemplate} from '../pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';	
	
entity Pd_Product_Activity_Template {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key product_activity_code : String(40)  not null @title: '제품Activity코드' ;	

          children          : Composition of many DpProductActivityTemplateLng.Pd_Product_Activity_Template_Lng
                                on  children.tenant_id  = tenant_id
                                and children.product_activity_code = product_activity_code;

    sequence : Decimal default 1  @title: '순번' ;	
    description : String(240)   @title: '설명' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Product_Activity_Template with util.Managed;	
