namespace cm;	

using util from '../../util/util-model';

entity Currency {	
  key tenant_id : String(5)  not null;	
  key currency_code : String(30)  not null;	
    effective_start_date : DateTime  ;	
    effective_end_date : DateTime  ;	
    use_flag : Boolean  not null;	
    scale : Decimal  ;	
    extension_scale : Decimal  ;	
}	

extend Currency with util.Managed;