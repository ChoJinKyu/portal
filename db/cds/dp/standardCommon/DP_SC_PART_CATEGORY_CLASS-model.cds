namespace dp;	
using util from '../../util/util-model'; 	
using {dp as partCategory} from '../standardCommon/DP_SC_PART_CATEGORY-model';
	
entity Sc_Part_Category_Class {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  default '*' not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key category_code : String(200)  not null;	
  
    parent: Composition of partCategory.Sc_Part_Category
        on parent.tenant_id = tenant_id 
        and parent.org_type_code = org_type_code
        and parent.org_code = org_code
        and parent.category_code = category_code;

  key class_code : String(200)  not null;	
    status_code : String(10)  ;	
}	
extend Sc_Part_Category_Class with util.Managed;	
