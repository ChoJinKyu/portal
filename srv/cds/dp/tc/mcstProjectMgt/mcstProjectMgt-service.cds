using {dp as mcstPjt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT-model';
using {dp as mcstPjtEvt} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_EVENT-model';
using {dp as mcstPjtExrate} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_BASE_EXRATE-model';
using {dp as mcstPjtSimilarModel} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_SIMILAR_MODEL-model';
using {dp as mcstPjtAddInfo} from '../../../../../db/cds/dp/tc/DP_TC_MCST_PROJECT_ADDITION_INFO-model';
using {cm as codeDtl} from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using {cm as codeLng} from '../../../../../db/cds/cm/CM_CODE_LNG-model';
using {cm as hrEmployee} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm as hrDept} from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';

namespace dp;

@path : '/dp.McstProjectMgtService'
service McstProjectMgtService {
    entity McstProject as projection on mcstPjt.Tc_Mcst_Project;
    entity McstProjectEvent as projection on mcstPjtEvt.Tc_Mcst_Project_Event;
    entity McstProjectExrate as projection on mcstPjtExrate.Tc_Mcst_Project_Base_Exrate;
    entity McstProjectSimilarModel as projection on mcstPjtSimilarModel.Tc_Mcst_Project_Similar_Model;
    entity McstProjectAddInfo as projection on mcstPjtAddInfo.Tc_Mcst_Project_Addition_Info;

    @readonly
    entity Code_Dtl as
        select from codeDtl.Code_Dtl as d {
            key tenant_id,
            key group_code,
            key code,
                (select code_name from codeLng.Code_Lng l where l.tenant_id  = d.tenant_id
                        and l.group_code = d.group_code
                        and l.code = d.code
                        and l.language_cd = 'KO') as code_name: String(240),
                code_description,
                sort_no
        }
        where
            $now between start_date and end_date;


    @readonly
    view McstProjectView @(title : 'Mcst Project View') as
        select key pjt.tenant_id                  /*테넌트ID*/
             , key pjt.project_code               /*프로젝트코드*/
             , key pjt.model_code                 /*모델코드*/
             , key pjt.version_number
             , pjt.model_name                 /*모델명*/
             , pjt.project_name               /*프로젝트명*/
             , pjt.mcst_code                  /*재료비구분코드*/
             , pjt.version_sequence           /*재료비차수*/
             , pjt.company_code               /*회사코드*/
             , pjt.org_type_code              /*조직유형코드*/
             , pjt.org_code                   /*조직코드*/
             , pjt.bizdivision_code           /*사업부코드*/
             , pjt.product_group_code         /*제품군코드*/
             , pjt.source_type_code           /*출처구분코드*/
             , pjt.quotation_project_code     /*견적프로젝트코드*/
             , pjt.project_status_code        /*프로젝트상태코드*/
             , pjt.project_grade_code         /*프로젝트등급코드*/
             , pjt.production_company_code    /*생산회사코드*/
             , pjt.project_leader_empno       /*프로젝트리더사번*/
             , pjt.buyer_empno                /*구매담당자사번*/
             , pjt.marketing_person_empno     /*마케팅담당자사번*/
             , pjt.planning_person_empno      /*기획담당자사번*/
             , pjt.customer_local_name        /*고객로컬명*/
             , pjt.last_customer_name         /*최종고객명*/
             , pjt.customer_model_desc        /*고객모델설명*/
             , pjt.mcst_yield_rate            /*재료비수율*/
             , pjt.bom_type_code              /*자재명세서유형코드*/
             , pjt.sales_currency_code        /*매출통화코드*/
             , pjt.project_creator_empno      /*프로젝트생성자사번*/
             , pjt.project_create_date        /*프로젝트생성일자*/
             , pjt.massprod_start_date        /*양산시작일자*/
             , pjt.massprod_end_date          /*양산종료일자*/
             , pjt.mcst_excl_flag             /*재료비제외여부*/
             , pjt.mcst_excl_reason           /*재료비제외사유*/
             , pjt.direct_register_flag       /*직접등록여부*/
             , pjt.mcst_status_code
             , pjt.mcst_sum_value
             , (select ccl.code_name
                  from codeLng.Code_Lng ccl
                 where ccl.tenant_id = pjt.tenant_id
                   and ccl.group_code = 'DP_TC_MCST_CODE'
                   and ccl.code = pjt.mcst_code
                   and ccl.language_cd = 'KO') AS mcst_text : String        /*재료비구분명*/
             , (select ccl.code_name
                  from codeLng.Code_Lng ccl
                 where ccl.tenant_id = pjt.tenant_id
                   and ccl.group_code = 'DP_TC_MCST_STATUS_CODE'
                   and ccl.code = pjt.mcst_status_code
                   and ccl.language_cd = 'KO') AS mcst_status_text : String        /*재료비상태명*/
             , (select ccl.code_name
                  from codeLng.Code_Lng ccl
                 where ccl.tenant_id = pjt.tenant_id
                   and ccl.group_code = 'DC_TC_PRODUCT_GROUP_CODE'
                   and ccl.code = pjt.product_group_code
                   and ccl.language_cd = 'KO') AS product_group_text : String        /*제품군명*/
             , (select ccl.code_name
                  from codeLng.Code_Lng ccl
                 where ccl.tenant_id = pjt.tenant_id
                   and ccl.group_code = 'DP_TC_PROJECT_GRADE_CODE'
                   and ccl.code = pjt.project_grade_code
                   and ccl.language_cd = 'KO') AS project_grade_text : String        /*프로젝트등급명*/
             , (select ccl.code_name
                  from codeLng.Code_Lng ccl
                 where ccl.tenant_id = pjt.tenant_id
                   and ccl.group_code = 'DP_TC_SOURCE_TYPE_CODE'
                   and ccl.code = pjt.source_type_code
                   and ccl.language_cd = 'KO') AS source_type_text : String          /*출처구분명(용도)*/
             , (select ccl.code_name
                  from codeLng.Code_Lng ccl
                 where ccl.tenant_id = pjt.tenant_id
                   and ccl.group_code = 'DP_TC_BOM_TYPE_CODE'
                   and ccl.code = pjt.bom_type_code
                   and ccl.language_cd = 'KO') AS bom_type_text : String             /*자재명세서유형명*/
             , (select ccl.code_name
                  from codeLng.Code_Lng ccl
                 where ccl.tenant_id = pjt.tenant_id
                   and ccl.group_code = 'DP_TC_PROJECT_STATUS_CODE'
                   and ccl.code = pjt.project_status_code
                   and ccl.language_cd = 'KO') AS project_status_text : String        /*프로젝트상태명*/  
             , (select emp.user_local_name || ' ' || emp.job_title || '/' || dept.department_local_name AS project_creator_info
                  from hrEmployee.Hr_Employee emp
                     , hrDept.Hr_Department dept
                 where emp.tenant_id = pjt.tenant_id
                   and emp.tenant_id = dept.tenant_id
                   and emp.employee_number = pjt.project_creator_empno
                   and emp.department_id = dept.department_id) AS project_creator_info : String     /*프로젝트생성자이름부서*/
             , (select emp.user_local_name || ' ' || emp.job_title AS project_leader_name
                  from hrEmployee.Hr_Employee emp
                 where emp.tenant_id = pjt.tenant_id
                   and emp.employee_number = pjt.project_leader_empno) AS project_leader_name : String            /*프로젝트리더이름*/
             , (select emp.user_local_name || ' ' || emp.job_title || '/' || dept.department_local_name AS project_leader_info
                  from hrEmployee.Hr_Employee emp
                     , hrDept.Hr_Department dept
                 where emp.tenant_id = pjt.tenant_id
                   and emp.tenant_id = dept.tenant_id
                   and emp.employee_number = pjt.project_leader_empno
                   and emp.department_id = dept.department_id) AS project_leader_info : String      /*프로젝트리더이름부서*/
             , (select emp.user_local_name || ' ' || emp.job_title AS buyer_name
                  from hrEmployee.Hr_Employee emp
                 where emp.tenant_id = pjt.tenant_id
                   and emp.employee_number = pjt.buyer_empno) AS buyer_name : String                /*재료비총괄이름*/
             , (select emp.user_local_name || ' ' || emp.job_title || '/' || dept.department_local_name AS buyer_info
                  from hrEmployee.Hr_Employee emp
                     , hrDept.Hr_Department dept
                 where emp.tenant_id = pjt.tenant_id
                   and emp.tenant_id = dept.tenant_id
                   and emp.employee_number = pjt.buyer_empno
                   and emp.department_id = dept.department_id) AS buyer_info : String               /*재료비총괄이름부서*/
             , (select emp.user_local_name || ' ' || emp.job_title AS marketing_person_name
                  from hrEmployee.Hr_Employee emp
                 where emp.tenant_id = pjt.tenant_id
                   and emp.employee_number = pjt.marketing_person_empno) AS marketing_person_name : String          /*마케팅담당자이름*/
             , (select emp.user_local_name || ' ' || emp.job_title || '/' || dept.department_local_name AS marketing_person_info
                  from hrEmployee.Hr_Employee emp
                     , hrDept.Hr_Department dept
                 where emp.tenant_id = pjt.tenant_id
                   and emp.tenant_id = dept.tenant_id
                   and emp.employee_number = pjt.marketing_person_empno
                   and emp.department_id = dept.department_id) AS marketing_person_info : String     /*마케팅담당자이름부서*/
             , (select emp.user_local_name || ' ' || emp.job_title AS planning_person_name
                  from hrEmployee.Hr_Employee emp
                 where emp.tenant_id = pjt.tenant_id
                   and emp.employee_number = pjt.planning_person_empno) AS planning_person_name : String          /*기획담당자이름*/
             , (select emp.user_local_name || ' ' || emp.job_title || '/' || dept.department_local_name AS planning_person_info
                  from hrEmployee.Hr_Employee emp
                     , hrDept.Hr_Department dept
                 where emp.tenant_id = pjt.tenant_id
                   and emp.tenant_id = dept.tenant_id
                   and emp.employee_number = pjt.planning_person_empno
                   and emp.department_id = dept.department_id) AS planning_person_info : String     /*기획담당자이름부서*/
             , pjt.develope_event_code
          from mcstPjt.Tc_Mcst_Project pjt      
    ;

    // type InputDataType {
    //     tenant_id    : String(5);
    //     project_code : String(30);
    //     model_code   : String(40);
    //     mcst_code    : String(30);
    //     user_id      : String(255);
    // }

    // type OutputDataType : {
    //     version_number : String(30);
    //     return_code    : String(20);
    //     return_msg     : String(5000);
    // };

    // action TcCreateMcstProjectProc(inputData : InputDataType) returns OutputDataType;
}
