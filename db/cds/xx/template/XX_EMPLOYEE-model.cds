using util from '../../cm/util/util-model';
using from './XX_DEPARTMENT-model';

namespace xx;

entity Employee {
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
        department_code     : String(30) not null;

        department          : Association to xx.Department
                                on  department.tenant_id  = tenant_id
                                and department.department_code = department_code;

}

extend Employee with util.Managed;