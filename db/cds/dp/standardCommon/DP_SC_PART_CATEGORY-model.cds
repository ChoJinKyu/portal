namespace dp;	
using util from '../../util/util-model'; 	
// using {dp as partCategory} from '../standardCommon/DP_SC_PART_CATEGORY-model';
using {dp as categoryClass} from '../standardCommon/DP_SC_PART_CATEGORY_CLASS-model';
using {dp as categoryAuth} from '../standardCommon/DP_SC_PART_CATEGORY_AUTH-model';
	
entity Sc_Part_Category {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null default '*';	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key category_code : String(200)  not null;

    cClass: Composition of many categoryClass.Sc_Part_Category_Class
        on cClass.tenant_id = tenant_id 
        and cClass.org_type_code = org_type_code
        and cClass.org_code = org_code
        and cClass.category_code = category_code;

    cAuth: Composition of many categoryAuth.Sc_Part_Category_Auth
        on cAuth.tenant_id = tenant_id 
        and cAuth.org_type_code = org_type_code
        and cAuth.org_code = org_code
        and cAuth.category_code = category_code;

    parent_category_code : String(200)  ;	
    seq : Decimal default 0 ;	
    category_name : String(2000)  ;	
    desc : String(2000)  ;	
    status_code : String(10)  ;	
}	
extend Sc_Part_Category with util.Managed;	
