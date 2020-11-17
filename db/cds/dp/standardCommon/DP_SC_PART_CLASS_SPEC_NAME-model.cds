namespace dp;	
using util from '../../util/util-model'; 	
using {dp.Sc_Part_Class_Spec_Name as Class_Spec_Name} from '../standardCommon/DP_SC_PART_CLASS_SPEC_NAME-model';	
	
entity Sc_Part_Class_Spec_Name {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  default '*' not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key class_code : String(200)  not null;	
  key spec_code : String(200)  not null;	
    seq : Decimal default 0 ;	
    status_code : String(10)  ;	
}	
extend Sc_Part_Class_Spec_Name with util.Managed;	
