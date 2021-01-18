namespace dp;

using {dp as mcstPjtView} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_VIEW-model';

@path : '/dp.McstProjectMgtV4Service'
service McstProjectMgtV4Service {

    view McstProjectView(language_code: String) as
        select from mcstPjtView.TC_Mcst_Project_View(language_code: :language_code);

    type CreatePjtInputData {
        tenant_id    : String(5);
        project_code : String(30);
        model_code   : String(40);
        mcst_code    : String(30);
        user_id      : String(255);
    }

    type CreatePjtOutputData : {
        version_number : String(30);
        return_code    : String(20);
        return_msg     : String(5000);
    };

    //재료비 프로젝트 생성(프로젝트, 유사모델, 개발일정, 판가물동원가, 환율 일괄 생성)
    action TcCreateMcstProjectProc(inputData : CreatePjtInputData) returns CreatePjtOutputData;

    type TcProjectType {
        tenant_id               : String(5);
        project_code            : String(30);
        model_code              : String(40);
        version_number          : String(30);
        mcst_code               : String(30);
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
        mcst_yield_rate         : String(30);
        bom_type_code           : String(30);
        project_create_date     : String(30);
        user_id                 : String(255);
    }

    //재료비 프로젝트 수정
    //action TcUpdateMcstProjectProc(inputData : UpdatePjtInputData) returns OutputData;

    type UpdateSimilarModelInputData : {
        similar_model_code   : String(40);
        code_desc            : String(300);
        direct_register_flag : Boolean;
    };

    type UpdateSimilarModelInputDataType : {
        tenant_id      : String(5);
        project_code   : String(30);
        model_code     : String(40);
        version_number : String(30);
        similarModel   : array of UpdateSimilarModelInputData;
        user_id        : String(255);
    }
    
/*
    //재료비 프로젝트의 유사모델 수정(delete,insert)
    //action TcUpdateMcstSimilarModelProc(inputData : UpdateSimilarModelInputDataType) returns OutputData;


    type UpdateAddInfoInputData {
        tenant_id      : String(5);
        project_code   : String(30);
        model_code     : String(40);
        version_number : String(30);
        add_type_code  : String(30);
        period_code    : String(30);
        add_type_value : String(10);
        user_id        : String(255);
    }

    //재료비 프로젝트의 물동, 판가, 가공비, 판관비 수정
    //action TcUpdateMcstAddInfoProc(inputData : UpdateAddInfoInputData) returns OutputData;


    //재료비 프로젝트의 환율 수정
    //action TcUpdateMcstBaseExrateProc(inputData : UpdateBaseExrateInputData) returns OutputData;

    type UpdateBaseExrateInputData {
        tenant_id      : String(5);
        project_code   : String(30);
        model_code     : String(40);
        version_number : String(30);
        currency_code  : String(3);
        period_code    : String(30);
        exrate         : String(30);
        user_id        : String(255);
    }
*/
    type TcProjectSimilarModelType : {
        tenant_id            : String(5);
        project_code         : String(30);
        model_code           : String(40);
        version_number : String(30);
        similar_model_code   : String(40);
        code_desc            : String(300);
        direct_register_flag : Boolean;
    };
    
    type TcProjectAdditionInfoType : {
        tenant_id           : String(5);
        project_code        : String(30);
        model_code          : String(40);
        version_number : String(30);
        addition_type_code  : String(30);
        period_code         : String(30);
        addition_type_value : String(10);
        user_id        : String(255);
    };

    type TcProjectBaseExrateType : {
        tenant_id      : String(5);
        project_code   : String(30);
        model_code     : String(40);
        version_number : String(30);
        currency_code  : String(3);
        period_code    : String(30);
        exrate         : String(30);
        user_id        : String(255);
    };

    type InputDataType : {
        tcPjt             : array of TcProjectType;
        tcPjtSimilarModel : array of UpdateSimilarModelInputDataType;
        tcPjtAddInfo      : array of TcProjectAdditionInfoType;
        tcPjtBaseExrate   : array of TcProjectBaseExrateType;
        user_id           : String(255);
    }

    type OutputData : {
        return_code : String(20);
        return_msg  : String(5000);
    };

    action TcUpdateMcstProjectProc(inputData : InputDataType) returns OutputData;

}