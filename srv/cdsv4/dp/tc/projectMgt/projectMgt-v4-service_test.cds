namespace dp;

using {dp as pjtView} from '../../../../../db/cds/dp/tc/DP_TC_PROJECT_VIEW-model';

@path : '/dp.ProjectMgtV4Service'
service ProjectMgtV4Service_test {

    view ProjectView(language_cd: String) as
        select from pjtView.TC_Project_View(language_cd: :language_cd);

    type TcProjectType : {
        tenant_id               : String(5);
        project_code            : String(30);
        model_code              : String(40);
        project_name            : String(100);
        model_name              : String(100);
        product_group_code      : String(10);
        source_type_code        : String(30);
        quotation_project_code  : String(50);
        project_status_code     : String(30);
        project_grade_code      : String(30);
        develope_event_code     : String(30);
        production_company_code : String(10);
        project_leader_empno    : String(30);
        buyer_empno             : String(30);
        marketing_person_empno  : String(30);
        planning_person_empno   : String(30);
        customer_local_name     : String(50);
        last_customer_name      : String(240);
        customer_model_desc     : String(1000);
        //mcst_yield_rate         : Decimal;
        mcst_yield_rate         : String(30);
        bom_type_code           : String(30);
        //project_create_date     : Date;
        project_create_date     : String(30);
    };

    type TcProjectSimilarModelType : {
        tenant_id            : String(5);
        project_code         : String(30);
        model_code           : String(40);
        similar_model_code   : String(40);
        code_desc            : String(300);
        direct_register_flag : Boolean;
    };

    type TcProjectAdditionInfoType : {
        tenant_id           : String(5);
        project_code        : String(30);
        model_code          : String(40);
        addition_type_code  : String(30);
        period_code         : String(30);
        addition_type_value : String(10);
    };

    type TcProjectBaseExrateType : {
        tenant_id     : String(5);
        project_code  : String(30);
        model_code    : String(40);
        currency_code : String(3);
        period_code   : String(30);
        //exrate        : Decimal;
        exrate        : String(30);
    };

    type TcProcOutType : {
        return_code : String(20);
        return_msg  : String(5000);
    };

    type InputDataType : {
        tcPjt             : array of TcProjectType;
        tcPjtSimilarModel : array of TcProjectSimilarModelType;
        tcPjtAddInfo      : array of TcProjectAdditionInfoType;
        tcPjtBaseExrate   : array of TcProjectBaseExrateType;
        user_id           : String(255);
    }

    action TcUpdateProjectProc(inputData : InputDataType) returns TcProcOutType;
}
