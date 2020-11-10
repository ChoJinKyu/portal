namespace dp;	
using util from '../../util/util-model'; 	
using {dp.Sc_Spec_Name as Spec_Name} from '../standardCommon/DP_SC_SPEC_NAME-model';	
	
entity Sc_Spec_Name {	
  key tenant_id : String(5)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key spec_code : String(200)  not null;	
    spec_name : String(2000)  ;	
    status_code : String(10)  ;	
    spec_value_list_code : String(10)  ;	
}	
extend Sc_Spec_Name with util.Managed;	
