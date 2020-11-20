namespace dp;	
using util from '../../util/util-model';  	
// using {dp as materialMst} from '../standardCommon/DP_SC_MATERIAL_ORG-model';	
	
entity Sc_Material_Org {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key material_code : String(40)  not null;	
    category_code : String(200)  ;	
    class_code : String(200)  ;	
    class_name : String(2000)  ;	
    spec_summary : String  ;	
    repr_maker_info : String(2000)  ;	
    uom : String(10)  ;	
    uit : String(10)  ;	
    commodity_code : String(200)  ;	
    part_status_code : String(10)  ;	
    spec_value_list_code : String(10)  ;	
}	
extend Sc_Material_Org with util.Managed;