using util from '../../cm/util/util-model';
using from './XX_COMPANY-model';

namespace xx;

entity Department {
    key tenant_id                    : String(5) not null;
    key department_code              : String(30) not null;
        department_name              : String(240) not null;
        department_korean_name       : String(240);
        department_english_name      : String(240);
        company_code                 : String(10);
        parent_department_code       : String(30) not null;
        department_leader_empno      : String(30);
        department_type_code         : String(30);
        use_flag                     : Boolean not null;
        sort_number                  : Decimal;
        full_path_desc               : String(300);

        parent                       : Association to xx.Company
                                        on  parent.tenant_id  = tenant_id
                                        and parent.company_code = company_code;
}

extend Department with util.Managed;
