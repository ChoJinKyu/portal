namespace dp;	
using util from '../../util/util-model'; 	
using {dp.Sc_Part_Class as Part_Class} from '../standardCommon/DP_SC_PART_CLASS-model';	
	
entity Sc_Part_Class {	
  key tenant_id : String(5)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key class_code : String(200)  not null;	
    parent_class_code : String(200)  ;	
    seq : Decimal default 0 ;	
    class_name : String(2000)  ;	
    desc : String(2000)  ;	
    status_code : String(10)  ;	
}	
extend Sc_Part_Class with util.Managed;	
