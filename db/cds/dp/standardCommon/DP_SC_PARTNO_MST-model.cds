namespace dp;	
using util from '../../util/util-model';  	
using {dp.Sc_Partno_Mst as Partno_Mst} from '../standardCommon/DP_SC_PARTNO_MST-model';	
	
entity Sc_Partno_Mst {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key part_no : String(200)  not null;	
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
extend Sc_Partno_Mst with util.Managed;	
