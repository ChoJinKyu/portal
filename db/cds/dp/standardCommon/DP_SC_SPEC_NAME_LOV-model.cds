namespace dp;	
using util from '../../util/util-model'; 	
// using {dp as specNameLov} from '../standardCommon/DP_SC_SPEC_NAME_LOV-model';	
	
entity Sc_Spec_Name_Lov {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10) default '*' not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key spec_code : String(200)  not null;	
  key spec_value_code : String(200)  not null;	
    spec_value_name : String(2000)  ;	
    seq : Decimal default 0 ;	
    status_code : String(10)  ;	
}	
extend Sc_Spec_Name_Lov with util.Managed;	
