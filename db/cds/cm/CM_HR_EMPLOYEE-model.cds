namespace cm;

using util from './util/util-model';

entity Hr_Employee {
    key tenant_id           : String(5) not null;
    key employee_number     : String(30) not null;
        user_status_code    : String(30) not null;
        email_id            : String(240);
        user_local_name     : String(240) not null;
        user_korean_name    : String(240);
        user_english_name   : String(240);
        mobile_phone_number : String(50);
        office_phone_number : String(50);
        office_address      : String(240);
        job_title           : String(100);
        assign_type_code    : String(30) not null;
        assign_company_name : String(240);
        gender_code         : String(30);
        nation_code         : String(30);
        locale_code         : String(30);
        department_id       : String(16) not null;
        department_code     : String(50) not null;
}

extend Hr_Employee with util.Managed;
