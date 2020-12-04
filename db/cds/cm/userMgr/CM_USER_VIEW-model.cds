namespace cm;
using util from '../util/util-model';

@cds.persistence.exists
entity User_View {	
    key user_id : String(50);
    user_name : String(240);
    tenant_id : String(5) ;
    company_code : String(10);
    employee_number : String(30);
    employee_name : String(240);
    english_employee_name : String(240);
    employee_status_code : String(30);
    language_code : String(30);
    timezone_code : String(30);
    date_format_type_code : String(30);
    digits_format_type_code : String(30);
    currency_code : String(30);
    password : String(4000);
    email : String(240);
   
}	

extend User_View with util.Managed;
