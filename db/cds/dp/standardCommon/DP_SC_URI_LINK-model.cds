namespace dp;	
using util from '../../util/util-model'; 	
using {dp.Sc_Uri_Link as Uri_Link} from '../standardCommon/DP_SC_URI_LINK-model';	
	
entity Sc_Uri_Link {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key org_type_code : String(30)  not null;	
  key org_code : String(10)  not null;	
  key uri_code : String(10)  not null;	
    uri_name : String(2000)  ;	
    uri_type : String(10)  ;	
    if_system : String(2000)  ;	
    desc : String(2000)  ;	
    call_key1 : String(2000)  ;	
    call_key2 : String(2000)  ;	
    call_key3 : String(2000)  ;	
    call_key4 : String(2000)  ;	
    call_key5 : String(2000)  ;	
    use_yn : Boolean  ;	
}	
