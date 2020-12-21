namespace ep;

using util from '../../cm/util/util-model';


entity Po_Project {
    key tenant_id               : String(5) not null;
    key company_code            : String(10) not null;
    key ep_project_number       : String(50) not null;
        project_name            : String(100);
        ep_purchasing_type_code : String(30);
        plant_code              : String(10);
        bizunit_code            : String(10);
        bizdivision_code        : String(10);
        remark                  : String(3000);
        org_type_code           : String(2);
        org_code                : String(10);
}

extend Po_Project with util.Managed;
