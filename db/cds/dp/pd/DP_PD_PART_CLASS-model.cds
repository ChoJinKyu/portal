namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as partClass} from '../pd/DP_PD_PART_CLASS-model';	
	
entity Pd_Part_Class {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key part_class_code : String(40)  not null @title: '분류코드' ;	
    parent_part_class_code : String(40)   @title: '상위분류코드' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    part_class_name : String(240)   @title: '분류명' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Part_Class with util.Managed;	
