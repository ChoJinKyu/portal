namespace ep;

@path : 'ep.ProjectMgtV4Service'
service ProjectMgtV4Service {

    type OutType : {
        returncode    : String(2);
        returnmessage : String(500);
        savedkey      : String(50);
    };

    action SaveProjectProc(tenant_id : String(5), company_code : String(10), ep_project_number : String(50), project_name : String(100), ep_purchasing_type_code : String(30), plant_code : String(10), bizunit_code : String(10), bizdivision_code : String(10), remark : String(3000), org_type_code : String(2), org_code : String(10), user_id : String(255)) returns array of OutType;

    action DeleteProjectProc(tenant_id : String(5), company_code : String(10), ep_project_number : String(50)) returns String;

}
