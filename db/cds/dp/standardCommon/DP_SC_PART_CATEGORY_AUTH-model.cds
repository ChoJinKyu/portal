namespace dp;	
using util from '../../util/util-model'; 	
using {dp.Sc_Part_Category_Auth as Category_Auth} from '../standardCommon/DP_SC_PART_CATEGORY_AUTH-model';	
	
entity Sc_Part_Category_Auth {	
  key tenant_id : String(5)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key category_code : String(200)  not null;	
  key auth_code : String(200)  not null;	
    status_code : String(10)  ;	
}	
extend Sc_Part_Category_Auth with util.Managed;	
