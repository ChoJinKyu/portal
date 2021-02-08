namespace ep;	
using util from '../../cm/util/util-model';	
	
entity Po_Approval_Payment {	
  key tenant_id : String(5)  not null;	
  key company_code : String(10)  not null;	
  key purchasing_approval_number : String(50)  not null;	
  key pay_sequence : Decimal  not null;	
    pay_type_code : String(30)  ;	
    pay_rate : Decimal  ;	
    pay_amount : Decimal  ;	
    currency_code : String(15)  ;	
    pay_remark : String(1000)  ;	
    pay_scheduled_date : Date  ;	
    payterms_code : String(30)  ;	
    payment_condition_code : String(30)  ;	
}	
extend Po_Approval_Payment with util.Managed;	