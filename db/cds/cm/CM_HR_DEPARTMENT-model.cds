namespace cm;

using util from './util/util-model';

entity Hr_Department {
    key tenant_id                    : String(5) not null;
    key department_id                : String(100) not null;
    key department_code              : String(50) not null;
        department_local_name        : String(240) not null;
        department_korean_name       : String(240);
        department_english_name      : String(240);
        company_id                   : String(100);
        company_code                 : String(10);
        company_local_name           : String(240);
        company_english_name         : String(240);
        parent_department_id         : String(100) not null;
        parent_department_code       : String(50) not null;
        department_leader_empno      : String(30);
        bizunit_code                 : String(10);
        bizmanage_code               : String(10);
        local_it_center_code         : String(30);
        local_accounting_center_code : String(30);
        department_start_date        : String(8);
        department_end_date          : String(8);
        department_type_code         : String(30);
        use_flag                     : Boolean not null;
        sort_number                  : Decimal;
        full_path_desc               : String(300);
}

extend Hr_Department with util.Managed;
