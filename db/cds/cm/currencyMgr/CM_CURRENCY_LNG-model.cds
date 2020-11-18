namespace cm;	

using util from '../../util/util-model';

entity Currency_Lng {	
  key tenant_id : String(5)  not null;	
  key currency_code : String(30)  not null;	
  key language_code : String(30)  ;	
    currency_code_name : String(240)  ;	
    currency_code_desc : String(300)  not null;	
    currency_prefix : String(30)  ;	
    currency_suffix : String(30)  ;	
}	

extend Currency_Lng with util.Managed;