namespace ep;	
	
using util from '../../cm/util/util-model';
	
entity Po_Forex_Declaration {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key po_number : String(50)  not null;	
    forex_declare_status_code : String(30)  ;	
    management_target_flag : Boolean  ;	
    declare_target_flag : Boolean  ;	
    declare_scheduled_date : Date  ;	
    declare_date : Date  ;	
    processed_complete_date : Date  ;	
    attch_group_number : String(100)  ;	
    remark : String(3000)  ;	
    org_type_code : String(2)  ;	
    org_code : String(10)  ;	
}	
extend Po_Forex_Declaration with util.Managed;