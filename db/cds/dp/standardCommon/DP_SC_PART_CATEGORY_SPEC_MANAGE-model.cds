namespace dp;	
using util from '../../util/util-model'; 	
// using {dp as categorySpecManage} from '../standardCommon/DP_SC_PART_CATEGORY_SPEC_MANAGE-model';	
	
entity Sc_Part_Category_Spec_Manage {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10) default '*' not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key category_code : String(200)  not null;	
  key spec_code : String(200)  not null;	
    seq : Decimal default 0 ;	
    detail_flag : Boolean  ;	
    search_condition_flag : Boolean  ;	
    class_code : String(200)  ;	
    status_code : String(10)  ;	
}	
extend Sc_Part_Category_Spec_Manage with util.Managed;