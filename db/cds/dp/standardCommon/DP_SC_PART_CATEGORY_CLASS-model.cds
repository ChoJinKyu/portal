namespace dp;	
using util from '../../util/util-model'; 	
using {dp.Sc_Part_Category_Class as Category_Class} from '../standardCommon/DP_SC_PART_CATEGORY_CLASS-model';	
	
entity Sc_Part_Category_Class {	
  key tenant_id : String(5)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key category_code : String(200)  not null;	
  key class_code : String(200)  not null;	
    status_code : String(10)  ;	
}	
extend Sc_Part_Category_Class with util.Managed;	
